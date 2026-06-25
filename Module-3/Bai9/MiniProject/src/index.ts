import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import prisma from './db/prisma';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import classRoutes from './routes/classRoutes';
import studentRoutes from './routes/studentRoutes';
import statsRoutes from './routes/statsRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';
import { swaggerSpec } from './docs/swagger';

const app = express();
const port = process.env.PORT || 3000;

// ── Security & infrastructure middleware (Bài 9 hardening) ──
app.use(helmet()); // sets secure HTTP headers (CSP, HSTS, X-Frame-Options, ...)
app.use(cors());
app.use(requestLogger); // log every request (morgan)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health & readiness probes ──
// liveness: is the process up? (no external dependency)
app.get('/health', (req, res) => {
  res.json({ success: true, status: 'up' });
});
// readiness: can we actually serve traffic? (verify the DB is reachable)
app.get('/ready', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, status: 'ready' });
  } catch {
    res.status(503).json({ success: false, status: 'not-ready', message: 'Database unavailable' });
  }
});

// ── API docs (Swagger UI) ──
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Rate limiting ──
app.use('/api/v1/auth', authLimiter); // strict limit on auth endpoints
app.use('/api/v1', apiLimiter); // general limit for the rest of the API

// ── API routes (v1) ──
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/stats', statsRoutes);

// ── Error handling (LAST) ──
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📖 API docs:    http://localhost:${port}/api-docs`);
  console.log(`📊 Health:      http://localhost:${port}/health`);
});

export default app;
