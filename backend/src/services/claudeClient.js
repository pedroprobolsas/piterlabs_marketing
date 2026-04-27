import Anthropic from '@anthropic-ai/sdk';

// Singleton — un solo cliente por proceso
let _client = null;

export function getClaudeClient() {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

export const CLAUDE_MODEL = 'claude-opus-4-7';
