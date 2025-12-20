import { Request, Response } from "express";
import dbPromise from "../config/db";

/**
 * CREATE ORDER ITEM
 */
export const createOrderItem = async (req: Request, res: Response) => {
  try {
    const { order_id, accessory_id, quantity, price, discount } = req.body;

    if (!order_id || !accessory_id || !quantity || !price) {
      return res.status(400).json({
        message: "order_id, accessory_id, quantity, and price are required",
      });
    }

    const final_price = price * quantity - (discount || 0);

    const db = await dbPromise;

    const [result] = await db.query(
      `INSERT INTO order_items 
       (order_id, accessory_id, quantity, price, discount, final_price)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [order_id, accessory_id, quantity, price, discount || 0, final_price]
    );

    return res.status(201).json({
      message: "Order item added successfully",
      order_item_id: (result as any).insertId,
    });
  } catch (err) {
    console.error("Error creating order item:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * GET ALL ITEMS FOR AN ORDER
 */
export const getOrderItemsByOrderId = async (req: Request, res: Response) => {
  try {
    const { order_id } = req.params;
    const db = await dbPromise;

    const [rows] = await db.query(
      `SELECT oi.*, a.item_name, a.price AS accessory_price
       FROM order_items oi
       LEFT JOIN accessories a ON oi.accessory_id = a.id
       WHERE oi.order_id = ?`,
      [order_id]
    );

    return res.json(rows);
  } catch (err) {
    console.error("Error fetching order items:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Get order item by id
export const getOrderItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await dbPromise;
    const [rows] = await db.query(
      `SELECT oi.*, a.item_name, a.price AS accessory_price
       FROM order_items oi
       LEFT JOIN accessories a ON oi.accessory_id = a.id
       WHERE oi.id = ?`,
      [id]
    );
    if ((rows as any).length === 0) {
      return res.status(404).json({ message: "Order item not found" });
    }

    return res.json((rows as any)[0]);
  } catch (err) {
    console.error("Error fetching order item:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * UPDATE ORDER ITEM
 */
export const updateOrderItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity, price, discount } = req.body;

    if (!quantity && !price && discount === undefined) {
      return res
        .status(400)
        .json({ message: "At least one field is required" });
    }

    const db = await dbPromise;

    // Calculate final_price if any relevant fields are provided
    const final_price = (price || 0) * (quantity || 0) - (discount || 0);

    const [result] = await db.query(
      `UPDATE order_items 
       SET quantity = ?, price = ?, discount = ?, final_price = ?
       WHERE id = ?`,
      [quantity, price, discount || 0, final_price, id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: "Order item not found" });
    }

    return res.json({ message: "Order item updated successfully" });
  } catch (err) {
    console.error("Error updating order item:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * DELETE ORDER ITEM
 */
export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await dbPromise;

    const [result] = await db.query("DELETE FROM order_items WHERE id = ?", [
      id,
    ]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: "Order item not found" });
    }

    return res.json({ message: "Order item deleted successfully" });
  } catch (err) {
    console.error("Error deleting order item:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
