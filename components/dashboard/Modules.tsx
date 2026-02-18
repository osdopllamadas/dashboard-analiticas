"use client";

import { UltravoxCall, FilterState, getCallDuration, getCallerPhone, getEndReason } from "@/types";
import { getBilledSeconds, getCallCost } from "@/lib/api";
import { KPIGrid } from "./KPIGrid";
import { MinutesChart } from "./MinutesChart";
import { CallsOverTimeChart } from "./CallsOverTimeChart";
import { EndReasonChart } from "./EndReasonChart";
import { CallHistoryTable } from "./CallHistoryTable";
import { FilterBar, applyDatePreset } from "./FilterBar";
import { DurationHistogram } from "./DurationHistogram";
import { HourlyActivityChart } from "./HourlyActivityChart";
import { HangupSourceChart } from "./HangupSourceChart";
export { AIAnalystModule } from "./AIAnalystModule";
import { useState, useMemo } from "react";

interface DashboardModuleProps {
    calls: UltravoxCall[];
}

const initialDates = applyDatePreset("30d");
const INIT: FilterState = {
    startDate: initialDates.startDate,
    endDate: initialDates.endDate,
    minDuration: "",
    endReason: "",
    searchTerm: "",
    phoneNumber: "",
    preset: "30d",
};

function applyFilters(calls: UltravoxCall[], filters: FilterState): UltravoxCall[] {
    return calls.filter((call) => {
        const callDate = new Date(call.created);

        // Parse as local time (no "Z") to avoid UTC offset shifting the date boundary
        if (filters.startDate && callDate < new Date(filters.startDate + "T00:00:00")) return false;
        if (filters.endDate) {
            const end = new Date(filters.endDate + "T23:59:59.999");
            if (callDate > end) return false;
        }

        if (filters.minDuration) {
            const dur = getCallDuration(call);
            if (dur < parseInt(filters.minDuration)) return false;
        }

        if (filters.endReason) {
            const reason = getEndReason(call);
            if (reason !== filters.endReason) return false;
        }

        if (filters.phoneNumber) {
            const phone = filters.phoneNumber.toLowerCase();
            const callerPhone = getCallerPhone(call).toLowerCase();
            const did = (call.metadata?.["ultravox.sip.header.did"] || "").toLowerCase();
            if (!callerPhone.includes(phone) && !did.includes(phone)) return false;
        }

        return true;
    });
}

// ─── MODULE: DASHBOARD ───────────────────────────────────────────────────────
export function DashboardModule({ calls }: DashboardModuleProps) {
    const [filters, setFilters] = useState<FilterState>(INIT);
    const filtered = useMemo(() => applyFilters(calls, filters), [calls, filters]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Dashboard <span className="text-gradient">Overview</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">Resumen general de llamadas</p>
            </div>
            <FilterBar filters={filters} onChange={setFilters} totalResults={filtered.length} />
            <KPIGrid calls={filtered} />
            <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <MinutesChart calls={filtered} />
                </div>
                <div>
                    <EndReasonChart calls={filtered} />
                </div>
            </div>
            <CallsOverTimeChart calls={filtered} />
        </div>
    );
}

// ─── MODULE: CALL HISTORY ─────────────────────────────────────────────────────
export function CallHistoryModule({ calls }: DashboardModuleProps) {
    const [filters, setFilters] = useState<FilterState>({
        ...INIT,
        preset: "all",
        startDate: "",
        endDate: "",
    });
    const filtered = useMemo(() => applyFilters(calls, filters), [calls, filters]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Historial de <span className="text-gradient">Llamadas</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Registro completo — <span className="text-foreground font-semibold">{calls.length.toLocaleString()}</span> llamadas en total
                </p>
            </div>
            <FilterBar filters={filters} onChange={setFilters} totalResults={filtered.length} showPhoneFilter />
            <CallHistoryTable calls={filtered} />
        </div>
    );
}

// ─── MODULE: ANALYTICS ───────────────────────────────────────────────────────
export function AnalyticsModule({ calls }: DashboardModuleProps) {
    const [filters, setFilters] = useState<FilterState>(INIT);
    const filtered = useMemo(() => applyFilters(calls, filters), [calls, filters]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Analytics <span className="text-gradient">Avanzado</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">Análisis detallado de métricas y tendencias</p>
            </div>
            <FilterBar filters={filters} onChange={setFilters} totalResults={filtered.length} />
            <KPIGrid calls={filtered} />

            <div className="grid gap-4 lg:grid-cols-2">
                <CallsOverTimeChart calls={filtered} />
                <HourlyActivityChart calls={filtered} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <DurationHistogram calls={filtered} />
                <HangupSourceChart calls={filtered} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <EndReasonChart calls={filtered} />
                <MinutesChart calls={filtered} />
            </div>
        </div>
    );
}

// ─── MODULE: REAL-TIME ────────────────────────────────────────────────────────
export function RealtimeModule({ calls }: DashboardModuleProps) {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const [filters, setFilters] = useState<FilterState>({
        ...INIT,
        startDate: todayStr,
        endDate: todayStr,
        preset: "today",
    });
    const filtered = useMemo(() => applyFilters(calls, filters), [calls, filters]);

    const recentCalls = [...filtered]
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
        .slice(0, 50);

    const activeCalls = calls.filter(c => !c.ended);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Actividad <span className="text-gradient">en Tiempo Real</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">Llamadas de hoy — actualización cada 3 minutos</p>
            </div>

            {/* Active Calls Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div
                    className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 relative overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-sm font-medium text-blue-400">Llamadas Activas</h3>
                            <div className="text-3xl font-bold text-foreground mt-1">
                                {activeCalls.length}
                            </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mt-1" />
                    </div>
                    {activeCalls.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {activeCalls.map(c => (
                                <div key={c.callId} className="flex justify-between text-xs text-muted-foreground bg-background/50 p-2 rounded border border-border/50">
                                    <span>{getCallerPhone(c) || "Desconocido"}</span>
                                    <span>{getCallDuration(c)}s</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <FilterBar filters={filters} onChange={setFilters} totalResults={filtered.length} showPhoneFilter />
            <KPIGrid calls={filtered} />
            <div className="grid gap-4 lg:grid-cols-2">
                <EndReasonChart calls={filtered} />
                <CallsOverTimeChart calls={filtered} />
            </div>
            {/* Recent calls feed */}
            <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            >
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-semibold text-foreground">Últimas llamadas de hoy</h3>
                </div>
                <div className="divide-y divide-border/50">
                    {recentCalls.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            No hay llamadas hoy todavía
                        </div>
                    ) : (
                        recentCalls.map((call) => {
                            const reason = getEndReason(call);
                            const isSuccess = !reason || (reason !== "error" && reason !== "failed");
                            const isError = reason === "error" || reason === "failed";
                            const dur = getCallDuration(call);
                            const mins = Math.floor(dur / 60);
                            const secs = dur % 60;
                            const phone = getCallerPhone(call);
                            const did = call.metadata?.["ultravox.sip.header.did"] || "";
                            return (
                                <div key={call.callId} className="flex items-center gap-4 px-6 py-3 hover:bg-secondary/20 transition-colors">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${isError ? "bg-red-400" : isSuccess ? "bg-green-400" : "bg-yellow-400"}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-mono text-muted-foreground">{call.callId.slice(0, 8)}...</span>
                                            {phone && <span className="text-xs text-blue-400 font-medium">{phone}</span>}
                                            {did && <span className="text-xs text-slate-500">→ {did}</span>}
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">{call.shortSummary || call.summary || "Sin resumen"}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs text-foreground font-medium">
                                            {dur > 0 ? (mins > 0 ? `${mins}m ${secs}s` : `${secs}s`) : "—"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(call.created).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── MODULE: MINUTES ─────────────────────────────────────────────────────────
export function MinutesModule({ calls }: DashboardModuleProps) {
    const [filters, setFilters] = useState<FilterState>(INIT);
    const filtered = useMemo(() => applyFilters(calls, filters), [calls, filters]);

    const totalSec = filtered.reduce((a, c) => a + getCallDuration(c), 0);
    const billedSec = filtered.reduce((a, c) => a + getBilledSeconds(c), 0);
    const totalCost = filtered.reduce((a, c) => a + getCallCost(c), 0);

    const statCards = [
        { label: "Minutos Totales", value: (totalSec / 60).toFixed(1) + "m", color: "text-blue-400" },
        { label: "Minutos Facturados", value: (billedSec / 60).toFixed(1) + "m", color: "text-green-400" },
        { label: "Costo Total", value: "$" + totalCost.toFixed(4), color: "text-purple-400" },
        { label: "Costo/Minuto", value: billedSec > 0 ? "$" + (totalCost / (billedSec / 60)).toFixed(4) : "$0.0000", color: "text-orange-400" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Análisis de <span className="text-gradient">Minutos</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">Consumo de minutos totales y facturados</p>
            </div>
            <FilterBar filters={filters} onChange={setFilters} totalResults={filtered.length} />

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-2xl p-5"
                        style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    >
                        <p className="text-xs text-muted-foreground mb-2">{card.label}</p>
                        <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            <MinutesChart calls={filtered} />

            {/* Per-day breakdown */}
            <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            >
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-semibold text-foreground">Desglose por Día</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                {["Fecha", "Llamadas", "Min. Totales", "Min. Facturados", "Costo"].map((h) => (
                                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const dayMap: Record<string, { calls: number; totalSec: number; billedSec: number; cost: number }> = {};
                                filtered.forEach((c) => {
                                    const day = new Date(c.created).toLocaleDateString("es", { year: "numeric", month: "short", day: "numeric" });
                                    if (!dayMap[day]) dayMap[day] = { calls: 0, totalSec: 0, billedSec: 0, cost: 0 };
                                    dayMap[day].calls++;
                                    dayMap[day].totalSec += getCallDuration(c);
                                    dayMap[day].billedSec += getBilledSeconds(c);
                                    dayMap[day].cost += getCallCost(c);
                                });
                                return Object.entries(dayMap)
                                    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                                    .map(([day, data]) => (
                                        <tr key={day} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                                            <td className="px-6 py-3 text-foreground font-medium">{day}</td>
                                            <td className="px-6 py-3 text-muted-foreground">{data.calls}</td>
                                            <td className="px-6 py-3 text-blue-400 font-medium">{(data.totalSec / 60).toFixed(1)}m</td>
                                            <td className="px-6 py-3 text-green-400 font-medium">{(data.billedSec / 60).toFixed(1)}m</td>
                                            <td className="px-6 py-3 text-purple-400 font-medium">${data.cost.toFixed(4)}</td>
                                        </tr>
                                    ));
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
