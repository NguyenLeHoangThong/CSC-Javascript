import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/departmentService';

export async function getDepartments(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.findAll() });
  } catch (err) {
    next(err);
  }
}

export async function createDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json({ success: true, data: await svc.create(req.body) });
  } catch (err) {
    next(err);
  }
}

export async function deleteDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.remove(res.locals.id);
    res.json({ success: true, message: 'Đã xóa phòng ban' });
  } catch (err) {
    next(err);
  }
}
