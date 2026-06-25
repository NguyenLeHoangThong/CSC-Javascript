import { Router } from 'express';
import { validate, validateId } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { authorizeOwner } from '../middleware/authorizeOwner';
import { orderCreateSchema, orderStatusSchema } from '../schemas/index';
import * as controller from '../controllers/orderController';
import { findOwnerId } from '../services/orderService';

const router = Router();

// Any logged-in user (customer or admin) can place an order.
router.post('/', authenticate, validate(orderCreateSchema), controller.createOrder);

// A customer sees only THEIR own orders.
router.get('/me', authenticate, controller.getMyOrders);

// Admin-only: list every order, change order status.
router.get('/', authenticate, authorize('admin'), controller.getOrders);
router.patch('/:id/status', authenticate, authorize('admin'), validateId, validate(orderStatusSchema), controller.updateOrderStatus);

// Order detail: owner OR admin. authorizeOwner looks up the order's userId.
router.get(
  '/:id',
  authenticate,
  validateId,
  authorizeOwner(async (req) => findOwnerId(Number(req.params.id))),
  controller.getOrderById
);

export default router;
