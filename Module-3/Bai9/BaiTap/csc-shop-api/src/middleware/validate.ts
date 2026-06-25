import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { AppError } from '../types/api';

// Validate request body against a Yup schema. On failure -> 400.
export const validate = (schema: yup.ObjectSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // `stripUnknown` removes fields not declared in the schema (defense in depth)
      req.body = await schema.validate(req.body, { stripUnknown: true });
      next();
    } catch (error: any) {
      next(new AppError(400, error.message));
    }
  };

// Validate the query string and write the cast values back onto req.query,
// so controllers receive numbers/booleans instead of raw strings.
export const validateQuery = (schema: yup.ObjectSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.validate(req.query, { abortEarly: false });
      req.query = validated as any;
      next();
    } catch (error: any) {
      next(new AppError(400, error.message));
    }
  };

// Ensure :id route param is a positive integer; store the parsed number in res.locals.id.
export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return next(new AppError(400, 'ID must be a valid number'));
  }
  res.locals.id = Number(id);
  next();
};
