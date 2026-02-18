"use client";

import { FilterState, DatePreset } from "@/types";
import { Calendar, Filter, X, ChevronDown, Phone, Search } from "lucide-react";
import { useState } from "react";

interface FilterBarProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
    totalResults: number;
    showPhoneFilter?: boolean;
}

const DATE_PRESETS: { label: string; value: DatePreset }[] = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
    { label: "This month", value: "month" },
    { label: "All time", value: "all" },
];

const END_REASONS = [
    { label: "All", value: "" },
    { label: "User Hangup", value: "user-hangup" },
    { label: "Agent Hangup", value: "agent-hangup" },
    { label: "Hangup", value: "hangup" },
    { label: "Error", value: "error" },
    { label: "Failed", value: "failed" },
    { label: "Timeout", value: "timeout" },
];

export function applyDatePreset(preset: DatePreset): { startDate: string; endDate: string } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // Use local date parts to avoid UTC offset shifting the date (e.g. UTC-3 users)
    const fmt = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };


    switch (preset) {
        case "today":
            return { startDate: fmt(today), endDate: fmt(today) };
        case "yesterday": {
            const y = new Date(today);
            y.setDate(y.getDate() - 1);
            return { startDate: fmt(y), endDate: fmt(y) };
        }
        case "7d": {
            const d = new Date(today);
            d.setDate(d.getDate() - 6);
            return { startDate: fmt(d), endDate: fmt(today) };
        }
        case "30d": {
            const d = new Date(today);
            d.setDate(d.getDate() - 29);
            return { startDate: fmt(d), endDate: fmt(today) };
        }
        case "month": {
            const d = new Date(today.getFullYear(), today.getMonth(), 1);
            return { startDate: fmt(d), endDate: fmt(today) };
        }
        case "all":
        default:
            return { startDate: "", endDate: "" };
    }
}

export function FilterBar({ filters, onChange, totalResults, showPhoneFilter = false }: FilterBarProps) {
    const [showEndReason, setShowEndReason] = useState(false);

    const activeFiltersCount = [
        filters.startDate,
        filters.endDate,
        filters.minDuration,
        filters.endReason,
        filters.phoneNumber,
    ].filter(Boolean).length;

    const handlePreset = (preset: DatePreset) => {
        const dates = applyDatePreset(preset);
        onChange({ ...filters, ...dates, preset });
    };

    const handleClear = () => {
        onChange({
            startDate: "",
            endDate: "",
            minDuration: "",
            endReason: "",
            searchTerm: filters.searchTerm,
            phoneNumber: "",
            preset: "",
        });
    };

    return (
        <div
            className="rounded-2xl p-4"
            style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
            }}
        >
            <div className="flex flex-wrap items-center gap-3">
                {/* Date Presets */}
                <div className="flex items-center gap-1 flex-wrap">
                    <Filter className="w-4 h-4 text-muted-foreground mr-1 shrink-0" />
                    {DATE_PRESETS.map((preset) => (
                        <button
                            key={preset.value}
                            onClick={() => handlePreset(preset.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${filters.preset === preset.value
                                ? "bg-blue-500 text-white shadow-sm shadow-blue-500/30"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                                }`}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>

                <div className="w-px h-6 bg-border shrink-0" />

                {/* Custom Date Range */}
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) =>
                            onChange({ ...filters, startDate: e.target.value, preset: "" })
                        }
                        className="h-8 px-2 rounded-lg text-xs bg-secondary border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-muted-foreground text-xs">to</span>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) =>
                            onChange({ ...filters, endDate: e.target.value, preset: "" })
                        }
                        className="h-8 px-2 rounded-lg text-xs bg-secondary border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div className="w-px h-6 bg-border shrink-0" />

                {/* Phone Number Filter */}
                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                        type="text"
                        placeholder="Phone number..."
                        value={filters.phoneNumber}
                        onChange={(e) => onChange({ ...filters, phoneNumber: e.target.value })}
                        className="h-8 w-36 px-2 rounded-lg text-xs bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div className="w-px h-6 bg-border shrink-0" />

                {/* Min Duration */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">Min seg:</span>
                    <input
                        type="number"
                        placeholder="0"
                        value={filters.minDuration}
                        onChange={(e) => onChange({ ...filters, minDuration: e.target.value })}
                        className="h-8 w-20 px-2 rounded-lg text-xs bg-secondary border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                {/* End Reason Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowEndReason((v) => !v)}
                        className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <span>
                            {filters.endReason
                                ? END_REASONS.find((r) => r.value === filters.endReason)?.label
                                : "Estado"}
                        </span>
                        <ChevronDown className="w-3 h-3" />
                    </button>
                    {showEndReason && (
                        <div
                            className="absolute top-full mt-1 left-0 z-50 rounded-xl shadow-xl overflow-hidden min-w-[160px]"
                            style={{
                                background: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                            }}
                        >
                            {END_REASONS.map((reason) => (
                                <button
                                    key={reason.value}
                                    onClick={() => {
                                        onChange({ ...filters, endReason: reason.value });
                                        setShowEndReason(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-xs transition-colors ${filters.endReason === reason.value
                                        ? "bg-blue-500/20 text-blue-400"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                        }`}
                                >
                                    {reason.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Clear & Results */}
                <div className="ml-auto flex items-center gap-3">
                    {activeFiltersCount > 0 && (
                        <button
                            onClick={handleClear}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-3 h-3" />
                            Limpiar ({activeFiltersCount})
                        </button>
                    )}
                    <span className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{totalResults.toLocaleString()}</span>{" "}
                        resultados
                    </span>
                </div>
            </div>
        </div>
    );
}
