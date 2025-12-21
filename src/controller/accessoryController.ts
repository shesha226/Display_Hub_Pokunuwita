import { Request, Response } from "express";
import dbPromise from "../config/db";

export const createAccessory = async (req: Request, res: Response) => {
  try {
    const {
      category,
      item_name,
      item_number,
      price,
      discount,
      offer_price,
      qty_on_hand,
    } = req.body;

    // Validation
    if (
      !category.trim() ||
      !item_name.trim() ||
      !item_number?.trim() ||
      !price == null ||
      !qty_on_hand == null
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = await dbPromise;

    const [exsistingAccessory] = await db.query(
      "SELECT * FROM accessories WHERE item_name = ?",
      [item_name]
    );
    if ((exsistingAccessory as any).length > 0) {
      return res.status(409).json({
        message: "Accessory already exists",
      });
    }
    // Insert new accessory
    const [result] = await db.query(
      `INSERT INTO accessories 
         ( category,item_name, item_number, price, discount, offer_price, qty_on_hand) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        category,
        item_name,
        item_number,
        price,
        discount || 0,
        offer_price || 0,
        qty_on_hand,
      ]
    );

    const [rows] = await db.query(
      "SELECT * FROM accessories WHERE item_name = ?",
      [item_name]
    );
    return res.status(201).json({
      message: "Accessory created successfully",
      accessory: (rows as any)[0],
    });
  } catch (err) {
    console.error("Error creating accessory:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//getAllAccessoriesById

export const getAccessoryById = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM accessories WHERE id = ?", [
      id,
    ]);
    if ((rows as any).length === 0) {
      return res.status(404).json({ message: "Accessory not found" });
    }
    res.json((rows as any)[0]);
  } catch (err) {
    console.error("Error fetching accessories:", err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

//getAllAccessories

export const getAllAccessories = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;

    const [rows]: any = await db.query("SELECT * FROM accessories");

    if (rows.length === 0) {
      return res.status(404).json({ message: "No accessories found" });
    }

    // Map rows to detailed JSON
    const accessories = rows.map((accessory: any) => ({
      id: accessory.id,
      category: accessory.category,
      item_name: accessory.item_name,
      item_number: accessory.item_number,
      price: Number(accessory.price),
      discount: Number(accessory.discount),
      offer_price: Number(accessory.offer_price),
      qty_on_hand: Number(accessory.qty_on_hand),
      created_at: accessory.created_at,
    }));

    return res.status(200).json({
      message: "Accessories fetched successfully",
      accessories,
    });
  } catch (err) {
    console.error("Error fetching accessories:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err,
    });
  }
};

//updateAccessoryById

export const updateAccessory = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const id = req.params.id;
    const {
      category,
      item_name,
      item_number,
      price,
      discount,
      offer_price,
      qty_on_hand,
    } = req.body;

    // Validation
    if (
      !category.trim() ||
      !item_name?.trim() ||
      !item_number?.trim() ||
      price == null ||
      qty_on_hand == null
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if accessory exists
    const [existingAccessory]: any = await db.query(
      "SELECT * FROM accessories WHERE id = ?",
      [id]
    );

    if (existingAccessory.length === 0) {
      return res.status(404).json({ message: "Accessory not found" });
    }

    // Check for duplicate item_name
    const [itemNameCheck]: any = await db.query(
      "SELECT * FROM accessories WHERE item_name = ? AND id != ?",
      [item_name, id]
    );
    if (itemNameCheck.length > 0) {
      return res
        .status(409)
        .json({ message: "Accessory with this name already exists" });
    }

    // Check for duplicate item_number
    const [itemNumberCheck]: any = await db.query(
      "SELECT * FROM accessories WHERE item_number = ? AND id != ?",
      [item_number, id]
    );
    if (itemNumberCheck.length > 0) {
      return res
        .status(409)
        .json({ message: "Accessory with this number already exists" });
    }

    // Update accessory
    await db.query(
      `UPDATE accessories 
       SET category = ?, item_name = ?, item_number = ?, price = ?, discount = ?, offer_price = ?, qty_on_hand = ? 
       WHERE id = ?`,
      [
        category,
        item_name,
        item_number,
        price,
        discount || 0,
        offer_price || 0,
        qty_on_hand,
        id,
      ]
    );

    // Fetch updated accessory
    const [updatedRows]: any = await db.query(
      "SELECT * FROM accessories WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      message: "Accessory updated successfully",
      accessory: updatedRows[0],
    });
  } catch (err) {
    console.error("Error updating accessory:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//deleteAccessoryById
export const deleteAccessory = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    // Check if accessory exists
    const [rows] = await db.query("SELECT id FROM accessories WHERE id = ?", [
      id,
    ]);
    if ((rows as any).length === 0) {
      return res.status(404).json({ message: "Accessory not found" });
    }

    // Check if accessory is used in orders
    const [used] = await db.query(
      "SELECT * FROM order_items WHERE accessory_id = ?",
      [id]
    );

    if ((used as any).length > 0) {
      return res.status(400).json({
        message: "Cannot delete accessory. It is used in existing orders.",
      });
    }

    // Safe to delete
    await db.query("DELETE FROM accessories WHERE id = ?", [id]);
    return res.status(200).json({ message: "Accessory deleted successfully" });
  } catch (err) {
    console.error("Error deleting accessory:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err });
  }
};
