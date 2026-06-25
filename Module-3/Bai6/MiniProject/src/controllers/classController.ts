import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/classService';
import { buildMeta } from '../utils/pagination';

export async function getClasses(req: Request, res: Response, next: NextFunction) {
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

export async function getClassDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const id = res.locals.id;
    const classData = await svc.findById(id);
    res.json({ success: true, data: classData });
  } catch (err) {
    next(err);
  }
}

export async function createClass(req: Request, res: Response, next: NextFunction) {
  try {
    const classData = await svc.create(req.body);
    res.status(201).json({ success: true, data: classData });
  } catch (err) {
    next(err);
  }
}

export async function updateClass(req: Request, res: Response, next: NextFunction) {
  try {
    const id = res.locals.id;
    const classData = await svc.update(id, req.body);
    res.json({ success: true, data: classData });
  } catch (err) {
    next(err);
  }
}

export async function deleteClass(req: Request, res: Response, next: NextFunction) {
  try {
    const id = res.locals.id;
    await svc.remove(id);
    res.json({ success: true, message: 'Đã xóa lớp' });
  } catch (err) {
    next(err);
  }
}

export async function transferStudent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { studentId } = req.body;
    const newClassId = res.locals.id;

    const student = await svc.transferStudent(studentId, newClassId);
    res.json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
}
