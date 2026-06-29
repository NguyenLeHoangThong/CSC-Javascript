import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import courseRoutes from './routes/courseRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ success: true, message: 'OK' }));

app.use('/api/v1/courses', courseRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => console.log(`🎓 Bài 5.1 course-management on http://localhost:${port}`));

export default app;
