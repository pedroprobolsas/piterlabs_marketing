-- Migration 009 — Añadir Skill de Fotogramas Clave (Keyframes)
-- Específicamente solicitado para generar 6 prompts visuales consistentes.

INSERT INTO marketing.skills (
  clave, 
  nombre, 
  descripcion, 
  instrucciones, 
  activa, 
  orden, 
  label_tab, 
  titulo_panel
) VALUES (
  'fotogramas_clave',
  'Fotogramas Clave (IA)',
  'Genera 6 prompts visuales consistentes en inglés para crear la columna vertebral visual de tu video.',
  $$Analiza el guion y la imagen de referencia (si existe) para extraer el ADN visual del producto y la marca. Genera EXACTAMENTE 6 prompts detallados en inglés para herramientas de IA generativa (Midjourney, DALL-E, GPT Image 2).

REGLAS DE ORO:
1. CONSISTENCIA: Asegura que el sujeto, el entorno, la paleta de colores y la iluminación sean idénticos en los 6 prompts.
2. ESTRUCTURA DE CADA PROMPT: [Tipo de Plano] + [Sujeto/Acción] + [Entorno] + [Iluminación/Atmósfera] + [Estilo/Lente].
3. IDIOMA: Siempre en inglés para mayor precisión técnica.
4. CANTIDAD: Exactamente 6 frames.

FORMATO DE SALIDA:
FRAME 1: [Descripción técnica en inglés]
FRAME 2: [Descripción técnica en inglés]
...
FRAME 6: [Descripción técnica en inglés]

No incluyas explicaciones adicionales.$$,
  TRUE,
  0,
  '📸 Fotogramas',
  '6 Fotogramas Clave para Producción'
) ON CONFLICT (clave) DO NOTHING;
