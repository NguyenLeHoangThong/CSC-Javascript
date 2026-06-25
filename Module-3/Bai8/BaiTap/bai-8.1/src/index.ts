import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// ── Bài 8.1: Role-Based Access Control (RBAC) ────────────────
// Focus: an authorize(...roles) middleware that runs AFTER authenticate.
// Two seeded accounts: an admin and a normal user.

const app = express();
const PORT = process.env.PORT || 3003;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

app.use(cors());
app.use(express.json());

// Seed users with pre-hashed passwords (hashSync so we can do it at module load)
const users = [
  { id: 1, email: 'admin@demo.com', role: 'admin', passwordHash: bcrypt.hashSync('admin123', 10) },
  { id: 2, email: 'user@demo.com', role: 'user', passwordHash: bcrypt.hashSync('user123', 10) },
];

interface Post {
  id: number;
  title: string;
  authorId: number;
}
const posts: Post[] = [{ id: 1, title: 'Hello world', authorId: 1 }];
let nextPostId = 2;

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

// 1) authenticate — verify token, attach req.user
function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authenticated' });
  try {
    req.user = jwt.verify(header.split(' ')[1], JWT_SECRET) as { id: number; role: string };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// 2) authorize — allow only the listed roles (run AFTER authenticate)
function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  const user = users.find((u) => u.email === email);
  const ok = user && (await bcrypt.compare(password ?? '', user.passwordHash));
  if (!user || !ok) return res.status(401).json({ message: 'Invalid email or password' });
  // Put the role INSIDE the token so authorize() can read it without a DB lookup.
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role });
});

// Anyone can read
app.get('/posts', (req: Request, res: Response) => res.json(posts));

// Only admin can create / delete
app.post('/posts', authenticate, authorize('admin'), (req: AuthRequest, res: Response) => {
  const post: Post = { id: nextPostId++, title: req.body?.title ?? 'Untitled', authorId: req.user!.id };
  posts.push(post);
  res.status(201).json(post);
});

app.delete('/posts/:id', authenticate, authorize('admin'), (req: Request, res: Response) => {
  const idx = posts.findIndex((p) => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Post not found' });
  posts.splice(idx, 1);
  res.json({ message: 'deleted' });
});

app.listen(PORT, () => console.log(`🛡️  Bài 8.1 RBAC running on http://localhost:${PORT}`));
