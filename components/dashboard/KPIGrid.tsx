"use client";

import { UltravoxCall } from "@/types";
import { Phone, CheckCircle, AlertCircle, Clock, TrendingUp, DollarSign } from "lucide-react";
import { computeStats } from "@/lib/api";
import { useLanguage } from "@/lib/i18n";

interface KPIGridProps {
    calls: UltravoxCall[];
}

function formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

function formatMinutes(seconds: number): string {
    return (seconds / 60).toFixed(1) + "m";
}

/** Smart cost formatting: avoids ambiguous displays like $3.0050 */
function formatCost(amount: number): string {
    if (amount === 0) return "$0.00";
    if (amount < 0.01) return `$${amount.toFixed(4)}`;   // e.g. $0.0055
    if (amount < 1) return `$${amount.toFixed(3)}`;       // e.g. $0.330
    if (amount < 100) return `$${amount.toFixed(2)}`;     // e.g. $3.30
    return `$${Math.round(amount).toLocaleString()}`;     // e.g. $1,234
}

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    gradient: string;
    iconBg: string;
    delay?: number;
}

function KPICard({ title, value, subtitle, icon: Icon, gradient, iconBg, delay = 0 }: KPICardProps) {
    return (
        <div
            className="relative overflow-hidden rounded-2xl p-6 card-hover animate-slide-up"
            style={{
                animationDelay: `${delay}ms`,
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
            }}
        >
            {/* Background gradient accent */}
            <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-8 translate-x-8"
                style={{ background: gradient }}
            />

            <div className="relative flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                    <p className="text-3xl font-bold tracking-tight text-foreground mb-1">
                        {value}
                    </p>
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0"
                    style={{ background: iconBg }}
                >
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
}

export function KPIGrid({ calls }: KPIGridProps) {
    const { t } = useLanguage();
    const stats = computeStats(calls);

    const cards: KPICardProps[] = [
        {
            title: t("kpi.totalCalls"),
            value: stats.totalCalls.toLocaleString(),
            subtitle: `${stats.effectiveCalls} ${t("kpi.effective")}`,
            icon: Phone,
            gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            iconBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            delay: 0,
        },
        {
            title: t("kpi.successRate"),
            value: `${stats.successRate}%`,
            subtitle: `${stats.effectiveCalls} ${t("kpi.of")} ${stats.totalCalls} ${t("kpi.calls")}`,
            icon: CheckCircle,
            gradient: "linear-gradient(135deg, #10b981, #059669)",
            iconBg: "linear-gradient(135deg, #10b981, #059669)",
            delay: 80,
        },
        {
            title: t("kpi.errors"),
            value: stats.errorCalls,
            subtitle: `${stats.totalCalls > 0 ? ((stats.errorCalls / stats.totalCalls) * 100).toFixed(1) : 0}% ${t("kpi.errorRate")}`,
            icon: AlertCircle,
            gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
            iconBg: "linear-gradient(135deg, #ef4444, #dc2626)",
            delay: 160,
        },
        {
            title: t("kpi.avgDuration"),
            value: formatTime(stats.avgDuration),
            subtitle: `Total: ${formatMinutes(stats.totalDurationSeconds)}`,
            icon: Clock,
            gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
            iconBg: "linear-gradient(135deg, #f59e0b, #d97706)",
            delay: 240,
        },
        {
            title: t("kpi.totalMinutes"),
            value: formatMinutes(stats.totalDurationSeconds),
            subtitle: `${t("kpi.billed")}: ${formatMinutes(stats.totalBilledSeconds)}`,
            icon: TrendingUp,
            gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            iconBg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            delay: 320,
        },
        {
            title: t("kpi.totalCost"),
            value: formatCost(stats.totalCost),
            subtitle: t("kpi.avgCallCost").replace("{cost}", formatCost(stats.totalCalls > 0 ? stats.totalCost / stats.totalCalls : 0)),
            icon: DollarSign,
            gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
            iconBg: "linear-gradient(135deg, #06b6d4, #0891b2)",
            delay: 400,
        },
    ];

    return (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((card) => (
                <KPICard key={card.title} {...card} />
            ))}
        </div>
    );
}
