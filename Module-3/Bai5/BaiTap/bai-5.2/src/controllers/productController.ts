import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/productService';
import { buildMeta } from '../utils/pagination';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const q = req.query as any;
    const { data, total } = await svc.findAll(q);
    res.json({ success: true, data, meta: buildMeta(total, q.page, q.limit) });
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.findById(res.locals.id) });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json({ success: true, data: await svc.create(req.body) });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.update(res.locals.id, req.body) });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.remove(res.locals.id);
    res.json({ success: true, message: 'Đã xóa sản phẩm' });
  } catch (err) {
    next(err);
  }
}
