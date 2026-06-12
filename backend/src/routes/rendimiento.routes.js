import { Router } from 'express';
import {
  getAllRendimientos,
  createRendimiento,
  updateRendimiento,
  removeRendimiento
} from '../controllers/rendimiento.controller.js';

const router = Router();

router.get('/', getAllRendimientos);
router.post('/', createRendimiento);
router.put('/:id', updateRendimiento);
router.delete('/:id', removeRendimiento);

export default router;
