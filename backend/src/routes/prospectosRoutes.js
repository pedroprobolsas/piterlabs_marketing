import { Router } from 'express';
import { getKanban, createProspecto, updateEtapa } from '../controllers/prospectosController.js';

const router = Router();

router.get('/kanban', getKanban);
router.post('/', createProspecto);
router.patch('/:id/etapa', updateEtapa);

export default router;
