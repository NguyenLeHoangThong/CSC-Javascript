import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/api';

// RBAC — allow only the listed roles. Use AFTER authenticate.
export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) return next(new AppError(401, 'Chưa đăng nhập'));
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(403, 'Bạn không có quyền thực hiện thao tác này'));
    }
    next();
  };
}
