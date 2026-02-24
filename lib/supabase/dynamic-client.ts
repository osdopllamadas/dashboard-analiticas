/**
 * Cliente Dinámico de Supabase
 * 
 * Este módulo crea instancias de Supabase "al vuelo" basándose en las
 * credenciales almacenadas en la base de datos maestra para cada organización.
 * 
 * Esto permite que cada cliente tenga su propia base de datos aislada.
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getClientConnection } from './master-client';
import { decrypt } from '../encryption/crypto';

// Tipos para las tablas de la base de datos del cliente
export interface Call {
    id: string;
    agent_name: string;
    phone: string;
    type: 'inbound' | 'outbound';
    status: 'pending' | 'completed' | 'failed' | 'no_answer' | 'busy' | 'cancelled';
    duration_seconds: number | null;
    started_at: string | null;
    ended_at: string | null;
    summary: string | null;
    transcription: string | null;
    audio_url: string | null;
    audio_bucket: string;
    sentiment: 'positive' | 'neutral' | 'negative' | null;
    sentiment_score: number | null;
    keywords: string[] | null;
    dynamic_vars: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface Suggestion {
    id: string;
    user_id: string | null;
    user_email: string | null;
    user_name: string | null;
    title: string;
    content: string;
    category: string | null;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'in_progress' | 'completed' | 'rejected';
    response: string | null;
    responded_by: string | null;
    responded_at: string | null;
    attachments: any[];
    tags: string[] | null;
    created_at: string;
    updated_at: string;
}

export interface Agent {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    avatar_url: string | null;
    is_active: boolean;
    total_calls: number;
    successful_calls: number;
    failed_calls: number;
    average_duration_seconds: number | null;
    conversion_rate: number | null;
    ai_rating: number | null;
    last_ai_analysis: string | null;
    created_at: string;
    updated_at: string;
}

export interface AIAnalytics {
    id: string;
    analysis_type: string;
    period_start: string | null;
    period_end: string | null;
    results: Record<string, any>;
    ai_model: string | null;
    tokens_used: number | null;
    processing_time_ms: number | null;
    created_at: string;
}

// Definir el tipo de la base de datos del cliente
export interface ClientDatabase {
    public: {
        Tables: {
            calls: {
                Row: Call;
                Insert: Omit<Call, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Call, 'id' | 'created_at' | 'updated_at'>>;
            };
            suggestions: {
                Row: Suggestion;
                Insert: Omit<Suggestion, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Suggestion, 'id' | 'created_at' | 'updated_at'>>;
            };
            agents: {
                Row: Agent;
                Insert: Omit<Agent, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Agent, 'id' | 'created_at' | 'updated_at'>>;
            };
            ai_analytics: {
                Row: AIAnalytics;
                Insert: Omit<AIAnalytics, 'id' | 'created_at'>;
                Update: never;
            };
        };
    };
}

// Cache de clientes para evitar crear múltiples instancias
const clientCache = new Map<string, SupabaseClient<ClientDatabase>>();

/**
 * Crea un cliente de Supabase para la base de datos de un cliente específico
 * 
 * @param orgId - ID de la organización
 * @returns Cliente de Supabase configurado para la BD del cliente
 */
export async function createDynamicClient(
    orgId: string
): Promise<SupabaseClient<ClientDatabase> | null> {
    // Verificar si ya existe en cache
    if (clientCache.has(orgId)) {
        return clientCache.get(orgId)!;
    }

    try {
        // Obtener las credenciales de conexión desde la base de datos maestra
        const connection = await getClientConnection(orgId);

        if (!connection) {
            console.error(`No connection found for organization: ${orgId}`);
            return null;
        }

        if (connection.connection_status !== 'active') {
            console.error(`Connection is not active for organization: ${orgId}`);
            return null;
        }

        // Desencriptar las credenciales
        const serviceRoleKey = decrypt(connection.supabase_service_role_key);

        // Crear el cliente de Supabase
        const client = createClient<ClientDatabase>(
            connection.supabase_url,
            serviceRoleKey,
            {
                auth: {
                    autoRefreshToken: true,
                    persistSession: false, // No persistir sesión en clientes dinámicos
                },
            }
        );

        // Guardar en cache
        clientCache.set(orgId, client);

        return client;
    } catch (error) {
        console.error('Error creating dynamic client:', error);
        return null;
    }
}

/**
 * Obtiene un cliente de Supabase para un usuario autenticado
 * 
 * @param userId - ID del usuario autenticado (auth.uid())
 * @returns Cliente de Supabase para la BD del cliente
 */
export async function getClientForUser(
    userId: string
): Promise<SupabaseClient<ClientDatabase> | null> {
    const { getUserOrganization } = await import('./master-client');

    const org = await getUserOrganization(userId);

    if (!org) {
        console.error(`No organization found for user: ${userId}`);
        return null;
    }

    return createDynamicClient(org.id);
}

/**
 * Limpia el cache de clientes
 * Útil cuando se actualizan credenciales
 */
export function clearClientCache(orgId?: string): void {
    if (orgId) {
        clientCache.delete(orgId);
    } else {
        clientCache.clear();
    }
}

/**
 * Verifica la conexión a la base de datos del cliente
 * 
 * @param orgId - ID de la organización
 * @returns true si la conexión es exitosa
 */
export async function testClientConnection(orgId: string): Promise<boolean> {
    try {
        const client = await createDynamicClient(orgId);

        if (!client) {
            return false;
        }

        // Intentar una query simple
        const { error } = await client.from('calls').select('id').limit(1);

        return !error;
    } catch (error) {
        console.error('Connection test failed:', error);
        return false;
    }
}

/**
 * Obtiene las API keys de IA para una organización
 * 
 * @param orgId - ID de la organización
 * @returns Objeto con las API keys desencriptadas
 */
export async function getAIKeys(orgId: string): Promise<{
    openai?: string;
    anthropic?: string;
    google?: string;
    provider: string;
    model: string;
} | null> {
    try {
        const connection = await getClientConnection(orgId);

        if (!connection) {
            return null;
        }

        const result: any = {
            provider: connection.ai_provider,
            model: connection.ai_model,
        };

        // Desencriptar las API keys que existan
        if (connection.openai_api_key) {
            result.openai = decrypt(connection.openai_api_key);
        }

        if (connection.anthropic_api_key) {
            result.anthropic = decrypt(connection.anthropic_api_key);
        }

        if (connection.google_api_key) {
            result.google = decrypt(connection.google_api_key);
        }

        return result;
    } catch (error) {
        console.error('Error getting AI keys:', error);
        return null;
    }
}

export default createDynamicClient;
