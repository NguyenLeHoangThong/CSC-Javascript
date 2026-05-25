import { Router, Request, Response, NextFunction } from "express";
import { AppError, Post } from "../types/api";
import { validate } from "../middleware/validate";
import { createPostSchema, updatePostSchema } from "../schemas/postSchema";
import * as postService from "../services/postService";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, sort, order } = req.query;
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "10");

    let posts = postService.getAll();

    if (category) posts = posts.filter((p) => p.category === category);

    if (sort) {
      const key = sort as keyof Post;
      const dir = order === "desc" ? -1 : 1;
      posts.sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        if (av === undefined || bv === undefined) return 0;
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    }

    const total = posts.length;
    const start = (page - 1) * limit;
    const data = posts.slice(start, start + limit);

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
    const post = postService.getById(id);
    if (!post) throw new AppError(404, "Không tìm thấy bài viết");
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  validate(createPostSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = postService.create(req.body);
      res.status(201).json({ success: true, data: post, message: "Tạo bài viết thành công" });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/:id",
  validate(updatePostSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const updated = postService.update(id, req.body);
      if (!updated) throw new AppError(404, "Không tìm thấy bài viết");
      res.json({ success: true, data: updated, message: "Cập nhật thành công" });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const ok = postService.remove(id);
    if (!ok) throw new AppError(404, "Không tìm thấy bài viết");
    res.json({ success: true, message: "Đã xóa bài viết" });
  } catch (err) {
    next(err);
  }
});

export default router;
