import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import classRoutes from "./routes/classRoutes";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());
app.use("/api/v1/classes", classRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `${req.url} không tìm thấy` });
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
