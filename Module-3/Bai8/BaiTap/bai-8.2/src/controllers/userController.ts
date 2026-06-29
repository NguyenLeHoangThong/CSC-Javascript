import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/userService';
import { buildMeta } from '../utils/pagination';

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const q = req.query as any;
    const { data, total } = await svc.findAll(q);
    res.json({ success: true, data, meta: buildMeta(total, q.page, q.limit) });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.findById(res.locals.id) });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.updateProfile(res.locals.id, req.body) });
  } catch (err) {
    next(err);
  }
}

export async function updateRole(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.updateRole(res.locals.id, req.body.role, req.user!.id) });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.remove(res.locals.id, req.user!.id);
    res.json({ success: true, message: 'Đã xóa user' });
  } catch (err) {
    next(err);
  }
}
