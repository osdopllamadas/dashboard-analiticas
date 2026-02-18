"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { UltravoxCall } from "@/types";

interface CallsOverTimeChartProps {
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
                <p className="font-semibold text-foreground mb-1">{label}</p>
                <p className="text-muted-foreground">
                    <span className="font-medium text-blue-400">{payload[0]?.value}</span>{" "}
                    calls
                </p>
            </div>
        );
    }
    return null;
};

export function CallsOverTimeChart({ calls }: CallsOverTimeChartProps) {
    const dataMap = calls.reduce(
        (acc, call) => {
            const date = new Date(call.created).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    const data = Object.entries(dataMap)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([date, count]) => ({ date, count }));

    return (
        <div
            className="rounded-2xl p-6"
            style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
            }}
        >
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">Calls Over Time</h3>
                <p className="text-sm text-muted-foreground mt-1">Daily call volume</p>
            </div>
            <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#3b82f6"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5, fill: "#3b82f6", strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
