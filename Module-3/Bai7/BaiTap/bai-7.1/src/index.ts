import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ success: true, message: 'OK' }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => console.log(`📝 Bài 7.1 blog-auth on http://localhost:${port}`));

export default app;
