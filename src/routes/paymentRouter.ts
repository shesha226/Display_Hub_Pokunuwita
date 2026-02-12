import { Router } from "express";
import {
  createPayment,
  getPaymentsByCustomerId,
  deletePaymentById,
  updatePaymentById,
  getAllPayments,
} from "../controller/paymentsController";

const router = Router();


router.get("/", getAllPayments);


router.post("/", createPayment);


router.get("/order/:id", getPaymentsByCustomerId);


router.put("/:id", updatePaymentById);


router.delete("/:id", deletePaymentById);

export default router;
