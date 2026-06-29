import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'yup';
import { AppError } from '../types/api';

// Central error handler — registered LAST. Maps known errors to clean JSON responses.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  if (err instanceof ValidationError) {
    res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: err.inner.map((e) => ({ field: e.path, message: e.message })),
    });
    return;
  }
  // Prisma known errors
  if (err.code === 'P2002') {
    res.status(409).json({ success: false, message: 'Học viên đã đăng ký khoá học này' });
    return;
  }
  if (err.code === 'P2025') {
    res.status(404).json({ success: false, message: 'Không tìm thấy bản ghi' });
    return;
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Lỗi server' });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ success: false, message: `Route không tồn tại: ${req.method} ${req.path}` });
}
