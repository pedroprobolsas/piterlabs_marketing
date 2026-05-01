import OpenAI from 'openai';
import { getClaudeClient, CLAUDE_MODELS } from '../services/claudeClient.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ---------------------------------------------------------------
// POST /api/openai/generar-miniatura
// Genera dos miniaturas (16:9 y 9:16) usando Claude para el prompt y OpenAI (gpt-image-2) para la imagen
// Body: { guion, atributos_producto, marca_config }
// ---------------------------------------------------------------
export const generarMiniatura = async (req, res) => {
  const { guion, atributos_producto, marca_config } = req.body;

  if (!guion) {
    return res.status(400).json({ success: false, error: 'El guion es obligatorio' });
  }

  try {
    // 1. Llamar a Claude para crear el prompt visual maestro
    const claudeClient = getClaudeClient();
    
    const marcaCtx = `- Nombre: ${marca_config?.nombre_marca || 'No especificada'}
- Industria: ${marca_config?.industria || ''}
- Tono de voz: ${marca_config?.tono_voz || 'profesional'}
- Arquetipos: ${marca_config?.arquetipos?.length ? marca_config.arquetipos.join(', ') : 'No definidos'}`;

    const visionCtx = atributos_producto ? `
- Forma: ${atributos_producto.forma || 'N/A'}
- Material: ${atributos_producto.material || 'N/A'}
- Funcionalidad: ${atributos_producto.funcionalidad || 'N/A'}` : 'Sin producto específico detectado.';

    const systemPrompt = `Eres un Director de Arte y Experto en Miniaturas Virales de YouTube/TikTok. 
Tu tarea es leer el guion y el contexto de la marca para generar un PROMPT EXACTO en inglés para un modelo generador de imágenes de producto (gpt-image-2).
El prompt debe describir una composición visual hiper-impactante, realista y muy llamativa.
Debe incluir: composición, ángulos de cámara, iluminación, paleta de colores (basada en la marca), y detalles del producto.
IMPORTANTE: NO devuelvas ninguna explicación, saludos ni markdown. Devuelve SOLO el texto del prompt en inglés.`;

    const userPrompt = `Crea el prompt para la miniatura del siguiente video:

**GUION BASE:**
${guion}

**CONTEXTO DE MARCA:**
${marcaCtx}

**ATRIBUTOS DEL PRODUCTO:**
${visionCtx}

Escribe SOLO el prompt visual en inglés, max 100 palabras. Asegúrate de incluir instrucciones para texto grande y llamativo (Zero-Click style) si el guion lo sugiere.`;

    const claudeMessage = await claudeClient.messages.create({
      model: CLAUDE_MODELS.RAPIDO,
      max_tokens: 300,
      system: [{ type: 'text', text: systemPrompt }],
      messages: [{ role: 'user', content: userPrompt }]
    });

    const dallEPrompt = claudeMessage.content.find(b => b.type === 'text')?.text || '';

    if (!dallEPrompt) {
      throw new Error('Claude no pudo generar el prompt para la miniatura.');
    }

    // 2. Llamar a OpenAI en paralelo para los dos formatos (16:9 y 9:16)
    // Usando el modelo gpt-image-2 para fotografía publicitaria
    const [resWide, resVertical] = await Promise.all([
      openai.images.generate({
        model: "gpt-image-2",
        prompt: dallEPrompt + " (Wide shot, cinematic lighting)",
        size: "1792x1024",
        n: 1,
      }).catch(e => ({ error: e.message })),
      openai.images.generate({
        model: "gpt-image-2",
        prompt: dallEPrompt + " (Vertical shot, ideal for TikTok/Reels, cinematic lighting)",
        size: "1024x1792",
        n: 1,
      }).catch(e => ({ error: e.message }))
    ]);

    console.log('[OpenAIController] resWide:', JSON.stringify(resWide, null, 2));
    console.log('[OpenAIController] resVertical:', JSON.stringify(resVertical, null, 2));

    // Función auxiliar para extraer la URL de forma defensiva (diferentes estructuras)
    const extractUrl = (res) => {
      if (!res) return null;
      if (res.error) return null;
      if (res.data && Array.isArray(res.data) && res.data[0]) {
        return res.data[0].url || res.data[0].b64_json || res.data[0];
      }
      if (res.url) return res.url;
      // Intento de buscar cualquier string que parezca URL o base64
      const str = JSON.stringify(res);
      const urlMatch = str.match(/"(https?:\/\/[^"]+)"/);
      if (urlMatch) return urlMatch[1];
      return null;
    };

    const result = {
      prompt_usado: dallEPrompt,
      imagen_16_9: extractUrl(resWide),
      imagen_9_16: extractUrl(resVertical),
      errores: []
    };

    // Agregar mensaje de error si no se pudo extraer imagen pero tampoco hay res.error explícito
    if (!result.imagen_16_9 && !resWide.error) {
       result.errores.push(`Error 16:9: Respuesta desconocida o vacía del servidor.`);
    }
    if (!result.imagen_9_16 && !resVertical.error) {
       result.errores.push(`Error 9:16: Respuesta desconocida o vacía del servidor.`);
    }

    if (resWide.error) result.errores.push(`Error 16:9: ${resWide.error}`);
    if (resVertical.error) result.errores.push(`Error 9:16: ${resVertical.error}`);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[OpenAIController][generarMiniatura]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
