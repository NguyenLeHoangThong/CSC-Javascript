import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/userService';
import { buildMeta } from '../utils/pagination';

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as any;
    const { data, total } = await svc.findAll(query);
    res.json({
      success: true,
      data,
      meta: buildMeta(total, query.page, query.limit),
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await svc.findById(res.locals.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await svc.updateProfile(res.locals.id, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // req.user!.id — id của admin đang thao tác (để chặn tự đổi role mình)
    const user = await svc.updateRole(
      res.locals.id,
      req.body.role,
      req.user!.id
    );
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await svc.remove(res.locals.id, req.user!.id);
    res.json({ success: true, message: 'Đã xóa user' });
  } catch (err) {
    next(err);
  }
}
