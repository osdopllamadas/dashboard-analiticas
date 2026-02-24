"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
    Search,
    Sun,
    Moon,
    Bell,
    Menu,
    ChevronDown,
    LogOut,
    User,
    Settings as SettingsIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Header() {
    const { setTheme, theme } = useTheme();
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            toast.success("Sesión cerrada correctamente");
            router.push("/login");
            router.refresh();
        } catch (error) {
            toast.error("Error al cerrar sesión");
        }
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white dark:bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            {/* Mobile Sidebar */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden text-gray-500">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                    <Sidebar />
                </SheetContent>
            </Sheet>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                {/* Global Search */}
                <div className="relative flex flex-1 items-center">
                    <label htmlFor="search-field" className="sr-only">
                        Buscar llamadas, agentes o clientes
                    </label>
                    <Search className="pointer-events-none absolute left-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <Input
                        id="search-field"
                        className="block h-10 w-full rounded-full border-0 py-0 pl-10 pr-4 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm bg-gray-50 dark:bg-gray-800"
                        placeholder="Buscar..."
                        type="search"
                        name="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative text-gray-500">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                    </Button>

                    {/* Theme Switcher */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="text-gray-500"
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Cambiar tema</span>
                    </Button>

                    {/* Separator */}
                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700" aria-hidden="true" />

                    {/* User Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-x-2 p-1.5 focus:ring-0">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="" alt="Usuario" />
                                    <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
                                </Avatar>
                                <div className="hidden lg:flex lg:flex-col lg:items-start text-sm">
                                    <span className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">Administrador</span>
                                    <span className="text-xs text-gray-500">Plan Enterprise</span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push("/settings")}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Perfil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push("/settings")}>
                                <SettingsIcon className="mr-2 h-4 w-4" />
                                <span>Ajustes</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Cerrar sesión</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
