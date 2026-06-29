import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/orderService';

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json({ success: true, data: await svc.createOrder(req.body) });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.findById(res.locals.id) });
  } catch (err) {
    next(err);
  }
}
