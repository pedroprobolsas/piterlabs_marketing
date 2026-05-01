import { Router } from 'express';
import { generarMiniatura } from '../controllers/openaiController.js';

const router = Router();

router.post('/generar-miniatura', generarMiniatura);

export default router;
