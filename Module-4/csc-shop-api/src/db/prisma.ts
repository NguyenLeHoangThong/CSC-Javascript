import { PrismaClient } from '@prisma/client';

// Bài 39 — Singleton. Render's free Postgres allows ~97 connections; every
// `new PrismaClient()` opens its own pool, so the whole app must share this one
// instance. Nothing else in src/ may call `new PrismaClient()`.
//
// Bài 37 — in development we also log every query with its duration, which is how
// you spot an N+1: the same SELECT repeated once per row.
const isDev = process.env.NODE_ENV === 'development';

const prisma = new PrismaClient({
  log: isDev
    ? [{ emit: 'event', level: 'query' }, 'warn', 'error']
    : ['error'],
});

if (isDev) {
  // `e.duration` is in ms — anything triple-digit on a seeded dev DB is worth a look.
  prisma.$on('query', (e) => {
    console.log(`[prisma ${e.duration}ms] ${e.query}`);
  });
}

export default prisma;
