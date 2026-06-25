import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import classRoutes from './routes/classRoutes';
import studentRoutes from './routes/studentRoutes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// API Routes v1
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/students', studentRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(
  (
    err: any,
    req: Request,
    res: Response,
    next: (err?: any) => void
  ) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});

export default app;
