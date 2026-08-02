import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/api';

// RBAC (Role-Based Access Control) — use AFTER `authenticate`.
// Example: authorize('admin') or authorize('admin', 'staff')
export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Must be authenticated first
    if (!req.user) {
      next(new AppError(401, 'Not authenticated'));
      return;
    }
    // Role not in the allow-list -> forbidden
    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError(403, 'You do not have permission to perform this action'));
      return;
    }
    next();
  };
}
