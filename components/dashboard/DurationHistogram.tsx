"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { UltravoxCall, getCallDuration } from "@/types";

interface DurationHistogramProps {
    calls: UltravoxCall[];
}

export function DurationHistogram({ calls }: DurationHistogramProps) {
    const buckets = {
        "0-10s": 0,
        "10-30s": 0,
        "30-60s": 0,
        "1-3m": 0,
        "3m+": 0,
    };

    calls.forEach((c) => {
        const d = getCallDuration(c);
        if (d <= 10) buckets["0-10s"]++;
        else if (d <= 30) buckets["10-30s"]++;
        else if (d <= 60) buckets["30-60s"]++;
        else if (d <= 180) buckets["1-3m"]++;
        else buckets["3m+"]++;
    });

    const data = Object.entries(buckets).map(([range, count]) => ({ range, count }));

    return (
        <div
            className="rounded-2xl p-6"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
        >
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">Retención y Duración</h3>
                <p className="text-sm text-muted-foreground mt-1">Cómo se distribuye la duración de tus llamadas</p>
            </div>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ fill: "hsl(var(--secondary))", opacity: 0.4 }}
                            contentStyle={{
                                background: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                            }}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Llamadas" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
