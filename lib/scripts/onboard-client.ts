import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * Script de Onboarding Automático
 * Este script automatiza la creación de una nueva organización,
 * la encriptación de sus credenciales y el registro del primer usuario administrador.
 */

const MASTER_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const MASTER_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const ENCRYPTION_KEY = process.env.MASTER_DATABASE_ENCRYPTION_KEY!; // 32 chars hex

const masterClient = createClient(MASTER_SUPABASE_URL, MASTER_SERVICE_ROLE);

function encrypt(text: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

async function onboardNewClient(orgName: string, clientDbUrl: string, clientDbKey: string, adminEmail: string) {
    console.log(`🚀 Iniciando onboarding para: ${orgName}`);

    // 1. Crear Organización
    const { data: org, error: orgErr } = await masterClient
        .from('organizations')
        .insert([{ name: orgName, slug: orgName.toLowerCase().replace(/ /g, '-') }])
        .select()
        .single();

    if (orgErr) throw orgErr;
    console.log(`✅ Organización creada ID: ${org.id}`);

    // 2. Encriptar y Guardar Conexión
    const encryptedKey = encrypt(clientDbKey);
    const { error: connErr } = await masterClient
        .from('client_connections')
        .insert([{
            org_id: org.id,
            supabase_url: clientDbUrl,
            supabase_key: encryptedKey,
            is_active: true
        }]);

    if (connErr) throw connErr;
    console.log(`✅ Conexión del cliente guardada de forma segura.`);

    // 3. Crear Usuario Admin (En una implementación real esto se integraría con Supabase Auth)
    const { error: userErr } = await masterClient
        .from('users')
        .insert([{
            org_id: org.id,
            email: adminEmail,
            full_name: 'Administrador Inicial',
            role: 'admin'
        }]);

    if (userErr) throw userErr;
    console.log(`✅ Usuario administrador registrado para la master DB.`);

    console.log(`🎉 Onboarding completado con éxito para ${orgName}`);
}

// Ejemplo de uso:
// onboardNewClient('Acme Corp', 'https://acme.supabase.co', 'anon-key-here', 'admin@acme.com')
//   .catch(console.error);
