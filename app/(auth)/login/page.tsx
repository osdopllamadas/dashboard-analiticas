"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Building2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClientComponentClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Custom Auth for OSDOP
        if (email === "OSDOP") {
            try {
                const res = await fetch("/api/auth/custom-login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: email, password }),
                });

                if (res.ok) {
                    toast.success("¡Bienvenido OSDOP!", {
                        description: "Acceso administrativo concedido.",
                    });
                    router.push("/dashboard");
                    router.refresh();
                    return;
                } else {
                    toast.error("Contraseña incorrecta", {
                        description: "Verifica tus credenciales de administrador.",
                    });
                    setIsLoading(false);
                    return;
                }
            } catch (err) {
                toast.error("Error de conexión");
                setIsLoading(false);
                return;
            }
        }

        // Standard Supabase Auth
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error("Error al iniciar sesión", {
                    description: error.message,
                });
                return;
            }

            if (data.user) {
                toast.success("¡Bienvenido!", {
                    description: "Redirigiendo al dashboard...",
                });
                router.push("/dashboard");
                router.refresh();
            }
        } catch (error) {
            toast.error("Error inesperado", {
                description: "Por favor, intenta de nuevo.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Building2 className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">CRM Call Center</CardTitle>
                <CardDescription>
                    Ingresa tus credenciales para acceder al sistema
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Usuario o Correo</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="text"
                                placeholder="OSDOP o tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Iniciando sesión...
                            </>
                        ) : (
                            "Iniciar sesión"
                        )}
                    </Button>
                    <div className="text-sm text-center text-muted-foreground">
                        ¿No tienes una cuenta?{" "}
                        <Link
                            href="/register"
                            className="text-primary hover:underline font-medium"
                        >
                            Regístrate aquí
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
