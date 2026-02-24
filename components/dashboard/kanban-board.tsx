"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const initialData = {
    columns: {
        "column-1": {
            id: "column-1",
            title: "Nuevo",
            taskIds: ["task-1", "task-2"],
        },
        "column-2": {
            id: "column-2",
            title: "Contactado",
            taskIds: ["task-3"],
        },
        "column-3": {
            id: "column-3",
            title: "Interesado",
            taskIds: ["task-4"],
        },
        "column-4": {
            id: "column-4",
            title: "Cerrado",
            taskIds: ["task-5"],
        },
    },
    tasks: {
        "task-1": { id: "task-1", content: "Lead: Acme Corp", agent: "JP", priority: "high" },
        "task-2": { id: "task-2", content: "Lead: Globex", agent: "MG", priority: "medium" },
        "task-3": { id: "task-3", content: "Lead: Soylent Corp", agent: "CL", priority: "low" },
        "task-4": { id: "task-4", content: "Lead: Initech", agent: "JP", priority: "high" },
        "task-5": { id: "task-5", content: "Lead: Hooli", agent: "MG", priority: "high" },
    },
    columnOrder: ["column-1", "column-2", "column-3", "column-4"],
};

export function KanbanBoard() {
    const [data, setData] = useState(initialData);

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = data.columns[source.droppableId as keyof typeof data.columns];
        const finish = data.columns[destination.droppableId as keyof typeof data.columns];

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            };

            setData({
                ...data,
                columns: {
                    ...data.columns,
                    [newColumn.id]: newColumn,
                },
            });
            return;
        }

        // Moving between columns
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        };

        setData({
            ...data,
            columns: {
                ...data.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        });
    };

    return (
        <div className="mt-8">
            <CardTitle className="mb-4">Pipeline de Gestión de Leads</CardTitle>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.columnOrder.map((columnId) => {
                        const column = data.columns[columnId as keyof typeof data.columns];
                        const tasks = column.taskIds.map((taskId) => data.tasks[taskId as keyof typeof data.tasks]);

                        return (
                            <div key={column.id} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-4 flex justify-between items-center">
                                    {column.title}
                                    <Badge variant="secondary" className="bg-white dark:bg-slate-800">
                                        {tasks.length}
                                    </Badge>
                                </h3>
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={cn(
                                                "min-h-[200px] transition-colors",
                                                snapshot.isDraggingOver ? "bg-slate-100 dark:bg-slate-800/50" : ""
                                            )}
                                        >
                                            {tasks.map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={cn(
                                                                "bg-white dark:bg-slate-800 p-4 mb-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 select-none",
                                                                snapshot.isDragging ? "shadow-xl border-primary ring-2 ring-primary/20" : ""
                                                            )}
                                                        >
                                                            <p className="text-sm font-semibold mb-3">{task.content}</p>
                                                            <div className="flex items-center justify-between">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                                                        {task.agent}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <Badge
                                                                    className={cn(
                                                                        "text-[10px] uppercase font-bold",
                                                                        task.priority === "high" ? "bg-rose-100 text-rose-700" :
                                                                            task.priority === "medium" ? "bg-amber-100 text-amber-700" :
                                                                                "bg-emerald-100 text-emerald-700"
                                                                    )}
                                                                >
                                                                    {task.priority}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
}
