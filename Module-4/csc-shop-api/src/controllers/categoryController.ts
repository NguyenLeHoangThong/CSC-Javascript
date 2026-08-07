import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/categoryService';

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await svc.findAll();

    // Bài 37 — categories are public and slow-changing: let browsers and any CDN in
    // front of the API keep them for 10 minutes, and keep serving a stale copy for
    // another minute while revalidating.
    res.set('Cache-Control', 'public, max-age=600, stale-while-revalidate=60');
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getCategoryById(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await svc.findById(res.locals.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await svc.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await svc.update(res.locals.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.remove(res.locals.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
}
