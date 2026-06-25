import { Router } from 'express';
import { validate, validateId } from '../middleware/validate';
import { categoryCreateSchema, categoryUpdateSchema } from '../schemas/index';
import * as controller from '../controllers/categoryController';

const router = Router();

// In Bài 5 every route is open. Authentication/authorization are added in Bài 7 & 8.
router.get('/', controller.getCategories);
router.get('/:id', validateId, controller.getCategoryById);
router.post('/', validate(categoryCreateSchema), controller.createCategory);
router.patch('/:id', validateId, validate(categoryUpdateSchema), controller.updateCategory);
router.delete('/:id', validateId, controller.deleteCategory);

export default router;
