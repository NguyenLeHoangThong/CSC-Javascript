import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/orderService';
import { OrderQuery } from '../services/orderService';
import { buildMeta } from '../utils/pagination';

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    // optionalAuthenticate may have attached req.user — link the order to that account
    // when present, otherwise it is a guest order (userId stays null).
    const order = await svc.create({ ...req.body, userId: req.user?.id ?? null });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function getMyOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const orders = await svc.findByUser(req.user!.id);
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
}

export async function getOrders(req: Request, res: Response, next: NextFunction) {
  try {
    // Bài 31: validateQuery(orderQuerySchema) has already parsed and defaulted these,
    // so `page`/`limit` are real numbers here — buildMeta can no longer produce NaN.
    const query = req.query as unknown as OrderQuery;
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
