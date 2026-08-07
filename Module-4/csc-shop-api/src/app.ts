import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import prisma from './db/prisma';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';
import statsRoutes from './routes/statsRoutes';
import aiRoutes from './routes/aiRoutes';
import { authLimiter, generalLimiter } from './middleware/rateLimiters';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Bài 32 / Bài 39 — the Express app is built here and NOTHING listens.
// `server.ts` owns `.listen()`. That split is what lets Supertest import this file
// and drive real HTTP requests without ever binding a port.
const app = express();

// Behind Render/Vercel there is a proxy in front of us. Without this, every request
// looks like it comes from the proxy IP and express-rate-limit would throttle all
// users as if they were one. `1` = trust exactly one hop, never `true`.
app.set('trust proxy', 1);

// ── Security headers (Bài 36) ────────────────────────────────────────────
app.use(helmet());
app.disable('x-powered-by'); // helmet already removes it; explicit is cheaper than assuming

// helmet does not set this one. Turn off browser features the shop never uses, so an
// injected script cannot silently reach for the camera or wallet.
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  next();
});

// ── CORS (Bài 36) ────────────────────────────────────────────────────────
// Module 3 used `cors()` = Access-Control-Allow-Origin: *. With credentials that is
// a hole; with a whitelist only our own frontends can call the API from a browser.
const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header = same-origin, curl, or a mobile app — not a browser CORS
      // request, so there is nothing to block.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);

// ── Body parsing ─────────────────────────────────────────────────────────
// A size cap so one huge payload cannot exhaust memory.
app.use(express.json({ limit: '100kb' }));

// ── Health check (Bài 39) ────────────────────────────────────────────────
// Render pings this. It must also prove the DATABASE is reachable — a process that
// is "up" but cannot query Postgres is not healthy.
app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', uptime: Math.round(process.uptime()) });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// ── Rate limiting (Bài 36) ───────────────────────────────────────────────
// ORDER MATTERS. The specific limiters are mounted on their exact paths first;
// generalLimiter goes on /api/v1 afterwards as the catch-all ceiling.
// (aiLimiter lives inside aiRoutes, next to the route it protects.)
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);
app.use('/api/v1', generalLimiter);

// ── API routes (v1) ──────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/ai', aiRoutes);
// reviewRoutes owns both /products/:id/reviews and /reviews/:id, so it mounts on the
// version prefix itself rather than on one resource.
app.use('/api/v1', reviewRoutes);

// ── Error handling (must be LAST) ────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
