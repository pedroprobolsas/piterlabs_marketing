# PITERLABS MARKETING — MASTER BACKLOG

> Registro de funcionalidades aprobadas pendientes de sprint.
> Estado: PENDIENTE | EN SPRINT | ENTREGADO

---

## SPRINT 4 — EN PROGRESO

### B.3 — Producir Video · Generador de Brief de Producción
**Estado:** EN SPRINT — arquitectura redefinida 2026-04-27  
**Módulo:** `/camara` — Producir Video  
**Descripción:**  
El módulo /camara no es solo preview 9:16. Es un **Generador de Brief de Producción** que toma el guion del Bloque 2 + la foto del producto + el contexto de Mi Marca, y genera 5 skills de producción completas vía Claude API.

#### UI — Dos secciones

**Sección izquierda** *(ya construida en Sprint 4 inicial)*:
- Upload de foto del producto + preview 9:16 con Zero-Click Captions y Parallax VFX

**Sección derecha** *(pendiente de implementar)*:
- Panel "Brief de Producción" con botón **"Generar Brief"**
- Llama a `POST /api/claude/generar-brief` con: guion del Bloque 2 + contexto de Mi Marca + foto analizada con Claude Vision (si se subió imagen)
- Resultado: **5 tabs** — Foto Publicitaria / Carrusel / Video Cinematográfico / Stories / Narración
- Cada tab tiene el prompt completo + botón "Copiar"

---

#### Backend — `POST /api/claude/generar-brief`

**Recibe:**
```json
{
  "guion": "texto del guion generado en /pluma",
  "marca": { /* objeto config_marca completo */ },
  "imagen_base64": "data:image/jpeg;base64,..." // opcional
}
```

**Claude analiza:** Vision sobre la imagen (si existe) + contexto de marca + guion  
**Devuelve:**
```json
{
  "success": true,
  "data": {
    "foto_publicitaria": "...",
    "carrusel": "...",
    "video_cinematografico": "...",
    "stories": "...",
    "narracion": "..."
  }
}
```

---

#### Skill 1 — Foto Publicitaria (GPT Image 2)

Genera un prompt en inglés para GPT Image 2. Estructura obligatoria:
1. **Tipo de imagen** — fotografía de producto / lifestyle / hero shot / etc.
2. **Descripción del producto** — lo visible: forma, color, textura, tamaño relativo
3. **Estilo fotográfico** — minimalista editorial / documental / publicidad emocional / etc.
4. **Iluminación** — física de la luz: fuente, dirección, temperatura de color
5. **Composición** — regla de tercios, primer plano, encuadre, punto de fuga
6. **Texto de marca** — si aplica, tipografía sugerida
7. **CTA visual** — elemento que dirige la mirada

**Reglas de escritura del prompt:**
- Escena primero, sujeto segundo, detalles tercero, restricciones al final
- En inglés, directo, sin adjetivos vacíos (sin "stunning", "beautiful", "amazing")
- Basado en arquetipo + tono de voz + buyer persona de Mi Marca

---

#### Skill 2 — Carrusel Educativo (Instagram / LinkedIn)

Genera la estructura completa del carrusel. Parámetros:
- **Número de slides:** 5–8 según la longitud del guion
- **Slide 1:** Hook — extrae el hook más fuerte del guion
- **Slides 2 a N-1:** Un solo mensaje por slide, extraído del guion
- **Último slide:** CTA — acción concreta, alineada con el buyer persona
- Cada slide incluye: mensaje principal + instrucción visual + nota de diseño
- Paleta de marca + tipografía sugerida según arquetipo

---

#### Skill 3 — Video Cinematográfico (Seedance 2.0 / Kling AI)

Prompt estructurado en **7 bloques obligatorios**:

| Bloque | Nombre | Qué describe |
|---|---|---|
| 01 | SCENE SETTING | Dónde ocurre, materiales del entorno, hora del día, clima |
| 02 | SUBJECT DESCRIPTION | Solo lo visible: ropa, postura, rasgos físicos. Nunca estados internos |
| 03 | ACTION / BEHAVIOR | Intención + resultado visible. Nunca biomecánica (no "flexiona el codo") |
| 04 | SHOT LANGUAGE | Vocabulario cinematográfico real: tracking shot, dolly-in, crane, handheld, OTS |
| 05 | LIGHTING / ATMOSPHERE | Física de la luz: fuente, dirección, temperatura de color, tipo de sombras |
| 06 | STYLE / VISUAL TEXTURE | Paleta de color, grano de película, estética de referencia (ej: "Neon Genesis warm tones") |
| 07 | AUDIO / DIALOGUE | Opcional. Máx 25 palabras. Siempre separado de la acción |

**Reglas Seedance:**
- Intención, no biomecánica
- Solo lo visible — nunca "siente", "piensa", "recuerda"
- Máximo 3 personajes por corte
- **Output bilingüe EN + ZH** (inglés primero, chino mandarín segundo)

---

#### Skill 4 — Stories Secuenciales 9:16

3 prompts de imagen GPT Image 2 con coherencia visual entre ellos:

| Story | Rol | Objetivo |
|---|---|---|
| **Story 1 — Hook** | Para el scroll | Imagen de alto impacto visual que genera curiosidad inmediata |
| **Story 2 — Desarrollo** | El conflicto o transformación | Muestra el antes/durante de la transformación que ofrece la marca |
| **Story 3 — CTA** | Llamado a la acción | Imagen clara con texto o elemento visual que guía la acción |

**Reglas:**
- Cada prompt en inglés
- Formato vertical 9:16 especificado en cada prompt
- Paleta de colores consistente entre los 3 (mismos tonos, misma temperatura de color)

---

#### Skill 5 — Narración Viral (ElevenLabs / CapCut)

Script limpio de voz en off. **Sin corchetes, sin instrucciones técnicas, sin marcas de dirección.** Solo el texto que se habla.

**Reglas de redacción viral:**
- Frases cortas. Máximo 10 palabras por frase.
- Párrafos de 1–2 líneas separados por línea en blanco.
- Puntos suspensivos para pausas naturales.
- La primera frase es el gancho. Para el scroll en 2 segundos.
- Progresión emocional: **Curiosidad → Tensión → Revelación → Inspiración → CTA**

**3 estilos disponibles (el usuario elige):**

| Estilo | Voz | Características |
|---|---|---|
| **Documental Netflix** | Grave, pausado, autoridad | Oraciones completas, ritmo lento, frases de impacto al cierre |
| **Hook Viral TikTok** | Energía alta, arranque inmediato | Arranca con pregunta o dato chocante, ritmo rápido, CTA urgente |
| **Storytelling Emocional** | Conversacional, construye tensión | Primera persona, progresión emocional clara, cierre inspirador |

---

### B.2 — Crear Guion · Skills de Guion Personalizables
**Estado:** PENDIENTE APROBADO  
**Módulo:** `/pluma` — Crear Guion  
**Descripción:**  
Agregar sección "Estilo Cinematográfico" en la pantalla de Crear Guion con opciones de prompt avanzado que modifican el contexto enviado a Claude:

- **Tipo de cinematografía** (selector visual): Documental · Publicidad emocional · Estilo Netflix · Viral UGC
- **Ritmo de edición** (selector): Lento · Medio · Rápido
- **Referencias visuales** (campo libre): el usuario describe referencias (ej: "estilo Apple, cortes secos, música minimalista")

Estas opciones se inyectan en el prompt de `generar-guion`.

---

### B.4 — Viralizar · App Store de Agentes
**Estado:** PENDIENTE APROBADO  
**Módulo:** `/rayo` — Viralizar (actualmente "Próximamente")  
**Descripción:**  
Pantalla de gestión de agentes con tarjetas on/off. Cada agente procesa el guion generado en B.2:

| Agente | Función | Endpoint |
|---|---|---|
| **Agente de Humor** | Inyecta giros irónicos y remates al guion | `POST /api/claude/agente-humor` |
| **Agente SEO Social** | Hashtags + mejor hora de publicación + tendencias | `POST /api/claude/agente-seo` |
| **Agente de Repropósito** | Fragmenta el guion en 5 piezas de micro-contenido | `POST /api/claude/agente-reproposito` |

---

## BACKLOG GENERAL — SIN SPRINT ASIGNADO

- **KB de Marca** (carry-over Sprint 3): UI para subir PDFs/URLs, extracción de texto, almacenamiento en `kb_fuentes` JSONB, inyección en prompts Claude
- **Dashboard KPIs reales**: conectar las 4 métricas hardcodeadas con queries reales a BD
- **B.5 Publicar y Medir** (`/engranaje`): métricas y publicación
- **Email Marketing** (`/email`): módulo de campañas
- **SSL**: verificar emisión del certificado Let's Encrypt en VPS
