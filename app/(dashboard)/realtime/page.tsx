"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Phone, Clock, TrendingUp, Zap, Users } from "lucide-react";

export default function RealTimePage() {
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 3000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { label: "Llamadas Activas", value: String(12 + (tick % 4)), icon: Phone, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Agentes en Línea", value: "8", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Tiempo Promedio", value: "4:32", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Llamadas Hoy", value: String(142 + tick), icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="flex flex-col space-y-2 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/20">
                            <Activity className="h-6 w-6 text-emerald-400" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white">
                            Tiempo Real
                        </h1>
                    </div>
                    <p className="text-slate-400 text-sm max-w-lg pl-1">
                        Monitoreo en vivo de llamadas activas y agentes conectados.
                    </p>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                        En Vivo
                    </Badge>
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
                            <div className="flex items-center gap-1 mt-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs text-emerald-500 font-medium">Actualizado en tiempo real</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Live Feed */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary fill-primary" />
                        Actividad en Curso
                    </CardTitle>
                    <CardDescription>Llamadas activas en este momento</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[
                            { agent: "Juan Pérez", phone: "+54 11 1234-5678", duration: "5:23", status: "Activa" },
                            { agent: "María García", phone: "+34 600 000 000", duration: "2:11", status: "Activa" },
                            { agent: "Carlos López", phone: "+52 55 5555 5555", duration: "8:04", status: "En espera" },
                        ].map((call, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-slate-50 dark:bg-slate-900/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                                        {call.agent.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{call.agent}</p>
                                        <p className="text-xs text-muted-foreground">{call.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-mono font-bold text-slate-600 dark:text-slate-300">{call.duration}</span>
                                    <Badge variant="outline" className={call.status === "Activa" ? "border-emerald-500 text-emerald-600 bg-emerald-50" : "border-amber-500 text-amber-600 bg-amber-50"}>
                                        {call.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
