import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../types/api';

// Attach the decoded user to req after verifying the access token.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: number; email: string; role: string };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(new AppError(401, 'Chưa đăng nhập'));
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { id: number; email: string; role: string };
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch (err: any) {
    next(new AppError(401, err.name === 'TokenExpiredError' ? 'Token đã hết hạn' : 'Token không hợp lệ'));
  }
}
