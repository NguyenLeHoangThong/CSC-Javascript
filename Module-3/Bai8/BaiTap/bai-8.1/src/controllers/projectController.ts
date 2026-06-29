import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/projectService';

export async function getProjects(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.findAll() });
  } catch (err) {
    next(err);
  }
}

export async function getProjectById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.findById(res.locals.id) });
  } catch (err) {
    next(err);
  }
}

export async function createProject(req: Request, res: Response, next: NextFunction) {
  try {
    // ownerId comes from the logged-in user
    res.status(201).json({ success: true, data: await svc.create(req.user!.id, req.body) });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.update(res.locals.id, req.body) });
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.remove(res.locals.id);
    res.json({ success: true, message: 'Đã xóa dự án' });
  } catch (err) {
    next(err);
  }
}

export async function getProjectTasks(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.listTasks(res.locals.id) });
  } catch (err) {
    next(err);
  }
}

export async function createProjectTask(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json({ success: true, data: await svc.createTask(res.locals.id, req.body) });
  } catch (err) {
    next(err);
  }
}
