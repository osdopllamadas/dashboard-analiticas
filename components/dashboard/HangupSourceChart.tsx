"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { UltravoxCall, getEndReason } from "@/types";

interface HangupSourceChartProps {
    calls: UltravoxCall[];
}

export function HangupSourceChart({ calls }: HangupSourceChartProps) {
    const counts = {
        "Usuario colgó": 0,
        "Agente colgó": 0,
        "Error/Fallo": 0,
        "Otro": 0,
    };

    calls.forEach((c) => {
        const r = getEndReason(c).toLowerCase();
        if (r === "user-hangup") counts["Usuario colgó"]++;
        else if (r === "agent-hangup") counts["Agente colgó"]++;
        else if (r === "error" || r === "failed" || r.includes("error")) counts["Error/Fallo"]++;
        else counts["Otro"]++;
    });

    const data = Object.entries(counts)
        .filter(([_, count]) => count > 0)
        .map(([name, value]) => ({ name, value }));

    const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#94a3b8"];

    return (
        <div
            className="rounded-2xl p-6"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
        >
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">Origen del Corte</h3>
                <p className="text-sm text-muted-foreground mt-1">¿Quién finalizó la llamada?</p>
            </div>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="hsl(var(--card))" strokeWidth={2} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                            }}
                            itemStyle={{ color: "hsl(var(--foreground))" }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
