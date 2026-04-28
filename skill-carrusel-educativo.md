# SKILL: Carrusel Educativo — Instagram / LinkedIn

## Propósito
Generar la estructura completa de un carrusel de contenido educativo que nazca del guion del Bloque 2. El usuario recibe slide por slide con el texto de cada uno y el prompt de imagen correspondiente para GPT Image 2.

---

## Reglas Fundamentales

1. **Un mensaje por slide** — nunca dos ideas en el mismo slide
2. **Slide 1 = Hook** — debe parar el scroll en menos de 2 segundos
3. **Slide final = CTA** — siempre termina con una acción clara
4. **Coherencia visual** — todos los slides deben verse como parte de la misma serie
5. **Progresión lógica** — cada slide lleva al siguiente naturalmente
6. **Máximo 8 palabras por línea de texto** en el diseño

---

## Estructura por Número de Slides

### Carrusel Corto (5 slides) — para LinkedIn
```
Slide 1: HOOK — La promesa o el problema
Slide 2: CONTEXTO — Por qué importa
Slide 3: REVELACIÓN — El insight clave
Slide 4: SOLUCIÓN — Lo que cambia todo
Slide 5: CTA — La acción que debe tomar
```

### Carrusel Medio (7 slides) — para Instagram educativo
```
Slide 1: HOOK — Pregunta o afirmación que para el scroll
Slide 2: PROBLEMA — El dolor que reconoce el buyer persona
Slide 3: AGITACIÓN — Por qué es más grave de lo que parece
Slide 4: CONTEXTO — Datos o historia que da credibilidad
Slide 5: SOLUCIÓN — El camino correcto
Slide 6: PRUEBA — Resultado o transformación
Slide 7: CTA — Acción concreta
```

### Carrusel Largo (8 slides) — para campaña de autoridad
```
Slide 1: HOOK — Dato sorprendente o pregunta polémica
Slide 2: HISTORIA — Personaje que tiene el problema
Slide 3: PROBLEMA RAÍZ — La causa real, no el síntoma
Slide 4: CONSECUENCIAS — Qué pasa si no se resuelve
Slide 5: EL GIRO — El descubrimiento o cambio
Slide 6: LA SOLUCIÓN — Cómo funciona
Slide 7: TRANSFORMACIÓN — El antes y el después
Slide 8: CTA — Próximo paso claro
```

---

## Formato de Entrega por Slide

Para cada slide PiterLabs genera:

```
--- SLIDE [N] ---
TEXTO PRINCIPAL: "[título o frase central — máx 8 palabras]"
TEXTO SECUNDARIO: "[explicación de apoyo — máx 20 palabras]"
ELEMENTO VISUAL: [descripción de qué mostrar — foto producto / ícono / dato / persona]
PROMPT GPT IMAGE 2: "[prompt en inglés para generar la imagen de este slide]"
```

---

## Hooks que Funcionan (Slide 1)

### Por tipo de arquetipo:

**El Sabio (Educativo):**
- "El 80% de los empaques fallan antes de llegar al supermercado"
- "Lo que nadie te dice sobre el empaque flexible"
- "3 errores que destruyen tu producto en el transporte"
- "¿Sabes cuántas barreras protegen tu salsa? Nosotros sí"

**El Héroe (Inspiracional):**
- "Cómo [cliente] triplicó sus ventas cambiando solo el empaque"
- "De la marmita al lineal: la historia que nadie cuenta"

**El Cuidador (Cercano):**
- "El empaque que cuida tu receta tanto como tú"
- "Para los que hacen alimentos con amor y los entregan con calidad"

---

## CTAs que Convierten (Slide Final)

Por canal:
- **WhatsApp:** "Escríbenos al [número] y cotiza hoy"
- **LinkedIn:** "Síguenos para más contenido sobre empaques inteligentes"
- **Instagram:** "Guarda este carrusel para cuando lo necesites"
- **Email:** "Solicita tu muestra gratis en el link de la bio"

---

## Instrucciones de Diseño para Canva / IA

```
PALETA: [colores de marca]
TIPOGRAFÍA: [fuente principal] para títulos / [fuente secundaria] para cuerpo
FONDO: [color sólido / gradiente / foto con overlay]
ELEMENTOS CONSISTENTES EN TODOS LOS SLIDES:
  - Logo marca en esquina [superior/inferior] [izquierda/derecha]
  - Número de slide: [N/TOTAL] en esquina opuesta
  - Línea decorativa o elemento gráfico de marca
FORMATO: 1:1 para Instagram / 4:5 para feed optimizado / 1:1.91 para LinkedIn
```

---

## Ejemplo Real — Probolsas (Arquetipo: El Sabio)

**Input:** Guion "Por qué los empaques flexibles están sustituyendo las botellas" — plantilla Storytelling

**Output — Carrusel 7 slides:**

```
--- SLIDE 1 (HOOK) ---
TEXTO PRINCIPAL: "El 70% del costo de tu botella es aire"
TEXTO SECUNDARIO: "Lo que nadie te dice sobre el empaque que usas"
PROMPT GPT IMAGE 2: "Professional advertising slide, dark background, bold white typography '70%' in large numbers center, subtitle text below, Probolsas logo upper right, clean minimalist design, Instagram carousel format 1:1"

--- SLIDE 2 (PROBLEMA) ---
TEXTO PRINCIPAL: "Tu salsa es perfecta. Tu empaque... no tanto"
TEXTO SECUNDARIO: "Las botellas rígidas generan fugas, devoluciones y pérdida de ventas en góndola"
PROMPT GPT IMAGE 2: "Split comparison image, left side: broken rigid bottle with sauce spilled, dim lighting, red tone. Right side: intact flexible doypack, bright lighting, green tone. Professional photography, 1:1 format"

--- SLIDE 3 (AGITACIÓN) ---
TEXTO PRINCIPAL: "Cada devolución cuesta más de lo que crees"
TEXTO SECUNDARIO: "Reputación, logística, merma y pérdida de espacio en góndola"
PROMPT GPT IMAGE 2: "Infographic slide, dark background, 4 icons with text: box return icon 'Reputación', truck icon 'Logística', waste icon 'Merma', shelf icon 'Góndola'. Clean flat design, brand colors, 1:1 format"

--- SLIDE 4 (CONTEXTO) ---
TEXTO PRINCIPAL: "Los empaques flexibles ya dominan en Europa y EEUU"
TEXTO SECUNDARIO: "En Latinoamérica apenas empezamos. La ventaja es tuya si actúas ahora"
PROMPT GPT IMAGE 2: "World map infographic, flexible packaging icons placed on Europe and USA highlighted, Latin America with growth arrow, professional data visualization style, dark background, 1:1 format"

--- SLIDE 5 (SOLUCIÓN) ---
TEXTO PRINCIPAL: "Doypack flexible: menos costo, más impacto"
TEXTO SECUNDARIO: "70% menos material. Impresión de alta definición. Válvulas anti-fuga incluidas"
PROMPT GPT IMAGE 2: "Product hero shot of Torre del Oro flexible doypack on dark background, 3 benefit callouts with arrows: '70% menos material', 'Alta definición', 'Anti-fuga'. Clean commercial photography, 1:1 format"

--- SLIDE 6 (TRANSFORMACIÓN) ---
TEXTO PRINCIPAL: "Resultado: cero devoluciones, 40% menos costo logístico"
TEXTO SECUNDARIO: "Y una presentación que por fin compite en góndola"
PROMPT GPT IMAGE 2: "Before/after split. Left: old rigid bottle on shelf, faded colors. Right: new flexible doypack on shelf, vibrant, prominent. Stats overlay: '0 devoluciones' and '40% menos costo'. Professional photography, 1:1 format"

--- SLIDE 7 (CTA) ---
TEXTO PRINCIPAL: "¿Listo para dar el salto?"
TEXTO SECUNDARIO: "Cotiza tu empaque flexible hoy. Muestras disponibles"
PROMPT GPT IMAGE 2: "Clean CTA slide, brand colors background, Probolsas logo centered, WhatsApp icon with phone number, website URL, tagline 'Empaques que venden por ti'. Minimalist professional design, 1:1 format"
```

---

## Lo que NO hacer

- ❌ Dos ideas en un solo slide
- ❌ Más de 3 líneas de texto por slide
- ❌ Imágenes sin coherencia visual entre slides
- ❌ CTA en slide que no sea el último
- ❌ Hook genérico como "Hola, hoy te hablo de empaques"
- ❌ Carrusel sin número de slide visible — el usuario no sabe cuántos vienen
