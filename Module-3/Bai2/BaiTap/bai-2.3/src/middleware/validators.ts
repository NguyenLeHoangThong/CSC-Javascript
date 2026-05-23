import { Request, Response, NextFunction } from "express";

export function validateId(req: Request, res: Response, next: NextFunction): void {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ message: "id phải là số nguyên dương" });
    return;
  }
  next();
}

export function validateBody(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing = fields.filter((f) => !req.body?.[f]);
    if (missing.length > 0) {
      res.status(400).json({ message: `Thiếu các field: ${missing.join(", ")}` });
      return;
    }
    next();
  };
}

export function requestTimer(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.url} — ${Date.now() - start}ms`);
  });
  next();
}
