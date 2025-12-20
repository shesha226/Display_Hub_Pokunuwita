import { Request, Response } from "express";
import dbPromise from "../config/db";

/* ================= CREATE PAYMENT ================= */
export const createPayment = async (req: Request, res: Response) => {
  try {
    const {
      customer_id,
      order_id,
      completed_repair_id,
      amount,
      payment_method,
      payment_date,
    } = req.body;

    if (!customer_id || !amount || !payment_method || !payment_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const db = await dbPromise;

    await db.query(
      `INSERT INTO payments
        (customer_id, order_id, completed_repair_id, amount, payment_method, payment_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        order_id || null,
        completed_repair_id || null,
        amount,
        payment_method,
        payment_date,
      ]
    );

    res.status(201).json({ message: "Payment created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL PAYMENTS ================= */
export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const [rows] = await db.query(`SELECT * FROM payments ORDER BY id DESC`);
    res.status(200).json(rows); // ✅ ARRAY ONLY
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET PAYMENTS BY CUSTOMER ================= */
export const getPaymentsByCustomerId = async (req: Request, res: Response) => {
  try {
    const customerId = req.params.customerId;
    const db = await dbPromise;

    const [rows] = await db.query(
      `SELECT p.*, 
              r.phone_model AS repair_model,
              o.total_amount AS order_total
       FROM payments p
       LEFT JOIN completed_repairs r ON p.completed_repair_id = r.id
       LEFT JOIN orders o ON p.order_id = o.id
       WHERE p.customer_id = ?
       ORDER BY p.payment_date DESC`,
      [customerId]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching payments by customer:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

/* ================= UPDATE PAYMENT ================= */
export const updatePaymentById = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const paymentId = req.params.id;
    const { amount, payment_date, payment_method, note } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Missing amount" });
    }

    const [result] = await db.query(
      "UPDATE payments SET amount = ?, payment_date = ?, payment_method = ?, note = ? WHERE id = ?",
      [
        amount,
        payment_date || new Date(),
        payment_method || "cash",
        note || null,
        paymentId,
      ]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const [rows] = await db.query("SELECT * FROM payments WHERE id = ?", [
      paymentId,
    ]);

    return res.status(200).json({
      message: "Payment updated successfully",
      payment: (rows as any)[0],
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

/* ================= DELETE PAYMENT ================= */
export const deletePaymentById = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const paymentId = req.params.id;

    const [existingPayment] = await db.query(
      "SELECT * FROM payments WHERE id = ?",
      [paymentId]
    );
    if ((existingPayment as any).length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await db.query("DELETE FROM payments WHERE id = ?", [paymentId]);
    return res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
