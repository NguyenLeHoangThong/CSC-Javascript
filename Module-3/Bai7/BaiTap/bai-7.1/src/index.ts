import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import * as yup from 'yup';

// ── Bài 7.1: JWT auth basics ─────────────────────────────────
// Focus: hash password with bcrypt, sign a JWT on login, protect a route.
// Users are kept in memory (an array) so we can concentrate on the auth flow,
// not on the database.

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';

app.use(cors());
app.use(express.json());

// In-memory "table" of users
interface User {
  id: number;
  email: string;
  passwordHash: string;
}
const users: User[] = [];
let nextId = 1;

// Validation schemas
const registerSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6, 'Password must be at least 6 chars').required(),
});
const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

// Auth middleware: read "Authorization: Bearer <token>", verify it, attach req.userId
interface AuthRequest extends Request {
  userId?: number;
}
function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' });
  }
  try {
    const payload = jwt.verify(header.split(' ')[1], JWT_SECRET) as { id: number };
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// POST /register — hash the password, store the user
app.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = await registerSchema.validate(req.body);
    if (users.some((u) => u.email === email)) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = { id: nextId++, email, passwordHash };
    users.push(user);
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// POST /login — verify the password, return a signed JWT
app.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = await loginSchema.validate(req.body);
    const user = users.find((u) => u.email === email);
    // Same message whether email or password is wrong → avoid user enumeration
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!user || !ok) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES } as SignOptions);
    res.json({ token });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// GET /me — protected: only reachable with a valid token
app.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  const user = users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ id: user.id, email: user.email });
});

app.listen(PORT, () => console.log(`🔐 Bài 7.1 auth running on http://localhost:${PORT}`));
