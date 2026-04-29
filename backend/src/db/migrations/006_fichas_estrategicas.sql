-- Migration 006 — Fichas Estratégicas
-- Permite guardar el historial del Estratega Interactivo y la ficha final

CREATE TABLE IF NOT EXISTS marketing.fichas_estrategicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_profile_id UUID REFERENCES marketing.brand_profiles(id) ON DELETE SET NULL,
    conversacion JSONB DEFAULT '[]'::jsonb,
    ficha JSONB DEFAULT '{}'::jsonb,
    estado VARCHAR(50) DEFAULT 'en_progreso',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_fichas_estrategicas_updated_at
    BEFORE UPDATE ON marketing.fichas_estrategicas
    FOR EACH ROW
    EXECUTE FUNCTION marketing.update_updated_at_column();
