import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { AppError } from '../types/api';

// Validate req.body; throw ValidationError so errorHandler returns field-level messages.
export const validate = (schema: yup.ObjectSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
      next();
    } catch (err) {
      next(err);
    }
  };

// Validate query string; cast strings ("1") to the schema type (number) and store back.
export const validateQuery = (schema: yup.ObjectSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Yup's validate() already coerces "1" -> 1 for number fields (cast is on by default)
      req.query = await schema.validate(req.query, { abortEarly: false, stripUnknown: true }) as any;
      next();
    } catch (err) {
      next(err);
    }
  };

// Ensure :id is a positive integer; store it in res.locals.id.
export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) return next(new AppError(400, 'id phải là số nguyên dương'));
  res.locals.id = id;
  next();
};
