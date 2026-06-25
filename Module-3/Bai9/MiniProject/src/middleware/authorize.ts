import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/api';

// Phân quyền theo vai trò (RBAC) — dùng SAU middleware authenticate.
// Ví dụ: authorize('admin') hoặc authorize('admin', 'manager')
export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Chưa qua authenticate → chưa biết "bạn là ai"
    if (!req.user) {
      next(new AppError(401, 'Chưa đăng nhập'));
      return;
    }

    // Role không nằm trong danh sách được phép → cấm
    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError(403, 'Bạn không có quyền thực hiện thao tác này'));
      return;
    }

    next();
  };
}
