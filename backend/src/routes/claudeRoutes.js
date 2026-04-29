import { Router } from 'express';
import {
  analizarMarca,
  generarBuyerPersona,
  validarHook,
  generarGuion,
  adaptarFormatos,
  generarBrief,
  chatEstratega,
  analizarProducto,
  getFicha,
  agenteHumor,
  agenteSeo,
  agenteReproposito,
} from '../controllers/claudeController.js';

const router = Router();

router.post('/analizar-marca',     analizarMarca);
router.post('/buyer-persona',      generarBuyerPersona);
router.post('/validar-hook',       validarHook);
router.post('/generar-guion',      generarGuion);
router.post('/adaptar-formatos',   adaptarFormatos);
router.post('/generar-brief',      generarBrief);
router.post('/chat-estratega',     chatEstratega);
router.post('/analizar-producto',  analizarProducto);
router.get('/fichas/:id',          getFicha);

// Agents
router.post('/agente-humor',       agenteHumor);
router.post('/agente-seo',         agenteSeo);
router.post('/agente-reproposito', agenteReproposito);

export default router;
