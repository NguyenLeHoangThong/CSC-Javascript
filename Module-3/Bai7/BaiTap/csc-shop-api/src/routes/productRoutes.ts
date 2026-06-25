import { Router } from 'express';
import { validate, validateQuery, validateId } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { productCreateSchema, productUpdateSchema, productQuerySchema } from '../schemas/index';
import * as controller from '../controllers/productController';

const router = Router();

// ── Public: anyone can browse the catalogue ──
router.get('/', validateQuery(productQuerySchema), controller.getProducts);
router.get('/:id', validateId, controller.getProductById);

// ── Protected: must be logged in to change data (any role for now; Bài 8 restricts to admin) ──
router.post('/', authenticate, validate(productCreateSchema), controller.createProduct);
router.patch('/:id', authenticate, validateId, validate(productUpdateSchema), controller.updateProduct);
router.delete('/:id', authenticate, validateId, controller.deleteProduct);

export default router;
