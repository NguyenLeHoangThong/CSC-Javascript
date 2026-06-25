import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import * as yup from 'yup';

// ── Bài 5.2: CRUD with a relation (Genre 1──< Movie) ─────────
const app = express();
const PORT = process.env.PORT || 3002;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const movieSchema = yup.object({
  title: yup.string().min(1).max(200).required(),
  year: yup.number().min(1888).max(2100).required(),
  rating: yup.number().min(0).max(10).default(0),
  genreId: yup.number().positive().required(),
});

// GET /genres — list genres with how many movies each has (_count)
app.get('/genres', async (req: Request, res: Response) => {
  const genres = await prisma.genre.findMany({ include: { _count: { select: { movies: true } } } });
  res.json(genres);
});

// GET /movies?genreId=1 — list movies, include the related genre
app.get('/movies', async (req: Request, res: Response) => {
  const genreId = req.query.genreId ? Number(req.query.genreId) : undefined;
  const movies = await prisma.movie.findMany({
    where: genreId ? { genreId } : undefined,
    include: { genre: true }, // join the genre into each movie
    orderBy: { rating: 'desc' },
  });
  res.json(movies);
});

// POST /movies — create, validating that the genre exists first
app.post('/movies', async (req: Request, res: Response) => {
  try {
    const data = await movieSchema.validate(req.body);
    const genre = await prisma.genre.findUnique({ where: { id: data.genreId } });
    if (!genre) return res.status(404).json({ message: 'Genre not found' });
    const movie = await prisma.movie.create({ data, include: { genre: true } });
    res.status(201).json(movie);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /movies/:id
app.delete('/movies/:id', async (req: Request, res: Response) => {
  try {
    await prisma.movie.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'deleted' });
  } catch {
    res.status(404).json({ message: 'Movie not found' });
  }
});

app.listen(PORT, () => console.log(`🎬 Bài 5.2 movie-catalog running on http://localhost:${PORT}`));
