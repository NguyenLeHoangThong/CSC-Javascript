import { Router, Request, Response, NextFunction } from "express";
import { Book } from "../types";

const router = Router();

let books: Book[] = [
  { id: 1, title: "Lập trình Node.js", author: "Nguyễn A", genre: "tech", year: 2023 },
  { id: 2, title: "Clean Code", author: "Robert C.", genre: "tech", year: 2008 },
  { id: 3, title: "Tôi tài giỏi", author: "Adam Khoo", genre: "self-help", year: 2010 },
];
let nextId = 4;

router.get("/", (req: Request, res: Response) => {
  res.json(books);
});

router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(book);
  } catch (err) {
    next(err);
  }
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, author, genre, year } = req.body;
    if (!title || !author || !genre || !year)
      return res.status(400).json({ message: "Thiếu: title, author, genre, year" });
    const newBook: Book = { id: nextId++, title, author, genre, year };
    books.push(newBook);
    res.status(201).json(newBook);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const index = books.findIndex((b) => b.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Không tìm thấy" });
    books[index] = { ...books[index], ...req.body, id: books[index].id };
    res.json(books[index]);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const index = books.findIndex((b) => b.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Không tìm thấy" });
    books.splice(index, 1);
    res.json({ message: "Đã xóa" });
  } catch (err) {
    next(err);
  }
});

export default router;
