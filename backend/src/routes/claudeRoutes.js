import { Router } from 'express';
import {
  analizarMarca,
  generarBuyerPersona,
  validarHook,
  generarGuion,
  adaptarFormatos,
  generarBrief,
  generarIdeas,
  chatEstratega,
  getFicha,
} from '../controllers/claudeController.js';

const router = Router();

router.post('/analizar-marca',   analizarMarca);
router.post('/buyer-persona',    generarBuyerPersona);
router.post('/validar-hook',     validarHook);
router.post('/generar-guion',    generarGuion);
router.post('/generar-ideas',    generarIdeas);
router.post('/adaptar-formatos', adaptarFormatos);
router.post('/generar-brief',    generarBrief);
router.post('/chat-estratega',   chatEstratega);
router.get('/fichas/:id',        getFicha);

export default router;
