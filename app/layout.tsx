import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutShell } from "@/components/dashboard/LayoutShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Ultravoz Conecta X Renton Connective",
    description: "Plataforma de análisis de llamadas — Renton Connective",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className="dark">
            <body className={inter.className}>
                <LayoutShell>{children}</LayoutShell>
            </body>
        </html>
    );
}
