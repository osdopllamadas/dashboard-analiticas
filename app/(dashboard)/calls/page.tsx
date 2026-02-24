"use client";

import { CallsTable } from "@/components/dashboard/calls-table";
import { PhoneCall, Download, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallsPage() {
    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <PhoneCall className="h-5 w-5 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            Gestión de Llamadas
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-sm pl-9">
                        Visualiza, filtra y analiza el histórico completo de grabaciones y sus métricas.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-slate-200 dark:border-slate-700">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros Avanzados
                    </Button>
                    <Button className="shadow-lg shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Carga
                    </Button>
                </div>
            </div>

            {/* Main Table Section */}
            <div className="bg-transparent">
                <CallsTable />
            </div>
        </div>
    );
}
