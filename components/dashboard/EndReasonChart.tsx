"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { UltravoxCall, getEndReason } from "@/types";

interface EndReasonChartProps {
    calls: UltravoxCall[];
}

const COLORS: Record<string, string> = {
    "hangup": "#10b981",
    "user-hangup": "#3b82f6",
    "agent-hangup": "#8b5cf6",
    "error": "#ef4444",
    "failed": "#dc2626",
    "timeout": "#f59e0b",
    "unknown": "#6b7280",
};

const DEFAULT_COLOR = "#6b7280";

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const { name, value, percent } = payload[0];
        return (
            <div
                className="rounded-xl p-3 shadow-xl text-sm"
                style={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                }}
            >
                <p className="font-semibold text-foreground capitalize">{name}</p>
                <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{value}</span> calls (
                    {(percent * 100).toFixed(1)}%)
                </p>
            </div>
        );
    }
    return null;
};

export function EndReasonChart({ calls }: EndReasonChartProps) {
    const reasonMap = calls.reduce(
        (acc, call) => {
            const reason = getEndReason(call) || "sin razón";
            acc[reason] = (acc[reason] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    const data = Object.entries(reasonMap)
        .sort(([, a], [, b]) => b - a)
        .map(([name, value]) => ({ name, value }));

    return (
        <div
            className="rounded-2xl p-6"
            style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
            }}
        >
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Call Outcomes</h3>
                <p className="text-sm text-muted-foreground mt-1">Distribution by end reason</p>
            </div>
            <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={3}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[entry.name] || DEFAULT_COLOR}
                                    stroke="transparent"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: "11px" }}
                            formatter={(value) => (
                                <span
                                    style={{ color: "hsl(var(--muted-foreground))", textTransform: "capitalize" }}
                                >
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
