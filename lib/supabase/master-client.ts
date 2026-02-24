/**
 * Cliente de Supabase para la Base de Datos Maestra
 * 
 * Esta es la base de datos principal que gestiona:
 * - Organizaciones
 * - Usuarios
 * - Conexiones a bases de datos de clientes
 * - Logs de auditoría
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Tipos para las tablas de la base de datos maestra
export interface Organization {
    id: string;
    name: string;
    logo: string | null;
    plan_type: 'basic' | 'professional' | 'enterprise';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ClientConnection {
    id: string;
    org_id: string;
    supabase_url: string;
    supabase_service_role_key: string; // Encriptado
    supabase_anon_key: string | null; // Encriptado
    openai_api_key: string | null; // Encriptado
    anthropic_api_key: string | null; // Encriptado
    google_api_key: string | null; // Encriptado
    ai_provider: 'openai' | 'anthropic' | 'google';
    ai_model: string;
    connection_status: 'active' | 'inactive' | 'error';
    last_connection_test: string | null;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    org_id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: 'admin' | 'manager' | 'user' | 'viewer';
    auth_user_id: string | null;
    is_active: boolean;
    last_login: string | null;
    created_at: string;
    updated_at: string;
}

export interface AuditLog {
    id: string;
    org_id: string | null;
    user_id: string | null;
    action: string;
    resource_type: string | null;
    resource_id: string | null;
    details: Record<string, any> | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
}

// Definir el tipo de la base de datos maestra
export interface MasterDatabase {
    public: {
        Tables: {
            organizations: {
                Row: Organization;
                Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at'>>;
            };
            client_connections: {
                Row: ClientConnection;
                Insert: Omit<ClientConnection, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<ClientConnection, 'id' | 'created_at' | 'updated_at'>>;
            };
            users: {
                Row: User;
                Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
            };
            audit_logs: {
                Row: AuditLog;
                Insert: Omit<AuditLog, 'id' | 'created_at'>;
                Update: never; // Los logs no se actualizan
            };
        };
    };
}

/**
 * Crea y retorna el cliente de Supabase para la base de datos maestra
 */
export function createMasterClient(): SupabaseClient<MasterDatabase> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error(
            'Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
        );
    }

    return createClient<MasterDatabase>(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
        },
    });
}

/**
 * Cliente singleton para la base de datos maestra
 * Usar este en lugar de crear múltiples instancias
 */
let masterClientInstance: SupabaseClient<MasterDatabase> | null = null;

export function getMasterClient(): SupabaseClient<MasterDatabase> {
    if (!masterClientInstance) {
        masterClientInstance = createMasterClient();
    }
    return masterClientInstance;
}

/**
 * Obtiene la organización de un usuario autenticado
 */
export async function getUserOrganization(userId: string): Promise<Organization | null> {
    const client = getMasterClient();

    const { data: user, error: userError } = await client
        .from('users')
        .select('org_id')
        .eq('auth_user_id', userId)
        .single();

    if (userError || !user) {
        console.error('Error fetching user organization:', userError);
        return null;
    }

    const { data: org, error: orgError } = await client
        .from('organizations')
        .select('*')
        .eq('id', user.org_id)
        .single();

    if (orgError) {
        console.error('Error fetching organization:', orgError);
        return null;
    }

    return org;
}

/**
 * Obtiene las credenciales de conexión de una organización
 */
export async function getClientConnection(orgId: string): Promise<ClientConnection | null> {
    const client = getMasterClient();

    const { data, error } = await client
        .from('client_connections')
        .select('*')
        .eq('org_id', orgId)
        .single();

    if (error) {
        console.error('Error fetching client connection:', error);
        return null;
    }

    return data;
}

/**
 * Crea un log de auditoría
 */
export async function createAuditLog(params: {
    orgId: string;
    userId?: string;
    action: string;
    resourceType?: string;
    resourceId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}): Promise<void> {
    const client = getMasterClient();

    const { error } = await client.from('audit_logs').insert({
        org_id: params.orgId,
        user_id: params.userId || null,
        action: params.action,
        resource_type: params.resourceType || null,
        resource_id: params.resourceId || null,
        details: params.details || null,
        ip_address: params.ipAddress || null,
        user_agent: params.userAgent || null,
    });

    if (error) {
        console.error('Error creating audit log:', error);
    }
}

/**
 * Verifica si un usuario tiene un rol específico
 */
export async function userHasRole(
    userId: string,
    requiredRoles: User['role'][]
): Promise<boolean> {
    const client = getMasterClient();

    const { data, error } = await client
        .from('users')
        .select('role')
        .eq('auth_user_id', userId)
        .single();

    if (error || !data) {
        return false;
    }

    return requiredRoles.includes(data.role);
}

/**
 * Actualiza el último login de un usuario
 */
export async function updateUserLastLogin(userId: string): Promise<void> {
    const client = getMasterClient();

    await client
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('auth_user_id', userId);
}

export default getMasterClient;
