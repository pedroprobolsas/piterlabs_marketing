-- ================================================================
-- Sprint 3 — PiterLabs Marketing
-- Agrega columna analisis_estrategico a marketing.config_marca
-- ================================================================
ALTER TABLE marketing.config_marca
  ADD COLUMN IF NOT EXISTS analisis_estrategico TEXT;
