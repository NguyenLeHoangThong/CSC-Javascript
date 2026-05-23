import { Router, Request, Response } from "express";

export interface Student {
  id: number;
  name: string;
  age: number;
  major: string;
}

const router = Router();

let students: Student[] = [
  { id: 1, name: "Nguyen Van A", age: 20, major: "CNTT" },
  { id: 2, name: "Tran Thi B", age: 21, major: "KTPM" },
];
let nextId = 3;

router.get("/", (req: Request, res: Response) => {
  const { major } = req.query;
  let result = [...students];
  if (major) {
    result = result.filter((s) => s.major === major);
  }
  res.json(result);
});

router.get("/:id", (req: Request, res: Response) => {
  const student = students.find((s) => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ message: "Không tìm thấy" });
  res.json(student);
});

router.post("/", (req: Request, res: Response) => {
  const { name, age, major } = req.body;
  if (!name || !age || !major)
    return res.status(400).json({ message: "Thiếu: name, age, major" });
  const newStudent: Student = { id: nextId++, name, age, major };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

router.put("/:id", (req: Request, res: Response) => {
  const index = students.findIndex((s) => s.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Không tìm thấy" });
  students[index] = { ...students[index], ...req.body, id: students[index].id };
  res.json(students[index]);
});

router.delete("/:id", (req: Request, res: Response) => {
  const index = students.findIndex((s) => s.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Không tìm thấy" });
  students.splice(index, 1);
  res.json({ message: "Đã xóa" });
});

export default router;
