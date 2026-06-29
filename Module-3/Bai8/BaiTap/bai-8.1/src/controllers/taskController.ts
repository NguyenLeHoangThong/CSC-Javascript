import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/taskService';

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.update(res.locals.id, req.body) });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.remove(res.locals.id);
    res.json({ success: true, message: 'Đã xóa task' });
  } catch (err) {
    next(err);
  }
}
