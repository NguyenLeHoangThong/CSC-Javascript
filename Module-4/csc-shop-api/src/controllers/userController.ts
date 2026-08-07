import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/userService';
import { UserQuery } from '../services/userService';
import { buildMeta } from '../utils/pagination';

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    // Cast once, after validateQuery(userQuerySchema) has parsed + defaulted everything.
    const query = req.query as unknown as UserQuery;
    const { data, total } = await svc.findAll(query);
    res.json({ success: true, data, meta: buildMeta(total, query.page, query.limit) });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await svc.findById(res.locals.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await svc.updateRole(res.locals.id, req.body.role, req.user!.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.remove(res.locals.id, req.user!.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
}
