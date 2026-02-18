"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { UltravoxCall, getCallDuration, parseDurationSeconds } from "@/types";

interface MinutesChartProps {
    calls: UltravoxCall[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div
                className="rounded-xl p-3 shadow-xl text-sm"
                style={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                }}
            >
                <p className="font-semibold text-foreground mb-2">{label}</p>
                {payload.map((entry: any) => (
                    <div key={entry.name} className="flex items-center gap-2">
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: entry.color }}
                        />
                        <span className="text-muted-foreground">{entry.name}:</span>
                        <span className="font-medium text-foreground">
                            {entry.value.toFixed(2)}m
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function MinutesChart({ calls }: MinutesChartProps) {
    const dataMap = calls.reduce(
        (acc, call) => {
            const date = new Date(call.created).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            if (!acc[date]) {
                acc[date] = { date, totalMinutes: 0, billedMinutes: 0, calls: 0 };
            }
            const duration = getCallDuration(call);
            const billedDuration = parseDurationSeconds(call.sipDetails?.billedDuration);
            acc[date].totalMinutes += duration / 60;
            acc[date].billedMinutes += billedDuration / 60;
            acc[date].calls += 1;
            return acc;
        },
        {} as Record<
            string,
            { date: string; totalMinutes: number; billedMinutes: number; calls: number }
        >
    );

    const data = Object.values(dataMap)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((d) => ({
            ...d,
            totalMinutes: Math.round(d.totalMinutes * 100) / 100,
            billedMinutes: Math.round(d.billedMinutes * 100) / 100,
        }));

    return (
        <div
            className="rounded-2xl p-6"
            style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
            }}
        >
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">Minutes Analysis</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Total vs billed minutes per day
                </p>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorBilled" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `${v}m`}
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                            formatter={(value) => (
                                <span style={{ color: "hsl(var(--muted-foreground))" }}>{value}</span>
                            )}
                        />
                        <Area
                            type="monotone"
                            dataKey="totalMinutes"
                            name="Total Minutes"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="url(#colorTotal)"
                            dot={false}
                            activeDot={{ r: 4, fill: "#3b82f6" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="billedMinutes"
                            name="Billed Minutes"
                            stroke="#10b981"
                            strokeWidth={2}
                            fill="url(#colorBilled)"
                            dot={false}
                            activeDot={{ r: 4, fill: "#10b981" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
