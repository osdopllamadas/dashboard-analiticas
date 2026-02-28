"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Organization, ClientConnection, User } from "../supabase/master-client";
import { toast } from "sonner";

interface ClientContextType {
    organization: Organization | null;
    user: User | null;
    connection: ClientConnection | null;
    isLoading: boolean;
    refreshData: () => Promise<void>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: React.ReactNode }) {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [connection, setConnection] = useState<ClientConnection | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClientComponentClient();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setIsLoading(false);
                return;
            }

            // IMPORTANTE: En una implementación real, estas queries irían a la Master Database
            // Para este prototipo, simularemos el fetch de datos del usuario y org

            // Intentar obtener usuario desde la tabla users de la master DB
            // (Suponiendo que el cliente de supabase está configurado para la master DB)
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("auth_user_id", session.user.id)
                .single();

            if (userError) throw userError;
            setUser(userData);

            if (userData?.org_id) {
                // Obtener organización
                const { data: orgData, error: orgError } = await supabase
                    .from("organizations")
                    .select("*")
                    .eq("id", userData.org_id)
                    .single();

                if (orgError) throw orgError;
                setOrganization(orgData);

                // Obtener conexión
                const { data: connData, error: connError } = await supabase
                    .from("client_connections")
                    .select("*")
                    .eq("org_id", userData.org_id)
                    .single();

                if (!connError) setConnection(connData);
            }
        } catch (error) {
            console.error("Error fetching client context:", error);
            // toast.error("Error al cargar datos de la organización");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ClientContext.Provider
            value={{
                organization,
                user,
                connection,
                isLoading,
                refreshData: fetchData,
            }}
        >
            {children}
        </ClientContext.Provider>
    );
}

export function useClient() {
    const context = useContext(ClientContext);
    if (context === undefined) {
        throw new Error("useClient must be used within a ClientProvider");
    }
    return context;
}
