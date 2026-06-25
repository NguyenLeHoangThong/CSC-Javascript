import { Router } from 'express';
import { validate, validateQuery, validateId } from '../middleware/validate';
import { productCreateSchema, productUpdateSchema, productQuerySchema } from '../schemas/index';
import * as controller from '../controllers/productController';

const router = Router();

// GET / now supports ?search=&category=&minPrice=&maxPrice=&sortBy=&order=&page=&limit=
router.get('/', validateQuery(productQuerySchema), controller.getProducts);
router.get('/:id', validateId, controller.getProductById);
router.post('/', validate(productCreateSchema), controller.createProduct);
router.patch('/:id', validateId, validate(productUpdateSchema), controller.updateProduct);
router.delete('/:id', validateId, controller.deleteProduct);

export default router;
