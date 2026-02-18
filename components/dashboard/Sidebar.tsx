"use client";

import {
    LayoutDashboard,
    Phone,
    BarChart3,
    Clock,
    Settings,
    ChevronLeft,
    ChevronRight,
    Activity,
    Zap,
    Sparkles,
    Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModuleId } from "@/types";
import { useLanguage } from "@/lib/i18n";

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    activeModule: ModuleId;
    onModuleChange: (id: ModuleId) => void;
}

export function Sidebar({ collapsed, onToggle, activeModule, onModuleChange }: SidebarProps) {
    const { t, language, setLanguage } = useLanguage();

    const navItems: { label: string; icon: React.ElementType; id: ModuleId }[] = [
        { label: t("nav.dashboard"), icon: LayoutDashboard, id: "dashboard" },
        { label: t("nav.calls"), icon: Phone, id: "calls" },
        { label: t("nav.analytics"), icon: BarChart3, id: "analytics" },
        { label: t("nav.realtime"), icon: Activity, id: "realtime" },
        { label: t("nav.minutes"), icon: Clock, id: "minutes" },
        { label: t("nav.ai"), icon: Sparkles, id: "ai" },
    ];

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "es" : "en");
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out",
                "gradient-sidebar border-r border-white/5",
                collapsed ? "w-[72px]" : "w-[260px]"
            )}
        >
            {/* Logo */}
            <div className="flex items-center h-16 px-4 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="shrink-0 w-9 h-9 rounded-xl gradient-blue flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="text-white font-bold text-sm leading-tight whitespace-nowrap">
                                {t("brand.app")}
                            </p>
                            <p className="text-blue-400 text-xs font-medium whitespace-nowrap">
                                {t("brand.org")}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {!collapsed && (
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
                        Menu
                    </p>
                )}
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeModule === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onModuleChange(item.id)}
                            title={collapsed ? item.label : undefined}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-blue-500/20 text-blue-400 shadow-sm"
                                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "shrink-0 w-5 h-5",
                                    isActive ? "text-blue-400" : "text-slate-500"
                                )}
                            />
                            {!collapsed && (
                                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                    {item.label}
                                </span>
                            )}
                            {isActive && !collapsed && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Settings & Collapse */}
            <div className="px-3 pb-4 space-y-1 border-t border-white/5 pt-3">
                {/* Language Toggle */}
                <button
                    onClick={toggleLanguage}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    )}
                    title={language === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
                >
                    <Globe className="shrink-0 w-5 h-5 text-slate-500" />
                    {!collapsed && (
                        <div className="flex items-center justify-between w-full">
                            <span>{language === "en" ? "Español" : "English"}</span>
                            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded uppercase">{language}</span>
                        </div>
                    )}
                </button>

                <button
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    )}
                >
                    <Settings className="shrink-0 w-5 h-5 text-slate-500" />
                    {!collapsed && <span>{t("nav.settings")}</span>}
                </button>

                <button
                    onClick={onToggle}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    )}
                >
                    {collapsed ? (
                        <ChevronRight className="shrink-0 w-5 h-5 text-slate-500" />
                    ) : (
                        <>
                            <ChevronLeft className="shrink-0 w-5 h-5 text-slate-500" />
                            <span>{collapsed ? t("nav.expand") : t("nav.collapse")}</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
}
