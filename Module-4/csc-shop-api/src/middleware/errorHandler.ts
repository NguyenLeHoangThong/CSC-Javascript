import { Request, Response, NextFunction } from 'express';
import { AppError, ApiResponse } from '../types/api';

// Bài 31 — the shape a Prisma error actually has. Module 3 typed the whole handler
// as `err: any`, which meant `err.meta.target[0]` was never checked by the compiler.
interface PrismaKnownError {
  code: string;
  meta?: { target?: string[] };
}

function isPrismaError(err: unknown): err is PrismaKnownError {
  return typeof err === 'object' && err !== null && typeof (err as PrismaKnownError).code === 'string';
}

// Global error handler — the LAST middleware. Every `next(err)` ends up here,
// so controllers never have to format error responses themselves.
// Express only treats a function as an error handler if it declares all FOUR
// parameters, which is why `next` is present but unused.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  // Keep test output readable; still log everywhere else.
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error:', err instanceof Error ? err.message : err);
  }

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (isPrismaError(err)) {
    switch (err.code) {
      case 'P2002': // unique constraint violation
        statusCode = 409;
        message = `${err.meta?.target?.[0] ?? 'Value'} already exists`;
        break;
      case 'P2025': // record to update/delete not found
        statusCode = 404;
        message = 'Record not found';
        break;
      case 'P2003': // foreign key constraint failed
        statusCode = 409;
        message = 'Cannot complete — related records exist';
        break;
    }
  }

  // Bài 36 — a 500 must never echo the internal message (stack traces, SQL, secrets).
  // Anything we deliberately threw is safe; anything else gets the generic text above.
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
