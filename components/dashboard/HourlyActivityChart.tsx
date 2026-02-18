"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { UltravoxCall } from "@/types";

interface HourlyActivityChartProps {
    calls: UltravoxCall[];
}

export function HourlyActivityChart({ calls }: HourlyActivityChartProps) {
    // 0-23 hours
    const hours = Array(24).fill(0);

    calls.forEach((c) => {
        const d = new Date(c.created);
        const h = d.getHours();
        hours[h]++;
    });

    const data = hours.map((count, h) => ({
        hour: `${h}:00`,
        count,
    }));

    return (
        <div
            className="rounded-2xl p-6"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
        >
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">Actividad por Hora</h3>
                <p className="text-sm text-muted-foreground mt-1">Horarios pico de llamadas</p>
            </div>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} interval={3} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ fill: "hsl(var(--secondary))", opacity: 0.4 }}
                            contentStyle={{
                                background: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                            }}
                        />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Llamadas" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
