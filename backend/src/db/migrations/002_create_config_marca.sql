-- ================================================================
-- Sprint 3 — PiterLabs Marketing
-- Schema: marketing
-- Tabla: config_marca
-- Almacena la configuración de marca del Bloque 1 (Mi Marca)
-- ================================================================

-- ================================================================
-- TABLA: marketing.config_marca
-- ================================================================
CREATE TABLE IF NOT EXISTS marketing.config_marca (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_marca     VARCHAR(200),
  industria        VARCHAR(100),
  propuesta_valor  TEXT,
  tono_voz         VARCHAR(30),
  -- 'inspiracional' | 'educativo' | 'confrontador' | 'cercano'
  arquetipos       JSONB DEFAULT '[]'::jsonb,
  -- Array de strings: ["Héroe", "Sabio"]
  buyer_persona    JSONB DEFAULT '{}'::jsonb,
  -- Objeto generado por Claude con nombre, edad, dolor, aspiracion, canal, objecion
  kb_fuentes       JSONB DEFAULT '[]'::jsonb,
  -- Array de objetos: [{ tipo: 'archivo'|'url', nombre, contenido_resumen }]
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- Trigger: updated_at automático (reutiliza la función del migration 001)
CREATE OR REPLACE TRIGGER trg_config_marca_updated_at
  BEFORE UPDATE ON marketing.config_marca
  FOR EACH ROW
  EXECUTE FUNCTION marketing.set_updated_at();

-- Permisos (probolsas_user ya tiene GRANT ALL ON SCHEMA marketing del migration 001)
GRANT ALL ON TABLE marketing.config_marca TO probolsas_user;

-- ================================================================
-- COMANDO PARA EJECUTAR EN EL VPS:
-- docker exec -i <postgres_container_id> psql -U postgres -d probolsas_db \
--   < backend/src/db/migrations/002_create_config_marca.sql
--
-- Para obtener el ID del contenedor postgres:
--   docker ps | grep postgres
-- ================================================================
