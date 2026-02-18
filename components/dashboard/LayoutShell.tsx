"use client";

import { useState, createContext, useContext } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ModuleId } from "@/types";

export const ActiveModuleContext = createContext<ModuleId>("dashboard");

export function useActiveModule(): ModuleId {
    return useContext(ActiveModuleContext);
}

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed((v) => !v)}
                activeModule={activeModule}
                onModuleChange={setActiveModule}
            />
            <main
                className="flex-1 overflow-y-auto transition-all duration-300"
                style={{
                    marginLeft: sidebarCollapsed ? "72px" : "260px",
                }}
            >
                <ActiveModuleContext.Provider value={activeModule}>
                    {children}
                </ActiveModuleContext.Provider>
            </main>
        </div>
    );
}
