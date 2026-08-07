import { Router } from 'express';
import { aiLimiter } from '../middleware/rateLimiters';
import * as controller from '../controllers/aiController';

const router = Router();

// GET /api/v1/ai/suggest?q=...
// Public (guests may ask too) but rate-limited hard: every call costs Gemini quota.
router.get('/suggest', aiLimiter, controller.suggest);

export default router;
