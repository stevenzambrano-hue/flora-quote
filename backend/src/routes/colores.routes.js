import { Router } from 'express';
import * as coloresController from '../controllers/colores.controller.js';

const router = Router();

router.get('/', coloresController.getAll);
router.get('/:id', coloresController.getById);
router.post('/', coloresController.create);
router.put('/:id', coloresController.update);
router.delete('/:id', coloresController.remove);

export default router;
