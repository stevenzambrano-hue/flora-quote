import { Router } from 'express';
import { createFullQuotation, getAll, remove } from '../controllers/cotizacion.controller.js';

const router = Router();

// Endpoints
router.get('/', getAll);
router.post('/', createFullQuotation);
router.delete('/:id', remove);

export default router;
