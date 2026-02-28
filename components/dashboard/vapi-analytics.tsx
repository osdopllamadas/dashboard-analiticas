"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, TrendingUp, DollarSign, BarChart2, Loader2 } from "lucide-react";

interface DayData {
    date: string;    // "YYYY-MM-DD"
    totalMinutes: number;
    billedMinutes: number;
    totalCalls: number;
}

interface EndReasonData {
    reason: string;
    count: number;
    pct: number;
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-AR", { month: "short", day: "numeric" });
}

function barWidth(value: number, max: number) {
    return max > 0 ? Math.round((value / max) * 100) : 0;
}

export function VapiMinutesAnalytics() {
    const [days, setDays] = useState<DayData[]>([]);
    const [endReasons, setEndReasons] = useState<EndReasonData[]>([]);
    const [totals, setTotals] = useState({ totalMin: 0, billedMin: 0, cost: 0, calls: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchVapiData() {
            try {
                const res = await fetch("/api/vapi-analytics");
                if (!res.ok) throw new Error("No se pudieron cargar los datos");
                const data = await res.json();
                setDays(data.days || []);
                setEndReasons(data.endReasons || []);
                setTotals(data.totals || { totalMin: 0, billedMin: 0, cost: 0, calls: 0 });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchVapiData();
    }, []);

    const maxMinutes = Math.max(...days.map(d => d.totalMinutes), 1);
    const maxCalls = Math.max(...days.map(d => d.totalCalls), 1);

    const stats = [
        { label: "Minutos Totales", value: `${totals.totalMin.toLocaleString("es-AR")}m`, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Minutos Facturados", value: `${totals.billedMin.toLocaleString("es-AR")}m`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Costo Total", value: `$${totals.cost.toFixed(2)}`, icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Llamadas Totales", value: totals.calls.toLocaleString("es-AR"), icon: BarChart2, color: "text-primary", bg: "bg-primary/10" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-slate-400">Cargando datos de Vapi...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                Error al cargar los datos: {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="hover:shadow-lg transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                                {stat.label}
                            </CardTitle>
                            <div className={`h-8 w-8 rounded-full ${stat.bg} flex items-center justify-center`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Análisis de Minutos */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Análisis de Minutos</CardTitle>
                        <CardDescription>Minutos totales vs facturados por día</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {days.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">Sin datos disponibles</p>
                        ) : (
                            <div className="space-y-3">
                                {days.map((day) => (
                                    <div key={day.date} className="space-y-1">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span className="font-medium w-16">{formatDate(day.date)}</span>
                                            <span>{day.totalMinutes}m total / {day.billedMinutes}m facturados</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div className="flex h-full gap-px">
                                                <div
                                                    className="bg-cyan-500 h-full rounded-l-full"
                                                    style={{ width: `${barWidth(day.billedMinutes, maxMinutes)}%` }}
                                                />
                                                <div
                                                    className="bg-blue-300 dark:bg-blue-800 h-full rounded-r-full"
                                                    style={{ width: `${barWidth(day.totalMinutes - day.billedMinutes, maxMinutes)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center gap-6 pt-3 border-t">
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-cyan-500" />
                                        <span className="text-xs text-muted-foreground">Minutos Facturados</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-blue-300 dark:bg-blue-800" />
                                        <span className="text-xs text-muted-foreground">Minutos Totales</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Resultados de Llamadas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resultados de Llamadas</CardTitle>
                        <CardDescription>Distribución por motivo de fin</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {endReasons.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">Sin datos</p>
                        ) : (
                            <div className="space-y-4">
                                {endReasons.map((item) => {
                                    const label = translateEndReason(item.reason);
                                    return (
                                        <div key={item.reason} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium capitalize">{label}</span>
                                                <span className="text-muted-foreground">{item.count} ({item.pct}%)</span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${item.pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Llamadas en el Tiempo */}
            <Card>
                <CardHeader>
                    <CardTitle>Llamadas en el Tiempo</CardTitle>
                    <CardDescription>Volumen diario de llamadas</CardDescription>
                </CardHeader>
                <CardContent>
                    {days.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">Sin datos disponibles</p>
                    ) : (
                        <div className="space-y-3">
                            {days.map((day) => (
                                <div key={day.date} className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span className="font-medium w-16">{formatDate(day.date)}</span>
                                        <span>{day.totalCalls} llamadas</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${barWidth(day.totalCalls, maxCalls)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Traduce los motivos de fin de llamada de Vapi al español
function translateEndReason(reason: string): string {
    const map: Record<string, string> = {
        "hangup": "Cuelgue del cliente",
        "customer-did-not-answer": "Sin respuesta del cliente",
        "system-error": "Error del sistema",
        "system_error": "Error del sistema",
        "assistant-error": "Error del asistente",
        "transfer": "Transferencia",
        "voicemail": "Buzón de voz",
        "silence": "Silencio prolongado",
        "max-duration-exceeded": "Duración máxima excedida",
        "pipeline-error": "Error de pipeline",
        "unknown": "Desconocido",
    };
    return map[reason.toLowerCase()] ?? reason.replace(/_/g, " ");
}
