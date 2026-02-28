"use client";

import { useState } from "react";
import { AgentPerformance } from "@/components/dashboard/agent-performance";
import { PredictiveAnalytics } from "@/components/dashboard/predictive-analytics";
import { ExportPDF } from "@/components/dashboard/export-pdf";
import { AIAnalystModule } from "@/components/dashboard/AIAnalystModule";
import { mockCalls } from "@/lib/data";
import { BarChart3, LineChart, Users, Sparkles, BrainCircuit, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] -ml-24 -mb-24" />

                <div className="flex flex-col space-y-2 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/20 rounded-xl backdrop-blur-sm border border-primary/20">
                            <BrainCircuit className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white">
                            IA Analytics <span className="text-slate-500 font-normal">&</span> Proyecciones
                        </h1>
                    </div>
                    <p className="text-slate-400 text-sm max-w-lg pl-1">
                        Visualiza el futuro de tu negocio con nuestro motor de Inteligencia Artificial. Análisis de sentimientos, predicciones ARIMA y coaching automático de agentes.
                    </p>
                </div>

                <div className="relative z-10">
                    <ExportPDF />
                </div>
            </div>

            {/* Main Analytics Tabs */}
            <Tabs defaultValue="performance" className="space-y-6">
                <div className="bg-white dark:bg-slate-900 p-1.5 rounded-xl border w-fit mx-auto lg:mx-0">
                    <TabsList className="bg-transparent gap-2">
                        <TabsTrigger
                            value="performance"
                            className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all shadow-none"
                        >
                            <Users className="h-4 w-4 mr-2" />
                            Rendimiento de Agentes
                        </TabsTrigger>
                        <TabsTrigger
                            value="projections"
                            className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all shadow-none"
                        >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Proyecciones y IA
                        </TabsTrigger>
                        <TabsTrigger
                            value="analyst"
                            className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all shadow-none"
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Analista Virtual
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="performance" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <AgentPerformance />
                </TabsContent>

                <TabsContent value="projections" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <PredictiveAnalytics />
                </TabsContent>

                <TabsContent value="analyst" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <AIAnalystModule calls={mockCalls} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
