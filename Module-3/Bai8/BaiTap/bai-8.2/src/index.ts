import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// ── Bài 8.2: Ownership ───────────────────────────────────────
// Focus: a user may edit/delete ONLY the notes they own.
// An admin bypasses the ownership check (can touch anyone's note).

const app = express();
const PORT = process.env.PORT || 3004;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

app.use(cors());
app.use(express.json());

const users = [
  { id: 1, email: 'admin@demo.com', role: 'admin', passwordHash: bcrypt.hashSync('admin123', 10) },
  { id: 2, email: 'alice@demo.com', role: 'user', passwordHash: bcrypt.hashSync('alice123', 10) },
  { id: 3, email: 'bob@demo.com', role: 'user', passwordHash: bcrypt.hashSync('bob123', 10) },
];

interface Note {
  id: number;
  text: string;
  ownerId: number;
}
const notes: Note[] = [
  { id: 1, text: "Alice's note", ownerId: 2 },
  { id: 2, text: "Bob's note", ownerId: 3 },
];
let nextNoteId = 3;

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

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

// Ownership middleware factory: looks up the resource and compares owner to req.user.
// Admins bypass the check entirely.
function authorizeNoteOwner(req: AuthRequest, res: Response, next: NextFunction) {
  const note = notes.find((n) => n.id === Number(req.params.id));
  if (!note) return res.status(404).json({ message: 'Note not found' });
  if (req.user!.role !== 'admin' && note.ownerId !== req.user!.id) {
    return res.status(403).json({ message: 'You do not own this note' });
  }
  res.locals.note = note;
  next();
}

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  const user = users.find((u) => u.email === email);
  const ok = user && (await bcrypt.compare(password ?? '', user.passwordHash));
  if (!user || !ok) return res.status(401).json({ message: 'Invalid email or password' });
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role });
});

// List my notes (admin sees all)
app.get('/notes', authenticate, (req: AuthRequest, res: Response) => {
  const visible = req.user!.role === 'admin' ? notes : notes.filter((n) => n.ownerId === req.user!.id);
  res.json(visible);
});

// Create a note owned by the current user
app.post('/notes', authenticate, (req: AuthRequest, res: Response) => {
  const note: Note = { id: nextNoteId++, text: req.body?.text ?? '', ownerId: req.user!.id };
  notes.push(note);
  res.status(201).json(note);
});

// Update / delete require ownership (or admin)
app.patch('/notes/:id', authenticate, authorizeNoteOwner, (req: Request, res: Response) => {
  const note = res.locals.note as Note;
  note.text = req.body?.text ?? note.text;
  res.json(note);
});

app.delete('/notes/:id', authenticate, authorizeNoteOwner, (req: Request, res: Response) => {
  const note = res.locals.note as Note;
  notes.splice(notes.indexOf(note), 1);
  res.json({ message: 'deleted' });
});

app.listen(PORT, () => console.log(`🔑 Bài 8.2 ownership running on http://localhost:${PORT}`));
