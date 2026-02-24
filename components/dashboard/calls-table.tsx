"use client";

import { useMemo, useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Download,
    Filter,
    MoreHorizontal,
    Play,
    Settings2,
    Users
} from "lucide-react";
import { AudioPlayer } from "./audio-player";
import { formatDate, formatDuration, cn } from "@/lib/utils";
import * as XLSX from "xlsx";

interface Call {
    id: string;
    agent_name: string;
    customer_phone: string;
    duration_seconds: number;
    status: string;
    sentiment: "positive" | "neutral" | "negative";
    created_at: string;
    recording_url: string;
    dynamic_vars: Record<string, any>;
}

// Mock data for demonstration
const mockCalls: Call[] = [
    {
        id: "1",
        agent_name: "Juan Pérez",
        customer_phone: "+54 11 1234-5678",
        duration_seconds: 345,
        status: "completed",
        sentiment: "positive",
        created_at: new Date().toISOString(),
        recording_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        dynamic_vars: { purchase_amount: 1500, city: "Buenos Aires", interest: "Product A" }
    },
    {
        id: "2",
        agent_name: "María García",
        customer_phone: "+34 600 000 000",
        duration_seconds: 120,
        status: "completed",
        sentiment: "neutral",
        created_at: new Date(Date.now() - 3600000).toISOString(),
        recording_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        dynamic_vars: { city: "Madrid", reason: "Information request" }
    },
    {
        id: "3",
        agent_name: "Carlos López",
        customer_phone: "+52 55 5555 5555",
        duration_seconds: 520,
        status: "missed",
        sentiment: "negative",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        recording_url: "",
        dynamic_vars: { city: "Mexico City", complaint: "Delay in delivery" }
    },
    // Add more mock data as needed
];

export function CallsTable() {
    const [data, setData] = useState<Call[]>(mockCalls);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [selectedCall, setSelectedCall] = useState<Call | null>(null);

    // Extract dynamic column keys from data
    const dynamicKeys = useMemo(() => {
        const keys = new Set<string>();
        data.forEach(call => {
            Object.keys(call.dynamic_vars).forEach(key => keys.add(key));
        });
        return Array.from(keys);
    }, [data]);

    const columns = useMemo<ColumnDef<Call>[]>(() => [
        {
            accessorKey: "agent_name",
            header: "Agente",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                        {row.original.agent_name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="font-medium">{row.getValue("agent_name")}</span>
                </div>
            ),
        },
        {
            accessorKey: "customer_phone",
            header: "Cliente",
        },
        {
            accessorKey: "duration_seconds",
            header: "Duración",
            cell: ({ row }) => formatDuration(row.getValue("duration_seconds")),
        },
        {
            accessorKey: "sentiment",
            header: "Sentimiento",
            cell: ({ row }) => {
                const sentiment = row.getValue("sentiment") as string;
                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            "uppercase text-[10px] font-bold",
                            sentiment === "positive" ? "border-emerald-500 text-emerald-600 bg-emerald-50" :
                                sentiment === "negative" ? "border-rose-500 text-rose-600 bg-rose-50" :
                                    "border-amber-500 text-amber-600 bg-amber-50"
                        )}
                    >
                        {sentiment}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "created_at",
            header: "Fecha",
            cell: ({ row }) => formatDate(row.getValue("created_at")),
        },
        // Dynamic Columns from JSONB
        ...dynamicKeys.map(key => ({
            id: `dynamic_${key}`,
            header: key.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
            accessorFn: (row: Call) => row.dynamic_vars[key],
            cell: ({ getValue }: any) => {
                const val = getValue();
                return val !== undefined ? (
                    <span className="text-muted-foreground italic text-xs capitalize">{String(val)}</span>
                ) : "-";
            }
        })),
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    {row.original.recording_url && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-primary border-primary/20 hover:bg-primary/5"
                            onClick={() => setSelectedCall(row.original)}
                        >
                            <Play className="h-4 w-4 fill-current" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ], [dynamicKeys]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    });

    const exportToExcel = () => {
        const exportData = data.map(call => ({
            ID: call.id,
            Agente: call.agent_name,
            Cliente: call.customer_phone,
            Duracion: formatDuration(call.duration_seconds),
            Estado: call.status,
            Sentimiento: call.sentiment,
            Fecha: formatDate(call.created_at),
            ...call.dynamic_vars
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Llamadas");
        XLSX.writeFile(workbook, `Reporte_Llamadas_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Filtrar por agente..."
                        value={(table.getColumn("agent_name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("agent_name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-xs"
                    />
                    <Button variant="outline" size="icon" className="shrink-0">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-auto">
                                <Settings2 className="mr-2 h-4 w-4" />
                                Columnas
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[150px]">
                            <DropdownMenuLabel>Alternar columnas</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" && column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id.replace("dynamic_", "").replace("_", " ")}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" onClick={exportToExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Download className="mr-2 h-4 w-4" />
                        Excel
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="font-bold py-4">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Sin resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                    Mostrando {table.getRowModel().rows.length} de {data.length} llamadas
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-medium">
                        Página {table.getState().pagination.pageIndex + 1} de{" "}
                        {table.getPageCount()}
                    </span>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Audio Player Modal */}
            <Dialog open={!!selectedCall} onOpenChange={(open) => !open && setSelectedCall(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Grabación de Llamada</DialogTitle>
                        <DialogDescription>
                            Escuchando llamada de {selectedCall?.agent_name} con {selectedCall?.customer_phone}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCall && (
                        <div className="py-6">
                            <AudioPlayer url={selectedCall.recording_url} className="w-full" />
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Duración</span>
                                    <span className="text-sm font-bold">{formatDuration(selectedCall.duration_seconds)}</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Fecha</span>
                                    <span className="text-sm font-bold">{formatDate(selectedCall.created_at)}</span>
                                </div>
                            </div>
                            <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Atributos Dinámicos</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(selectedCall.dynamic_vars).map(([key, val]) => (
                                        <div key={key} className="flex justify-between items-center bg-white dark:bg-slate-900 px-3 py-1.5 rounded-md border border-slate-100 dark:border-slate-800">
                                            <span className="text-[10px] font-medium text-slate-500 capitalize">{key.replace("_", " ")}</span>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{String(val)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
