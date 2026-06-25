import { Request, Response } from 'express';
import * as studentService from '../services/studentService';
import { studentCreateSchema, studentUpdateSchema } from '../validators';

export const getStudents = async (req: Request, res: Response) => {
  try {
    const { classId, status, search, page = '1', limit = '10' } = req.query;

    const result = await studentService.getAllStudents({
      classId: classId ? Number(classId) : undefined,
      status: status as string,
      search: search as string,
      page: Number(page),
      limit: Number(limit),
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

export const getStudentDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentById(Number(id));

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ data: student });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const validated = await studentCreateSchema.validate(req.body);
    const student = await studentService.createStudent(validated);
    res.status(201).json({ data: student });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create student' });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validated = await studentUpdateSchema.validate(req.body);
    const student = await studentService.updateStudent(Number(id), validated);
    res.json({ data: student });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(500).json({ error: 'Failed to update student' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentStatus(Number(id));

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (student.status === 'active') {
      return res
        .status(409)
        .json({ error: 'Cannot delete active student' });
    }

    await studentService.deleteStudent(Number(id));
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
};
