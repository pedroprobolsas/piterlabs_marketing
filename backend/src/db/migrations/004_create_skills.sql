-- Migration 004 — Tabla marketing.skills
-- Skills de producción editables desde la UI (Brief de Producción en /camara)

CREATE TABLE IF NOT EXISTS marketing.skills (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  clave         VARCHAR(50)  NOT NULL UNIQUE,   -- clave del campo JSON de salida
  nombre        VARCHAR(100) NOT NULL,
  descripcion   VARCHAR(300),
  instrucciones TEXT         NOT NULL,           -- se inyecta dinámicamente en el prompt de Claude
  activa        BOOLEAN      DEFAULT TRUE,
  orden         INTEGER      NOT NULL DEFAULT 0,
  updated_at    TIMESTAMP    DEFAULT NOW()
);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION marketing.update_skills_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_skills_updated_at ON marketing.skills;
CREATE TRIGGER trg_skills_updated_at
  BEFORE UPDATE ON marketing.skills
  FOR EACH ROW EXECUTE FUNCTION marketing.update_skills_updated_at();

-- 5 skills iniciales
-- ON CONFLICT DO NOTHING permite re-ejecutar sin duplicar
INSERT INTO marketing.skills (clave, nombre, descripcion, instrucciones, activa, orden) VALUES

('foto_publicitaria',
 'Foto Publicitaria',
 'Prompt en inglés para GPT Image 2 basado en el producto y el contexto de marca.',
$$Prompt en inglés para GPT Image 2. Estructura obligatoria: tipo de imagen → descripción del producto → estilo fotográfico → iluminación (física: fuente, dirección, temperatura de color) → composición → texto de marca si aplica → CTA visual. Reglas de escritura: escena primero, sujeto segundo, detalles tercero, restricciones al final. Sin adjetivos vacíos (no stunning, no beautiful, no amazing). Basado en el arquetipo, tono de voz y buyer persona de la marca. Si hay imagen del producto adjunta, incluir descripción visual precisa de lo que se ve.$$,
 TRUE, 1),

('carrusel',
 'Carrusel Educativo',
 'Estructura completa de carrusel para Instagram y LinkedIn con instrucciones por slide.',
$$Estructura completa del carrusel Instagram/LinkedIn. 6-8 slides. Formato por slide: "Slide N: [mensaje principal] | Visual: [instrucción visual] | Diseño: [nota de diseño]". Slide 1 = hook más fuerte extraído del guion. Slides intermedios = un solo mensaje por slide, extraído del guion en orden narrativo. Último slide = CTA concreto y directo alineado con el buyer persona. Paleta y tipografía de la marca mencionadas en las notas de diseño.$$,
 TRUE, 2),

('video_cinematografico',
 'Video Cinematográfico',
 'Prompt Seedance 2.0 / Kling AI estructurado en 7 bloques, bilingüe EN+ZH.',
$$Prompt estructurado en 7 bloques obligatorios con etiquetas exactas:
[01 SCENE SETTING] dónde ocurre, materiales del entorno, hora del día, clima visual
[02 SUBJECT DESCRIPTION] solo lo visible: ropa, postura, rasgos físicos. Nunca estados internos ni emociones
[03 ACTION/BEHAVIOR] intención + resultado visible. Nunca biomecánica (no "flexiona", no "contrae")
[04 SHOT LANGUAGE] vocabulario cinematográfico real: tracking shot, dolly-in, crane, handheld, OTS, rack focus
[05 LIGHTING/ATMOSPHERE] física de la luz: fuente, dirección, temperatura de color, tipo de sombras
[06 STYLE/VISUAL TEXTURE] paleta de color, grano de película, estética de referencia
[07 AUDIO/DIALOGUE] opcional — máx 25 palabras, siempre separado de la acción
Reglas Seedance: solo lo visible, intención no biomecánica, máx 3 personajes por corte.
Output BILINGÜE: cada bloque en inglés primero, luego el mismo bloque traducido al mandarín (ZH).$$,
 TRUE, 3),

('stories',
 'Stories Secuenciales 9:16',
 '3 prompts GPT Image 2 con coherencia visual para Stories verticales.',
$$3 prompts de imagen GPT Image 2 para Stories verticales 9:16 con paleta visual coherente entre ellos. Formato exacto:
STORY 1 — HOOK: [prompt en inglés, especifica formato vertical 9:16, imagen que para el scroll]
STORY 2 — DESARROLLO: [prompt en inglés, 9:16, muestra el conflicto o transformación del guion]
STORY 3 — CTA: [prompt en inglés, 9:16, imagen con elemento visual que dirige a la acción]
Los 3 prompts deben usar la misma temperatura de color, paleta y estética para coherencia visual de secuencia.$$,
 TRUE, 4),

('narracion',
 'Narración Viral',
 'Script limpio de voz en off en 3 estilos: Documental Netflix, Hook TikTok, Storytelling Emocional.',
$$Objeto JSON con exactamente 3 campos — "netflix", "tiktok", "emocional". Cada campo es el script limpio de voz en off: sin corchetes, sin instrucciones técnicas, sin marcas de dirección — solo el texto que se habla. Reglas universales para los 3 estilos: frases máx 10 palabras, párrafos de 1-2 líneas separados por línea en blanco, puntos suspensivos para pausas naturales, primera frase es el gancho que para el scroll en 2 segundos, progresión emocional: Curiosidad → Tensión → Revelación → Inspiración → CTA. "netflix": voz grave, pausado, autoridad, oraciones completas. "tiktok": energía alta, arranque inmediato con pregunta o dato chocante, ritmo rápido, CTA urgente. "emocional": primera persona, conversacional, construye tensión gradual, cierre inspirador.$$,
 TRUE, 5)

ON CONFLICT (clave) DO NOTHING;
