"use client";

import { useState } from "react";
import { Call } from "@/types";
import { computeStats } from "@/lib/api";
import { Bot, Lock, Loader2, Sparkles, Send, KeyRound } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import ReactMarkdown from "react-markdown";

interface AIAnalystModuleProps {
    calls?: Call[]; // Make optional to prevent runtime error if undefined
}

export function AIAnalystModule({ calls = [] }: AIAnalystModuleProps) {
    const { t } = useLanguage();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [error, setError] = useState("");

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [showKeyInput, setShowKeyInput] = useState(false);

    // Load API Key from localStorage
    useState(() => {
        if (typeof window !== 'undefined') {
            const savedKey = localStorage.getItem("openai_api_key");
            if (savedKey) {
                setApiKey(savedKey);
            } else {
                setShowKeyInput(true);
            }
        }
    });

    const handleSaveKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem("openai_api_key", key);
        setShowKeyInput(false);
    };

    const handleChangeKey = () => {
        setShowKeyInput(true);
        setAnalysis(null);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded check for the module
        if (username === "admin" && password === "Rentonia1234") {
            setIsLoggedIn(true);
            setError("");
        } else {
            setError("Credenciales incorrectas");
        }
    };

    const handleAnalyze = async () => {
        if (!apiKey) {
            setError("Por favor ingresa una API Key válida (OpenAI)");
            setShowKeyInput(true);
            return;
        }
        setIsAnalyzing(true);
        setError("");

        try {
            // Prepare summary data
            const stats = computeStats(calls);
            const summaryData = {
                period: "Last 30 days",
                totalCalls: stats.totalCalls,
                successRate: stats.successRate,
                avgDuration: stats.avgDuration,
                totalCost: stats.totalCost,
                // Top 5 hangup reasons (simplified)
                topHangupReasons: Object.entries(calls.reduce((acc, c) => {
                    const r = c.sipDetails?.terminationReason || c.endReason || "unknown";
                    acc[r] = (acc[r] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>))
                    .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
                    .slice(0, 5)
            };

            const res = await fetch("/api/ai-analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stats: summaryData, apiKey }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Error al generar análisis");
            }

            const data = await res.json();
            setAnalysis(data.analysis);
        } catch (err: any) {
            setError(err.message || "Hubo un error al conectar con la IA. Verifica tu API Key.");
            if (err.message && err.message.includes("Key")) setShowKeyInput(true);
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border border-slate-800 rounded-xl bg-slate-900/50">
                <div className="w-full max-w-sm space-y-4">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <Bot className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-center text-white">Acceso a Analista IA</h2>
                    <p className="text-sm text-slate-400 text-center">
                        Ingresa las credenciales de administrador para desbloquear el módulo de inteligencia artificial.
                    </p>

                    <form onSubmit={handleLogin} className="space-y-4 pt-4">
                        <div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                placeholder="Usuario (admin)"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                placeholder="Contraseña"
                            />
                        </div>
                        {error && <p className="text-xs text-red-400 text-center">{error}</p>}
                        <button
                            type="submit"
                            className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <KeyRound className="w-4 h-4" />
                            Desbloquear
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        Ultravox AI
                    </h1>
                    <p className="text-sm text-slate-400">Análisis inteligente de tus llamadas</p>
                </div>
                {!analysis && (
                    <div className="flex gap-2 items-center">
                        {showKeyInput ? (
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="OpenAI API Key"
                                    className="h-9 px-3 w-48 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:border-blue-500 outline-none"
                                />
                                <button
                                    onClick={() => handleSaveKey(apiKey)}
                                    className="h-9 px-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium text-xs transition-colors"
                                >
                                    Guardar
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleChangeKey}
                                className="text-xs text-slate-500 hover:text-blue-400 transition-colors mr-2 underline"
                            >
                                Cambiar API Key
                            </button>
                        )}

                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || (!apiKey && !showKeyInput)}
                            className="h-9 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isAnalyzing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            {isAnalyzing ? "Analizando..." : "Generar Análisis"}
                        </button>
                    </div>
                )}
            </div>

            {error && !analysis && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {analysis ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-xl">
                    <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                        <button
                            onClick={() => setAnalysis(null)}
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Nuevo análisis
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                        <Bot className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-slate-400 font-medium">Listo para analizar {calls.length} llamadas</p>
                    <p className="text-sm text-slate-600 mt-1 max-w-sm text-center">
                        El sistema generará insights sobre satisfacción, motivos de corte y costos.
                    </p>
                </div>
            )}
        </div>
    );
}
