import { Router } from 'express';
import { validate, validateQuery, validateId } from '../middleware/validate';
import { authenticate, optionalAuthenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { authorizeOwner } from '../middleware/authorizeOwner';
import { orderCreateSchema, orderQuerySchema, orderStatusSchema } from '../schemas/index';
import * as controller from '../controllers/orderController';
import { findOwnerId } from '../services/orderService';

const router = Router();

// Bài 31 — fixed: Module 3 used `authenticate` here, which made guest checkout return
// 401 even though the storefront advertises it. `optionalAuthenticate` attaches
// req.user when a token is present and falls through to a guest order otherwise.
router.post('/', optionalAuthenticate, validate(orderCreateSchema), controller.createOrder);

// A customer sees only THEIR own orders.
// Must be declared BEFORE '/:id', otherwise Express matches "me" as an id.
router.get('/me', authenticate, controller.getMyOrders);

// ── Admin-only ──
router.get('/', authenticate, authorize('admin'), validateQuery(orderQuerySchema), controller.getOrders);
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  validateId,
  validate(orderStatusSchema),
  controller.updateOrderStatus
);

// Order detail: owner OR admin. authorizeOwner looks up the order's userId.
router.get(
  '/:id',
  authenticate,
  validateId,
  authorizeOwner(async (req) => findOwnerId(Number(req.params.id))),
  controller.getOrderById
);

export default router;
