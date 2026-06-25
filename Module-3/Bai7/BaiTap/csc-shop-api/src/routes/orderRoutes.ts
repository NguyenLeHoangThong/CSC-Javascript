import { Router } from 'express';
import { validate, validateId } from '../middleware/validate';
import { authenticate, optionalAuthenticate } from '../middleware/authenticate';
import { orderCreateSchema, orderStatusSchema } from '../schemas/index';
import * as controller from '../controllers/orderController';

const router = Router();

// Create order: optionalAuthenticate -> logged-in users get the order linked to their account,
// guests can still check out. (Bài 8 will require login + add ownership rules.)
router.post('/', optionalAuthenticate, validate(orderCreateSchema), controller.createOrder);

// Current user's orders (login required)
router.get('/me', authenticate, controller.getMyOrders);

// Admin-style listing/management (locked down to admin in Bài 8)
router.get('/', authenticate, controller.getOrders);
router.get('/:id', authenticate, validateId, controller.getOrderById);
router.patch('/:id/status', authenticate, validateId, validate(orderStatusSchema), controller.updateOrderStatus);

export default router;
