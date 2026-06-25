import { Request, Response, NextFunction } from 'express';
import { AppError, ApiResponse } from '../types/api';

// Global error handler — the LAST middleware. Every `next(err)` ends up here,
// so controllers never have to format error responses themselves.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err.message);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.code === 'P2002') {
    // Prisma: unique constraint violation
    statusCode = 409;
    message = `${err.meta?.target?.[0] || 'Value'} already exists`;
  } else if (err.code === 'P2025') {
    // Prisma: record to update/delete not found
    statusCode = 404;
    message = 'Record not found';
  } else if (err.code === 'P2003') {
    // Prisma: foreign key constraint failed
    statusCode = 409;
    message = 'Cannot complete — related records exist';
  }

  const response: ApiResponse = { success: false, message };
  res.status(statusCode).json(response);
};

// Catch-all for unknown routes (must be registered before errorHandler).
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
};
