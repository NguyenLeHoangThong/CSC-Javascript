import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/postService';

export async function getPosts(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.findAllPublished() });
  } catch (err) {
    next(err);
  }
}

export async function getPostById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.findById(res.locals.id) });
  } catch (err) {
    next(err);
  }
}

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    // authorId comes from the token (req.user), never from the body
    res.status(201).json({ success: true, data: await svc.create(req.user!.id, req.body) });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.updateOwn(res.locals.id, req.user!.id, req.body) });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.removeOwn(res.locals.id, req.user!.id);
    res.json({ success: true, message: 'Đã xóa bài viết' });
  } catch (err) {
    next(err);
  }
}
