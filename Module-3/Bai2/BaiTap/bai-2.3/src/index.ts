import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { logger } from "./middleware/logger";
import { requestTimer } from "./middleware/validators";
import bookRoutes from "./routes/bookRoutes";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(requestTimer);
app.use("/books", bookRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `${req.url} không tìm thấy` });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(500).json({ message: "Lỗi server" });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
