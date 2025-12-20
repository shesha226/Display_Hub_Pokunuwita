import { Router } from "express";
import {
  createPayment,
  getPaymentsByCustomerId,
  deletePaymentById,
  updatePaymentById,
  getAllPayments,
} from "../controller/paymentsController";

const router = Router();

// ✅ Get all payments
router.get("/", getAllPayments);

// ✅ Create a new payment
router.post("/", createPayment);

// ✅ Get payments by order id
router.get("/order/:orderId", getPaymentsByCustomerId);

// ✅ Update payment by ID
router.put("/:id", updatePaymentById);

// ✅ Delete payment by ID
router.delete("/:id", deletePaymentById);

export default router;
