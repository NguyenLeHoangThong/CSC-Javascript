import { Router, Request, Response, NextFunction } from 'express';
import { aiLimiter } from '../middleware/rateLimiters';
import * as controller from '../controllers/aiController';

const router = Router();

// Bài 37 — `no-store` cho MỌI response của /ai, kể cả lỗi.
//
// Ban đầu header này chỉ được set ở nhánh thành công trong controller, nên response
// 429/503 lại đi ra không có Cache-Control. Đặt ở router là chỗ đúng: nó áp dụng cho
// cả nhánh lỗi do errorHandler trả về, và một route AI thêm sau này không thể quên.
router.use((req: Request, res: Response, next: NextFunction) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// GET /api/v1/ai/suggest?q=...
// Public (khách vãng lai cũng hỏi được) nhưng rate limit chặt: mỗi lượt gọi đốt quota Gemini.
router.get('/suggest', aiLimiter, controller.suggest);

export default router;
