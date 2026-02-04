"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const customerRouter_1 = __importDefault(require("./routes/customerRouter"));
const accessoryRourer_1 = __importDefault(require("./routes/accessoryRourer"));
const repairPartsRouter_1 = __importDefault(require("./routes/repairPartsRouter"));
const paymentRouter_1 = __importDefault(require("./routes/paymentRouter"));
const orderRouter_1 = __importDefault(require("./routes/orderRouter"));
const orderItemRouter_1 = __importDefault(require("./routes/orderItemRouter"));
const reportRouter_1 = __importDefault(require("./routes/reportRouter"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
app.use(express_1.default.json());
// 🔹 API routes
app.use("/api/users", userRoutes_1.default);
app.use("/api/customers", customerRouter_1.default);
app.use("/api/accessories", accessoryRourer_1.default);
app.use("/api/repair-parts", repairPartsRouter_1.default);
app.use("/api/payments", paymentRouter_1.default);
app.use("/api/orders", orderRouter_1.default);
app.use("/api/order-items", orderItemRouter_1.default);
app.use("/api/reports", reportRouter_1.default);
// ✅ CONNECTION TEST ROUTE
app.get("/api/test", (_req, res) => {
    res.json({ message: "Backend connected successfullylk 🚀" });
});
// 404
app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// Error handler
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
exports.default = app;
