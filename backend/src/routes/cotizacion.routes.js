import { Router } from 'express';
import { createFullQuotation } from '../controllers/cotizacion.controller.js';

const router = Router();

// Endpoint para crear una cotización completa
router.post('/', createFullQuotation);

export default router;
