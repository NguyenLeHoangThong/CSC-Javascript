import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employeeRoutes';
import departmentRoutes from './routes/departmentRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ success: true, message: 'OK' }));

app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/departments', departmentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => console.log(`👔 Bài 6.1 employee-management on http://localhost:${port}`));

export default app;
