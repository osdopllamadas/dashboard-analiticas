# Instrucciones de Configuración de Supabase

Este documento explica cómo configurar las bases de datos de Supabase para el CRM Call Center Enterprise.

## 📋 Requisitos Previos

1. Cuenta de Supabase (https://supabase.com)
2. Al menos 2 proyectos de Supabase:
   - **Master Database**: Base de datos principal
   - **Client Database(s)**: Una por cada organización/cliente

## 🗄️ Paso 1: Configurar Master Database

### 1.1 Crear Proyecto en Supabase

1. Ve a https://app.supabase.com
2. Crea un nuevo proyecto llamado "CRM-Master"
3. Guarda las credenciales:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 1.2 Ejecutar Schema SQL

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Crea una nueva query
3. Copia y pega el contenido de `lib/supabase/schemas/master-schema.sql`
4. Ejecuta la query

### 1.3 Verificar Tablas Creadas

Deberías ver las siguientes tablas:
- ✅ `organizations`
- ✅ `client_connections`
- ✅ `users`
- ✅ `audit_logs`

## 🗄️ Paso 2: Configurar Client Database

### 2.1 Crear Proyecto para Cliente

1. Crea un nuevo proyecto en Supabase (ej: "CRM-Client-Demo")
2. Guarda las credenciales de este proyecto

### 2.2 Ejecutar Schema SQL

1. En el SQL Editor del proyecto del cliente
2. Copia y pega el contenido de `lib/supabase/schemas/client-schema.sql`
3. Ejecuta la query

### 2.3 Verificar Tablas Creadas

Deberías ver las siguientes tablas:
- ✅ `calls`
- ✅ `suggestions`
- ✅ `agents`
- ✅ `ai_analytics`

## 🔐 Paso 3: Configurar Storage (Buckets)

### En cada Client Database:

1. Ve a **Storage** en el dashboard
2. Crea un nuevo bucket llamado `call-recordings`
3. Configura las políticas de acceso:

```sql
-- Permitir lectura autenticada
CREATE POLICY "Authenticated users can read recordings"
ON storage.objects FOR SELECT
USING (bucket_id = 'call-recordings' AND auth.role() = 'authenticated');

-- Permitir subida autenticada
CREATE POLICY "Authenticated users can upload recordings"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'call-recordings' AND auth.role() = 'authenticated');
```

## 🔑 Paso 4: Generar Clave de Encriptación

Ejecuta este comando en tu terminal para generar una clave de encriptación segura:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Guarda esta clave como `ENCRYPTION_KEY` en tus variables de entorno.

## 📝 Paso 5: Registrar Organización en Master Database

### 5.1 Insertar Organización

```sql
INSERT INTO organizations (name, plan_type)
VALUES ('Mi Empresa Demo', 'enterprise');
```

Guarda el `id` generado.

### 5.2 Encriptar y Guardar Credenciales

Necesitarás encriptar las credenciales antes de insertarlas. Puedes usar el siguiente script Node.js:

```javascript
// encrypt-credentials.js
const { encrypt } = require('./lib/encryption/crypto');

const credentials = {
  supabaseUrl: 'https://xxx.supabase.co',
  serviceRoleKey: 'eyJhbGc...',
  anonKey: 'eyJhbGc...',
  openaiKey: 'sk-...'
};

console.log('Encrypted Service Role Key:', encrypt(credentials.serviceRoleKey));
console.log('Encrypted Anon Key:', encrypt(credentials.anonKey));
console.log('Encrypted OpenAI Key:', encrypt(credentials.openaiKey));
```

### 5.3 Insertar Conexión

```sql
INSERT INTO client_connections (
  org_id,
  supabase_url,
  supabase_service_role_key,
  supabase_anon_key,
  openai_api_key,
  ai_provider,
  ai_model
) VALUES (
  'org-id-del-paso-anterior',
  'https://xxx.supabase.co',
  'ENCRYPTED_SERVICE_ROLE_KEY',
  'ENCRYPTED_ANON_KEY',
  'ENCRYPTED_OPENAI_KEY',
  'openai',
  'gpt-4-turbo-preview'
);
```

## 👤 Paso 6: Crear Usuario Administrador

### 6.1 Crear Usuario en Supabase Auth

1. Ve a **Authentication** > **Users** en el Master Database
2. Crea un nuevo usuario con email y contraseña
3. Guarda el `id` del usuario (UUID)

### 6.2 Vincular Usuario a Organización

```sql
INSERT INTO users (
  org_id,
  email,
  full_name,
  role,
  auth_user_id
) VALUES (
  'org-id-del-paso-5',
  'admin@miempresa.com',
  'Administrador',
  'admin',
  'auth-user-id-del-paso-anterior'
);
```

## ✅ Paso 7: Verificar Configuración

### 7.1 Test de Conexión

Puedes usar este script para verificar que todo funciona:

```typescript
// test-connection.ts
import { getMasterClient } from './lib/supabase/master-client';
import { createDynamicClient } from './lib/supabase/dynamic-client';

async function test() {
  // Test Master DB
  const master = getMasterClient();
  const { data: orgs } = await master.from('organizations').select('*');
  console.log('Organizations:', orgs);

  // Test Dynamic Client
  const client = await createDynamicClient('org-id');
  if (client) {
    const { data: calls } = await client.from('calls').select('*');
    console.log('Calls:', calls);
  }
}

test();
```

## 🔄 Paso 8: Script de Onboarding Automático

Para nuevos clientes, puedes usar el script de onboarding que creará automáticamente:
- Nuevo proyecto de Supabase (manual)
- Tablas en la base de datos del cliente
- Registro en la master database

Este script se creará en la Fase 8 del proyecto.

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

## ⚠️ Notas Importantes

1. **NUNCA** commitees las credenciales reales al repositorio
2. Usa variables de entorno para todas las credenciales
3. La `ENCRYPTION_KEY` debe ser única y secreta
4. Habilita 2FA en tu cuenta de Supabase
5. Configura backups automáticos en Supabase
6. Monitorea el uso de la base de datos regularmente
