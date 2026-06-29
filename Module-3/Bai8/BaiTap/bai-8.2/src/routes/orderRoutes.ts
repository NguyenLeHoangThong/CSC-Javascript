import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { validate, validateId } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { authorizeOwner } from '../middleware/authorizeOwner';
import { createOrderSchema, orderStatusSchema } from '../schemas/orderSchema';
import { buildMeta } from '../utils/pagination';
import * as svc from '../services/orderService';

const router = Router();

// Guest checkout: attach userId only if a valid token is present (no 401 for guests).
async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    let userId: number | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const payload = jwt.verify(authHeader.split(' ')[1], process.env.JWT_ACCESS_SECRET!) as { id: number };
        userId = payload.id;
      } catch {
        // ignore invalid token → guest order
      }
    }
    const order = await svc.createOrder(req.body, userId);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

router.post('/', validate(createOrderSchema), createOrder);

// "my" MUST be declared before "/:id" so it isn't captured as an :id value.
router.get('/my', authenticate, async (req, res, next) => {
  try {
    res.json({ success: true, data: await svc.findByUserId(req.user!.id) });
  } catch (err) {
    next(err);
  }
});

// Admin: list every order
router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const { data, total } = await svc.findAll({ status: req.query.status as string | undefined, page, limit });
    res.json({ success: true, data, meta: buildMeta(total, page, limit) });
  } catch (err) {
    next(err);
  }
});

// Admin: change order status
router.patch('/:id/status', authenticate, authorize('admin'), validateId, validate(orderStatusSchema), async (req, res, next) => {
  try {
    res.json({ success: true, data: await svc.updateStatus(res.locals.id, req.body.status) });
  } catch (err) {
    next(err);
  }
});

// Order detail: owner OR admin. Guest orders (userId null) → only admin can view.
router.get(
  '/:id',
  authenticate,
  validateId,
  authorizeOwner((req) => svc.getOwnerId(Number(req.params.id))),
  async (req, res, next) => {
    try {
      res.json({ success: true, data: await svc.findById(res.locals.id) });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
