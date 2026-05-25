import { Router, Request, Response, NextFunction } from "express";
import { AppError } from "../types";
import { validate } from "../middleware/validate";
import { createClassSchema, updateClassSchema } from "../schemas/classSchema";
import * as svc from "../services/classService";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subject, hasSlot } = req.query;
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "10");

    let classes = svc.getAll();

    if (subject) classes = classes.filter((c) => c.subject === subject);
    if (hasSlot === "true")
      classes = classes.filter((c) => c.currentStudents < c.maxStudents);

    const total = classes.length;
    const start = (page - 1) * limit;
    const data = classes.slice(start, start + limit);

    res.json({
      success: true,
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const cls = svc.getById(id);
    if (!cls) throw new AppError(404, "Không tìm thấy lớp học");
    res.json({ success: true, data: cls });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  validate(createClassSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const cls = svc.create(req.body);
      res.status(201).json({ success: true, data: cls, message: "Tạo lớp học thành công" });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/:id",
  validate(updateClassSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const updated = svc.update(id, req.body);
      if (!updated) throw new AppError(404, "Không tìm thấy lớp học");
      res.json({ success: true, data: updated, message: "Cập nhật thành công" });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const ok = svc.remove(id);
    if (!ok) throw new AppError(404, "Không tìm thấy lớp học");
    res.json({ success: true, message: "Đã xóa lớp học" });
  } catch (err) {
    next(err);
  }
});

export default router;
