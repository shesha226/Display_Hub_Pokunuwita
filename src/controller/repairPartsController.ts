import { Request, Response } from "express";
import dbPromise from "../config/db";

// POST new repair part with auto-generated invoice number
export const createRepairPart = async (req: Request, res: Response) => {
  try {
    const { customer_name, phone_model, issue, repair_cost, status, advance } =
      req.body;

    if (
      !issue ||
      !customer_name ||
      !phone_model ||
      repair_cost == null ||
      advance == null
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = await dbPromise;

    // Generate next invoice number
    const [rows]: any = await db.query(
      `SELECT IFNULL(
          CONCAT('INV', LPAD(CAST(SUBSTRING(MAX(invoice_number), 4) AS UNSIGNED)+1, 4, '0')),
          'RINV0001'
        ) AS next_invoice
      FROM repairs`
    );
    const invoice_number = rows[0].next_invoice;

    // Insert new repair
    await db.query(
      `INSERT INTO repairs 
        (invoice_number, customer_name, phone_model, issue, repair_cost, status, advance) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        invoice_number,
        customer_name,
        phone_model,
        issue,
        repair_cost,
        status || "pending",
        advance,
      ]
    );

    return res
      .status(201)
      .json({ message: "Repair part created successfully", invoice_number });
  } catch (err) {
    console.error("Error creating repair part:", err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

// GET all repair parts
export const getAllRepairParts = async (_req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const [rows]: any = await db.query(
      "SELECT * FROM repairs ORDER BY id DESC"
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching repair parts:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// GET repair part by ID
export const getRepairPartById = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const id = req.params.id;

    const [rows]: any = await db.query("SELECT * FROM repairs WHERE id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Repair part not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching repair part:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err });
  }
};

// GET only pending repairs
export const getPendingRepairs = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const [rows] = await db.query(
      "SELECT * FROM repairs WHERE status = 'pending' ORDER BY created_at DESC"
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE repair (partial or full)
export const updateRepair = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const id = req.params.id;
    const { customer_name, phone_model, issue, repair_cost, status, advance } =
      req.body;

    const [existing]: any = await db.query(
      "SELECT * FROM repairs WHERE id = ?",
      [id]
    );
    if (existing.length === 0)
      return res.status(404).json({ message: "Repair not found" });

    await db.query(
      `UPDATE repairs SET 
        customer_name = COALESCE(?, customer_name),
        phone_model = COALESCE(?, phone_model),
        issue = COALESCE(?, issue),
        repair_cost = COALESCE(?, repair_cost),
        status = COALESCE(?, status),
        advance = COALESCE(?, advance)
       WHERE id = ?`,
      [customer_name, phone_model, issue, repair_cost, status, advance, id]
    );

    const [updated]: any = await db.query(
      "SELECT * FROM repairs WHERE id = ?",
      [id]
    );
    res.status(200).json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE repair part by ID
export const deleteRepairPartById = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const id = req.params.id;

    const [existingPart]: any = await db.query(
      "SELECT * FROM repairs WHERE id = ?",
      [id]
    );
    if (existingPart.length === 0) {
      return res.status(404).json({ message: "Repair part not found" });
    }

    await db.query("DELETE FROM repairs WHERE id = ?", [id]);

    return res
      .status(200)
      .json({ message: "Repair part deleted successfully" });
  } catch (err) {
    console.error("Error deleting repair part:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err });
  }
};
