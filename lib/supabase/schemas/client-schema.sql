-- =====================================================
-- CLIENT DATABASE SCHEMA
-- Esquema estándar que debe tener cada base de datos
-- de cliente (cada organización tiene su propia BD)
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLA: calls
-- Registros de todas las llamadas (entrantes y salientes)
-- =====================================================
CREATE TABLE IF NOT EXISTS calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Información básica de la llamada
    agent_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('inbound', 'outbound')),
    
    -- Estado de la llamada
    status VARCHAR(50) NOT NULL DEFAULT 'pending', 
    -- Valores posibles: pending, completed, failed, no_answer, busy, cancelled
    
    -- Duración y timestamps
    duration_seconds INTEGER, -- Duración en segundos
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    
    -- Resumen y transcripción
    summary TEXT, -- Resumen generado por IA
    transcription TEXT, -- Transcripción completa de la llamada
    
    -- Audio
    audio_url TEXT, -- URL del archivo de audio en Supabase Storage
    audio_bucket VARCHAR(100) DEFAULT 'call-recordings',
    
    -- Análisis de IA
    sentiment VARCHAR(50), -- positive, neutral, negative
    sentiment_score DECIMAL(3,2), -- 0.00 a 1.00
    keywords TEXT[], -- Array de palabras clave detectadas
    
    -- Campos dinámicos (JSONB para máxima flexibilidad)
    dynamic_vars JSONB DEFAULT '{}',
    -- Ejemplos de dynamic_vars:
    -- {
    --   "lead_stage": "qualified",
    --   "interest_level": "high",
    --   "product_interest": "premium_plan",
    --   "follow_up_date": "2024-02-15",
    --   "customer_name": "Juan Pérez",
    --   "company": "Acme Corp",
    --   "notes": "Cliente muy interesado en demo"
    -- }
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para calls
CREATE INDEX idx_calls_agent_name ON calls(agent_name);
CREATE INDEX idx_calls_phone ON calls(phone);
CREATE INDEX idx_calls_type ON calls(type);
CREATE INDEX idx_calls_status ON calls(status);
CREATE INDEX idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX idx_calls_started_at ON calls(started_at DESC);

-- Índice GIN para búsqueda en JSONB
CREATE INDEX idx_calls_dynamic_vars ON calls USING GIN (dynamic_vars);

-- Índice para búsqueda de texto completo en transcripción
CREATE INDEX idx_calls_transcription_search ON calls USING GIN (to_tsvector('spanish', transcription));

-- =====================================================
-- TABLA: suggestions
-- Sistema de sugerencias y mejora continua
-- =====================================================
CREATE TABLE IF NOT EXISTS suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Usuario que crea la sugerencia
    user_id UUID, -- Referencia al usuario en la master database
    user_email VARCHAR(255), -- Email del usuario (para facilitar búsquedas)
    user_name VARCHAR(255),
    
    -- Contenido de la sugerencia
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100), -- bug, feature, improvement, voice_quality, etc.
    priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high, critical
    
    -- Estado
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    -- Valores posibles: pending, in_progress, completed, rejected
    
    -- Respuesta del equipo técnico
    response TEXT,
    responded_by VARCHAR(255),
    responded_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata adicional
    attachments JSONB DEFAULT '[]', -- Array de URLs de archivos adjuntos
    tags TEXT[], -- Tags para categorización
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para suggestions
CREATE INDEX idx_suggestions_user_id ON suggestions(user_id);
CREATE INDEX idx_suggestions_status ON suggestions(status);
CREATE INDEX idx_suggestions_category ON suggestions(category);
CREATE INDEX idx_suggestions_priority ON suggestions(priority);
CREATE INDEX idx_suggestions_created_at ON suggestions(created_at DESC);

-- =====================================================
-- TABLA: agents
-- Información de agentes/vendedores
-- =====================================================
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Información del agente
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    avatar_url TEXT,
    
    -- Estado
    is_active BOOLEAN DEFAULT true,
    
    -- Estadísticas (calculadas periódicamente)
    total_calls INTEGER DEFAULT 0,
    successful_calls INTEGER DEFAULT 0,
    failed_calls INTEGER DEFAULT 0,
    average_duration_seconds INTEGER,
    conversion_rate DECIMAL(5,2), -- Porcentaje de conversión
    
    -- Rating de IA (calculado por el sistema de analytics)
    ai_rating DECIMAL(3,2), -- 0.00 a 10.00
    last_ai_analysis TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para agents
CREATE INDEX idx_agents_name ON agents(name);
CREATE INDEX idx_agents_is_active ON agents(is_active);
CREATE INDEX idx_agents_conversion_rate ON agents(conversion_rate DESC);

-- =====================================================
-- TABLA: ai_analytics
-- Resultados de análisis de IA
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Tipo de análisis
    analysis_type VARCHAR(100) NOT NULL,
    -- Valores: agent_performance, call_analysis, predictions, trends
    
    -- Período analizado
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    
    -- Resultados del análisis (JSONB para flexibilidad)
    results JSONB NOT NULL,
    -- Ejemplos:
    -- {
    --   "agent_ratings": {...},
    --   "top_keywords": [...],
    --   "conversion_factors": [...],
    --   "predictions": {...}
    -- }
    
    -- Metadata
    ai_model VARCHAR(100), -- gpt-4, claude-3, etc.
    tokens_used INTEGER,
    processing_time_ms INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para ai_analytics
CREATE INDEX idx_ai_analytics_type ON ai_analytics(analysis_type);
CREATE INDEX idx_ai_analytics_created_at ON ai_analytics(created_at DESC);
CREATE INDEX idx_ai_analytics_results ON ai_analytics USING GIN (results);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analytics ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS: calls
-- =====================================================

-- Todos los usuarios autenticados pueden ver las llamadas
CREATE POLICY "Authenticated users can view calls"
    ON calls FOR SELECT
    USING (auth.role() = 'authenticated');

-- Todos los usuarios autenticados pueden insertar llamadas
CREATE POLICY "Authenticated users can insert calls"
    ON calls FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Todos los usuarios autenticados pueden actualizar llamadas
CREATE POLICY "Authenticated users can update calls"
    ON calls FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Solo service role puede eliminar llamadas
CREATE POLICY "Service role can delete calls"
    ON calls FOR DELETE
    USING (auth.role() = 'service_role');

-- =====================================================
-- POLÍTICAS RLS: suggestions
-- =====================================================

-- Todos los usuarios pueden ver sugerencias
CREATE POLICY "Authenticated users can view suggestions"
    ON suggestions FOR SELECT
    USING (auth.role() = 'authenticated');

-- Todos los usuarios pueden crear sugerencias
CREATE POLICY "Authenticated users can insert suggestions"
    ON suggestions FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Los usuarios pueden actualizar sus propias sugerencias si están pendientes
CREATE POLICY "Users can update their own pending suggestions"
    ON suggestions FOR UPDATE
    USING (
        auth.uid()::text = user_id::text 
        AND status = 'pending'
    );

-- Service role puede actualizar cualquier sugerencia
CREATE POLICY "Service role can update suggestions"
    ON suggestions FOR UPDATE
    USING (auth.role() = 'service_role');

-- =====================================================
-- POLÍTICAS RLS: agents
-- =====================================================

-- Todos los usuarios pueden ver agentes
CREATE POLICY "Authenticated users can view agents"
    ON agents FOR SELECT
    USING (auth.role() = 'authenticated');

-- Solo service role puede modificar agentes
CREATE POLICY "Service role can manage agents"
    ON agents FOR ALL
    USING (auth.role() = 'service_role');

-- =====================================================
-- POLÍTICAS RLS: ai_analytics
-- =====================================================

-- Todos los usuarios pueden ver análisis
CREATE POLICY "Authenticated users can view analytics"
    ON ai_analytics FOR SELECT
    USING (auth.role() = 'authenticated');

-- Solo service role puede insertar análisis
CREATE POLICY "Service role can insert analytics"
    ON ai_analytics FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

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
CREATE TRIGGER update_calls_updated_at
    BEFORE UPDATE ON calls
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suggestions_updated_at
    BEFORE UPDATE ON suggestions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON agents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCIÓN: Actualizar estadísticas de agente
-- =====================================================
CREATE OR REPLACE FUNCTION update_agent_stats(p_agent_name VARCHAR)
RETURNS VOID AS $$
BEGIN
    UPDATE agents
    SET 
        total_calls = (
            SELECT COUNT(*) FROM calls WHERE agent_name = p_agent_name
        ),
        successful_calls = (
            SELECT COUNT(*) FROM calls 
            WHERE agent_name = p_agent_name AND status = 'completed'
        ),
        failed_calls = (
            SELECT COUNT(*) FROM calls 
            WHERE agent_name = p_agent_name AND status IN ('failed', 'no_answer')
        ),
        average_duration_seconds = (
            SELECT AVG(duration_seconds)::INTEGER FROM calls 
            WHERE agent_name = p_agent_name AND duration_seconds IS NOT NULL
        ),
        conversion_rate = (
            SELECT 
                CASE 
                    WHEN COUNT(*) > 0 THEN 
                        (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*) * 100)
                    ELSE 0
                END
            FROM calls WHERE agent_name = p_agent_name
        )
    WHERE name = p_agent_name;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Buscar llamadas por campos dinámicos
-- =====================================================
CREATE OR REPLACE FUNCTION search_calls_by_dynamic_field(
    p_field_name TEXT,
    p_field_value TEXT
)
RETURNS TABLE (
    id UUID,
    agent_name VARCHAR,
    phone VARCHAR,
    type VARCHAR,
    status VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.agent_name,
        c.phone,
        c.type,
        c.status,
        c.created_at
    FROM calls c
    WHERE c.dynamic_vars->>p_field_name = p_field_value;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Obtener KPIs del dashboard
-- =====================================================
CREATE OR REPLACE FUNCTION get_dashboard_kpis(
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'total_calls', COUNT(*),
        'successful_calls', COUNT(*) FILTER (WHERE status = 'completed'),
        'failed_calls', COUNT(*) FILTER (WHERE status IN ('failed', 'no_answer')),
        'average_duration', AVG(duration_seconds)::INTEGER,
        'conversion_rate', 
            CASE 
                WHEN COUNT(*) > 0 THEN 
                    ROUND((COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*) * 100), 2)
                ELSE 0
            END,
        'total_agents', COUNT(DISTINCT agent_name),
        'positive_sentiment_calls', COUNT(*) FILTER (WHERE sentiment = 'positive'),
        'negative_sentiment_calls', COUNT(*) FILTER (WHERE sentiment = 'negative')
    )
    INTO v_result
    FROM calls
    WHERE 
        (p_start_date IS NULL OR created_at >= p_start_date)
        AND (p_end_date IS NULL OR created_at <= p_end_date);
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGER: Actualizar stats de agente al insertar llamada
-- =====================================================
CREATE OR REPLACE FUNCTION trigger_update_agent_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Crear agente si no existe
    INSERT INTO agents (name)
    VALUES (NEW.agent_name)
    ON CONFLICT (name) DO NOTHING;
    
    -- Actualizar estadísticas
    PERFORM update_agent_stats(NEW.agent_name);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_call_insert_update_stats
    AFTER INSERT OR UPDATE ON calls
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_agent_stats();

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL - SOLO PARA DESARROLLO)
-- =====================================================

-- Insertar agentes de ejemplo
INSERT INTO agents (name, email, is_active) VALUES
    ('Juan Pérez', 'juan.perez@example.com', true),
    ('María García', 'maria.garcia@example.com', true),
    ('Carlos López', 'carlos.lopez@example.com', true)
ON CONFLICT (email) DO NOTHING;

-- Insertar llamadas de ejemplo
INSERT INTO calls (
    agent_name, 
    phone, 
    type, 
    status, 
    duration_seconds, 
    summary, 
    sentiment,
    dynamic_vars,
    started_at
) VALUES
    (
        'Juan Pérez',
        '+1234567890',
        'outbound',
        'completed',
        180,
        'Cliente interesado en plan premium. Programada demo para próxima semana.',
        'positive',
        '{"lead_stage": "qualified", "interest_level": "high", "product_interest": "premium_plan"}'::jsonb,
        NOW() - INTERVAL '2 hours'
    ),
    (
        'María García',
        '+0987654321',
        'inbound',
        'completed',
        240,
        'Consulta sobre precios. Cliente solicitó cotización.',
        'neutral',
        '{"lead_stage": "contacted", "interest_level": "medium", "product_interest": "basic_plan"}'::jsonb,
        NOW() - INTERVAL '5 hours'
    ),
    (
        'Carlos López',
        '+1122334455',
        'outbound',
        'no_answer',
        0,
        'No contestó. Programar reintento.',
        NULL,
        '{"lead_stage": "new", "retry_count": 1}'::jsonb,
        NOW() - INTERVAL '1 hour'
    )
ON CONFLICT DO NOTHING;

-- Comentarios útiles
COMMENT ON TABLE calls IS 'Registros de llamadas con campos dinámicos en JSONB para máxima flexibilidad';
COMMENT ON COLUMN calls.dynamic_vars IS 'Campos personalizados en formato JSON. Permite agregar cualquier dato sin modificar el esquema';
COMMENT ON FUNCTION search_calls_by_dynamic_field IS 'Busca llamadas filtrando por campos dentro de dynamic_vars';
COMMENT ON FUNCTION get_dashboard_kpis IS 'Retorna KPIs principales del dashboard en formato JSON';
