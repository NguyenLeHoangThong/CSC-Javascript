import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import statsRoutes from './routes/statsRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 3000;

// ── Global middleware ──
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      "http://localhost:5173",       // local dev
      "http://localhost:4173",       // local preview
      process.env.FE_URL ?? "",      // production FE URL
    ].filter(Boolean);

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  allowedHeaders: ["Content-Type", "Authorization"],
  methods:        ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

app.use(express.json());
app.use(morgan("dev"));

// ── Health check ──
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'CSC Shop API is running' });
});

// ── API routes (v1) ──
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/stats', statsRoutes);

// ── Error handling (must be LAST) ──
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🛒 CSC Shop API running on http://localhost:${port}`);
});

export default app;
