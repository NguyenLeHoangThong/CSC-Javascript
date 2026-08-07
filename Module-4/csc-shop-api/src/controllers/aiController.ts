import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/aiService';

export async function suggest(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await svc.suggestProducts(req.query.q);

    // `Cache-Control: no-store` được đặt ở aiRoutes cho toàn bộ router (kể cả nhánh lỗi).
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
