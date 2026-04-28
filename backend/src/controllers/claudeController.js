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
  const { objetivo, canal, etapa_cliente, cantidad, marca_config } = req.body;

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
          text: `Actúa como estratega senior de contenido, especialista en marketing, ventas, storytelling y generación de demanda.
Tu tarea es generar temas de contenido para una empresa según su industria, producto, audiencia y objetivo comercial.`,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Genera temas organizados.

Datos de entrada:
- Tipo de empresa / Industria: ${marca_config?.industria || 'No especificada'}
- Producto o servicio: ${marca_config?.propuesta_valor || 'No especificado'}
- Público objetivo: ${marca_config?.buyer_persona ? `${marca_config.buyer_persona.nombre}, ${marca_config.buyer_persona.ocupacion}. Dolor: ${marca_config.buyer_persona.dolor_principal}` : 'No definido'}
- Objetivo del contenido: ${objetivo}
- Canal principal: ${canal}
- Tono de marca: ${marca_config?.tono_voz || 'Profesional'}
- Etapa del cliente: ${etapa_cliente || 'No especificada'}
- Cantidad de temas: ${cantidad || 10}

Genera temas organizados en estas categorías (si aplican a la cantidad solicitada):
1. Dolor del cliente
2. Deseo del cliente
3. Errores comunes
4. Mitos
5. Comparativas
6. Educación
7. Objeciones
8. Autoridad
9. Casos de uso
10. Conversión

Para cada tema entrega:
- Tema
- Hook sugerido
- Idea central
- Categoría
- Formato recomendado
- Canal recomendado
- CTA sugerido
- Nivel de intención comercial (baja, media o alta)
- Potencial viral (bajo, medio o alto)
- Nivel de dificultad para producir (bajo, medio o alto)

Reglas:
- No generes temas genéricos.
- Cada tema debe conectar con un dolor, deseo, objeción o meta real del público.
- Prioriza temas que puedan convertirse en guion, video, carrusel, email o anuncio.
- Usa lenguaje claro, directo y comercial en español latino.
- Si el canal es TikTok o Reels, prioriza hooks fuertes y retención.
- Si el canal es LinkedIn, prioriza autoridad, negocio y opinión.
- Si el canal es email, prioriza profundidad y conversión.
- Entrégalo formateado en Markdown claro, usando viñetas o tablas legibles. No incluyas intros ni saludos largos.`,
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
