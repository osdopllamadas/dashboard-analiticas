import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Autenticación - CRM Call Center",
    description: "Inicia sesión o regístrate en el sistema",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="w-full max-w-md p-8">
                {children}
            </div>
        </div>
    );
}
