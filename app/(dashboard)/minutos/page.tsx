"use client";

import { Clock } from "lucide-react";
import { VapiMinutesAnalytics } from "@/components/dashboard/vapi-analytics";

export default function MinutosPage() {
    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="flex flex-col space-y-2 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/20">
                            <Clock className="h-6 w-6 text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white">
                            Análisis de Minutos
                        </h1>
                    </div>
                    <p className="text-slate-400 text-sm max-w-lg pl-1">
                        Minutos totales vs facturados por día. Controla el consumo y los costos de tu operación.
                    </p>
                </div>
            </div>

            {/* Vapi Analytics Component */}
            <VapiMinutesAnalytics />
        </div>
    );
}
