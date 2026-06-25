import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { AppError } from '../types/api';

export const validate = (schema: yup.ObjectSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body);
      next();
    } catch (error: any) {
      next(new AppError(400, error.message));
    }
  };

export const validateQuery = (schema: yup.ObjectSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.validate(req.query, { abortEarly: false });
      req.query = validated;
      next();
    } catch (error: any) {
      next(new AppError(400, error.message));
    }
  };

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return next(new AppError(400, 'ID phải là số hợp lệ'));
  }
  res.locals.id = Number(id);
  next();
};
