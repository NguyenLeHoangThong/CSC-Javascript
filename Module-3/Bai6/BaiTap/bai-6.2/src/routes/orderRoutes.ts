import { Router } from 'express';
import { validate, validateId } from '../middleware/validate';
import { createOrderSchema } from '../schemas/orderSchema';
import * as controller from '../controllers/orderController';

const router = Router();

// In Bài 6.2 orders are open (guest). Auth + ownership come in Bài 7.2 / 8.2.
router.post('/', validate(createOrderSchema), controller.createOrder);
router.get('/:id', validateId, controller.getOrderById);

export default router;
