import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/employeeService';
import { buildMeta } from '../utils/pagination';

export async function getEmployees(req: Request, res: Response, next: NextFunction) {
  try {
    const q = req.query as any;
    const { data, total } = await svc.findAll(q);
    res.json({ success: true, data, meta: buildMeta(total, q.page, q.limit) });
  } catch (err) {
    next(err);
  }
}

export async function getEmployeeById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.findById(res.locals.id) });
  } catch (err) {
    next(err);
  }
}

export async function createEmployee(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json({ success: true, data: await svc.create(req.body) });
  } catch (err) {
    next(err);
  }
}

export async function updateEmployee(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.update(res.locals.id, req.body) });
  } catch (err) {
    next(err);
  }
}

export async function deleteEmployee(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.remove(res.locals.id);
    res.json({ success: true, message: 'Đã xóa nhân viên' });
  } catch (err) {
    next(err);
  }
}

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.getStats() });
  } catch (err) {
    next(err);
  }
}
