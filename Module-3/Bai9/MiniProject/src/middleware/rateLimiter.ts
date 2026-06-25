import rateLimit from 'express-rate-limit';

// Generic limiter for the whole API — protects against abuse / brute force at scale.
// 100 requests per IP per 15 minutes.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true, // send RateLimit-* headers
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
});

// Stricter limiter for auth endpoints (login/register/refresh) — these are the
// favourite target of credential-stuffing attacks, so we allow far fewer attempts.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts, please try again later' },
});
