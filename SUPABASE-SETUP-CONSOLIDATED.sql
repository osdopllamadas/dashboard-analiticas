-- =========================================================
-- SCRIPT DE CONFIGURACIÓN INICIAL: MASTER DATABASE
-- Ejecutar este script en el SQL Editor de tu proyecto 
-- principal de Supabase (Master DB).
-- =========================================================

-- 1. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Organizaciones (Tenants)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'premium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Conexiones de Clientes (Encriptadas)
CREATE TABLE IF NOT EXISTS client_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    supabase_url TEXT NOT NULL,
    supabase_key TEXT NOT NULL, -- Almacenar aquí la Service Role Key ENCRIPTADA
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla de Usuarios Maestros
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    auth_user_id UUID, -- ID vinculado a Supabase Auth
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================
-- SCRIPT DE CONFIGURACIÓN INICIAL: CLIENT DATABASE
-- Ejecutar lo siguiente en CADA PROYECTO de Supabase 
-- destinado a un cliente específico.
-- =========================================================

/*
-- Descomenta esta sección y ejecútala en el proyecto del CLIENTE:

CREATE TABLE IF NOT EXISTS calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID,
    agent_name TEXT,
    customer_phone TEXT,
    duration_seconds INTEGER,
    status TEXT,
    sentiment TEXT,
    recording_url TEXT,
    dynamic_vars JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    status TEXT DEFAULT 'pending',
    author TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
*/

-- =========================================================
-- DATOS DE PRUEBA (Opcional - Ejecutar solo en Master DB)
-- =========================================================

/*
INSERT INTO organizations (name, slug) 
VALUES ('Demo Enterprise', 'demo-enterprise');

-- Nota: El registro de la conexión debe hacerse vía la aplicación
-- para que la llave se guarde ENCRIPTADA correctamente.
*/
