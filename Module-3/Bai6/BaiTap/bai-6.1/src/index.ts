import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient, Prisma } from '@prisma/client';

// ── Bài 6.1: pagination + filter + search + sort ─────────────
// All of it happens in the database via where / orderBy / skip / take.
const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// GET /posts?search=&published=&sort=views&order=desc&page=1&limit=10
app.get('/posts', async (req: Request, res: Response) => {
  // Parse & sanitise query params (everything arrives as a string)
  const search = (req.query.search as string) || '';
  const published = req.query.published; // "true" | "false" | undefined
  const sort = (['views', 'createdAt', 'title'].includes(req.query.sort as string)
    ? req.query.sort
    : 'createdAt') as 'views' | 'createdAt' | 'title';
  const order = req.query.order === 'asc' ? 'asc' : 'desc';
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

  // Build the WHERE clause from the optional filters
  const where: Prisma.PostWhereInput = {
    ...(search && { title: { contains: search, mode: 'insensitive' } }),
    ...(published !== undefined && { published: published === 'true' }),
  };

  // Run the page query and the total count together
  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  const pages = Math.ceil(total / limit) || 1;
  res.json({
    data,
    meta: { total, page, limit, pages, hasNext: page < pages, hasPrev: page > 1 },
  });
});

app.listen(PORT, () => console.log(`📝 Bài 6.1 blog-pagination running on http://localhost:${PORT}`));
