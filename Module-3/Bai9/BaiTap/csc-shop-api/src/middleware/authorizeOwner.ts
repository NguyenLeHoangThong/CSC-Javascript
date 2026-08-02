import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/api';

// Ownership check — use AFTER `authenticate`.
//
// getOwnerId(req) returns the id of whoever owns the resource:
//   - null   -> resource not found (404)
//   - number -> compared against req.user.id
//
// Admins always bypass the check (they can access any resource).
export function authorizeOwner(getOwnerId: (req: Request) => Promise<number | null>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        next(new AppError(401, 'Not authenticated'));
        return;
      }
      // Admin bypass
      if (req.user.role === 'admin') {
        next();
        return;
      }

      const ownerId = await getOwnerId(req);
      if (ownerId === null) throw new AppError(404, 'Resource not found');
      if (ownerId !== req.user.id) throw new AppError(403, 'You do not have access to this resource');

      next();
    } catch (err) {
      next(err);
    }
  };
}
