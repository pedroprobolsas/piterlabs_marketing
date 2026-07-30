-- Migration 014 — Actualizar instrucciones para no inventar descripciones de personajes/productos
-- Se exige usar siempre referencias adjuntas (--cref o image input)

UPDATE marketing.skills
SET instrucciones = $$Prompt en inglés para herramientas de IA (Midjourney/GPT Image). Estructura obligatoria: referencias adjuntas → tipo de imagen → estilo fotográfico → iluminación → composición → texto de marca (si aplica) → CTA visual.
NUEVA REGLA ESTRICTA DE PERSONAJES Y PRODUCTOS: NUNCA inventes, adivines ni describas los rasgos físicos del personaje ni los detalles del empaque/producto en texto. En su lugar, el prompt debe indicar EXPRESAMENTE: "Use the attached images as strict character and product references (--cref / image input). Maintain exact facial features, clothing, and product design from the attachments. Do not alter or invent details."
Reglas de escritura: referencias primero, escena segundo, detalles tercero, restricciones al final. Sin adjetivos vacíos. Basado en el arquetipo y tono de la marca.$$
WHERE clave = 'foto_publicitaria';

UPDATE marketing.skills
SET instrucciones = $$Analiza el guion y extrae la narrativa. Genera EXACTAMENTE 6 prompts en inglés para herramientas de IA generativa (Midjourney, DALL-E, GPT Image 2).

REGLAS DE ORO:
1. REFERENCIAS FIJAS (¡CRÍTICO!): NUNCA describas los rasgos físicos del personaje principal ni el diseño del producto en texto. Todos los prompts deben iniciar obligatoriamente con la frase: "Use the attached images as strict character and product references. Maintain exact features and design."
2. CONSISTENCIA: Asegura que el entorno, paleta de colores e iluminación sean consistentes en los 6 prompts.
3. ESTRUCTURA DE CADA PROMPT: [Referencias Adjuntas] + [Tipo de Plano] + [Acción del Sujeto] + [Entorno] + [Iluminación] + [Estilo/Lente].
4. IDIOMA Y CANTIDAD: Siempre en inglés. Exactamente 6 frames.

FORMATO DE SALIDA:
FRAME 1: [Prompt técnico iniciando con la instrucción de referencias]
FRAME 2: [Prompt técnico iniciando con la instrucción de referencias]
...
FRAME 6: [Prompt técnico iniciando con la instrucción de referencias]

No incluyas explicaciones adicionales.$$
WHERE clave = 'fotogramas_clave';

UPDATE marketing.skills
SET instrucciones = $$3 prompts de imagen GPT Image 2 para Stories verticales 9:16.
REGLA ESTRICTA DE REFERENCIAS: NUNCA describas los rasgos físicos del personaje ni los detalles del producto en texto. Inicia cada prompt con: "Use the attached images as strict character and product references. Maintain exact features and design."

Formato exacto:
STORY 1 — HOOK: [Instrucción de referencias adjuntas + prompt en inglés, formato vertical 9:16, imagen que para el scroll]
STORY 2 — DESARROLLO: [Instrucción de referencias adjuntas + prompt en inglés, 9:16, muestra conflicto/transformación]
STORY 3 — CTA: [Instrucción de referencias adjuntas + prompt en inglés, 9:16, imagen con elemento visual hacia la acción]

Los 3 prompts deben usar la misma estética para coherencia visual.$$
WHERE clave = 'stories';
