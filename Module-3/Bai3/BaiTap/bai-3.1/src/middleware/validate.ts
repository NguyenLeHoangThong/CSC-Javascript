import { Request, Response, NextFunction } from "express";
import { AnySchema, ValidationError } from "yup";

export function validate(schema: AnySchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          errors: err.errors,
        });
        return;
      }
      next(err);
    }
  };
}
