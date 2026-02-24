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
    X,
    Building2,
    Globe,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function Sidebar() {
    const pathname = usePathname();
    const { t, language, setLanguage } = useLanguage();

    const navigation = [
        { name: t("nav.dashboard"), href: "/dashboard", icon: LayoutDashboard },
        { name: t("nav.calls"), href: "/calls", icon: Phone },
        { name: t("nav.analytics"), href: "/analytics", icon: BarChart3 },
        { name: t("nav.suggestions"), href: "/suggestions", icon: MessageSquarePlus },
        { name: t("nav.settings"), href: "/settings", icon: Settings },
    ];

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "es" : "en");
    };

    return (
        <div className="flex h-full flex-col bg-slate-900 text-white">
            <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-800">
                <Building2 className="h-8 w-8 text-primary shrink-0" />
                <span className="ml-3 text-xl font-bold tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">
                    CRM Enterprise
                </span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto scrollbar-hide">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 shrink-0 transition-colors",
                                    isActive ? "text-white" : "text-slate-500 group-hover:text-white"
                                )}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-800 space-y-4">
                {/* Language Toggle */}
                <button
                    onClick={toggleLanguage}
                    className="flex w-full items-center px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                >
                    <Globe className="mr-3 h-5 w-5 text-slate-500 group-hover:text-white" />
                    <span>{language === "en" ? "Español" : "English"}</span>
                </button>

                <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                        {t("dash.plan")}
                    </p>
                    <div className="flex items-center text-sm text-slate-300">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                        {t("dash.active")}
                    </div>
                </div>
            </div>
        </div>
    );
}
