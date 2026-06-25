import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// ── Bài 9.1: Production hardening ─────────────────────────────
// Focus: wrap a tiny Quotes API with the middleware you ship to production:
// helmet (secure headers), morgan (logging), rate limiting, and a central error handler.

const app = express();
const PORT = process.env.PORT || 3005;

// Secure HTTP headers (CSP, HSTS, X-Frame-Options, ...)
app.use(helmet());
app.use(cors());
// Request logging — 'dev' while developing, 'combined' in production
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

// Rate limit: max 5 requests / 10s per IP — small numbers so it's easy to trigger in class.
const limiter = rateLimit({
  windowMs: 10 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, slow down!' },
});
app.use(limiter);

const quotes = [
  'Talk is cheap. Show me the code.',
  'Premature optimization is the root of all evil.',
  'There are only two hard things in CS: cache invalidation and naming things.',
];

app.get('/quotes', (req: Request, res: Response) => res.json(quotes));

app.get('/quotes/random', (req: Request, res: Response) => {
  res.json({ quote: quotes[Math.floor(Math.random() * quotes.length)] });
});

// A route that throws, to demonstrate the central error handler catching it.
app.get('/boom', (req: Request, res: Response) => {
  throw new Error('Something went wrong on purpose');
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `Not found: ${req.method} ${req.path}` });
});

// Central error handler — MUST have 4 args and be registered LAST.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => console.log(`🛡️  Bài 9.1 hardening running on http://localhost:${PORT}`));
