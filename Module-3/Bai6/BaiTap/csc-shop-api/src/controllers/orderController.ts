import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/orderService';
import { buildMeta } from '../utils/pagination';

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await svc.create(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function getOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as any;
    const { data, total } = await svc.findAll(query);
    res.json({ success: true, data, meta: buildMeta(total, query.page, query.limit) });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await svc.findById(res.locals.id);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await svc.updateStatus(res.locals.id, req.body.status);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}
