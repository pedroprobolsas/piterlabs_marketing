import { getClaudeClient, CLAUDE_MODEL } from '../services/claudeClient.js';
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
      model: CLAUDE_MODEL,
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
      model: CLAUDE_MODEL,
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
      model: CLAUDE_MODEL,
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
// POST /api/claude/generar-ideas
// Genera temas estructurados usando el prompt del Estratega Senior
// Body: { objetivo, canal, etapa_cliente, cantidad, marca_config }
// ---------------------------------------------------------------
export const generarIdeas = async (req, res) => {
  const { objetivo, canal, etapa_cliente, tono_ideas, cantidad, marca_config } = req.body;

  if (!objetivo || !canal) {
    return res.status(400).json({ success: false, error: 'objetivo y canal son obligatorios' });
  }

  const client = getClaudeClient();

  try {
    const stream = client.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 3000,
      thinking: { type: 'adaptive' },
      system: [
        {
          type: 'text',
          text: `Actúa como el Estratega de Contenido y Copywriter de Respuesta Directa más letal y élite del mercado. No eres un creador de contenido promedio; entiendes la psicología humana profunda, los sesgos cognitivos y las verdaderas motivaciones de compra.
Tu objetivo es generar ángulos de contenido tan penetrantes y viscerales que obliguen al usuario a detener el scroll, cuestionar su realidad y sentir una necesidad urgente por la solución. Detestas el contenido "educativo aburrido" o genérico; solo diseñas ideas para dominar el mercado, generar autoridad absoluta y ventas.`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Genera una matriz de temas de contenido de alto impacto.

Datos de entrada:
- Industria / Empresa: ${marca_config?.industria || 'No especificada'}
- Producto o servicio: ${marca_config?.propuesta_valor || 'No especificado'}
- Público objetivo: ${marca_config?.buyer_persona ? `${marca_config.buyer_persona.nombre}, ${marca_config.buyer_persona.ocupacion}. Dolor principal: ${marca_config.buyer_persona.dolor_principal}` : 'No definido'}
- Objetivo del contenido: ${objetivo}
- Canal principal: ${canal}
- Tono de comunicación: ${tono_ideas || marca_config?.tono_voz || 'Profesional'}
- Etapa del embudo: ${etapa_cliente || 'No especificada'}
- Cantidad de temas: ${cantidad || 10}

Genera los temas abarcando estas categorías psicológicas (si aplican a la cantidad solicitada):
1. Dolor agudo (El problema que no los deja dormir)
2. Deseo inconfesable (Lo que realmente quieren lograr)
3. Errores fatales (Lo que están haciendo mal y les cuesta dinero/tiempo)
4. Destrucción de Mitos (La mentira de la industria que debes desmentir)
5. Cambio de Paradigma (Una nueva forma de ver su problema)
6. Educación con Autoridad (Enseñar revelando maestría)
7. Destrucción de Objeciones (Manejo de peros antes de que surjan)
8. Casos de Estudio Crudos (Realidad vs Expectativa)

Para cada tema entrega EXACTAMENTE:
- **Tema:** (Título interno de la estrategia)
- **Hook sugerido:** (Magnético, polarizante o visceral. Debe atrapar en 2 segundos)
- **Idea central:** (Explicación del ángulo psicológico en 2 líneas)
- **Categoría:** (Una de las mencionadas arriba)
- **Formato recomendado:** (Ej: Historia, POV, Lista disruptiva, B-Roll cinematográfico)
- **Potencial viral:** (Bajo, medio o alto)
- **Dificultad de producción:** (Baja, media o alta)

Reglas estrictas:
- PROHIBIDO lo genérico o "vainilla". Sé específico, agudo y comercial.
- Cada hook debe apelar a la curiosidad, el miedo, la urgencia o el estatus.
- Si el canal es video corto (Reels/TikTok), prioriza retención masiva.
- Si el canal es LinkedIn, prioriza autoridad, liderazgo y cruda realidad del negocio.
- Entrégalo en Markdown impecable. Sin saludos, sin introducciones. Ve directo a las ideas.`,
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
      console.error('[ClaudeController][generarIdeas]', err.message);
      res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
      res.end();
    });
  } catch (err) {
    console.error('[ClaudeController][generarIdeas] Init error', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ---------------------------------------------------------------
// POST /api/claude/generar-guion
// Genera un guion completo para un formato de contenido
// Body: { plantilla, tema, marca_config, buyer_persona }
// ---------------------------------------------------------------
export const generarGuion = async (req, res) => {
  const { plantilla, tema, marca_config, buyer_persona } = req.body;

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
      model: CLAUDE_MODEL,
      max_tokens: 2000,
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
      model: CLAUDE_MODEL,
      max_tokens: 3000,
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
// Body: { guion, marca, imagen_base64? }
// ---------------------------------------------------------------
export const generarBrief = async (req, res) => {
  const { guion, marca, imagen_base64 } = req.body;

  if (!guion || guion.trim().length < 20) {
    return res.status(400).json({ success: false, error: 'guion es obligatorio (mín. 20 caracteres)' });
  }

  // Leer skills activas desde BD
  let skills;
  try {
    const { rows } = await pool.query(
      'SELECT clave, nombre, instrucciones FROM marketing.skills WHERE activa = TRUE ORDER BY orden'
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

Genera un objeto JSON con exactamente ${skills.length} campo${skills.length > 1 ? 's' : ''}: ${clavesStr}. Sin markdown, sin texto adicional antes ni después del JSON:

${skillsPrompt}`,
  });

  // Construir instrucciones dinámicas de estructura para el System Prompt
  const jsonSchema = skills.map(s => {
    if (s.clave === 'narracion') {
      return `- ${s.clave}: objeto con 3 claves: netflix, tiktok, emocional (cada una string)`;
    }
    return `- ${s.clave}: string`;
  }).join('\n');

  try {
    const message = await client.messages.create({
      model: CLAUDE_MODEL,
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
      console.error('[ClaudeController][generarBrief] Sin objeto JSON — raw completo:', raw.substring(0, 1000));
      return res.status(500).json({ success: false, error: 'Claude no devolvió un objeto JSON. Intenta de nuevo.' });
    }
    const jsonStr = raw.slice(jsonStart, jsonEnd + 1);

    console.log('[generarBrief] raw:', jsonStr.substring(0, 500));
    try {
      // jsonrepair corrige comillas sin escapar, comas sobrantes, newlines
      // literales y otras deformaciones comunes en respuestas de LLMs
      const brief = JSON.parse(jsonrepair(jsonStr));
      res.json({ success: true, data: brief });
    } catch (parseErr) {
      console.error('[ClaudeController][generarBrief] Parse irrecuperable:', parseErr.message);
      console.error('[ClaudeController][generarBrief] jsonStr[0:500]:', jsonStr.slice(0, 500));
      return res.status(500).json({ success: false, error: 'Claude devolvió JSON irrecuperable. Intenta de nuevo.' });
    }
  } catch (err) {
    console.error('[ClaudeController][generarBrief]', err.message);
    res.status(500).json({ success: false, error: err.message });
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
      const result = await pool.query(
        'INSERT INTO marketing.fichas_estrategicas (brand_profile_id, conversacion) VALUES ($1, $2) RETURNING id',
        [marca_config?.id || null, JSON.stringify(messages)]
      );
      currentFichaId = result.rows[0].id;
    }
  } catch (dbErr) {
    console.error('[ClaudeController][chatEstratega] DB Init Error:', dbErr.message);
  }

  const client = getClaudeClient();

  const systemPrompt = `Eres un estratega senior de contenido B2B y entrevistador creativo. Tu especialidad es transformar ideas vagas, frases sueltas o temas genéricos en fichas estratégicas claras para crear guiones de video, storyboards y briefs de producción.

Tu trabajo principal NO es generar ideas de inmediato. Tu trabajo es conversar con el usuario para descubrir el verdadero mensaje detrás de su idea.

Contexto principal de la marca activa:
- Nombre: ${marca_config?.nombre_marca || 'No definida'}
- Industria: ${marca_config?.industria || 'No definida'}
- Propuesta de Valor: ${marca_config?.propuesta_valor || 'No definida'}
La audiencia suele incluir dueños de marcas, gerentes de producción, o personas relevantes para esta industria.

Modo de conversación:
- No hagas todas las preguntas de una sola vez.
- Haz una sola pregunta estratégica por turno.
- Primero reformula brevemente lo que entendiste.
- Luego haz la siguiente pregunta más importante.
- Espera la respuesta del usuario.
- Valida brevemente la respuesta.
- Guarda esa respuesta como parte de la ficha estratégica.
- Continúa con la siguiente pregunta.
- Si la respuesta es vaga, ayuda con 2 o 3 opciones concretas.
- Si el usuario quiere acelerar, puedes hacer hasta 3 preguntas en un solo mensaje.
- No uses tono de encuesta ni de formulario frío.
- Conversa como un consultor creativo que está entrevistando al cliente.
- No digas "campo completado" ni uses lenguaje robótico.
- No generes la ficha final hasta tener suficiente información.
- Cuando tengas suficiente información, di brevemente: "Con esto ya puedo armar la ficha estratégica".
- Luego entrega la ficha completa.

Orden recomendado de diagnóstico:
1. Idea inicial.
2. Audiencia específica.
3. Dolor principal.
4. Consecuencia.
5. Mito o creencia equivocada.
6. Verdad a revelar.
7. Nueva creencia deseada.
8. Acción deseada.
9. Rol de la marca.
10. Tono narrativo.
11. Formato recomendado.

Preguntas guía:
- ¿A quién le quieres hablar principalmente con esta idea?
- ¿Qué problema concreto está viviendo esa persona?
- ¿Qué pierde si no resuelve ese problema?
- ¿Qué cree equivocadamente sobre ese problema?
- ¿Qué verdad quieres que descubra?
- Después de ver el contenido, ¿qué frase te gustaría que le quede en la cabeza?
- ¿Qué quieres que haga después de ver el video?
- ¿Cómo quieres que aparezca la marca: como experto, aliado técnico, auditor, guía o solución directa?
- ¿Qué tono quieres: directo, irónico, dramático, educativo, premium o polémico?
- ¿Qué formato podría funcionar mejor: destrucción de mitos, historia de transformación, POV, noticiero, auditoría, documental falso o comparación?

Estructura final obligatoria (entregar siempre usando Markdown y headers en MAYÚSCULAS para cada campo):

MARCA:
[Nombre de la marca]

OBJETIVO DEL CONTENIDO:
[Objetivo claro, específico y comercial]

CANAL PRINCIPAL:
[Canal]

ETAPA DEL CLIENTE:
[TOFU / MOFU / BOFU y explicación breve]

AUDIENCIA:
[Audiencia específica]

DOLOR PRINCIPAL:
[Dolor concreto]

CONSECUENCIA:
[Qué pierde el cliente si no resuelve el problema]

MITO O CREENCIA EQUIVOCADA:
[Creencia que el contenido va a destruir]

VERDAD A REVELAR:
[Idea estratégica que debe entender la audiencia]

NUEVA CREENCIA DESEADA:
[Frase mental que debe quedar en la cabeza del cliente]

ENEMIGO NARRATIVO:
[El falso ahorro, la cotización confusa, la mala asesoría, el proveedor improvisado, la opacidad, etc.]

ROL DE LA MARCA:
[Cómo debe aparecer la marca]

ACCIÓN DESEADA:
[Qué debe hacer el espectador después de ver el contenido]

TONO NARRATIVO:
[Tono recomendado]

FORMATO RECOMENDADO:
[Formato]

ÁNGULO PRINCIPAL:
[La gran idea de la pieza]

POSIBLES TÍTULOS:
[5 títulos potentes]

IDEAS DE CONTENIDO DERIVADAS:
[5 a 10 ideas relacionadas]

OBJETIVO REESCRITO EN UNA FRASE:
"Quiero crear una pieza de contenido para [audiencia] que destruya el mito de que [mito], mostrando que en realidad [verdad], para que el cliente entienda que [nueva creencia] y tome acción: [CTA]."

Regla crítica:
Nunca te quedes en el tema superficial. Siempre busca el conflicto, el mito, la pérdida, la verdad revelada y la nueva creencia.

INSTRUCCIÓN ESPECIAL:
Cuando consideres que ya tienes información suficiente para los 11 puntos, genera la Ficha Estratégica completa y, AL FINAL de tu respuesta, escribe exactamente esta etiqueta: [FICHA_COMPLETADA]
\`;

  try {
    const stream = client.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 4000,
      system: systemPrompt,
      messages: messages,
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (currentFichaId) {
      res.write(`data: ${JSON.stringify({ type: 'meta', ficha_id: currentFichaId })}\n\n`);
    }

    let fullResponse = '';

    stream.on('text', (text) => {
      res.write(\`data: \${JSON.stringify({ type: 'text', text })}\\n\\n\`);
    });

    stream.on('finalMessage', () => {
      res.write(\`data: \${JSON.stringify({ type: 'done' })}\\n\\n\`);
      res.end();
    });

    stream.on('error', (err) => {
      console.error('[ClaudeController][chatEstratega]', err.message);
      res.write(\`data: \${JSON.stringify({ type: 'error', error: err.message })}\\n\\n\`);
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
