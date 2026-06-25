import { Router } from 'express';
import * as controller from '../controllers/statsController';

const router = Router();

// GET /api/v1/stats — dashboard numbers (counts, revenue, group by status)
router.get('/', controller.getStats);

export default router;
