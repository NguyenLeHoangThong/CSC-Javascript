import { Router } from 'express';
import { validate, validateId } from '../middleware/validate';
import { orderCreateSchema, orderStatusSchema } from '../schemas/index';
import * as controller from '../controllers/orderController';

const router = Router();

// Bài 6: orders are still open (auth arrives in Bài 7, ownership in Bài 8).
router.post('/', validate(orderCreateSchema), controller.createOrder);
router.get('/', controller.getOrders);
router.get('/:id', validateId, controller.getOrderById);
router.patch('/:id/status', validateId, validate(orderStatusSchema), controller.updateOrderStatus);

export default router;
