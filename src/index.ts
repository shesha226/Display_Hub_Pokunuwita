import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import userRouter from "./routes/userRoutes";
import customerRouter from "./routes/customerRouter";
import accessoryRouter from "./routes/accessoryRourer";
import repairPartsRouter from "./routes/repairPartsRouter";
import paymentRouter from "./routes/paymentRouter";
import orderRouter from "./routes/orderRouter";
import orderItems from "./routes/orderItemRouter";
import reportRoutes from "./routes/reportRouter";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

// 🔹 API routes
app.use("/api/users", userRouter);
app.use("/api/customers", customerRouter);
app.use("/api/accessories", accessoryRouter);
app.use("/api/repair-parts", repairPartsRouter);
app.use("/api/payments", paymentRouter);

app.use("/api/orders", orderRouter);
app.use("/api/order-items", orderItems);
app.use("/api/reports", reportRoutes);

// ✅ CONNECTION TEST ROUTE
app.get("/api/test", (_req: Request, res: Response) => {
  res.json({ message: "Backend connected successfullylk 🚀" });
});

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
