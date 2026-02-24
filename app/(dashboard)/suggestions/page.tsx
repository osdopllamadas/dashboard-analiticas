"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    MessageSquare,
    Send,
    CheckCircle2,
    Clock,
    AlertCircle,
    MoreVertical,
    Plus,
    Search
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Suggestion {
    id: string;
    title: string;
    description: string;
    category: "call_script" | "technical" | "process" | "other";
    status: "pending" | "reviewing" | "implemented" | "rejected";
    author: string;
    created_at: string;
}

const mockSuggestions: Suggestion[] = [
    {
        id: "1",
        title: "Actualización de Script de Bienvenida",
        description: "El script actual resulta muy largo y los clientes suelen interrumpir. Propongo una versión más directa.",
        category: "call_script",
        status: "reviewing",
        author: "Juan Pérez",
        created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: "2",
        title: "Falla en el botón de Silencio",
        description: "Ocasionalmente el botón de silencio no responde rápidamente en la interfaz de llamadas.",
        category: "technical",
        status: "pending",
        author: "María García",
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
        id: "3",
        title: "Nueva Etapa en Kanban: 'En Espera'",
        description: "Necesitamos una etapa para leads que pidieron ser contactados en un mes o más.",
        category: "process",
        status: "implemented",
        author: "Carlos López",
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    }
];

export default function SuggestionsPage() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>(mockSuggestions);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Form State
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newCategory, setNewCategory] = useState<Suggestion["category"]>("process");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newSug: Suggestion = {
            id: Math.random().toString(36).substr(2, 9),
            title: newTitle,
            description: newDesc,
            category: newCategory,
            status: "pending",
            author: "Admin User", // Simulado
            created_at: new Date().toISOString(),
        };

        setSuggestions([newSug, ...suggestions]);
        setIsAdding(false);
        toast.success("Sugerencia enviada correctamente", {
            description: "Un supervisor revisará tu propuesta pronto."
        });

        // Reset form
        setNewTitle("");
        setNewDesc("");
    };

    const getStatusIcon = (status: Suggestion["status"]) => {
        switch (status) {
            case "pending": return <Clock className="h-4 w-4 text-amber-500" />;
            case "reviewing": return <AlertCircle className="h-4 w-4 text-blue-500" />;
            case "implemented": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case "rejected": return <AlertCircle className="h-4 w-4 text-rose-500" />;
        }
    };

    const getStatusBadge = (status: Suggestion["status"]) => {
        switch (status) {
            case "pending": return <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50">Pendiente</Badge>;
            case "reviewing": return <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">En Revisión</Badge>;
            case "implemented": return <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50">Implementado</Badge>;
            case "rejected": return <Badge variant="outline" className="border-rose-500 text-rose-600 bg-rose-50">Rechazado</Badge>;
        }
    };

    const filteredSuggestions = suggestions.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <MessageSquare className="h-8 w-8 text-primary" />
                        Feedback Loop & Sugerencias
                    </h1>
                    <p className="text-muted-foreground">
                        Comparte tus ideas para mejorar el sistema o reporta inconvenientes.
                    </p>
                </div>
                <Button onClick={() => setIsAdding(!isAdding)} className="shadow-lg shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" />
                    {isAdding ? "Cancelar" : "Nueva Sugerencia"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className={cn("lg:col-span-1 space-y-6 transition-all duration-300", isAdding ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none absolute lg:relative")}>
                    <Card className="border-primary/20 shadow-xl shadow-primary/5">
                        <CardHeader>
                            <CardTitle className="text-lg">Crear Propuesta</CardTitle>
                            <CardDescription>Tu feedback ayuda a que todos seamos más eficientes.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Categoría</Label>
                                    <Select value={newCategory} onValueChange={(v: any) => setNewCategory(v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="call_script">Script de Llamada</SelectItem>
                                            <SelectItem value="technical">Problema Técnico</SelectItem>
                                            <SelectItem value="process">Procesos de Venta</SelectItem>
                                            <SelectItem value="other">Otro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Título</Label>
                                    <Input
                                        id="title"
                                        placeholder="Ej: Nuevo cierre de venta"
                                        required
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Descripción Detallada</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe tu idea o el problema reportado..."
                                        className="min-h-[120px]"
                                        required
                                        value={newDesc}
                                        onChange={(e) => setNewDesc(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full">
                                    <Send className="mr-2 h-4 w-4" />
                                    Enviar Sugerencia
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>

                {/* List Section */}
                <div className={cn("transition-all duration-300", isAdding ? "lg:col-span-2" : "lg:col-span-3")}>
                    <div className="mb-6 flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Buscar sugerencias..."
                                className="pl-10 h-10 bg-white dark:bg-slate-900 border-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border">
                            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs bg-white dark:bg-slate-700 shadow-sm">Todo</Button>
                            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">Pendientes</Button>
                            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">Implementados</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredSuggestions.map((s) => (
                            <Card key={s.id} className="hover:border-primary/50 transition-colors shadow-sm group">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(s.status)}
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.category.replace("_", " ")}</span>
                                            </div>
                                            <CardTitle className="text-base line-clamp-1">{s.title}</CardTitle>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-3">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                        {s.description}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-3 border-t flex justify-between items-center text-[10px]">
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold">
                                            {s.author[0]}
                                        </div>
                                        <span className="font-semibold">{s.author}</span>
                                        <span className="text-slate-400">• hace 2 días</span>
                                    </div>
                                    {getStatusBadge(s.status)}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {filteredSuggestions.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed">
                            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No se encontraron sugerencias que coincidan con la búsqueda.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
