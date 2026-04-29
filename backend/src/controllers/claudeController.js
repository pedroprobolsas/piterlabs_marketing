import { getClaudeClient, CLAUDE_MODELS } from '../services/claudeClient.js';
import pool from '../db/pool.js';
import { jsonrepair } from 'jsonrepair';

// ---------------------------------------------------------------
// POST /api/claude/analizar-marca
// Genera propuesta de valor y recomendaciones de posicionamiento
// Body: { nombre_marca, industria, propuesta_valor, tono_voz, arquetipos }
// ---------------------------------------------------------------
export const analizarMarca = async (req, res) => {
  const { nombre_marca, industria, propuesta_valor, tono_voz, arquetipos } = req.body;

  if (!nombre_marca || !industria) {
    return res.status(400).json({ success: false, error: 'nombre_marca e industria son obligatorios' });
  }

  const client = getClaudeClient();

  try {
    const stream = client.messages.stream({
      model: CLAUDE_MODELS.PRINCIPAL,
      max_tokens: 1500,
      thinking: { type: 'adaptive' },
      system: [
        {
          type: 'text',
          text: `Eres un estratega de marketing experto en branding y posicionamiento de marca para empresas latinoamericanas.
Respondes siempre en español, con un tono profesional pero directo.
Tu análisis es práctico, accionable y orientado a resultados.`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Analiza esta marca y entrega un diagnóstico estratégico:

**Marca:** ${nombre_marca}
**Industria:** ${industria}
**Propuesta de valor actual:** ${propuesta_valor || 'No definida'}
**Tono de voz:** ${tono_voz || 'No definido'}
**Arquetipos seleccionados:** ${arquetipos?.length ? arquetipos.join(', ') : 'No definidos'}

Entrega:
1. **Diagnóstico de posicionamiento** (2-3 párrafos): qué tan clara y diferenciada es la propuesta de valor actual
2. **Fortalezas de marca** (3 puntos bullet)
3. **Oportunidades de mejora** (3 puntos bullet)
4. **Propuesta de valor refinada** (1 frase poderosa, máx 20 palabras)
5. **Mensajes clave** (3 mensajes para usar en contenido)

Formato: usa markdown con headers bold (**).`,
        },
      ],
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    stream.on('text', (text) => {
      res.write(`data: ${JSON.stringify({ type: 'text', text })}\n\n`);
    });

    stream.on('finalMessage', () => {
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    });

    stream.on('error', (err) => {
      console.error('[ClaudeController][analizarMarca]', err.message);
      res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
      res.end();
    });
  } catch (err) {
    console.error('[ClaudeController][analizarMarca]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ---------------------------------------------------------------
// POST /api/claude/buyer-persona
// Genera un buyer persona detallado basado en la configuración de marca
// Body: { nombre_marca, industria, propuesta_valor, tono_voz, arquetipos }
// ---------------------------------------------------------------
export const generarBuyerPersona = async (req, res) => {
  const { nombre_marca, industria, propuesta_valor, tono_voz, arquetipos } = req.body;

  if (!nombre_marca || !industria) {
    return res.status(400).json({ success: false, error: 'nombre_marca e industria son obligatorios' });
  }

  const client = getClaudeClient();

  try {
    const message = await client.messages.create({
      model: CLAUDE_MODELS.PRINCIPAL,
      max_tokens: 1200,
      thinking: { type: 'adaptive' },
      system: [
        {
          type: 'text',
          text: `Eres un experto en marketing y psicología del consumidor latinoamericano.
Creas buyer personas realistas, específicas y accionables para equipos de ventas y marketing.
Siempre respondes en español y en formato JSON válido.`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Genera un buyer persona detallado para esta marca:

**Marca:** ${nombre_marca}
**Industria:** ${industria}
**Propuesta de valor:** ${propuesta_valor || 'No definida'}
**Tono de voz:** ${tono_voz || 'No definido'}
**Arquetipos:** ${arquetipos?.length ? arquetipos.join(', ') : 'No definidos'}

Responde ÚNICAMENTE con un objeto JSON con esta estructura exacta (sin markdown, solo JSON):
{
  "nombre": "Nombre ficticio realista",
  "edad": 35,
  "ocupacion": "Cargo y empresa tipo",
  "ciudad": "Ciudad colombiana",
  "ingreso_mensual": "Rango en COP",
  "dolor_principal": "El problema más urgente que tiene",
  "aspiracion": "Lo que más desea lograr profesional o personalmente",
  "canal_favorito": "Dónde consume contenido: Instagram / LinkedIn / WhatsApp / etc.",
  "objecion_tipica": "La razón principal por la que duda antes de comprar",
  "frase_tipica": "Una frase en primera persona que diría este cliente",
  "como_llega": "Cómo encontraría esta marca típicamente"
}`,
        },
      ],
    });

    // Extraer el texto del mensaje (puede incluir thinking blocks)
    const textBlock = message.content.find(b => b.type === 'text');
    if (!textBlock) {
      return res.status(500).json({ success: false, error: 'No se recibió respuesta de texto' });
    }

    try {
      const persona = JSON.parse(textBlock.text.trim());
      res.json({ success: true, data: persona });
    } catch {
      // Si Claude no devolvió JSON puro, retornar el texto para debug
      res.json({ success: true, data: null, raw: textBlock.text });
    }
  } catch (err) {
    console.error('[ClaudeController][generarBuyerPersona]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ---------------------------------------------------------------
// POST /api/claude/validar-hook
// Valida y puntúa un hook de contenido en tiempo real
// Body: { hook, formato, tono_voz, industria }
// ---------------------------------------------------------------
export const validarHook = async (req, res) => {
  const { hook, formato = 'video_corto', tono_voz = 'cercano', industria = '' } = req.body;

  if (!hook || hook.trim().length < 5) {
    return res.status(400).json({ success: false, error: 'El hook es obligatorio (mín. 5 caracteres)' });
  }

  const client = getClaudeClient();

  try {
    const message = await client.messages.create({
      model: CLAUDE_MODELS.RAPIDO,
      max_tokens: 600,
      thinking: { type: 'adaptive' },
      system: [
        {
          type: 'text',
          text: `Eres un experto en copywriting y contenido digital para redes sociales latinoamericanas.
Evalúas hooks de contenido con criterios claros y sugerencias específicas. Respondes en JSON.`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Evalúa este hook de contenido:

**Hook:** "${hook}"
**Formato:** ${formato}
**Tono de marca:** ${tono_voz}
**Industria:** ${industria}

Responde ÚNICAMENTE con JSON (sin markdown):
{
  "puntuacion": 85,
  "nivel": "fuerte",
  "fortalezas": ["razón 1", "razón 2"],
  "debilidades": ["razón 1"],
  "variantes": ["Hook variante A mejorada", "Hook variante B diferente"],
  "consejo": "Una sugerencia concreta de máximo 2 oraciones"
}

Escala puntuación: 0-49 débil, 50-74 regular, 75-89 fuerte, 90-100 viral`,
        },
      ],
    });

    const textBlock = message.content.find(b => b.type === 'text');
    if (!textBlock) {
      return res.status(500).json({ success: false, error: 'Sin respuesta de texto' });
    }

    try {
      const evaluacion = JSON.parse(textBlock.text.trim());
      res.json({ success: true, data: evaluacion });
    } catch {
      res.json({ success: true, data: null, raw: textBlock.text });
    }
  } catch (err) {
    console.error('[ClaudeController][validarHook]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};


// ---------------------------------------------------------------
// POST /api/claude/generar-guion
// Genera un guion completo para un formato de contenido
// Body: { plantilla, tema, marca_config, buyer_persona, tipo_cinematografia, ritmo_edicion, referencias_visuales }
// ---------------------------------------------------------------
export const generarGuion = async (req, res) => {
  const { plantilla, tema, marca_config, buyer_persona, tipo_cinematografia, ritmo_edicion, referencias_visuales } = req.body;

  if (!plantilla || !tema) {
    return res.status(400).json({ success: false, error: 'plantilla y tema son obligatorios' });
  }

  const client = getClaudeClient();

  const plantillaDescripciones = {
    problema_solucion: 'Problema → Agitación → Solución (PAS): presenta el dolor, lo intensifica, luego ofrece la solución',
    antes_despues: 'Antes → Después → Puente: muestra el contraste entre el estado actual y el deseado',
    storytelling: 'Historia de transformación: narrativa emocional con personaje, conflicto y resolución',
  };

  try {
    const stream = client.messages.stream({
      model: CLAUDE_MODELS.PRINCIPAL,
      max_tokens: 4000,
      thinking: { type: 'adaptive' },
      system: [
        {
          type: 'text',
          text: `Eres un guionista experto en contenido de video corto y largo para marcas latinoamericanas.
Creas guiones estructurados, persuasivos y adaptados al tono de cada marca.
Siempre en español. Cada sección del guion tiene tiempo estimado y notas de dirección.`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Genera un guion de contenido completo:

**Tema:** ${tema}
**Plantilla:** ${plantillaDescripciones[plantilla] || plantilla}
**Marca:** ${marca_config?.nombre_marca || 'No especificada'} — ${marca_config?.industria || ''}
**Propuesta de valor:** ${marca_config?.propuesta_valor || ''}
**Tono de voz:** ${marca_config?.tono_voz || 'profesional'}
**Buyer persona:** ${buyer_persona ? `${buyer_persona.nombre}, ${buyer_persona.ocupacion}. Dolor: ${buyer_persona.dolor_principal}` : 'No definido'}

**Estilo Cinematográfico (Instrucciones Visuales):**
- Tipo de Cinematografía: ${tipo_cinematografia || 'Documental'}
- Ritmo de Edición: ${ritmo_edicion || 'Medio'}
- Referencias Visuales: ${referencias_visuales || 'No especificadas'}

Estructura el guion en secciones con:
- **[SECCIÓN]** — nombre de la sección
- ⏱ Tiempo estimado (ej: 0:00-0:05)
- 🎙 Texto en pantalla / narración
- 🎬 Notas de dirección (visual, música, transición)

Al final incluye:
- **Hook alternativo** (2 variantes)
- **CTA sugerido** para esta pieza`,
        },
      ],
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    stream.on('text', (text) => {
      res.write(`data: ${JSON.stringify({ type: 'text', text })}\n\n`);
    });

    stream.on('finalMessage', () => {
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    });

    stream.on('error', (err) => {
      console.error('[ClaudeController][generarGuion]', err.message);
      res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
      res.end();
    });
  } catch (err) {
    console.error('[ClaudeController][generarGuion]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ---------------------------------------------------------------
// POST /api/claude/adaptar-formatos
// Adapta un guion a múltiples formatos de contenido
// Body: { guion_base, formatos, marca_config }
// formatos: array de 'reels' | 'linkedin' | 'email' | 'blog'
// ---------------------------------------------------------------
export const adaptarFormatos = async (req, res) => {
  const { guion_base, formatos = ['reels', 'linkedin'], marca_config } = req.body;

  if (!guion_base || guion_base.length < 20) {
    return res.status(400).json({ success: false, error: 'guion_base es obligatorio (mín. 20 caracteres)' });
  }

  const client = getClaudeClient();

  const formatoDescripciones = {
    reels: 'Reel de Instagram/TikTok: máx 60 segundos, lenguaje visual, gancho en primeros 3 segundos, subtítulos incluidos',
    linkedin: 'Post de LinkedIn: 150-300 palabras, tono profesional, párrafos cortos, máx 3 hashtags relevantes',
    email: 'Email de marketing: asunto irresistible, 200-300 palabras, estructura clara, CTA directo',
    blog: 'Artículo de blog: 400-600 palabras, H2 y H3 con keywords, intro enganchadora, conclusión con CTA',
  };

  const formatosSeleccionados = formatos
    .filter(f => formatoDescripciones[f])
    .map(f => `**${f.toUpperCase()}**: ${formatoDescripciones[f]}`)
    .join('\n');

  try {
    const message = await client.messages.create({
      model: CLAUDE_MODELS.PRINCIPAL,
      max_tokens: 8000,
      thinking: { type: 'adaptive' },
      system: [
        {
          type: 'text',
          text: `Eres un experto en content repurposing y estrategia multicanal para marcas latinoamericanas.
Adaptas contenido manteniendo el mensaje central pero optimizando cada formato para su plataforma.
Siempre en español. Mantienes la voz y tono de la marca.`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Adapta este guion a múltiples formatos:

**GUION BASE:**
${guion_base}

**MARCA:** ${marca_config?.nombre_marca || 'No especificada'} | Tono: ${marca_config?.tono_voz || 'profesional'}

**FORMATOS A GENERAR:**
${formatosSeleccionados}

Para cada formato entrega el contenido completo, listo para usar.
Separa cada formato con una línea: ---`,
        },
      ],
    });

    const textBlock = message.content.find(b => b.type === 'text');
    if (!textBlock) {
      return res.status(500).json({ success: false, error: 'Sin respuesta de texto' });
    }

    // Parsear usando los H2 (## ) como delimitadores de sección.
    // Claude usa --- dentro de cada formato para separar bloques internos,
    // lo que rompe el split por ---. Los headers ## son únicos por formato.
    const result = {};
    const raw = textBlock.text;

    const formatoMarkers = {
      reels:    /reel|instagram|tiktok|vertical/i,
      linkedin: /linkedin/i,
      email:    /email|correo|asunto/i,
      blog:     /blog|artículo/i,
    };

    // Encontrar todas las posiciones de headers H2 en el texto
    const h2Regex = /^## .+$/gm;
    const h2Hits = [...raw.matchAll(h2Regex)].map(m => ({
      index: m.index,
      text:  m[0],
    }));

    formatos.forEach(formato => {
      const marker = formatoMarkers[formato];
      const hit = h2Hits.find(h => marker && marker.test(h.text));
      if (hit) {
        // Contenido: desde este H2 hasta el siguiente H2 de otro formato (o fin)
        const nextHit = h2Hits.find(h => h.index > hit.index && formatos.some(f => {
          const m = formatoMarkers[f];
          return f !== formato && m && m.test(h.text);
        }));
        const end = nextHit ? nextHit.index : raw.length;
        result[formato] = raw.slice(hit.index, end).trim();
      } else {
        result[formato] = '';
      }
    });

    res.json({ success: true, data: result, raw: textBlock.text });
  } catch (err) {
    console.error('[ClaudeController][adaptarFormatos]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ---------------------------------------------------------------
// POST /api/claude/generar-brief
// Genera briefs de producción a partir del guion + marca + imagen (opcional)
// Las instrucciones de cada skill se leen de marketing.skills (activas)
// Body: { guion, marca, imagen_base64?, estilo_cinematografico? }
// ---------------------------------------------------------------
export const generarBrief = async (req, res) => {
  const { guion, marca, imagen_base64, estilo_cinematografico = 'Publicidad Emocional' } = req.body;

  if (!guion || guion.trim().length < 20) {
    return res.status(400).json({ success: false, error: 'guion es obligatorio (mín. 20 caracteres)' });
  }

  // Leer skills activas desde BD
  let skills;
  try {
    const { rows } = await pool.query(
      "SELECT clave, nombre, instrucciones FROM marketing.skills WHERE activa = TRUE AND clave != 'estratega_interactivo' ORDER BY orden"
    );
    skills = rows;
  } catch (dbErr) {
    console.error('[ClaudeController][generarBrief] DB error:', dbErr.message);
    return res.status(500).json({ success: false, error: 'Error leyendo skills de la base de datos' });
  }

  if (skills.length === 0) {
    return res.status(400).json({ success: false, error: 'No hay skills activas. Activa al menos una en Ajustes → Skills.' });
  }

  const client = getClaudeClient();

  // Construir contenido del mensaje — imagen Vision si se proporcionó
  const userContent = [];

  if (imagen_base64) {
    const match = imagen_base64.match(/^data:([^;]+);base64,(.+)$/s);
    if (match) {
      userContent.push({
        type: 'image',
        source: { type: 'base64', media_type: match[1], data: match[2] },
      });
    }
  }

  const marcaCtx = `- Nombre: ${marca?.nombre_marca || 'No especificada'}
- Industria: ${marca?.industria || ''}
- Propuesta de valor: ${marca?.propuesta_valor || ''}
- Tono de voz: ${marca?.tono_voz || 'profesional'}
- Arquetipos: ${marca?.arquetipos?.length ? marca.arquetipos.join(', ') : 'No definidos'}
- Buyer persona: ${marca?.buyer_persona?.nombre
    ? `${marca.buyer_persona.nombre}, ${marca.buyer_persona.ocupacion}. Dolor: ${marca.buyer_persona.dolor_principal}`
    : 'No definido'}`;

  const imagenNota = imagen_base64
    ? '\n[IMAGEN ADJUNTA: analiza el producto visible — forma, colores, materiales, contexto de uso]\n'
    : '';

  // Construir instrucciones dinámicas desde las skills activas
  const clavesStr = skills.map(s => `"${s.clave}"`).join(', ');
  const skillsPrompt = skills
    .map((s, i) => `${i + 1}. "${s.clave}": ${s.instrucciones}`)
    .join('\n\n');

  userContent.push({
    type: 'text',
    text: `Analiza el siguiente guion y contexto de marca para generar ${skills.length} brief${skills.length > 1 ? 's' : ''} de producción.
${imagenNota}
**GUION:**
${guion}

**MARCA:**
${marcaCtx}

**ESTILO CINEMATOGRÁFICO SELECCIONADO:** ${estilo_cinematografico}

Genera un objeto JSON con exactamente ${skills.length} campo${skills.length > 1 ? 's' : ''}: ${clavesStr}. Sin markdown, sin texto adicional antes ni después del JSON:

${skillsPrompt}`,
  });

  // Construir instrucciones dinámicas de estructura para el System Prompt
  const jsonSchema = skills.map(s => {
    if (s.clave === 'narracion') {
      return `- ${s.clave}: objeto con 3 claves: netflix, tiktok, emocional (cada una string)`;
    }
    if (s.clave === 'guion_grafico') {
      return `- ${s.clave}: string (desglose completo de todas las escenas en un solo bloque de texto, separadas por saltos de línea)`;
    }
    if (s.clave === 'video_cinematografico') {
      return `- ${s.clave}: objeto con exactamente 3 claves: "consultoria" (string), "keyframes" (array de objetos, cada uno con campos: escena/visual/shot_language/elementos_clave/audio_vo, todos strings), "inventario" (objeto con campos: personajes/productos/lugares/objetos, todos strings)`;
    }
    return `- ${s.clave}: string`;
  }).join('\n');

  const maxRetries = 2;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const message = await client.messages.create({
        model: CLAUDE_MODELS.PRINCIPAL,
        max_tokens: 8000,
        system: [
          {
            type: 'text',
            text: `Eres un experto en producción de contenido para redes sociales.
REGLA ABSOLUTA: Responde ÚNICAMENTE con un objeto JSON válido.
Sin texto antes. Sin texto después. Sin markdown. Sin backticks. Sin explicaciones.
El JSON debe tener exactamente estas ${skills.length} claves:
${jsonSchema}
Dentro de los strings, nunca uses comillas dobles. Usa comillas simples si necesitas citar algo.`,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content: userContent }],
      });

      const textBlock = message.content.find(b => b.type === 'text');
      if (!textBlock) {
        if (attempt < maxRetries) { console.warn(`[generarBrief] Sin texto, reintento ${attempt}`); continue; }
        return res.status(500).json({ success: false, error: 'Sin respuesta de texto' });
      }

      // Extraer el bloque JSON — strip markdown fences si Claude las incluyó
      const raw = textBlock.text.trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '');

      console.log('[generarBrief] raw text (500):', raw.substring(0, 500));
      const jsonStart = raw.indexOf('{');
      const jsonEnd   = raw.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) {
        console.error('[ClaudeController][generarBrief] Sin objeto JSON — raw:', raw.substring(0, 1000));
        if (attempt < maxRetries) { console.warn(`[generarBrief] Reintento ${attempt}...`); continue; }
        return res.status(500).json({ success: false, error: 'Claude no devolvió un objeto JSON. Intenta de nuevo.' });
      }
      const jsonStr = raw.slice(jsonStart, jsonEnd + 1);

      console.log('[generarBrief] jsonStr (500):', jsonStr.substring(0, 500));
      try {
        const brief = JSON.parse(jsonrepair(jsonStr));
        return res.json({ success: true, data: brief });
      } catch (parseErr) {
        console.error('[ClaudeController][generarBrief] Parse error intento', attempt, ':', parseErr.message);
        if (attempt < maxRetries) continue;
        return res.status(500).json({ success: false, error: 'Claude devolvió JSON irrecuperable. Intenta de nuevo.' });
      }
    } catch (err) {
      console.error('[ClaudeController][generarBrief]', err.message);
      if (attempt < maxRetries) continue;
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};

// ---------------------------------------------------------------
// POST /api/claude/chat-estratega
// Chat interactivo con el Estratega de Contenido (SSE)
// Body: { messages, marca_config }
// ---------------------------------------------------------------
export const chatEstratega = async (req, res) => {
  const { messages, marca_config, ficha_id } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, error: 'messages es obligatorio y debe ser un array' });
  }

  let currentFichaId = ficha_id;
  try {
    if (!currentFichaId) {
      const brandId = marca_config?.id || null;
      const result = await pool.query(
        'INSERT INTO marketing.fichas_estrategicas (brand_profile_id, conversacion) VALUES ($1, $2) RETURNING id',
        [brandId, JSON.stringify(messages)]
      );
      currentFichaId = result.rows[0].id;
    }
  } catch (dbErr) {
    console.error('[ClaudeController][chatEstratega] DB Init Error:', dbErr.message);
  }

  const client = getClaudeClient();

    let systemPrompt = '';
  try {
    const skillRes = await pool.query("SELECT instrucciones FROM marketing.skills WHERE clave = 'estratega_interactivo' AND activa = TRUE");
    if (skillRes.rows.length > 0) {
      systemPrompt = skillRes.rows[0].instrucciones;
    }
  } catch (err) {
    console.error('[ClaudeController][chatEstratega] Error al obtener skill:', err.message);
  }

  // Fallback por si la migración no se ha corrido
  if (!systemPrompt) {
    systemPrompt = `Eres un estratega senior B2B. Conversa con el usuario para armar una Ficha Estratégica. Haz una sola pregunta a la vez. No generes la ficha hasta tener todo claro. Contexto: {marca_nombre} ({marca_industria}). Propuesta: {marca_propuesta}. Al terminar, genera la ficha y escribe [FICHA_COMPLETADA] al final.`;
  }

  // Interpolar variables
  systemPrompt = systemPrompt
    .replace('{marca_nombre}', marca_config?.nombre_marca || 'No definida')
    .replace('{marca_industria}', marca_config?.industria || 'No definida')
    .replace('{marca_propuesta}', marca_config?.propuesta_valor || 'No definida');

  try {
    const stream = client.messages.stream({
      model: CLAUDE_MODELS.PRINCIPAL,
      max_tokens: 4000,
      system: [{
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" }
      }],
      messages: messages,
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (currentFichaId) {
      res.write('data: ' + JSON.stringify({ type: 'meta', ficha_id: currentFichaId }) + '\n\n');
    }

    let fullResponse = '';

    stream.on('text', (text) => {
      fullResponse += text;
      res.write('data: ' + JSON.stringify({ type: 'text', text }) + '\n\n');
    });

    stream.on('finalMessage', async (msg) => {
      console.log('[ESTRATEGA-TOKENS]', JSON.stringify({
        input: msg.usage?.input_tokens || 0,
        output: msg.usage?.output_tokens || 0,
        cache_creation: msg.usage?.cache_creation_input_tokens || 0,
        cache_read: msg.usage?.cache_read_input_tokens || 0,
        ficha_id: currentFichaId
      }));
      res.write('data: ' + JSON.stringify({ type: 'done' }) + '\n\n');
      res.end();

      if (currentFichaId) {
        try {
          const updatedMessages = [...messages, { role: 'assistant', content: fullResponse }];
          const isCompletada = fullResponse.includes('[FICHA_COMPLETADA]');
          const estado = isCompletada ? 'completada' : 'en_progreso';
          await pool.query(
            'UPDATE marketing.fichas_estrategicas SET conversacion = $1, estado = $2 WHERE id = $3',
            [JSON.stringify(updatedMessages), estado, currentFichaId]
          );
        } catch (dbErr) {
          console.error('[ClaudeController][chatEstratega] DB Save Error:', dbErr.message);
        }
      }
    });

    stream.on('error', (err) => {
      console.error('[ClaudeController][chatEstratega]', err.message);
      res.write('data: ' + JSON.stringify({ type: 'error', error: err.message }) + '\n\n');
      res.end();
    });
  } catch (err) {
    console.error('[ClaudeController][chatEstratega] Init error', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ---------------------------------------------------------------
// GET /api/claude/fichas/:id
// Obtener una ficha estratégica
// ---------------------------------------------------------------
export const getFicha = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM marketing.fichas_estrategicas WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Ficha no encontrada' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('[ClaudeController][getFicha]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===============================================================
// AGENTES DE VIRALIZACIÓN
// ===============================================================

export const agenteHumor = async (req, res) => {
  const { guion, marca_config } = req.body;
  if (!guion) return res.status(400).json({ success: false, error: 'Guion es obligatorio' });
  const client = getClaudeClient();
  try {
    const message = await client.messages.create({
      model: CLAUDE_MODELS.RAPIDO,
      max_tokens: 1500,
      system: [{ type: 'text', text: 'Eres un guionista de comedia especializado en contenido B2B y marketing corporativo latinoamericano. Inyectas humor sutil, ironía y analogías graciosas sin perder el profesionalismo.', cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: `Reescribe este guion inyectando humor, ironía o analogías curiosas. Mantén la estructura y el mensaje central.\n\nMarca: ${marca_config?.nombre_marca || 'No definida'}\n\nGUION:\n${guion}` }]
    });
    const txt = message.content.find(b => b.type === 'text')?.text || '';
    res.json({ success: true, data: txt });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const agenteSeo = async (req, res) => {
  const { guion, marca_config } = req.body;
  if (!guion) return res.status(400).json({ success: false, error: 'Guion es obligatorio' });
  const client = getClaudeClient();
  try {
    const message = await client.messages.create({
      model: CLAUDE_MODELS.RAPIDO,
      max_tokens: 1000,
      system: [{ type: 'text', text: 'Eres un experto en SEO para redes sociales (TikTok, Instagram, LinkedIn).', cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: `Analiza este guion y genera: 1) 5 Hashtags principales, 2) 3 Hashtags nicho, 3) Mejor hora de publicación sugerida para B2B Latam, 4) Título gancho para el caption.\n\nMarca: ${marca_config?.nombre_marca || 'No definida'}\n\nGUION:\n${guion}` }]
    });
    const txt = message.content.find(b => b.type === 'text')?.text || '';
    res.json({ success: true, data: txt });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const agenteReproposito = async (req, res) => {
  const { guion, marca_config } = req.body;
  if (!guion) return res.status(400).json({ success: false, error: 'Guion es obligatorio' });
  const client = getClaudeClient();
  try {
    const message = await client.messages.create({
      model: CLAUDE_MODELS.PRINCIPAL,
      max_tokens: 3000,
      system: [{ type: 'text', text: 'Eres un experto en content repurposing. Tu misión es tomar un guion largo y fragmentarlo en 5 piezas de microcontenido altamente virales.', cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: `Toma este guion y divídelo en 5 piezas cortas (ej: 3 Tweets/Threads cortos, 1 frase citada para LinkedIn, 1 Short directo). Cada pieza debe sostenerse por sí sola.\n\nMarca: ${marca_config?.nombre_marca || 'No definida'}\n\nGUION:\n${guion}` }]
    });
    const txt = message.content.find(b => b.type === 'text')?.text || '';
    res.json({ success: true, data: txt });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
