import { Router } from 'express';
import { validate, validateQuery, validateId } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { createProductSchema, updateProductSchema, productQuerySchema } from '../schemas/productSchema';
import * as controller from '../controllers/productController';

const router = Router();

// authenticate (401) → authorize('admin') (403)
const adminOnly = [authenticate, authorize('admin')];

// Public reads
router.get('/', validateQuery(productQuerySchema), controller.getProducts);
router.get('/:id', validateId, controller.getProductById);

// Admin-only writes
router.post('/', ...adminOnly, validate(createProductSchema), controller.createProduct);
router.patch('/:id', ...adminOnly, validateId, validate(updateProductSchema), controller.updateProduct);
router.delete('/:id', ...adminOnly, validateId, controller.deleteProduct);

export default router;
