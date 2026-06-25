import { Request, Response } from 'express';
import * as gradeService from '../services/gradeService';
import { gradeCreateSchema } from '../validators';

export const addGrade = async (req: Request, res: Response) => {
  try {
    const { id: studentId } = req.params;
    const validated = await gradeCreateSchema.validate(req.body);

    const grade = await gradeService.addGrade(Number(studentId), validated);
    res.status(201).json({ data: grade });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 'P2002') {
      return res
        .status(409)
        .json({ error: 'Grade for this subject already exists' });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(500).json({ error: 'Failed to add grade' });
  }
};

export const getStudentGrades = async (req: Request, res: Response) => {
  try {
    const { id: studentId } = req.params;
    const grades = await gradeService.getGradesByStudent(Number(studentId));
    res.json({ data: grades });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

export const deleteGrade = async (req: Request, res: Response) => {
  try {
    const { gradeId } = req.params;
    await gradeService.deleteGrade(Number(gradeId));
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Grade not found' });
    }
    res.status(500).json({ error: 'Failed to delete grade' });
  }
};
