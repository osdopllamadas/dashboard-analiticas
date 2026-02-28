"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, TrendingUp, DollarSign, BarChart2 } from "lucide-react";

const diasData = [
    { fecha: "Ene 31", totalMinutos: 180, minutosFact: 148, llamadas: 64 },
    { fecha: "Feb 2", totalMinutos: 160, minutosFact: 132, llamadas: 71 },
    { fecha: "Feb 4", totalMinutos: 210, minutosFact: 175, llamadas: 89 },
    { fecha: "Feb 6", totalMinutos: 195, minutosFact: 161, llamadas: 82 },
    { fecha: "Feb 8", totalMinutos: 200, minutosFact: 166, llamadas: 94 },
    { fecha: "Feb 10", totalMinutos: 170, minutosFact: 140, llamadas: 75 },
    { fecha: "Feb 12", totalMinutos: 130, minutosFact: 107, llamadas: 55 },
    { fecha: "Feb 14", totalMinutos: 155, minutosFact: 128, llamadas: 68 },
    { fecha: "Feb 17", totalMinutos: 145, minutosFact: 119, llamadas: 61 },
    { fecha: "Feb 19", totalMinutos: 125, minutosFact: 103, llamadas: 52 },
    { fecha: "Feb 22", totalMinutos: 140, minutosFact: 115, llamadas: 59 },
    { fecha: "Feb 24", totalMinutos: 118, minutosFact: 97, llamadas: 49 },
    { fecha: "Feb 26", totalMinutos: 108, minutosFact: 89, llamadas: 45 },
    { fecha: "Feb 28", totalMinutos: 115, minutosFact: 95, llamadas: 48 },
];

const motivosFin = [
    { motivo: "Cuelgue del cliente", cantidad: 842, pct: 68 },
    { motivo: "Error del sistema", cantidad: 124, pct: 10 },
    { motivo: "Transferencia", cantidad: 186, pct: 15 },
    { motivo: "Completada correctamente", cantidad: 89, pct: 7 },
];

const totalMinutos = diasData.reduce((s, d) => s + d.totalMinutos, 0);
const totalFacturado = diasData.reduce((s, d) => s + d.minutosFact, 0);
const totalLlamadas = diasData.reduce((s, d) => s + d.llamadas, 0);
const costoTotal = (totalFacturado * 0.018).toFixed(2);

const maxMin = Math.max(...diasData.map(d => d.totalMinutos));
const maxCalls = Math.max(...diasData.map(d => d.llamadas));

const stats = [
    { label: "Minutos Totales", valor: `${totalMinutos}m`, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Minutos Facturados", valor: `${totalFacturado}m`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Costo Total", valor: `$${costoTotal}`, icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Llamadas Totales", valor: totalLlamadas, icon: BarChart2, color: "text-primary", bg: "bg-primary/10" },
];

function barra(valor: number, max: number) {
    return `${Math.round((valor / max) * 100)}%`;
}

export default function MinutosPage() {
    return (
        <div className="space-y-8 animate-fade-in pb-10">

            {/* Header */}
            <div className="flex flex-col gap-4 bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="flex items-center gap-3 relative z-10">
                    <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/20">
                        <Clock className="h-6 w-6 text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">Análisis de Minutos</h1>
                </div>
                <p className="text-slate-400 text-sm pl-1 relative z-10">
                    Minutos totales vs facturados por día. Controla el consumo y los costos de tu operación.
                </p>
            </div>

            {/* KPIs */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                    <Card key={s.label} className="hover:shadow-lg transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                                {s.label}
                            </CardTitle>
                            <div className={`h-8 w-8 rounded-full ${s.bg} flex items-center justify-center`}>
                                <s.icon className={`h-4 w-4 ${s.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{s.valor}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Gráficas principales */}
            <div className="grid gap-6 lg:grid-cols-3">

                {/* Análisis de Minutos */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Análisis de Minutos</CardTitle>
                        <CardDescription>Minutos totales vs facturados por día</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {diasData.map((d) => (
                            <div key={d.fecha} className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span className="font-medium w-14">{d.fecha}</span>
                                    <span>{d.totalMinutos}m total / {d.minutosFact}m facturados</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                                    <div className="bg-cyan-500 h-full" style={{ width: barra(d.minutosFact, maxMin) }} />
                                    <div className="bg-blue-300 dark:bg-blue-800 h-full" style={{ width: barra(d.totalMinutos - d.minutosFact, maxMin) }} />
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center gap-6 pt-3 border-t text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-cyan-500 inline-block" />Minutos Facturados</span>
                            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-blue-300 dark:bg-blue-800 inline-block" />Minutos Totales</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Resultados de Llamadas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resultados de Llamadas</CardTitle>
                        <CardDescription>Distribución por motivo de fin</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {motivosFin.map((m) => (
                            <div key={m.motivo} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{m.motivo}</span>
                                    <span className="text-muted-foreground">{m.cantidad} ({m.pct}%)</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${m.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Llamadas en el Tiempo */}
            <Card>
                <CardHeader>
                    <CardTitle>Llamadas en el Tiempo</CardTitle>
                    <CardDescription>Volumen diario de llamadas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {diasData.map((d) => (
                        <div key={d.fecha} className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span className="font-medium w-14">{d.fecha}</span>
                                <span>{d.llamadas} llamadas</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: barra(d.llamadas, maxCalls) }} />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

        </div>
    );
}
