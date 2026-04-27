import { Router } from 'express';
import {
  analizarMarca,
  generarBuyerPersona,
  validarHook,
  generarGuion,
  adaptarFormatos,
} from '../controllers/claudeController.js';

const router = Router();

router.post('/analizar-marca',   analizarMarca);
router.post('/buyer-persona',    generarBuyerPersona);
router.post('/validar-hook',     validarHook);
router.post('/generar-guion',    generarGuion);
router.post('/adaptar-formatos', adaptarFormatos);

export default router;
