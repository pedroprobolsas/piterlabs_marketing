# SKILL: Video Cinematográfico — Seedance 2.0 / Kling

## Propósito
Generar prompts de 7 bloques para producir video cinematográfico con IA a partir del guion del Bloque 2. Output bilingüe EN + ZH. El usuario pega el prompt directamente en Seedance 2.0 (via Artlist) o Kling.

---

## Principio Fundamental

**Seedance 2.0 interpreta prompts como instrucciones de dirección cinematográfica.**
Sin estructura → Seedance adivina.
Con estructura → tú diriges.

---

## Los 7 Bloques Obligatorios

### 01 — SCENE SETTING
**Qué hace:** Define DÓNDE ocurre la acción. Seedance necesita el espacio para renderizar coherencia espacial y luz.

**Fórmula:** Interior/exterior + materiales + hora del día = escena anclada

**✅ Correcto:**
> "Planta de producción industrial, Cúcuta Colombia. Maquinaria de laminación en acero inoxidable, cintas transportadoras, iluminación fluorescente industrial mezclada con luz natural de ventanales laterales. Tarde, hora dorada filtrando desde el oeste."

**❌ Evitar:**
> "Un lugar de trabajo bonito"

---

### 02 — SUBJECT DESCRIPTION
**Qué hace:** Describe lo que SE VE. Nunca conceptos abstractos ni emociones. Usa roles funcionales.

**Regla:** Nunca "es triste" → siempre "hombros caídos, mirada al suelo"

**✅ Correcto:**
> "Figura en overol azul de trabajo, casco blanco, guantes de seguridad. Postura erguida, manos revisando un rollo de empaque flexible. Rasgos de concentración, mandíbula firme."

**❌ Evitar:**
> "Un gerente de producción preocupado y profesional"

---

### 03 — ACTION / BEHAVIOR
**Qué hace:** Escribe la intención del movimiento + resultado visible. NUNCA biomecánica ni ángulos articulares.

**Regla:** Fuerza + dirección. Intención + resultado.

**✅ Correcto:**
> "Examina la superficie del empaque con las yemas de los dedos, lo levanta contra la luz para verificar la transparencia, asiente levemente con la cabeza."

**❌ Evitar:**
> "Flexiona el codo izquierdo a 90 grados para sostener el empaque mientras gira la muñeca derecha 45 grados"

---

### 04 — SHOT LANGUAGE
**Qué hace:** Define el tipo de plano y movimiento de cámara. Esto define la emoción del video.

**Vocabulario cinematográfico disponible:**

| Tipo | Opciones |
|------|----------|
| Ángulos | low-angle, high-angle, dutch angle, eye-level, OTS (over-the-shoulder) |
| Focal | wide 14-24mm, standard 35-50mm, telephoto 85-135mm |
| Movimiento | tracking shot, dolly-in, dolly-out, crane shot, orbit, handheld, steadicam |
| Tiempo | slow-motion (120fps), speed ramp, freeze frame |
| Cortes | smash cut, match cut, hard cut, soft fade |

**✅ Correcto:**
> "Dolly-in desde plano general hasta close-up del empaque. Cámara a nivel de producto, ángulo ligeramente bajo para dar monumentalidad al objeto. Movimiento suave, steadicam."

**❌ Evitar:**
> "Una toma bonita con movimiento de cámara interesante"

---

### 05 — LIGHTING / ATMOSPHERE
**Qué hace:** Describe la FÍSICA de la luz. Seedance solo renderiza lo que se puede ver.

**Fórmula:** Fuente de luz + dirección + color + lo que revela/oculta

**✅ Correcto:**
> "Luz principal desde ventanal lateral izquierdo, temperatura cálida 3200K, crea gradiente de luz a sombra en el empaque. Luz de relleno suave desde derecha para eliminar sombras duras. El logo del producto queda en el área más iluminada."

**❌ Evitar:**
> "Ambiente profesional y cálido con buena iluminación"

---

### 06 — STYLE / VISUAL TEXTURE
**Qué hace:** Define paleta, grano y estética de referencia. NUNCA dejes que Seedance decida.

**Opciones de estilo:**

| Estilo | Descripción | Uso |
|--------|-------------|-----|
| Clean commercial | Colores saturados, sin grano, look publicitario | Ads de producto |
| Gritty documentary | Grano 16mm, contraste alto, handheld | Testimoniales |
| Premium editorial | Anamórfico, tones desaturados, slow-mo | Marca de lujo |
| Social UGC | Formato celular, colores vivos, sin stabilización | TikTok/Reels |
| Corporate professional | Clean steadicam, colores corporativos, formal | LinkedIn/B2B |

**✅ Correcto:**
> "Clean commercial look. Colores saturados y vibrantes, paleta cálida (rojos y dorados del empaque Torre del Oro). Sin grano, alta definición. Estética de publicidad de alimentos premium latinoamericana."

---

### 07 — AUDIO / DIALOGUE (Opcional)
**Qué hace:** Si hay diálogo o audio específico va aquí — siempre SEPARADO de la descripción de acción.

**Reglas:**
- Máximo 25-30 palabras habladas por cada 15 segundos de video
- El diálogo nunca va dentro de la descripción de acción
- Nunca traducir entre EN y ZH — cada versión se escribe nativa

**✅ Correcto:**
> Audio: "El empaque que protege tu salsa... y vende por ti." [voz en off, tono educativo, pausa después de 'salsa']

**❌ Evitar:**
> Mezclar el diálogo dentro de la descripción del movimiento de la cámara

---

## Reglas Críticas del Motor Seedance 2.0

| Regla | Descripción |
|-------|-------------|
| Intención, no biomecánica | Acción como intención + resultado. Nunca ángulos articulares |
| Solo lo visible | Nunca olores, pensamientos o emociones abstractas. Solo cámara |
| Máx 3 personajes por corte | Nombra al par activo en cada toma |
| Contraste doble en cortes | Cambia tamaño de plano Y tipo de cámara entre cortes |
| Evita reflejos | Seedance falla con espejos, charcos y metales reflectivos |
| Salida de cuadro = corte | Un personaje no puede reentrar en el mismo plano |
| Output bilingüe | EN + ZH. El chino es reescritura nativa, no traducción literal |

---

## Output Bilingüe — Formato

```
[EN VERSION]
[Prompt completo en inglés]

[ZH VERSION — 中文版本]
[Reescritura nativa en chino de un director cinematográfico chino — NO traducción literal]
```

---

## Ejemplo Real — Probolsas

**Input:** Escena del guion — "Andrés descubre los empaques flexibles de Probolsas"

**Output:**

```
[EN VERSION]

01 SCENE SETTING:
Industrial food packaging facility, Cúcuta Colombia. Stainless steel lamination machinery, conveyor belts moving flexible pouches, industrial fluorescent lighting mixed with warm afternoon light from large western windows. Late afternoon, golden hour filtering through.

02 SUBJECT DESCRIPTION:
Figure in blue work overalls, white safety helmet, protective gloves. Upright posture, hands carefully examining a flexible doypack pouch. Expression of focused concentration, slight forward lean, jaw set.

03 ACTION / BEHAVIOR:
Examines the pouch surface with fingertips, lifts it against the light source to check transparency and seal quality, gives a slow approving nod as he turns it in his hands.

04 SHOT LANGUAGE:
Dolly-in from medium full shot to close-up on the pouch and hands. Low angle, 35mm lens. Slow, steady movement — no handheld shake. Final frame: extreme close-up on the Torre del Oro branding on the pouch, in sharp focus.

05 LIGHTING / ATMOSPHERE:
Main light from left window, warm 3200K temperature, creates light-to-shadow gradient across the pouch. Soft fill light from right eliminates harsh shadows. The product logo lands in the brightest zone of the frame.

06 STYLE / VISUAL TEXTURE:
Clean commercial look. Saturated, vibrant colors — reds and golds of the Torre del Oro packaging pop against the industrial background. No grain, high definition. Premium Latin American food advertising aesthetic.

07 AUDIO:
Voice over (warm, educational tone, slight pause mid-sentence): "El empaque... que protege tu salsa y vende por ti."


[ZH VERSION — 中文版本]

01 场景设定：
哥伦比亚库库塔市工业食品包装厂。不锈钢压层机械，传送带运送柔性包装袋，工业荧光灯与西面大窗透入的午后暖光交织。黄金时刻，光线斜射而入。

02 主体描述：
身着蓝色工装，佩戴白色安全帽和防护手套的工人。站姿挺拔，双手仔细检查一个柔性自立袋。神情专注，身体微微前倾，下颌收紧。

03 动作行为：
用指尖检查袋子表面，举起对着光源检查透明度和封口质量，慢慢点头认可，同时在手中转动包装袋。

04 镜头语言：
从中全景推进至包装袋和双手的特写。低角度，35mm镜头。缓慢稳定移动，无手持抖动。最终画面：Torre del Oro品牌标识的极端特写，清晰对焦。

05 光线氛围：
主光来自左侧窗户，色温3200K暖调，在包装袋上形成明暗渐变。右侧柔和补光消除硬阴影。产品标识落在画面最亮区域。

06 风格质感：
干净商业风格。饱和鲜艳的色彩——Torre del Oro包装的红色和金色在工业背景下突出显现。无颗粒感，高清晰度。拉丁美洲高端食品广告美学。

07 音频：
画外音（温暖教育语气，句中略作停顿）："保护您产品的包装……同时为您销售。"
```

---

## Lo que NO hacer

- ❌ Describir emociones abstractas → ✅ describir expresiones físicas visibles
- ❌ Más de 3 personajes en el mismo plano
- ❌ Escenas con espejos, charcos o superficies metálicas muy reflectivas
- ❌ Diálogo mezclado con la descripción de acción
- ❌ Más de 30 palabras de diálogo por cada 15 segundos
- ❌ Traducir literalmente al chino — la versión ZH debe ser reescritura nativa
