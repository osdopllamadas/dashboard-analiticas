-- =====================================================
-- MASTER DATABASE SCHEMA
-- Base de datos principal que gestiona organizaciones
-- y conexiones a bases de datos de clientes
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLA: organizations
-- Almacena información de cada organización/cliente
-- =====================================================
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo TEXT, -- URL del logo de la organización
    plan_type VARCHAR(50) NOT NULL DEFAULT 'basic', -- basic, professional, enterprise
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para organizations
CREATE INDEX idx_organizations_plan_type ON organizations(plan_type);
CREATE INDEX idx_organizations_is_active ON organizations(is_active);

-- =====================================================
-- TABLA: client_connections
-- Almacena credenciales encriptadas para conectar
-- a las bases de datos de cada cliente
-- =====================================================
CREATE TABLE IF NOT EXISTS client_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Credenciales de Supabase del cliente (ENCRIPTADAS)
    supabase_url TEXT NOT NULL,
    supabase_service_role_key TEXT NOT NULL, -- Encriptado con AES-256
    supabase_anon_key TEXT, -- Encriptado con AES-256
    
    -- API Keys de IA (ENCRIPTADAS)
    openai_api_key TEXT, -- Encriptado con AES-256
    anthropic_api_key TEXT, -- Encriptado con AES-256
    google_api_key TEXT, -- Encriptado con AES-256
    
    -- Configuración adicional
    ai_provider VARCHAR(50) DEFAULT 'openai', -- openai, anthropic, google
    ai_model VARCHAR(100) DEFAULT 'gpt-4-turbo-preview',
    
    -- Metadata
    connection_status VARCHAR(50) DEFAULT 'active', -- active, inactive, error
    last_connection_test TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint: Una organización solo puede tener una conexión activa
    UNIQUE(org_id)
);

-- Índices para client_connections
CREATE INDEX idx_client_connections_org_id ON client_connections(org_id);
CREATE INDEX idx_client_connections_status ON client_connections(connection_status);

-- =====================================================
-- TABLA: users
-- Usuarios del sistema vinculados a organizaciones
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Información del usuario
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    
    -- Rol dentro de la organización
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- admin, manager, user, viewer
    
    -- Auth (integrado con Supabase Auth)
    auth_user_id UUID, -- ID del usuario en Supabase Auth
    
    -- Estado
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para users
CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- TABLA: audit_logs
-- Registro de auditoría para acciones críticas
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Información del evento
    action VARCHAR(100) NOT NULL, -- login, update_connection, export_data, etc.
    resource_type VARCHAR(100), -- organization, connection, user, etc.
    resource_id UUID,
    
    -- Detalles
    details JSONB, -- Información adicional del evento
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para audit_logs
CREATE INDEX idx_audit_logs_org_id ON audit_logs(org_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS: organizations
-- =====================================================

-- Los usuarios solo pueden ver su propia organización
CREATE POLICY "Users can view their own organization"
    ON organizations FOR SELECT
    USING (
        id IN (
            SELECT org_id FROM users 
            WHERE auth_user_id = auth.uid()
        )
    );

-- Solo admins pueden actualizar la organización
CREATE POLICY "Admins can update their organization"
    ON organizations FOR UPDATE
    USING (
        id IN (
            SELECT org_id FROM users 
            WHERE auth_user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLÍTICAS RLS: client_connections
-- =====================================================

-- Solo admins pueden ver las conexiones de su organización
CREATE POLICY "Admins can view their organization connections"
    ON client_connections FOR SELECT
    USING (
        org_id IN (
            SELECT org_id FROM users 
            WHERE auth_user_id = auth.uid() 
            AND role IN ('admin', 'manager')
        )
    );

-- Solo admins pueden actualizar las conexiones
CREATE POLICY "Admins can update their organization connections"
    ON client_connections FOR UPDATE
    USING (
        org_id IN (
            SELECT org_id FROM users 
            WHERE auth_user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Solo admins pueden insertar conexiones
CREATE POLICY "Admins can insert connections"
    ON client_connections FOR INSERT
    WITH CHECK (
        org_id IN (
            SELECT org_id FROM users 
            WHERE auth_user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =====================================================
-- POLÍTICAS RLS: users
-- =====================================================

-- Los usuarios pueden ver otros usuarios de su organización
CREATE POLICY "Users can view users in their organization"
    ON users FOR SELECT
    USING (
        org_id IN (
            SELECT org_id FROM users 
            WHERE auth_user_id = auth.uid()
        )
    );

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth_user_id = auth.uid());

-- Solo admins pueden crear nuevos usuarios
CREATE POLICY "Admins can insert users"
    ON users FOR INSERT
    WITH CHECK (
        org_id IN (
            SELECT org_id FROM users 
            WHERE auth_user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Solo admins pueden eliminar usuarios
CREATE POLICY "Admins can delete users"
    ON users FOR DELETE
    USING (
        org_id IN (
            SELECT org_id FROM users 
            WHERE auth_user_id = auth.uid() 
            AND role = 'admin'
        )
        AND auth_user_id != auth.uid() -- No pueden eliminarse a sí mismos
    );

-- =====================================================
-- POLÍTICAS RLS: audit_logs
-- =====================================================

-- Los usuarios pueden ver los logs de su organización
CREATE POLICY "Users can view audit logs of their organization"
    ON audit_logs FOR SELECT
    USING (
        org_id IN (
            SELECT org_id FROM users 
            WHERE auth_user_id = auth.uid()
        )
    );

-- Solo el sistema puede insertar logs (via service role)
CREATE POLICY "Service role can insert audit logs"
    ON audit_logs FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- FUNCIONES AUXILIARES
-- =====================================================

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_connections_updated_at
    BEFORE UPDATE ON client_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCIÓN: Crear log de auditoría automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION create_audit_log(
    p_org_id UUID,
    p_user_id UUID,
    p_action VARCHAR,
    p_resource_type VARCHAR DEFAULT NULL,
    p_resource_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO audit_logs (
        org_id,
        user_id,
        action,
        resource_type,
        resource_id,
        details
    ) VALUES (
        p_org_id,
        p_user_id,
        p_action,
        p_resource_type,
        p_resource_id,
        p_details
    ) RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL - SOLO PARA DESARROLLO)
-- =====================================================

-- Insertar organización de ejemplo
INSERT INTO organizations (id, name, plan_type) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Demo Organization',
    'enterprise'
) ON CONFLICT (id) DO NOTHING;

-- Nota: Las credenciales deben ser encriptadas antes de insertarse
-- Este es solo un ejemplo de estructura
COMMENT ON TABLE client_connections IS 'IMPORTANTE: Todos los campos *_key deben ser encriptados con AES-256 antes de insertarse';
COMMENT ON COLUMN client_connections.supabase_service_role_key IS 'Encriptado con AES-256';
COMMENT ON COLUMN client_connections.openai_api_key IS 'Encriptado con AES-256';
COMMENT ON COLUMN client_connections.anthropic_api_key IS 'Encriptado con AES-256';
COMMENT ON COLUMN client_connections.google_api_key IS 'Encriptado con AES-256';
