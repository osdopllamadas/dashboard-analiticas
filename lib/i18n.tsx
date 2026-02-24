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
        "login.title": "CRM Call Center",
        "login.subtitle": "Enterprise Intelligence Platform",
        "login.username": "User/Email",
        "login.password": "Password",
        "login.submit": "Login",
        "login.error": "Invalid credentials.",
        "login.footer": "© 2026 CRM Enterprise. All rights reserved.",

        // Sidebar
        "nav.dashboard": "Dashboard",
        "nav.calls": "Call History",
        "nav.analytics": "AI Analytics",
        "nav.suggestions": "Suggestions",
        "nav.settings": "Settings",
        "nav.collapse": "Collapse",
        "nav.expand": "Expand",

        // Dashboard
        "dash.plan": "Enterprise Plan",
        "dash.active": "System Active",
    },
    es: {
        // Auth
        "login.title": "CRM Call Center",
        "login.subtitle": "Plataforma de Inteligencia Empresarial",
        "login.username": "Usuario/Correo",
        "login.password": "Contraseña",
        "login.submit": "Iniciar Sesión",
        "login.error": "Credenciales inválidas.",
        "login.footer": "© 2026 CRM Enterprise. Todos los derechos reservados.",

        // Sidebar
        "nav.dashboard": "Panel Principal",
        "nav.calls": "Historial",
        "nav.analytics": "Analítica IA",
        "nav.suggestions": "Sugerencias",
        "nav.settings": "Ajustes",
        "nav.collapse": "Colapsar",
        "nav.expand": "Expandir",

        // Dashboard
        "dash.plan": "Plan Enterprise",
        "dash.active": "Sistema Activo",
    }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("es");

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
