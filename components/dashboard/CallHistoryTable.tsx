"use client";

import { useState } from "react";
import { UltravoxCall, getCallDuration, getEndReason, getCallerPhone } from "@/types";
import { getCallCost } from "@/lib/api";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Download, Eye } from "lucide-react";
import { CallDetailModal } from "./CallDetailModal";

interface CallHistoryTableProps {
    calls: UltravoxCall[];
}

type SortKey = "created" | "duration" | "cost" | "endReason";
type SortDir = "asc" | "desc";

function StatusBadge({ reason }: { reason: string }) {
    const isSuccess = !reason || (reason !== "error" && reason !== "failed");
    const isError = reason === "error" || reason === "failed";

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${isError
                ? "bg-red-500/15 text-red-400"
                : isSuccess && reason
                    ? "bg-green-500/15 text-green-400"
                    : "bg-yellow-500/15 text-yellow-400"
                }`}
        >
            {reason || "—"}
        </span>
    );
}

function formatDuration(seconds: number): string {
    if (seconds <= 0) return "—";
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const r = seconds % 60;
    return r > 0 ? `${m}m ${r}s` : `${m}m`;
}

function exportToCSV(calls: UltravoxCall[]) {
    const headers = ["Fecha", "Call ID", "Teléfono", "Duración", "Razón de fin", "Costo", "Resumen"];
    const rows = calls.map((c) => [
        new Date(c.created).toLocaleString("es"),
        c.callId,
        getCallerPhone(c),
        formatDuration(getCallDuration(c)),
        getEndReason(c),
        getCallCost(c).toFixed(4),
        (c.shortSummary || c.summary || "").replace(/,/g, ";"),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `llamadas-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export function CallHistoryTable({ calls }: CallHistoryTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState<SortKey>("created");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [selectedCall, setSelectedCall] = useState<UltravoxCall | null>(null);
    const itemsPerPage = 15;

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
        setPage(1);
    };

    const filtered = calls.filter((call) => {
        const term = searchTerm.toLowerCase();
        return (
            call.callId.toLowerCase().includes(term) ||
            (call.shortSummary && call.shortSummary.toLowerCase().includes(term)) ||
            getCallerPhone(call).includes(term) ||
            getEndReason(call).toLowerCase().includes(term)
        );
    });

    const sorted = [...filtered].sort((a, b) => {
        let aVal: number | string = 0;
        let bVal: number | string = 0;

        switch (sortKey) {
            case "created":
                aVal = new Date(a.created).getTime();
                bVal = new Date(b.created).getTime();
                break;
            case "duration":
                aVal = getCallDuration(a);
                bVal = getCallDuration(b);
                break;
            case "cost":
                aVal = getCallCost(a);
                bVal = getCallCost(b);
                break;
            case "endReason":
                aVal = getEndReason(a);
                bVal = getEndReason(b);
                break;
        }

        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    const paginated = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const SortButton = ({ col }: { col: SortKey }) => (
        <button onClick={() => handleSort(col)} className="ml-1 opacity-50 hover:opacity-100 transition-opacity">
            <ArrowUpDown className={`w-3 h-3 inline ${sortKey === col ? "opacity-100 text-blue-400" : ""}`} />
        </button>
    );

    return (
        <>
            <CallDetailModal call={selectedCall} onClose={() => setSelectedCall(null)} />

            <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Historial de Llamadas</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{filtered.length.toLocaleString()} llamadas</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="search"
                                placeholder="Buscar llamadas..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                                className="h-9 pl-9 pr-4 w-56 rounded-lg text-sm bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => exportToCSV(sorted)}
                            className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Exportar
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Fecha <SortButton col="created" />
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Teléfono</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Duración <SortButton col="duration" />
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Estado <SortButton col="endReason" />
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Costo <SortButton col="cost" />
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resumen</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((call) => {
                                const dur = getCallDuration(call);
                                const reason = getEndReason(call);
                                const phone = getCallerPhone(call);
                                return (
                                    <tr
                                        key={call.callId}
                                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                                        onClick={() => setSelectedCall(call)}
                                    >
                                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                            {new Date(call.created).toLocaleString("es", {
                                                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-blue-400 font-medium text-xs">
                                            {phone || <span className="text-muted-foreground">—</span>}
                                        </td>
                                        <td className="px-6 py-4 text-foreground">{formatDuration(dur)}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge reason={reason} />
                                        </td>
                                        <td className="px-6 py-4 text-foreground font-medium">
                                            ${getCallCost(call).toFixed(4)}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <span className="text-muted-foreground truncate block" title={call.summary || call.shortSummary}>
                                                {call.shortSummary || call.summary || "—"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedCall(call); }}
                                                className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {paginated.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                        No se encontraron llamadas
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                        Mostrando {Math.min((page - 1) * itemsPerPage + 1, sorted.length)}–
                        {Math.min(page * itemsPerPage, sorted.length)} de {sorted.length.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-muted-foreground px-2">{page} / {totalPages || 1}</span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || totalPages === 0}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
