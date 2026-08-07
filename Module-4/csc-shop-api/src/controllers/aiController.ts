import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/aiService';

export async function suggest(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await svc.suggestProducts(req.query.q);

    // Bài 37: AI answers are personalised and cheap to regenerate from our own
    // in-memory cache — never let a browser or CDN store them.
    res.set('Cache-Control', 'no-store');
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
