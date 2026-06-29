import { Router } from 'express';
import { validate, validateQuery, validateId } from '../middleware/validate';
import { createProductSchema, updateProductSchema, productQuerySchema } from '../schemas/productSchema';
import * as controller from '../controllers/productController';

const router = Router();

// In Bài 5.2 all routes are open. Auth (Bài 7.2) and admin-only writes (Bài 8.2) come later.
router.get('/', validateQuery(productQuerySchema), controller.getProducts);
router.get('/:id', validateId, controller.getProductById);
router.post('/', validate(createProductSchema), controller.createProduct);
router.patch('/:id', validateId, validate(updateProductSchema), controller.updateProduct);
router.delete('/:id', validateId, controller.deleteProduct);

export default router;
