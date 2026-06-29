import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/authService';
import { AppError } from '../types/api';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json({ success: true, data: await svc.register(req.body) });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.login(req.body) });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ success: true, data: await svc.getProfile(req.user!.id) });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.body.refreshToken) throw new AppError(400, 'Thiếu refresh token');
    res.json({ success: true, data: await svc.refreshTokens(req.body.refreshToken) });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.logout(req.user!.id);
    res.json({ success: true, message: 'Đăng xuất thành công' });
  } catch (err) {
    next(err);
  }
}
