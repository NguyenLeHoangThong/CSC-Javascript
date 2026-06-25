import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import * as yup from 'yup';

// ── Bài 5.1: basic Prisma CRUD on one model (Task) ───────────
const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const createSchema = yup.object({
  title: yup.string().min(2).max(200).required(),
  description: yup.string().nullable(),
  status: yup.string().oneOf(['todo', 'doing', 'done']).default('todo'),
  priority: yup.number().min(1).max(5).default(1),
});

// GET /tasks?status=todo — list, with an optional status filter
app.get('/tasks', async (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const tasks = await prisma.task.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { priority: 'desc' },
  });
  res.json(tasks);
});

// GET /tasks/:id
app.get('/tasks/:id', async (req: Request, res: Response) => {
  const task = await prisma.task.findUnique({ where: { id: Number(req.params.id) } });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// POST /tasks
app.post('/tasks', async (req: Request, res: Response) => {
  try {
    const data = await createSchema.validate(req.body);
    const task = await prisma.task.create({ data });
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /tasks/:id
app.patch('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const task = await prisma.task.update({ where: { id: Number(req.params.id) }, data: req.body });
    res.json(task);
  } catch {
    res.status(404).json({ message: 'Task not found' });
  }
});

// DELETE /tasks/:id
app.delete('/tasks/:id', async (req: Request, res: Response) => {
  try {
    await prisma.task.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'deleted' });
  } catch {
    res.status(404).json({ message: 'Task not found' });
  }
});

app.listen(PORT, () => console.log(`✅ Bài 5.1 task-manager running on http://localhost:${PORT}`));
