"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, TrendingUp, DollarSign, BarChart2 } from "lucide-react";

export default function MinutosPage() {
    const stats = [
        { label: "Minutos Totales", value: "14,320", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10", delta: "+8.2% este mes" },
        { label: "Minutos Facturados", value: "11,840", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", delta: "+5.1% este mes" },
        { label: "Costo por Minuto", value: "$0.018", icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10", delta: "Promedio del periodo" },
        { label: "Costo Total", value: "$213.12", icon: BarChart2, color: "text-primary", bg: "bg-primary/10", delta: "Últimos 30 días" },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="flex flex-col space-y-2 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/20">
                            <Clock className="h-6 w-6 text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white">
                            Análisis de Minutos
                        </h1>
                    </div>
                    <p className="text-slate-400 text-sm max-w-lg pl-1">
                        Minutos totales vs facturados por día. Controla el consumo y los costos de tu operación.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="hover:shadow-lg transition-all duration-300 group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                                {stat.label}
                            </CardTitle>
                            <div className={`h-8 w-8 rounded-full ${stat.bg} flex items-center justify-center`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-2">{stat.delta}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Minutes Analysis Module */}
            <Card>
                <CardHeader>
                    <CardTitle>Análisis de Minutos</CardTitle>
                    <CardDescription>Minutos totales vs facturados por día</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { date: "Ene 31", total: 480, billed: 390 },
                            { date: "Feb 2", total: 520, billed: 420 },
                            { date: "Feb 5", total: 710, billed: 580 },
                            { date: "Feb 8", total: 850, billed: 700 },
                            { date: "Feb 10", total: 640, billed: 510 },
                            { date: "Feb 14", total: 590, billed: 475 },
                            { date: "Feb 17", total: 460, billed: 380 },
                            { date: "Feb 22", total: 530, billed: 420 },
                            { date: "Feb 28", total: 490, billed: 400 },
                        ].map((row) => (
                            <div key={row.date} className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span className="font-medium">{row.date}</span>
                                    <span>{row.total} total / {row.billed} facturados</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="flex h-full">
                                        <div className="bg-blue-500 h-full rounded-l-full" style={{ width: `${(row.billed / row.total) * 100}%` }} />
                                        <div className="bg-blue-200 dark:bg-blue-900 h-full rounded-r-full flex-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-6 mt-6 pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-blue-500" />
                            <span className="text-xs text-muted-foreground">Minutos Facturados</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-blue-200 dark:bg-blue-900" />
                            <span className="text-xs text-muted-foreground">Minutos Totales</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Call Outcomes */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Resultados de Llamadas</CardTitle>
                        <CardDescription>Distribución por motivo de fin</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { reason: "Cuelgue del cliente", count: 842, pct: 68 },
                                { reason: "Error del sistema", count: 124, pct: 10 },
                                { reason: "Transferencia", count: 186, pct: 15 },
                                { reason: "Completada", count: 89, pct: 7 },
                            ].map((item) => (
                                <div key={item.reason} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium capitalize">{item.reason}</span>
                                        <span className="text-muted-foreground">{item.count} ({item.pct}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                                        <div className="bg-primary h-2 rounded-full" style={{ width: `${item.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Llamadas en el Tiempo</CardTitle>
                        <CardDescription>Volumen diario de llamadas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { date: "Lunes", calls: 120 },
                                { date: "Martes", calls: 145 },
                                { date: "Miércoles", calls: 98 },
                                { date: "Jueves", calls: 132 },
                                { date: "Viernes", calls: 110 },
                                { date: "Sábado", calls: 45 },
                                { date: "Domingo", calls: 22 },
                            ].map((item) => (
                                <div key={item.date} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{item.date}</span>
                                        <span className="text-muted-foreground">{item.calls} llamadas</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                                        <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${(item.calls / 145) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
