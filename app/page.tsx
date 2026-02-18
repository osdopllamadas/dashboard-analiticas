"use client";

import { useState } from "react";

import { useCalls } from "@/lib/hooks/useCalls";
import { useActiveModule } from "@/components/dashboard/LayoutShell";
import {
    DashboardModule,
    CallHistoryModule,
    AnalyticsModule,
    RealtimeModule,
    MinutesModule,
    AIAnalystModule,
} from "@/components/dashboard/Modules";
import { LoginScreen } from "@/components/LoginScreen";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";

function LoadingSkeleton() {
    return (
        <div className="flex-1 p-6 space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="h-8 w-64 bg-secondary rounded-xl" />
                <div className="h-8 w-40 bg-secondary rounded-xl" />
            </div>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-32 bg-secondary rounded-2xl" />
                ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 h-80 bg-secondary rounded-2xl" />
                <div className="h-80 bg-secondary rounded-2xl" />
            </div>
            <div className="h-96 bg-secondary rounded-2xl" />
        </div>
    );
}

export default function Dashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { calls, loading, error, lastUpdated, secondsUntilRefresh, refresh } = useCalls();
    const activeModule = useActiveModule();

    if (!isAuthenticated) {
        return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
    }

    if (loading && calls.length === 0) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Top bar */}
            <div className="flex items-center justify-end gap-3">
                {error ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                        <WifiOff className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-red-400">{error}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                        <Wifi className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-green-400">Live</span>
                    </div>
                )}

                {lastUpdated && (
                    <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground"
                        style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    >
                        <span>Actualizado {lastUpdated.toLocaleTimeString()}</span>
                        <span className="text-blue-400 font-medium">· {secondsUntilRefresh}s</span>
                    </div>
                )}

                <button
                    onClick={refresh}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* Module content */}
            {activeModule === "dashboard" && <DashboardModule calls={calls} />}
            {activeModule === "calls" && <CallHistoryModule calls={calls} />}
            {activeModule === "analytics" && <AnalyticsModule calls={calls} />}
            {activeModule === "realtime" && <RealtimeModule calls={calls} />}
            {activeModule === "minutes" && <MinutesModule calls={calls} />}
            {activeModule === "ai" && <AIAnalystModule calls={calls} />}
        </div>
    );
}
