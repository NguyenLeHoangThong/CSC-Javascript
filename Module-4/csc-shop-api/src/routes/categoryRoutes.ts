import { Router } from 'express';
import { validate, validateId } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { categoryCreateSchema, categoryUpdateSchema } from '../schemas/index';
import * as controller from '../controllers/categoryController';

const router = Router();

const adminOnly = [authenticate, authorize('admin')];

// ── Public reads ──
router.get('/', controller.getCategories);
router.get('/:id', validateId, controller.getCategoryById);

// ── Admin-only writes ──
router.post('/', ...adminOnly, validate(categoryCreateSchema), controller.createCategory);
router.patch('/:id', ...adminOnly, validateId, validate(categoryUpdateSchema), controller.updateCategory);
router.delete('/:id', ...adminOnly, validateId, controller.deleteCategory);

export default router;
