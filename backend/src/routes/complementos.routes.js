import { Router } from 'express';
import * as complementosController from '../controllers/complementos.controller.js';

const router = Router();

router.get('/', complementosController.getAll);
router.get('/:id', complementosController.getById);
router.post('/', complementosController.create);
router.put('/:id', complementosController.update);
router.delete('/:id', complementosController.remove);

export default router;
