import { Router, Request, Response, NextFunction } from "express";
import { AppError } from "../types";
import { validate } from "../middleware/validate";
import { createGradeSchema, updateGradeSchema } from "../schemas/gradeSchema";
import * as svc from "../services/gradeService";

const router = Router();

router.get("/summary", (req: Request, res: Response, next: NextFunction) => {
  try {
    const classId = req.query.classId
      ? parseInt(req.query.classId as string)
      : undefined;
    let grades = svc.getAll();

    if (classId) grades = grades.filter((g) => g.classId === classId);
    if (grades.length === 0) throw new AppError(404, "Không có dữ liệu điểm");

    const classAverage = +(
      grades.reduce((s, g) => s + g.average, 0) / grades.length
    ).toFixed(2);

    const distribution = ["A", "B", "C", "D", "F"].map((g) => ({
      grade: g,
      count: grades.filter((gr) => gr.grade === g).length,
    }));

    res.json({
      success: true,
      data: { classAverage, distribution, total: grades.length },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId, classId, subject, grade } = req.query;
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "10");

    let grades = svc.getAll();

    if (studentId)
      grades = grades.filter((g) => g.studentId === parseInt(studentId as string));
    if (classId)
      grades = grades.filter((g) => g.classId === parseInt(classId as string));
    if (subject) grades = grades.filter((g) => g.subject === subject);
    if (grade) grades = grades.filter((g) => g.grade === grade);

    const total = grades.length;
    const start = (page - 1) * limit;
    const data = grades.slice(start, start + limit);

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
    const g = svc.getById(id);
    if (!g) throw new AppError(404, "Không tìm thấy bản ghi điểm");
    res.json({ success: true, data: g });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  validate(createGradeSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentId, classId, subject } = req.body;
      const dup = svc.findDuplicate(studentId, classId, subject);
      if (dup)
        throw new AppError(409, "Đã tồn tại bản ghi cho học sinh, lớp và môn này");
      const g = svc.create(req.body);
      res.status(201).json({ success: true, data: g, message: "Tạo điểm thành công" });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/:id",
  validate(updateGradeSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const updated = svc.update(id, req.body);
      if (!updated) throw new AppError(404, "Không tìm thấy bản ghi điểm");
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
    if (!ok) throw new AppError(404, "Không tìm thấy bản ghi điểm");
    res.json({ success: true, message: "Đã xóa bản ghi điểm" });
  } catch (err) {
    next(err);
  }
});

export default router;
