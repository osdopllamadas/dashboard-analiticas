"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Phone,
    BarChart3,
    MessageSquarePlus,
    Settings,
    Building2,
    Activity,
    Clock,
    BrainCircuit,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useState } from "react";

export function Sidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const [collapsed, setCollapsed] = useState(false);

    const navigation = [
        { name: "RENTON CALL APP", href: "/dashboard", icon: LayoutDashboard },
        { name: "Historial", href: "/calls", icon: Phone },
        { name: "Analítica", href: "/analytics", icon: BarChart3 },
        { name: "Tiempo Real", href: "/realtime", icon: Activity },
        { name: "Minutos", href: "/minutos", icon: Clock },
        { name: "Analista IA", href: "/analytics", icon: BrainCircuit },
        { name: "Sugerencias", href: "/suggestions", icon: MessageSquarePlus },
        { name: "Configuración", href: "/settings", icon: Settings },
    ];

    return (
        <div className={cn("flex h-full flex-col bg-slate-900 text-white transition-all duration-300", collapsed ? "w-16" : "w-72")}>
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center px-4 border-b border-slate-800 justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-8 w-8 shrink-0 rounded-lg bg-primary flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                    </div>
                    {!collapsed && (
                        <span className="text-sm font-bold tracking-tight text-white overflow-hidden text-ellipsis whitespace-nowrap">
                            DASHCALL APP
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-slate-500 hover:text-white transition-colors shrink-0"
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
            </div>

            {/* Menu label */}
            {!collapsed && (
                <div className="px-4 pt-4 pb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Menú</p>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-2 py-2 overflow-y-auto scrollbar-hide">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href + item.name}
                            href={item.href}
                            title={collapsed ? item.name : undefined}
                            className={cn(
                                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "shrink-0 transition-colors",
                                    collapsed ? "h-5 w-5 mx-auto" : "mr-3 h-5 w-5",
                                    isActive ? "text-white" : "text-slate-500 group-hover:text-white"
                                )}
                                aria-hidden="true"
                            />
                            {!collapsed && item.name}
                            {isActive && !collapsed && (
                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/60" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800">
                <div className="bg-slate-800/50 rounded-lg p-3">
                    {!collapsed && (
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                            {t("dash.plan")}
                        </p>
                    )}
                    <div className="flex items-center text-sm text-slate-300 gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                        {!collapsed && <span className="text-xs">{t("dash.active")}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
