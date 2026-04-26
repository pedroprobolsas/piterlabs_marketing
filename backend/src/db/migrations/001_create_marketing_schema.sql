-- ================================================================
-- Sprint 2 — PiterLabs Marketing
-- Schema: marketing (en probolsas_db)
-- Tablas: prospectos e interacciones_prospecto
-- ================================================================

-- Crear schema si no existe
CREATE SCHEMA IF NOT EXISTS marketing;

-- ================================================================
-- TABLA 1: marketing.prospectos
-- ================================================================
CREATE TABLE IF NOT EXISTS marketing.prospectos (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre                    VARCHAR(200),
  telefono                  VARCHAR(20) NOT NULL,
  email                     VARCHAR(200),
  empresa                   VARCHAR(200),
  ciudad                    VARCHAR(100),
  fuente                    VARCHAR(30),
  -- 'whatsapp' | 'webchat' | 'manual' | 'meta' | 'google'
  producto_interes          VARCHAR(200),
  asesor_asignado           VARCHAR(100),
  etapa                     VARCHAR(30) DEFAULT 'nuevo',
  -- 'nuevo' | 'calificado' | 'cotizado' | 'negociando' | 'convertido'
  temperatura               VARCHAR(20) DEFAULT 'nuevo',
  -- 'nuevo' | 'caliente' | 'frio'
  score                     INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  fecha_primer_contacto     TIMESTAMP DEFAULT NOW(),
  fecha_ultima_interaccion  TIMESTAMP DEFAULT NOW(),
  fecha_proximo_seguimiento TIMESTAMP,
  cotizacion_id             VARCHAR(50),
  notas_openclaw            TEXT,
  convertido                BOOLEAN DEFAULT FALSE,
  created_at                TIMESTAMP DEFAULT NOW(),
  updated_at                TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prospectos_telefono
  ON marketing.prospectos(telefono);

CREATE INDEX IF NOT EXISTS idx_prospectos_etapa
  ON marketing.prospectos(etapa);

CREATE INDEX IF NOT EXISTS idx_prospectos_temperatura
  ON marketing.prospectos(temperatura);

CREATE INDEX IF NOT EXISTS idx_prospectos_seguimiento
  ON marketing.prospectos(fecha_proximo_seguimiento);

-- Trigger: updated_at automático
CREATE OR REPLACE FUNCTION marketing.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_prospectos_updated_at
  BEFORE UPDATE ON marketing.prospectos
  FOR EACH ROW
  EXECUTE FUNCTION marketing.set_updated_at();

-- ================================================================
-- TABLA 2: marketing.interacciones_prospecto
-- ================================================================
CREATE TABLE IF NOT EXISTS marketing.interacciones_prospecto (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospecto_id   UUID NOT NULL REFERENCES marketing.prospectos(id) ON DELETE CASCADE,
  fecha          TIMESTAMP DEFAULT NOW(),
  canal          VARCHAR(30),
  -- 'whatsapp' | 'webchat' | 'manual' | 'email' | 'chatwoot'
  tipo           VARCHAR(50),
  -- 'primer_contacto' | 'seguimiento' | 'cotizacion_emitida' | 'nurturing' | 'cambio_etapa'
  nota           TEXT,
  ejecutado_por  VARCHAR(100)
  -- 'openclaw' | 'n8n' | nombre del asesor
);

CREATE INDEX IF NOT EXISTS idx_interacciones_prospecto_id
  ON marketing.interacciones_prospecto(prospecto_id);

CREATE INDEX IF NOT EXISTS idx_interacciones_fecha
  ON marketing.interacciones_prospecto(fecha DESC);

-- ================================================================
-- PERMISOS: probolsas_user
-- READ sobre maestros y crisolweb, FULL sobre marketing
-- ================================================================
GRANT USAGE ON SCHEMA maestros TO probolsas_user;
GRANT SELECT ON ALL TABLES IN SCHEMA maestros TO probolsas_user;

GRANT USAGE ON SCHEMA crisolweb TO probolsas_user;
GRANT SELECT ON ALL TABLES IN SCHEMA crisolweb TO probolsas_user;

GRANT ALL ON SCHEMA marketing TO probolsas_user;
GRANT ALL ON ALL TABLES IN SCHEMA marketing TO probolsas_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA marketing TO probolsas_user;

-- ================================================================
-- COMANDO PARA EJECUTAR EN EL VPS:
-- docker exec -i 2f78aec4645a psql -U postgres -d probolsas_db \
--   < backend/src/db/migrations/001_create_marketing_schema.sql
-- ================================================================
