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
        "login.footer": "© 2026 OSDOP. All rights reserved.",

        // Sidebar
        "nav.dashboard": "Dashboard",
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

        // AI Analyst
        "ai.title": "AI Analyst",
        "ai.subtitle": "AI-Powered Strategic Insights",
        "ai.login.title": "AI Analyst Login",
        "ai.login.subtitle": "Restricted Access",
        "ai.login.submit": "Access",
        "ai.apiKey.placeholder": "Enter new OpenAI API Key...",
        "ai.apiKey.save": "Save",
        "ai.apiKey.change": "Change API Key",
        "ai.analyze": "Generate Analysis",
        "ai.analyzing": "Analyzing...",
        "ai.ready.title": "Ready to analyze",
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
        "login.footer": "© 2026 OSDOP. Todos los derechos reservados.",

        // Sidebar
        "nav.dashboard": "Panel Principal",
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

        // AI Analyst
        "ai.title": "Analista IA",
        "ai.subtitle": "Insights Estratégicos con IA",
        "ai.login.title": "Acceso Analista IA",
        "ai.login.subtitle": "Acceso Restringido",
        "ai.login.submit": "Acceder",
        "ai.apiKey.placeholder": "Ingresa API Key de OpenAI...",
        "ai.apiKey.save": "Guardar",
        "ai.apiKey.change": "Cambiar API Key",
        "ai.analyze": "Generar Análisis",
        "ai.analyzing": "Analizando...",
        "ai.ready.title": "Listo para analizar",
        "ai.ready.text": "La IA evaluará las llamadas para encontrar patrones.",
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
