import Anthropic from '@anthropic-ai/sdk';

// Modelos por tarea — granularidad costo/calidad
export const CLAUDE_MODELS = {
  // Tareas creativas y conversacionales (default)
  PRINCIPAL: 'claude-sonnet-4-6',

  // Tareas livianas: validaciones, hashtags, reformulaciones
  RAPIDO: 'claude-haiku-4-5-20251001',
};

// Backwards compat: alias del default
export const CLAUDE_MODEL = CLAUDE_MODELS.PRINCIPAL;

let claudeClient;
export const getClaudeClient = () => {
  if (!claudeClient) {
    claudeClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return claudeClient;
};
