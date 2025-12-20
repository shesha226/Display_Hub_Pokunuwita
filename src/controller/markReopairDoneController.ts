import { Request, Response } from "express";
import dbPromise from "../config/db";

export const markRepairAsDone = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await dbPromise;

    // pending repair එක select කරන්න
    const [rows]: any = await db.query("SELECT * FROM repairs WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Repair not found" });

    const repair = rows[0];

    // completed_repairs table එකට insert කරන්න
    await db.query(
      `INSERT INTO completed_repairs (customer_name, phone_model, issue, repair_cost, status) VALUES (?, ?, ?, ?, ?)`,
      [
        repair.customer_name,
        repair.phone_model,
        repair.issue,
        repair.repair_cost,
        "completed",
      ]
    );

    // pending table එකෙන් delete කරන්න
    await db.query("DELETE FROM repairs WHERE id = ?", [id]);

    res.status(200).json({ message: "Repair marked as done" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
