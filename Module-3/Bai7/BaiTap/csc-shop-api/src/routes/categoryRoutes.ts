import { Router } from 'express';
import { validate, validateId } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { categoryCreateSchema, categoryUpdateSchema } from '../schemas/index';
import * as controller from '../controllers/categoryController';

const router = Router();

// ── Public reads ──
router.get('/', controller.getCategories);
router.get('/:id', validateId, controller.getCategoryById);

// ── Protected writes (login required) ──
router.post('/', authenticate, validate(categoryCreateSchema), controller.createCategory);
router.patch('/:id', authenticate, validateId, validate(categoryUpdateSchema), controller.updateCategory);
router.delete('/:id', authenticate, validateId, controller.deleteCategory);

export default router;
