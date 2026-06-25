import { Request, Response, NextFunction } from 'express';
import { AppError, ApiResponse } from '../types/api';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_ERROR';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code || 'APP_ERROR';
  } else if (err.code === 'P2002') {
    statusCode = 409;
    message = `${err.meta?.target?.[0] || 'Dữ liệu'} đã tồn tại`;
    code = 'DUPLICATE_ENTRY';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Bản ghi không tồn tại';
    code = 'NOT_FOUND';
  } else if (err.code === 'P2003') {
    statusCode = 409;
    message = 'Không thể xóa - có dữ liệu liên kết';
    code = 'FOREIGN_KEY_CONSTRAINT';
  } else if (err.code === 'P2014') {
    statusCode = 409;
    message = 'Lỗi ràng buộc dữ liệu';
    code = 'RELATION_CONSTRAINT';
  }

  const response: ApiResponse = {
    success: false,
    message,
    data: undefined,
  };

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    message: `Route không tìm thấy: ${req.method} ${req.path}`,
  };
  res.status(404).json(response);
};
