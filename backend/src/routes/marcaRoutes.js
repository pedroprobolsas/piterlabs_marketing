import { Router } from 'express';
import { getMarca, upsertMarca } from '../controllers/marcaController.js';

const router = Router();

router.get('/',  getMarca);
router.put('/',  upsertMarca);

export default router;
