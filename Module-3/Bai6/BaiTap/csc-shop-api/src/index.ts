import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import statsRoutes from './routes/statsRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const port = process.env.PORT || 3000;

// ── Global middleware ──
app.use(cors());
app.use(express.json());

// ── Health check ──
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'CSC Shop API is running' });
});

// ── API routes (v1) ──
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
