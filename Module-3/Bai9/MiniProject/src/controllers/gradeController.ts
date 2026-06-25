import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/gradeService';

export async function addGrade(req: Request, res: Response, next: NextFunction) {
  try {
    const studentId = res.locals.id;
    const grade = await svc.addGrade(studentId, req.body);
    res.status(201).json({ success: true, data: grade });
  } catch (err) {
    next(err);
  }
}

export async function updateGrade(req: Request, res: Response, next: NextFunction) {
  try {
    const { gradeId } = req.params;
    const grade = await svc.updateGrade(Number(gradeId), req.body);
    res.json({ success: true, data: grade });
  } catch (err) {
    next(err);
  }
}

export async function getStudentGrades(req: Request, res: Response, next: NextFunction) {
  try {
    const studentId = res.locals.id;
    const grades = await svc.getByStudent(studentId);
    res.json({ success: true, data: grades });
  } catch (err) {
    next(err);
  }
}

export async function deleteGrade(req: Request, res: Response, next: NextFunction) {
  try {
    const { gradeId } = req.params;
    await svc.deleteGrade(Number(gradeId));
    res.json({ success: true, message: 'Đã xóa điểm' });
  } catch (err) {
    next(err);
  }
}
