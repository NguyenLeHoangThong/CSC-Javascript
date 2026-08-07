import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import * as controller from '../controllers/statsController';

const router = Router();

// GET /api/v1/stats — dashboard numbers (counts, revenue, orders by status).
//
// Bài 36 — this was fully public in Module 3, which leaked total revenue and order
// volume to anyone who guessed the URL. Business metrics are admin-only.
router.get('/', authenticate, authorize('admin'), controller.getStats);

export default router;
