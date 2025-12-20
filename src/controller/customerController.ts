import { Request, Response } from "express";
import dbPromise from "../config/db";

// CREATE
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, address, phone } = req.body;

    if (!name || !email || !address || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = await dbPromise;

    const [exist]: any = await db.query(
      "SELECT id FROM customers WHERE email = ?",
      [email]
    );

    if (exist.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    await db.query(
      "INSERT INTO customers (name, email, address, phone) VALUES (?, ?, ?, ?)",
      [name, email, address, phone]
    );

    res.status(201).json({ message: "Customer created" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// READ ALL
export const getAllCustomers = async (_req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const [rows]: any = await db.query(
      "SELECT id, name, email, address, phone FROM customers"
    );

    res.json({ customers: rows });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// UPDATE
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, address, phone } = req.body;
    const { id } = req.params;

    const db = await dbPromise;

    await db.query(
      "UPDATE customers SET name=?, email=?, address=?, phone=? WHERE id=?",
      [name, email, address, phone, id]
    );

    res.json({ message: "Customer updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// DELETE
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    await db.query("DELETE FROM customers WHERE id=?", [req.params.id]);
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};
