import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

// ── Bài 7.2: access + refresh token with rotation ────────────
// Focus: short-lived access token + long-lived refresh token.
// /refresh issues a NEW pair and invalidates the old refresh token (rotation).
// /logout removes the stored refresh token so it can no longer be used.

const app = express();
const PORT = process.env.PORT || 3002;
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh';
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

app.use(cors());
app.use(express.json());

interface User {
  id: number;
  email: string;
  passwordHash: string;
  refreshToken: string | null; // the ONE refresh token currently valid for this user
}
const users: User[] = [];
let nextId = 1;

function issueTokens(user: User) {
  const accessToken = jwt.sign({ id: user.id }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES } as SignOptions);
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES } as SignOptions);
  return { accessToken, refreshToken };
}

app.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ message: 'email & password required' });
  if (users.some((u) => u.email === email)) return res.status(409).json({ message: 'Email exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ id: nextId++, email, passwordHash, refreshToken: null });
  res.status(201).json({ message: 'registered' });
});

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  const user = users.find((u) => u.email === email);
  const ok = user && (await bcrypt.compare(password ?? '', user.passwordHash));
  if (!user || !ok) return res.status(401).json({ message: 'Invalid email or password' });

  const tokens = issueTokens(user);
  user.refreshToken = tokens.refreshToken; // store so we can revoke / detect reuse
  res.json(tokens);
});

// Exchange a valid refresh token for a brand-new pair (rotation).
app.post('/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });

  let payload: { id: number };
  try {
    payload = jwt.verify(refreshToken, REFRESH_SECRET) as { id: number };
  } catch {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }

  const user = users.find((u) => u.id === payload.id);
  // The token must match the one we stored — otherwise it was rotated or revoked.
  if (!user || user.refreshToken !== refreshToken) {
    return res.status(401).json({ message: 'Refresh token revoked' });
  }

  const tokens = issueTokens(user);
  user.refreshToken = tokens.refreshToken; // rotate: old refresh token no longer valid
  res.json(tokens);
});

// Revoke the stored refresh token.
app.post('/logout', (req: Request, res: Response) => {
  const { refreshToken } = req.body ?? {};
  const user = users.find((u) => u.refreshToken === refreshToken);
  if (user) user.refreshToken = null;
  res.json({ message: 'logged out' });
});

app.listen(PORT, () => console.log(`🔁 Bài 7.2 refresh-token running on http://localhost:${PORT}`));
