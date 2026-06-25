import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../types/api';

// Mở rộng Request type để thêm thông tin user sau khi xác thực
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

// Middleware xác thực — kiểm tra và decode JWT access token
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // 1. Lấy token từ Authorization header dạng "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError(401, 'Chưa đăng nhập'));
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify token — throw nếu hết hạn hoặc sai chữ ký
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      id: number;
      email: string;
      role: string;
    };

    // 3. Gắn thông tin user vào req để các handler phía sau sử dụng
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      next(new AppError(401, 'Token đã hết hạn'));
      return;
    }
    next(new AppError(401, 'Token không hợp lệ'));
  }
}
