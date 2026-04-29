-- Migration 007 — Fichas Estratégicas
-- La tabla ya existe en producción. Este archivo queda como referencia
-- y para entornos nuevos donde haya que recrear el schema desde cero.

CREATE TABLE IF NOT EXISTS marketing.fichas_estrategicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_profile_id UUID REFERENCES marketing.config_marca(id) ON DELETE SET NULL,
    conversacion JSONB DEFAULT '[]'::jsonb,
    ficha JSONB DEFAULT '{}'::jsonb,
    estado VARCHAR(50) DEFAULT 'en_progreso',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER trg_fichas_estrategicas_updated_at
    BEFORE UPDATE ON marketing.fichas_estrategicas
    FOR EACH ROW
    EXECUTE FUNCTION marketing.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_fichas_estrategicas_estado ON marketing.fichas_estrategicas(estado);
CREATE INDEX IF NOT EXISTS idx_fichas_estrategicas_brand ON marketing.fichas_estrategicas(brand_profile_id);
