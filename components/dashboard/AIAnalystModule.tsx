"use client";

import { useState } from "react";
import { UltravoxCall } from "@/types";
import { computeStats } from "@/lib/api";
import { Bot, Lock, Loader2, Sparkles, Send, KeyRound } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AIAnalystModuleProps {
    calls: UltravoxCall[];
}

export function AIAnalystModule({ calls }: AIAnalystModuleProps) {
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
        const savedKey = localStorage.getItem("openai_api_key");
        if (savedKey) {
            setApiKey(savedKey);
        } else {
            setShowKeyInput(true);
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
                errorRate: (stats.errorCalls / stats.totalCalls * 100).toFixed(1) + "%",
                // Top 5 hangup reasons (simplified)
                topHangupReasons: Object.entries(calls.reduce((acc, c) => {
                    const r = c.sipDetails?.terminationReason || c.endReason || "unknown";
                    acc[r] = (acc[r] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>))
                    .sort(([, a], [, b]) => b - a)
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
            if (err.message.includes("Key")) setShowKeyInput(true);
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!isLoggedIn) {
        // ... (Login form remains same)
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] animate-slide-up">
                <div
                    className="w-full max-w-md p-8 rounded-2xl shadow-2xl border border-blue-500/20 bg-card"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-blue-500/25 transition-shadow">
                            <Bot className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-2">AI Analyst Login</h2>
                    <p className="text-sm text-muted-foreground text-center mb-8">
                        Acceso restringido al módulo de inteligencia
                    </p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground ml-1 mb-1 block">Usuario</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg bg-secondary border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                placeholder="..."
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground ml-1 mb-1 block">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg bg-secondary border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                placeholder="..."
                            />
                        </div>
                        {error && <p className="text-xs text-red-400 text-center">{error}</p>}
                        <button
                            type="submit"
                            className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <KeyRound className="w-4 h-4" />
                            Acceder
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        AI <span className="text-gradient">Analyst</span>
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Análisis estratégico potenciado por IA</p>
                </div>
                {!analysis && (
                    <div className="flex gap-2 items-center">
                        {showKeyInput ? (
                            <div className="flex gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter new OpenAI API Key..."
                                    className="h-10 px-3 w-64 rounded-lg bg-secondary border border-border text-xs focus:border-blue-500 outline-none"
                                />
                                <button
                                    onClick={() => handleSaveKey(apiKey)}
                                    className="h-10 px-4 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium text-xs transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleChangeKey}
                                className="text-xs text-muted-foreground hover:text-blue-400 transition-colors mr-2 underline decoration-dashed underline-offset-4"
                            >
                                Change API Key
                            </button>
                        )}

                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || (!apiKey && !showKeyInput)}
                            className="h-10 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                <div className="rounded-2xl border border-border bg-card p-8 shadow-xl animate-slide-up">
                    <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground prose-strong:text-blue-400 prose-ul:text-muted-foreground">
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                    <div className="mt-8 pt-6 border-t border-border flex justify-end">
                        <button
                            onClick={() => setAnalysis(null)}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Generar nuevo análisis
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                        <Bot className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">Listo para analizar tus datos</p>
                    <p className="text-sm text-muted-foreground/60 mt-1 max-w-sm text-center">
                        La IA evaluará {calls.length} llamadas para encontrar patrones, problemas de calidad y oportunidades de ahorro.
                    </p>
                </div>
            )}
        </div>
    );
}
