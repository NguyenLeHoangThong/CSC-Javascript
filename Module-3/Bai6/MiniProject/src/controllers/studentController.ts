import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/studentService';
import { buildMeta } from '../utils/pagination';

export async function getStudents(req: Request, res: Response, next: NextFunction) {
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

export async function getStudentDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = res.locals.id;
    const student = await svc.findById(id);
    res.json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
}

export async function createStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const student = await svc.create(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
}

export async function updateStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const id = res.locals.id;
    const student = await svc.update(id, req.body);
    res.json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
}

export async function deleteStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const id = res.locals.id;
    await svc.remove(id);
    res.json({ success: true, message: 'Đã xóa học sinh' });
  } catch (err) {
    next(err);
  }
}
