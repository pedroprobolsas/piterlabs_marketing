const fs = require('fs');

let content = fs.readFileSync('backend/src/controllers/claudeController.js', 'utf8');

const regex = /const systemPrompt = `([\s\S]*?)`;/;

const newCode = `  let systemPrompt = '';
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
    systemPrompt = \`Eres un estratega senior B2B. Conversa con el usuario para armar una Ficha Estratégica. Haz una sola pregunta a la vez. No generes la ficha hasta tener todo claro. Contexto: {marca_nombre} ({marca_industria}). Propuesta: {marca_propuesta}. Al terminar, genera la ficha y escribe [FICHA_COMPLETADA] al final.\`;
  }

  // Interpolar variables
  systemPrompt = systemPrompt
    .replace('{marca_nombre}', marca_config?.nombre_marca || 'No definida')
    .replace('{marca_industria}', marca_config?.industria || 'No definida')
    .replace('{marca_propuesta}', marca_config?.propuesta_valor || 'No definida');`;

content = content.replace(regex, newCode);

fs.writeFileSync('backend/src/controllers/claudeController.js', content);
console.log('Replaced systemPrompt in claudeController.js');
