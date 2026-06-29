import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ success: true, message: 'shop-backend OK' }));

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => console.log(`🛒 shop-backend (Bài 5.2) on http://localhost:${port}`));

export default app;
