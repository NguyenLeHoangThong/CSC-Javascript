import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/productService';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await svc.findAll();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await svc.findById(res.locals.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await svc.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await svc.update(res.locals.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.remove(res.locals.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
}
