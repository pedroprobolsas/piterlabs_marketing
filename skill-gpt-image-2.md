# SKILL: GPT Image 2 — Fotografía Publicitaria de Producto

## Propósito
Generar prompts profesionales para GPT Image 2 que conviertan una foto de producto en una pieza publicitaria de nivel comercial. El usuario toma el prompt y lo usa directamente en ChatGPT Plus.

---

## Reglas Fundamentales

1. **Escena primero, sujeto segundo, detalles tercero, restricciones al final**
2. **Siempre en inglés** — GPT Image 2 responde mejor en inglés
3. **Específico, no vago** — nunca "beautiful lighting", siempre "soft studio lighting from the upper left, no harsh shadows"
4. **El producto es el héroe** — todo lo demás (fondo, props, texto) sirve al producto
5. **Incluir intención comercial** — mencionar el canal destino (Instagram, e-commerce, LinkedIn)

---

## Estructura del Prompt

```
[TIPO DE IMAGEN] + [DESCRIPCIÓN DEL PRODUCTO] + [ESTILO FOTOGRÁFICO] + 
[ILUMINACIÓN] + [COMPOSICIÓN] + [ELEMENTOS DE MARCA] + [RESTRICCIONES]
```

---

## Plantillas por Tipo de Pieza

### A. Ad Publicitario (feed Instagram / Facebook)
```
Use this product photo to create a professional advertising visual.
[PRODUCTO]: [descripción del producto — nombre, color, material, tamaño]
[FONDO]: [dark moody background / white marble surface / rustic wood table]
[ILUMINACIÓN]: [soft studio lighting, warm tones, subtle shadows beneath product]
[COMPOSICIÓN]: [product centered, slight 30-degree angle to show dimension]
[PROPS]: [ingredientes naturales relacionados al producto / sin props]
[TEXTO]: brand name "[MARCA]" in bold [color] typography upper left, tagline "[MENSAJE]" lower right
[CALIDAD]: commercial photography quality, ultra-realistic, photorealistic
[CANAL]: optimized for Instagram feed, 1:1 ratio
```

### B. Hero Shot (e-commerce / web)
```
Professional product photography of [PRODUCTO] on pure white background (#FFFFFF).
Studio lighting with soft, even illumination to eliminate harsh shadows.
Position product at slight 30-degree angle to show dimension.
High detail, sharp focus throughout, showing clear material texture.
Add very soft shadow beneath product so it looks grounded.
Colors accurate to real life — do not boost saturation artificially.
Photorealistic rendering, commercial photography quality, ultra-realistic.
```

### C. Lifestyle / Contextual
```
Professional lifestyle product photography of [PRODUCTO].
Setting: [descripción del ambiente — cocina moderna, restaurante, supermercado]
Lighting: [natural window light from left / warm ambient restaurant lighting]
Style: [editorial food photography / premium commercial aesthetic]
Product prominently featured, [persona o manos interactuando con el producto].
Shallow depth of field, 50mm lens perspective.
Color grading: [warm and inviting / cool and premium / vibrant and energetic]
```

### D. Cartel / Poster Publicitario
```
Create a professional advertising poster for [PRODUCTO].
Layout: product image [left/right/center], text [opposite side / overlay].
Background: [color sólido / gradiente / escena contextual]
Brand name EXACT TEXT: "[MARCA]" in [bold sans-serif / elegant serif], [color].
Tagline EXACT TEXT: "[MENSAJE]" smaller below brand name.
Key benefits (3 icons with text): "[BENEFICIO 1]" / "[BENEFICIO 2]" / "[BENEFICIO 3]"
CTA EXACT TEXT: "[LLAMADO A LA ACCIÓN]" in contrasting color button.
Style: [premium minimalist / bold and energetic / warm and artisanal]
Commercial advertising quality.
```

---

## Modificadores de Estilo por Arquetipo de Marca

| Arquetipo | Estilo Fotográfico | Paleta | Iluminación |
|-----------|-------------------|--------|-------------|
| El Sabio | Editorial, limpio, técnico | Blancos, azules, grises | Luz suave difusa, sin drama |
| El Creador | Artístico, texturado, único | Tierra, dorados, contrastes | Luz lateral dramática |
| El Héroe | Dinámico, energético, bold | Rojos, negros, blancos | Contraluz, rim lighting |
| El Cuidador | Cálido, cercano, natural | Beiges, verdes, cremas | Luz natural de ventana |
| El Forajido | Oscuro, contrastado, rebelde | Negros, rojos, metálicos | Neón, sombras duras |

---

## Ejemplo Real — Probolsas (Arquetipo: El Sabio / Tono: Educativo)

**Input:**
- Producto: Doypack de salsa de tomate Torre del Oro, empaque flexible rojo y amarillo, 500g
- Canal: Instagram feed
- Mensaje: "El empaque que protege tu salsa y vende por ti"
- Buyer persona: Gerentes de producción de empresas de alimentos

**Output prompt:**
```
Use this product photo to create a professional advertising visual for a flexible food packaging brand.
Product: a red and yellow flexible doypack pouch containing tomato sauce, 500g, with "Torre del Oro" branding.
Background: dark moody background, warm amber tones, subtle fog effect.
Lighting: dramatic soft studio lighting from upper left, warm highlights on the packaging, soft shadow beneath.
Composition: product centered, slight 15-degree tilt, tomato slices and fresh herbs as natural props around the base.
Text overlay: brand name "PROBOLSAS" in clean white sans-serif upper left corner. Tagline "El empaque que protege tu salsa y vende por ti" in smaller text lower left.
Badge: "Tecnología Flexible" seal upper right.
Style: premium food commercial photography, editorial quality.
Platform: optimized for Instagram feed 1:1, photorealistic, ultra-detailed.
```

---

## Lo que NO hacer

- ❌ "beautiful product photo" → ✅ "commercial photography, studio lighting, sharp focus"
- ❌ "nice background" → ✅ "dark moody background, warm amber tones, subtle fog"
- ❌ "good lighting" → ✅ "soft studio lighting from upper left, no harsh shadows"
- ❌ Texto vago en el prompt → ✅ EXACT TEXT: "[texto exacto]"
- ❌ Prompts en español → ✅ Siempre en inglés
- ❌ Más de 3 elementos de texto en la imagen → GPT Image 2 se confunde con mucho texto

---

## Referencia de Calidad

El prompt correcto convierte esto:
> *foto casual de producto en mesa*

En esto:
> *pieza publicitaria profesional con iluminación de estudio, composición editorial, texto de marca integrado y color grading para el canal destino*

Referencia visual: el nivel del ad de "Bún Riêu" del PDF de ejemplos — foto simple convertida en pieza publicitaria completa con tipografía, íconos y color grading.
