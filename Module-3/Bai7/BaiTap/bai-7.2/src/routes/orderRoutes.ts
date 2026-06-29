import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { validate, validateId } from '../middleware/validate';
import { createOrderSchema } from '../schemas/orderSchema';
import * as svc from '../services/orderService';

const router = Router();

// Guest checkout: if a valid token is present, link the order to that user; otherwise still allow it.
async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    let userId: number | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const payload = jwt.verify(authHeader.split(' ')[1], process.env.JWT_ACCESS_SECRET!) as { id: number };
        userId = payload.id;
      } catch {
        // Invalid/expired token → still allow as guest, just don't attach userId (no 401 here)
      }
    }
    const order = await svc.createOrder(req.body, userId);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

router.post('/', validate(createOrderSchema), createOrder);
router.get('/:id', validateId, async (req, res, next) => {
  try {
    res.json({ success: true, data: await svc.findById(res.locals.id) });
  } catch (err) {
    next(err);
  }
});

export default router;
