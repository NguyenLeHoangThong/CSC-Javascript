import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/authService';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await svc.register(req.body);
    res.status(201).json({ success: true, message: 'Registered successfully', data: user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await svc.login(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    // req.user is attached by the authenticate middleware
    const user = await svc.getProfile(req.user!.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const tokens = await svc.refreshTokens(req.body.refreshToken);
    res.json({ success: true, data: tokens });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.logout(req.user!.id);
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}
