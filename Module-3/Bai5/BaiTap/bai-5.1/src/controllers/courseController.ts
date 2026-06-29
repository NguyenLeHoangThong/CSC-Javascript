import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/courseService';
import { buildMeta } from '../utils/pagination';

export async function getCourses(req: Request, res: Response, next: NextFunction) {
  try {
    const q = req.query as any;
    const { data, total } = await svc.findAll(q);
    res.json({ success: true, data, meta: buildMeta(total, q.page, q.limit) });
  } catch (err) {
    next(err);
  }
}

export async function getCourseById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.findById(res.locals.id) });
  } catch (err) {
    next(err);
  }
}

export async function createCourse(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json({ success: true, data: await svc.create(req.body) });
  } catch (err) {
    next(err);
  }
}

export async function updateCourse(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.update(res.locals.id, req.body) });
  } catch (err) {
    next(err);
  }
}

export async function deleteCourse(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.remove(res.locals.id);
    res.json({ success: true, message: 'Đã xóa khoá học' });
  } catch (err) {
    next(err);
  }
}

export async function enrollCourse(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json({ success: true, data: await svc.enroll(res.locals.id, req.body) });
  } catch (err) {
    next(err);
  }
}
