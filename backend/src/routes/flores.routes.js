import { Router } from 'express';
import * as floresController from '../controllers/flores.controller.js';

const router = Router();

router.get('/', floresController.getAll);
router.get('/:id', floresController.getById);
router.post('/', floresController.create);
router.put('/:id', floresController.update);
router.delete('/:id', floresController.remove);

export default router;
