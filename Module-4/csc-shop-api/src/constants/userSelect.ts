// Bài 36 — Security: single source of truth for "which User fields may leave the server".
//
// `password` (bcrypt hash) and `refreshToken` are NEVER in this list. Every query that
// returns a user must pass `select: USER_SELECT` so a future `include: { user: true }`
// cannot silently leak credentials.
export const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

// Same idea, but for a User nested inside another record (e.g. an order's buyer):
// even less data is needed there.
export const USER_PUBLIC_SELECT = {
  id: true,
  name: true,
  email: true,
} as const;
