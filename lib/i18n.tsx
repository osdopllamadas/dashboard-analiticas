"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "es";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
    en: {
        // Auth
        "login.title": "DASHCALL APP",
        "login.subtitle": "Enterprise Intelligence Platform",
        "login.username": "Username",
        "login.password": "Password",
        "login.submit": "Login",
        "login.error": "Invalid credentials. Access denied.",
        "login.footer": "© 2026 RENTON CONNECTIVE. All rights reserved.",

        // Brand
        "brand.app": "DASHCALL APP",
        "brand.org": "Enterprise Intelligence Platform",

        // Sidebar
        "nav.dashboard": "RENTON CALL APP",
        "nav.calls": "Call History",
        "nav.analytics": "Analytics",
        "nav.realtime": "Real-time",
        "nav.minutes": "Minutes",
        "nav.ai": "AI Analyst",
        "nav.collapse": "Collapse",
        "nav.expand": "Expand",
        "nav.settings": "Settings",

        // KPI
        "kpi.totalCalls": "Total Calls",
        "kpi.successRate": "Success Rate",
        "kpi.errors": "Errors",
        "kpi.avgDuration": "Avg Duration",
        "kpi.totalMinutes": "Total Minutes",
        "kpi.totalCost": "Total Cost",
        "kpi.billed": "Billed",
        "kpi.costPerMin": "Cost/Min",
        "kpi.effective": "effective",
        "kpi.of": "of",
        "kpi.errorRate": "error rate",
        "kpi.avgCallCost": "Avg {cost}/call",

        // Modules
        "dashboard.title": "Dashboard",
        "dashboard.subtitle": "Overview",
        "dashboard.desc": "General call summary",

        "history.title": "Call",
        "history.subtitle": "History",
        "history.desc": "Complete log — {count} total calls",

        "analytics.title": "Advanced",
        "analytics.subtitle": "Analytics",
        "analytics.desc": "Detailed analysis of metrics and trends",

        "realtime.title": "Real-time",
        "realtime.subtitle": "Activity",
        "realtime.desc": "Today's calls — updates every 3 minutes",
        "realtime.activeCalls": "Active Calls",
        "realtime.recent": "Latest calls today",
        "realtime.noCalls": "No calls today yet",

        "minutes.title": "Minutes",
        "minutes.subtitle": "Analysis",
        "minutes.desc": "Total and billed minutes consumption",
        "minutes.breakdown": "Daily Breakdown",
        "minutes.table.date": "Date",
        "minutes.table.calls": "Calls",
        "minutes.table.total": "Total Min.",
        "minutes.table.billed": "Billed Min.",
        "minutes.table.cost": "Cost",

        // Filters
        "filter.today": "Today",
        "filter.yesterday": "Yesterday",
        "filter.last7": "Last 7 days",
        "filter.last30": "Last 30 days",
        "filter.month": "This month",
        "filter.all": "All time",
        "filter.to": "to",
        "filter.phonePlaceholder": "Phone number...",
        "filter.minSec": "Min sec:",
        "filter.status": "Status",
        "filter.clear": "Clear",
        "filter.results": "results",

        "reason.all": "All",
        "reason.userHangup": "User Hangup",
        "reason.agentHangup": "Agent Hangup",
        "reason.hangup": "Hangup",
        "reason.error": "Error",
        "reason.failed": "Failed",
        "reason.timeout": "Timeout",

        // Table
        "table.title": "Call History",
        "table.count": "{count} calls",
        "table.search": "Search calls...",
        "table.export": "Export",
        "table.date": "Date",
        "table.phone": "Phone",
        "table.duration": "Duration",
        "table.status": "Status",
        "table.cost": "Cost",
        "table.summary": "Summary",
        "table.callId": "Call ID",
        "table.endReason": "End Reason",
        "table.noCalls": "No calls found",
        "table.showing": "Showing",
        "table.of": "of",

        // AI Analyst
        "ai.title": "AI Analyst",
        "ai.subtitle": "AI-Powered Strategic Insights",
        "ai.login.title": "AI Analyst Login",
        "ai.login.submit": "Access",
        "ai.login.header": "AI Analyst Login",
        "ai.login.desc": "Restricted access to intelligence module",
        "ai.status.analyzing": "Analyzing...",
        "ai.status.generate": "Generate Analysis",
        "ai.status.new": "Generate new analysis",
        "ai.ready.title": "Ready to analyze your data",
        "ai.ready.desc": "AI will evaluate {count} calls to find patterns, quality issues, and saving opportunities.",

        "ai.apiKey.placeholder": "Enter new OpenAI API Key...",
        "ai.apiKey.save": "Save",
        "ai.apiKey.change": "Change API Key",
        "ai.analyze": "Generate Analysis",
        "ai.analyzing": "Analyzing...",
        "ai.ready.text": "AI will evaluate calls for patterns and insights.",
    },
    es: {
        // Auth
        "login.title": "DASHCALL APP",
        "login.subtitle": "Plataforma de Inteligencia Empresarial",
        "login.username": "Usuario",
        "login.password": "Contraseña",
        "login.submit": "Iniciar Sesión",
        "login.error": "Credenciales inválidas. Acceso denegado.",
        "login.footer": "© 2026 RENTON CONNECTIVE. Todos los derechos reservados.",

        // Brand
        "brand.app": "DASHCALL APP",
        "brand.org": "Plataforma de Inteligencia Empresarial",

        // Sidebar
        "nav.dashboard": "RENTON CALL APP",
        "nav.calls": "Historial",
        "nav.analytics": "Analítica",
        "nav.realtime": "Tiempo Real",
        "nav.minutes": "Minutos",
        "nav.ai": "Analista IA",
        "nav.collapse": "Colapsar",
        "nav.expand": "Expandir",
        "nav.settings": "Configuración",

        // KPI
        "kpi.totalCalls": "Total Llamadas",
        "kpi.successRate": "Tasa Éxito",
        "kpi.errors": "Errores",
        "kpi.avgDuration": "Duración Prom.",
        "kpi.totalMinutes": "Minutos Totales",
        "kpi.totalCost": "Costo Total",
        "kpi.billed": "Facturados",
        "kpi.costPerMin": "Costo/Min",
        "kpi.effective": "efectivas",
        "kpi.of": "de",
        "kpi.errorRate": "tasa de error",
        "kpi.avgCallCost": "Prom. {cost}/llamada",

        // Modules
        "dashboard.title": "Resumen",
        "dashboard.subtitle": "General",
        "dashboard.desc": "Resumen general de llamadas",

        "history.title": "Historial de",
        "history.subtitle": "Llamadas",
        "history.desc": "Registro completo — {count} llamadas en total",

        "analytics.title": "Analytics",
        "analytics.subtitle": "Avanzado",
        "analytics.desc": "Análisis detallado de métricas y tendencias",

        "realtime.title": "Actividad",
        "realtime.subtitle": "en Tiempo Real",
        "realtime.desc": "Llamadas de hoy — actualización cada 3 minutos",
        "realtime.activeCalls": "Llamadas Activas",
        "realtime.recent": "Últimas llamadas de hoy",
        "realtime.noCalls": "No hay llamadas hoy todavía",

        "minutes.title": "Análisis de",
        "minutes.subtitle": "Minutos",
        "minutes.desc": "Consumo de minutos totales y facturados",
        "minutes.breakdown": "Desglose por Día",
        "minutes.table.date": "Fecha",
        "minutes.table.calls": "Llamadas",
        "minutes.table.total": "Min. Totales",
        "minutes.table.billed": "Min. Facturados",
        "minutes.table.cost": "Costo",

        // Filters
        "filter.today": "Hoy",
        "filter.yesterday": "Ayer",
        "filter.last7": "Últimos 7 días",
        "filter.last30": "Últimos 30 días",
        "filter.month": "Este mes",
        "filter.all": "Todos",
        "filter.to": "a",
        "filter.phonePlaceholder": "Teléfono...",
        "filter.minSec": "Min seg:",
        "filter.status": "Estado",
        "filter.clear": "Limpiar",
        "filter.results": "resultados",

        "reason.all": "Todos",
        "reason.userHangup": "Cuelgue Usuario",
        "reason.agentHangup": "Cuelgue Agente",
        "reason.hangup": "Cuelgue",
        "reason.error": "Error",
        "reason.failed": "Fallido",
        "reason.timeout": "Tiempo Agotado",

        // Table
        "table.title": "Historial de Llamadas",
        "table.count": "{count} llamadas",
        "table.search": "Buscar llamadas...",
        "table.export": "Exportar",
        "table.date": "Fecha",
        "table.phone": "Teléfono",
        "table.duration": "Duración",
        "table.status": "Estado",
        "table.cost": "Costo",
        "table.summary": "Resumen",
        "table.callId": "Call ID",
        "table.endReason": "Razón de fin",
        "table.noCalls": "No se encontraron llamadas",
        "table.showing": "Mostrando",
        "table.of": "de",

        // AI Analyst
        "ai.title": "Analista IA",
        "ai.subtitle": "Insights Estratégicos con IA",
        "ai.login.title": "Acceso Analista IA",
        "ai.login.submit": "Acceder",
        "ai.login.header": "Acceso Analista IA",
        "ai.login.desc": "Acceso restringido al módulo de inteligencia",
        "ai.status.analyzing": "Analizando...",
        "ai.status.generate": "Generar Análisis",
        "ai.status.new": "Generar nuevo análisis",
        "ai.ready.title": "Listo para analizar tus datos",
        "ai.ready.desc": "La IA evaluará {count} llamadas para encontrar patrones, problemas de calidad y oportunidades de ahorro.",

        "ai.apiKey.placeholder": "Ingresa API Key de OpenAI...",
        "ai.apiKey.save": "Guardar",
        "ai.apiKey.change": "Cambiar API Key",
        "ai.analyze": "Generar Análisis",
        "ai.analyzing": "Analizando...",

    }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("es"); // Default to Spanish as requested implicitly ("como quiera")

    // Persist language
    useEffect(() => {
        const saved = localStorage.getItem("app_language") as Language;
        if (saved && (saved === "en" || saved === "es")) {
            setLanguage(saved);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("app_language", lang);
    };

    const t = (key: string): string => {
        return (translations[language] as any)[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
    return context;
};
