"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
    User,
    Settings as SettingsIcon,
    Database,
    Key,
    Bell,
    Shield,
    Moon,
    Sun,
    Save,
    Copy,
    Plus,
    Trash2,
    RefreshCw,
    Info
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function SettingsPage() {
    const { setTheme, theme } = useTheme();
    const [isSaving, setIsSaving] = useState(false);

    // Mock API Keys
    const [apiKeys, setApiKeys] = useState([
        { id: "1", name: "Production Key", key: "crm_live_••••••••••••••••", created: "2024-01-10" },
        { id: "2", name: "Development Scan", key: "crm_test_••••••••••••••••", created: "2024-03-05" },
    ]);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Configuración guardada", {
                description: "Tus cambios han sido aplicados correctamente."
            });
        }, 1500);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info("Copiado al portapapeles");
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <SettingsIcon className="h-8 w-8 text-primary" />
                    Ajustes del Sistema
                </h1>
                <p className="text-muted-foreground">
                    Administra tu perfil, conexiones de base de datos y llaves de API.
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-slate-100 dark:bg-slate-800 p-1">
                    <TabsTrigger value="profile" className="gap-2">
                        <User className="h-4 w-4" />
                        Perfil
                    </TabsTrigger>
                    <TabsTrigger value="connection" className="gap-2">
                        <Database className="h-4 w-4" />
                        Conexión
                    </TabsTrigger>
                    <TabsTrigger value="api" className="gap-2">
                        <Key className="h-4 w-4" />
                        API Keys
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="h-4 w-4" />
                        Preferencias
                    </TabsTrigger>
                </TabsList>

                {/* Profile Section */}
                <TabsContent value="profile" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-1 border-none shadow-sm bg-slate-50 dark:bg-slate-900/50">
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <Avatar className="h-32 w-32 mb-4 ring-4 ring-primary/10">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">AD</AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-bold">Administrador</h3>
                                <p className="text-sm text-slate-500 mb-4">admin@enterprise.com</p>
                                <Button variant="outline" size="sm" className="w-full">Cambiar Imagen</Button>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2 shadow-sm">
                            <CardHeader>
                                <CardTitle>Información Personal</CardTitle>
                                <CardDescription>Actualiza tus datos de contacto y detalles básicos.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Nombre Completo</Label>
                                        <Input defaultValue="Administrador" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Cargo</Label>
                                        <Input defaultValue="Chief Operations Officer" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Correo Electrónico</Label>
                                    <Input defaultValue="admin@enterprise.com" type="email" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Zona Horaria</Label>
                                    <Input defaultValue="(GMT-03:00) Buenos Aires" />
                                </div>
                            </CardContent>
                            <CardFooter className="border-t pt-6">
                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                                    Guardar Cambios
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                {/* Connection Section */}
                <TabsContent value="connection" className="space-y-6">
                    <Card shadow-sm>
                        <CardHeader>
                            <Title className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-primary" />
                                Base de Datos Cliente
                            </Title>
                            <CardDescription>Configura la conexión dinámica a la base de datos exclusiva para este tenant.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>URL de Supabase (Project URL)</Label>
                                    <Input placeholder="https://xyz.supabase.co" defaultValue="https://tennant-042.supabase.co" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Anon Key / Service Role</Label>
                                    <Input type="password" defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />
                                </div>
                            </div>

                            <Separator />

                            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-3">
                                <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <span className="font-bold block mb-1">Seguridad de Nivel Enterprise</span>
                                    Tus credenciales se almacenan utilizando encriptación AES-256-GCM en nuestra Master Database. Solo el middleware dinámico tiene acceso a la llave de desencriptación durante el runtime.
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="secondary">Probar Conexión</Button>
                                <Button onClick={handleSave}>Actualizar Conexión</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* API Keys Section */}
                <TabsContent value="api" className="space-y-6">
                    <Card shadow-sm>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>API Keys</CardTitle>
                                <CardDescription>Usa estas llaves para integrar el CRM con sistemas externos.</CardDescription>
                            </div>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Nueva LLave
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {apiKeys.map((key) => (
                                    <div key={key.id} className="flex items-center justify-between p-4 rounded-xl border bg-slate-50 dark:bg-slate-900/50 group">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold">{key.name}</p>
                                            <code className="text-[10px] text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                                                {key.key}
                                            </code>
                                            <p className="text-[10px] text-slate-400">Creada el {key.created}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard("crm_live_1234567890")}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications & Prefs Section */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card shadow-sm>
                        <CardHeader>
                            <CardTitle>Interfaz y Notificaciones</CardTitle>
                            <CardDescription>Personaliza tu experiencia visual y alertas.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Modo Oscuro</Label>
                                    <p className="text-xs text-slate-500 text-muted-foreground">Cambia el contraste de la interfaz.</p>
                                </div>
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn("h-8 w-8 p-0", theme === "light" && "bg-white dark:bg-slate-700 shadow-sm")}
                                        onClick={() => setTheme("light")}
                                    >
                                        <Sun className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn("h-8 w-8 p-0", theme === "dark" && "bg-white dark:bg-slate-700 shadow-sm")}
                                        onClick={() => setTheme("dark")}
                                    >
                                        <Moon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Notificaciones de Escritorio</Label>
                                    <p className="text-xs text-slate-500 text-muted-foreground">Recibe alertas de nuevas llamadas perdidas.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Alertas de IA Críticas</Label>
                                    <p className="text-xs text-slate-500 text-muted-foreground">Notificar inmediatamente cuando el sentimiento es negativo.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Reportes Semanales</Label>
                                    <p className="text-xs text-slate-500 text-muted-foreground">Enviar resumen PDF automáticamente los domingos.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-6">
                            <Button onClick={handleSave}>Guardar Preferencias</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
