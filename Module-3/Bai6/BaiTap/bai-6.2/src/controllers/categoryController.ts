import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/categoryService';

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.findAll() });
  } catch (err) {
    next(err);
  }
}
