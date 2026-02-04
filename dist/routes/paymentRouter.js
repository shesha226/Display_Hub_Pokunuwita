"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentsController_1 = require("../controller/paymentsController");
const router = (0, express_1.Router)();
// ✅ Get all payments
router.get("/", paymentsController_1.getAllPayments);
// ✅ Create a new payment
router.post("/", paymentsController_1.createPayment);
// ✅ Get payments by order id
router.get("/order/:orderId", paymentsController_1.getPaymentsByCustomerId);
// ✅ Update payment by ID
router.put("/:id", paymentsController_1.updatePaymentById);
// ✅ Delete payment by ID
router.delete("/:id", paymentsController_1.deletePaymentById);
exports.default = router;
