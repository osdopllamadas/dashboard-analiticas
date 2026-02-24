"use client";

import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ClientProvider } from "@/lib/contexts/client-context";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClientProvider>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden lg:flex lg:w-72 lg:flex-col lg:inset-y-0 lg:z-50">
                    <Sidebar />
                </div>

                <div className="flex flex-1 flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        <div className="mx-auto max-w-7xl">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ClientProvider>
    );
}
