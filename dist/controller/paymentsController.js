"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaymentById = exports.updatePaymentById = exports.getPaymentsByCustomerId = exports.getAllPayments = exports.createPayment = void 0;
const db_1 = __importDefault(require("../config/db"));
/* ================= CREATE PAYMENT ================= */
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id, order_id, completed_repair_id, amount, payment_method, payment_date, } = req.body;
        if (!customer_id || !amount || !payment_method || !payment_date) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const db = yield db_1.default;
        yield db.query(`INSERT INTO payments
        (customer_id, order_id, completed_repair_id, amount, payment_method, payment_date)
       VALUES (?, ?, ?, ?, ?, ?)`, [
            customer_id,
            order_id || null,
            completed_repair_id || null,
            amount,
            payment_method,
            payment_date,
        ]);
        res.status(201).json({ message: "Payment created" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.createPayment = createPayment;
/* ================= GET ALL PAYMENTS ================= */
const getAllPayments = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const [rows] = yield db.query(`SELECT * FROM payments ORDER BY id DESC`);
        res.status(200).json(rows); // ✅ ARRAY ONLY
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getAllPayments = getAllPayments;
/* ================= GET PAYMENTS BY CUSTOMER ================= */
const getPaymentsByCustomerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.params.customerId;
        const db = yield db_1.default;
        const [rows] = yield db.query(`SELECT p.*, 
              r.phone_model AS repair_model,
              o.total_amount AS order_total
       FROM payments p
       LEFT JOIN completed_repairs r ON p.completed_repair_id = r.id
       LEFT JOIN orders o ON p.order_id = o.id
       WHERE p.customer_id = ?
       ORDER BY p.payment_date DESC`, [customerId]);
        return res.status(200).json(rows);
    }
    catch (error) {
        console.error("Error fetching payments by customer:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.getPaymentsByCustomerId = getPaymentsByCustomerId;
/* ================= UPDATE PAYMENT ================= */
const updatePaymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const paymentId = req.params.id;
        const { amount, payment_date, payment_method, note } = req.body;
        if (!amount) {
            return res.status(400).json({ message: "Missing amount" });
        }
        const [result] = yield db.query("UPDATE payments SET amount = ?, payment_date = ?, payment_method = ?, note = ? WHERE id = ?", [
            amount,
            payment_date || new Date(),
            payment_method || "cash",
            note || null,
            paymentId,
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }
        const [rows] = yield db.query("SELECT * FROM payments WHERE id = ?", [
            paymentId,
        ]);
        return res.status(200).json({
            message: "Payment updated successfully",
            payment: rows[0],
        });
    }
    catch (error) {
        console.error("Error updating payment:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.updatePaymentById = updatePaymentById;
/* ================= DELETE PAYMENT ================= */
const deletePaymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const paymentId = req.params.id;
        const [existingPayment] = yield db.query("SELECT * FROM payments WHERE id = ?", [paymentId]);
        if (existingPayment.length === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }
        yield db.query("DELETE FROM payments WHERE id = ?", [paymentId]);
        return res.status(200).json({ message: "Payment deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting payment:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.deletePaymentById = deletePaymentById;
