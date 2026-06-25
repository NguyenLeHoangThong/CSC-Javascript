import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../types/api';

// Extend Express.Request so controllers can read req.user after authentication.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: number; email: string; role: string };
    }
  }
}

// Verify the JWT access token and attach the decoded user to req.user.
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  // 1. Token comes in the header as "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError(401, 'Not authenticated'));
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. verify() throws if the signature is wrong or the token expired
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      id: number;
      email: string;
      role: string;
    };
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      next(new AppError(401, 'Token expired'));
      return;
    }
    next(new AppError(401, 'Invalid token'));
  }
}

// Optional auth: if a valid token is present, attach req.user; otherwise continue as guest.
// Used by POST /orders so logged-in users get their order linked, but guests can still buy.
export function optionalAuthenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }
  try {
    const payload = jwt.verify(authHeader.split(' ')[1], process.env.JWT_ACCESS_SECRET!) as {
      id: number;
      email: string;
      role: string;
    };
    req.user = { id: payload.id, email: payload.email, role: payload.role };
  } catch {
    // ignore invalid token — treat as guest
  }
  next();
}
