import { Router } from 'express';
import { validate, validateId } from '../middleware/validate';
import { productCreateSchema, productUpdateSchema } from '../schemas/index';
import * as controller from '../controllers/productController';

const router = Router();

router.get('/', controller.getProducts);
router.get('/:id', validateId, controller.getProductById);
router.post('/', validate(productCreateSchema), controller.createProduct);
router.patch('/:id', validateId, validate(productUpdateSchema), controller.updateProduct);
router.delete('/:id', validateId, controller.deleteProduct);

export default router;
