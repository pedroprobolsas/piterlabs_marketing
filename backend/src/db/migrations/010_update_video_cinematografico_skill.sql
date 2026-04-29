-- Migration 010 — Upgrade Skill "Video Cinematográfico" a Storyboard Técnico Premium
-- La skill ahora devuelve un objeto JSON estructurado con 3 secciones:
-- consultoria, keyframes (array 5–9), inventario

UPDATE marketing.skills
SET
  nombre        = 'Video Cinematográfico (Storyboard)',
  descripcion   = 'Storyboard técnico premium con Consultoría de Segmentación, tabla de Keyframes Seedance 2.0 y Inventario de Activos de Producción.',
  label_tab     = '🎬 Storyboard',
  titulo_panel  = 'Storyboard Técnico de Producción',
  instrucciones = $$Genera un objeto JSON con EXACTAMENTE 3 claves: "consultoria", "keyframes", "inventario".

CLAVE 1 — "consultoria" (string):
Analiza el ritmo narrativo del guion. Responde: ¿Cómo segmentar los cortes para maximizar retención en los primeros 3 segundos (Hook) y mantener la tensión hasta el CTA? Escribe un consejo de dirección de arte en 2-3 párrafos cortos. Incorpora el estilo cinematográfico indicado como guía de tono visual.

CLAVE 2 — "keyframes" (array de objetos):
Determina cuántos keyframes necesita el video:
- Guion corto (< 300 palabras): 5 keyframes de alta calidad.
- Guion medio (300–600 palabras): 7 keyframes.
- Guion largo (> 600 palabras): 9 keyframes para cubrir toda la curva narrativa.
Cada keyframe es un objeto con EXACTAMENTE estos 5 campos:
- "escena": número y nombre del momento narrativo (ej: "01 — Hook")
- "visual": prompt Seedance 2.0 bilingüe EN+ZH con 7 bloques obligatorios: [01 SCENE SETTING] [02 SUBJECT DESCRIPTION] [03 ACTION/BEHAVIOR] [04 SHOT LANGUAGE] [05 LIGHTING/ATMOSPHERE] [06 STYLE/VISUAL TEXTURE] [07 AUDIO/DIALOGUE]. Reglas: solo lo visible, intención no biomecánica, máx 3 personajes por corte.
- "shot_language": tipo de plano y movimiento de cámara en términos cinematográficos reales (ej: "Dolly-in lento + Close-up detalle")
- "elementos_clave": props, FX y elementos visuales que NO pueden faltar en esa escena
- "audio_vo": texto limpio de voz en off para esa escena. Frases máx 10 palabras. Sin corchetes. Sin marcas técnicas. Solo el texto que se habla.

CLAVE 3 — "inventario" (objeto con EXACTAMENTE 4 campos string):
- "personajes": perfil visual, vestimenta exacta y "vibe" de los personajes (ej: "Emprendedor High-Status, 35–45 años, traje oscuro slim fit, reloj de lujo discreto, mirada de autoridad serena")
- "productos": ángulos de cámara recomendados, tipo de iluminación e instrucciones para reflejos y texturas del producto en cámara
- "lugares": escenografía y locaciones con detalle de atmósfera (ej: "Oficina minimalista con vista panorámica, iluminación Golden Hour lateral, paleta blanco-gris-negro con acento dorado")
- "objetos": lista de props físicos específicos para reforzar el estatus de la marca (máx 8 ítems)

ESTÉTICA OBLIGATORIA: Elegancia, sofisticación y alto estatus. Alineado con el arquetipo, tono de voz y buyer persona de la marca.$$ ,
  updated_at    = NOW()
WHERE clave = 'video_cinematografico';
