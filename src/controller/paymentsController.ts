import { Request, Response } from "express";
import { PaymentRepository } from "../repositories/paymentrRepository";
import { CustomerRepository } from "../repositories/customerRepository";


/* ================= configCREATE PAYMENT ================= */
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



    await PaymentRepository.createPayments({
      customer_id,
      order_id,
      completed_repair_id,
      amount,
      payment_method,
      payment_date,
    });

    res.status(201).json({ message: "Payment created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL PAYMENTS ================= */
export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await PaymentRepository.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET PAYMENTS BY CUSTOMER ================= */
export const getPaymentsByCustomerId = async (req: Request, res: Response) => {
  try {
    const customerId = Number(req.params.customerId);
    if (!customerId) {
      return res.status(400).json({ message: "Missing customer ID" });
    }

    const customer = await CustomerRepository.getCustomerById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const payments = await PaymentRepository.findByCustomerId(customerId);
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments by customer:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

/* ================= UPDATE PAYMENT ================= */
export const updatePaymentById = async (req: Request, res: Response) => {
  try {
    const paymentId = Number(req.params.id);
    const { amount, payment_date, payment_method, note } = req.body;

    if (!amount || !payment_date || !payment_method || !note) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingPayment = await PaymentRepository.findById(paymentId);
    if (!existingPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const result = await PaymentRepository.updateById(paymentId, {
      amount,
      payment_date,
      payment_method,
      note,
    });

    return res.status(200).json({
      message: "Payment updated successfully",
      payment: existingPayment,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

/* ================= DELETE PAYMENT ================= */
export const deletePaymentById = async (req: Request, res: Response) => {
  try {
    const paymentId = Number(req.params.id);

    const existingPayment = await PaymentRepository.findById(paymentId);
    if (!existingPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await PaymentRepository.deletePaymentById(paymentId);
    return res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
