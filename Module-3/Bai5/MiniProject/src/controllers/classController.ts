import { Request, Response } from 'express';
import * as classService from '../services/classService';
import { classCreateSchema } from '../validators';

export const getClasses = async (req: Request, res: Response) => {
  try {
    const classes = await classService.getAllClasses();
    res.json({ data: classes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

export const getClassDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const classData = await classService.getClassById(Number(id));

    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json({ data: classData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch class' });
  }
};

export const createClass = async (req: Request, res: Response) => {
  try {
    const validated = await classCreateSchema.validate(req.body);
    const classData = await classService.createClass(validated);
    res.status(201).json({ data: classData });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create class' });
  }
};

export const updateClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const classData = await classService.updateClass(Number(id), req.body);
    res.json({ data: classData });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.status(500).json({ error: 'Failed to update class' });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await classService.deleteClass(Number(id));
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.status(500).json({ error: 'Failed to delete class' });
  }
};
