import { Router } from 'express';
import { validate, validateQuery, validateId } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { productCreateSchema, productUpdateSchema, productQuerySchema } from '../schemas/index';
import * as controller from '../controllers/productController';

const router = Router();

// authenticate (401 if no token) -> authorize('admin') (403 if not admin)
const adminOnly = [authenticate, authorize('admin')];

// ── Public reads ──
router.get('/', validateQuery(productQuerySchema), controller.getProducts);
router.get('/:id', validateId, controller.getProductById);

// ── Admin-only writes ──
router.post('/', ...adminOnly, validate(productCreateSchema), controller.createProduct);
router.patch('/:id', ...adminOnly, validateId, validate(productUpdateSchema), controller.updateProduct);
router.delete('/:id', ...adminOnly, validateId, controller.deleteProduct);

export default router;
