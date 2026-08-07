import rateLimit, { Options } from 'express-rate-limit';
import { Request, Response } from 'express';

// Bài 36 — Security: rate limiting.
//
// One limiter is not enough: `/auth/login` needs to be strict (brute force),
// `/ai` needs to be strict (each call costs money), everything else just needs
// a sane ceiling. Order of registration matters — see app.ts.

// Every limiter answers with the SAME `{ success, message }` envelope the rest of
// the API uses, so the frontend error handling does not need a special case for 429.
function jsonHandler(message: string) {
  return (req: Request, res: Response) => {
    res.status(429).json({ success: false, message });
  };
}

const shared: Partial<Options> = {
  standardHeaders: true, // send RateLimit-* headers so clients can back off politely
  legacyHeaders: false, // drop the deprecated X-RateLimit-* headers
};

// The ceilings are env-configurable so a test run can raise them without editing code.
// An E2E suite drives hundreds of real requests from ONE IP in a couple of minutes and
// would otherwise trip `generalLimiter` halfway through — the failure would look like a
// broken app instead of a throttled test. Defaults stay production-safe.
function limitFrom(envVar: string, fallback: number): number {
  const parsed = Number(process.env[envVar]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

// Brute-force protection for credentials. 10 attempts / 15 minutes / IP.
// `skipSuccessfulRequests` means a legitimate user who logs in fine does not
// burn through the budget — only failures count.
export const authLimiter = rateLimit({
  ...shared,
  windowMs: 15 * 60 * 1000,
  limit: limitFrom("RATE_LIMIT_AUTH_MAX", 10),
  skipSuccessfulRequests: true,
  handler: jsonHandler('Too many login attempts. Please try again in 15 minutes.'),
});

// AI endpoints: every request may hit the Gemini quota, so keep it tight.
export const aiLimiter = rateLimit({
  ...shared,
  windowMs: 60 * 1000,
  limit: limitFrom('RATE_LIMIT_AI_MAX', 10),
  handler: jsonHandler('Too many AI requests. Please wait a minute.'),
});

// Catch-all ceiling for the rest of /api/v1.
export const generalLimiter = rateLimit({
  ...shared,
  windowMs: 60 * 1000,
  limit: limitFrom("RATE_LIMIT_GENERAL_MAX", 100),
  handler: jsonHandler('Too many requests. Please slow down.'),
});
