const fs = require('fs');

let content = fs.readFileSync('backend/src/controllers/claudeController.js', 'utf8');

content = content.replace(/export const analizarMarca =[\s\S]*?model: CLAUDE_MODEL,/, (match) => {
  return match.replace('model: CLAUDE_MODEL,', 'model: CLAUDE_MODELS.PRINCIPAL,');
});

content = content.replace(/export const generarBuyerPersona =[\s\S]*?model: CLAUDE_MODEL,/, (match) => {
  return match.replace('model: CLAUDE_MODEL,', 'model: CLAUDE_MODELS.PRINCIPAL,');
});

content = content.replace(/export const validarHook =[\s\S]*?model: CLAUDE_MODEL,/, (match) => {
  return match.replace('model: CLAUDE_MODEL,', 'model: CLAUDE_MODELS.RAPIDO,');
});

content = content.replace(/export const generarIdeas =[\s\S]*?model: CLAUDE_MODEL,/, (match) => {
  return match.replace('model: CLAUDE_MODEL,', 'model: CLAUDE_MODELS.RAPIDO,'); // Short bullet points
});

content = content.replace(/export const generarGuion =[\s\S]*?model: CLAUDE_MODEL,/, (match) => {
  return match.replace('model: CLAUDE_MODEL,', 'model: CLAUDE_MODELS.PRINCIPAL,');
});

content = content.replace(/export const adaptarFormatos =[\s\S]*?model: CLAUDE_MODEL,/, (match) => {
  return match.replace('model: CLAUDE_MODEL,', 'model: CLAUDE_MODELS.PRINCIPAL,');
});

content = content.replace(/export const generarBrief =[\s\S]*?model: CLAUDE_MODEL,/, (match) => {
  return match.replace('model: CLAUDE_MODEL,', 'model: CLAUDE_MODELS.PRINCIPAL,');
});

content = content.replace(/export const chatEstratega =[\s\S]*?model: CLAUDE_MODEL,/, (match) => {
  return match.replace('model: CLAUDE_MODEL,', 'model: CLAUDE_MODELS.PRINCIPAL,');
});

// Also fix imports
content = content.replace(
  "import { getClaudeClient, CLAUDE_MODEL } from '../services/claudeClient.js';",
  "import { getClaudeClient, CLAUDE_MODELS } from '../services/claudeClient.js';"
);

fs.writeFileSync('backend/src/controllers/claudeController.js', content);
console.log('Replaced models in backend/src/controllers/claudeController.js');
