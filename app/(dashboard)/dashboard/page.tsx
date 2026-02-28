"use client";

import { useClient } from "@/lib/contexts/client-context";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Skeleton
} from "@/components/ui/skeleton";
import {
    Phone,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Zap
} from "lucide-react";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { KanbanBoard } from "@/components/dashboard/kanban-board";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const { organization, user, isLoading } = useClient();

    if (isLoading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-72 w-full" />
                    <Skeleton className="h-72 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 italic">
                        Dashboard Analítico <span className="text-primary not-italic inline-flex items-center ml-2"><Zap className="h-6 w-6 mr-1 fill-primary" /> IA Power</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Hola {user?.full_name?.split(" ")[0] || "Administrador"}, revisa el rendimiento de {organization?.name || "tu organización"} hoy.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary">
                        Sincronizado: hace 2 min
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                        Periodo: Últimos 30 días
                    </Badge>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-all duration-300 group border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Llamadas Totales</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <Phone className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">1,284</div>
                        <div className="flex items-center text-xs text-green-500 mt-2 font-bold bg-green-50 dark:bg-green-900/20 w-fit px-2 py-0.5 rounded-full">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +12.5% vs ayer
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 group border-l-4 border-l-cyan-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tasa de Conversión</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-colors text-cyan-500">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">24.8%</div>
                        <div className="flex items-center text-xs text-green-500 mt-2 font-bold bg-green-50 dark:bg-green-900/20 w-fit px-2 py-0.5 rounded-full">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +4.3% este mes
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 group border-l-4 border-l-indigo-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Agentes en Línea</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors text-indigo-500">
                            <Users className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">42</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                            86% del staff completo
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 group border-l-4 border-l-amber-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Rating de IA</CardTitle>
                        <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors text-amber-500">
                            <Zap className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">8.4<span className="text-sm text-slate-400 font-normal">/10</span></div>
                        <div className="flex items-center text-xs text-amber-600 mt-2 font-bold bg-amber-50 dark:bg-amber-900/20 w-fit px-2 py-0.5 rounded-full">
                            Excelente desempeño
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Visual Analytics Section (Tremor) */}
            <DashboardCharts />

            {/* Kanban Pipeline Section */}
            <Card className="border-none shadow-none bg-transparent">
                <KanbanBoard />
            </Card>

            {/* Top Agents Table */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-8">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Top Agentes por Conversión</CardTitle>
                        <CardDescription>
                            Clasificación basada en rendimiento de las últimas 24 horas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: "Juan Pérez", sales: 42, rate: "32%", trend: "up" },
                            { name: "María García", sales: 38, rate: "28%", trend: "up" },
                            { name: "Carlos López", sales: 35, rate: "26%", trend: "down" },
                            { name: "Ana Martínez", sales: 31, rate: "24%", trend: "up" },
                        ].map((agent, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                                <div className="flex items-center gap-4">
                                    <span className="text-xl font-black text-slate-200 dark:text-slate-800 w-6">0{i + 1}</span>
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-primary">
                                        {agent.name.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">{agent.name}</span>
                                        <span className="text-xs text-muted-foreground">{agent.sales} conversiones exitosas</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="text-sm font-black text-primary">{agent.rate}</div>
                                        <div className={cn("text-[10px] font-bold uppercase", agent.trend === "up" ? "text-green-500" : "text-rose-500")}>
                                            {agent.trend === "up" ? "En alza" : "En baja"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 bg-slate-900 text-white border-none shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white">IA Insights</CardTitle>
                        <CardDescription className="text-slate-400">
                            Sugerencias automáticas para mejorar el cierre.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex gap-4">
                            <Zap className="h-5 w-5 text-primary shrink-0" />
                            <div className="text-sm">
                                <span className="font-bold block mb-1">Optimización de Scripts</span>
                                Los agentes que mencionan "garantía de por vida" tienen un <span className="text-primary font-bold">15% más</span> de éxito.
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-4">
                            <Phone className="h-5 w-5 text-amber-500 shrink-0" />
                            <div className="text-sm">
                                <span className="font-bold block mb-1">Horario Pico Detectado</span>
                                El volumen de llamadas aumenta los martes a las 10:00 AM. Asegura staff completo.
                            </div>
                        </div>
                        <div className="pt-4 mt-4 border-t border-slate-800">
                            <p className="text-xs text-slate-500 italic">
                                Análisis generado por GPT-4 Turbo basado en 2,400 llamadas recientes.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
