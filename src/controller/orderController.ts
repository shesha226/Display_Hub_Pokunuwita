import { Request, Response } from "express";
import dbPromise from "../config/db";

/**
 * CREATE ORDER (SECURE) with auto invoice_number
 */
export const createOrder = async (req: Request, res: Response) => {
  const { customer_id, items } = req.body;
  const pool = await dbPromise;
  const conn = await pool.getConnection();

  try {
    if (!customer_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    await conn.beginTransaction();

    // 1️⃣ Generate next invoice_number
    const [invoiceRows]: any = await conn.query(
      `SELECT IFNULL(
          CONCAT('ORD', LPAD(CAST(SUBSTRING(MAX(invoice_number), 4) AS UNSIGNED)+1, 4, '0')),
          'ORD0001'
        ) AS next_invoice
       FROM orders`
    );
    const invoice_number = invoiceRows[0].next_invoice;

    // 2️⃣ Insert order with invoice_number
    const [orderResult]: any = await conn.query(
      "INSERT INTO orders (customer_id, total_amount, invoice_number) VALUES (?, 0, ?)",
      [customer_id, invoice_number]
    );

    const orderId = orderResult.insertId;
    let totalAmount = 0;

    // 3️⃣ Process order items
    for (const item of items) {
      if (!item.accessory_id || !item.quantity || item.quantity <= 0) {
        throw new Error("Invalid item data");
      }

      const [rows]: any = await conn.query(
        "SELECT price, discount, qty_on_hand FROM accessories WHERE id = ? FOR UPDATE",
        [item.accessory_id]
      );

      if (rows.length === 0) throw new Error("Accessory not found");
      const { price, discount, qty_on_hand } = rows[0];

      if (qty_on_hand < item.quantity) throw new Error("Not enough stock");

      const finalPrice = (price - (discount || 0)) * item.quantity;
      totalAmount += finalPrice;

      await conn.query(
        `INSERT INTO order_items
         (order_id, accessory_id, quantity, price, discount, final_price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.accessory_id,
          item.quantity,
          price,
          discount || 0,
          finalPrice,
        ]
      );

      await conn.query(
        "UPDATE accessories SET qty_on_hand = qty_on_hand - ? WHERE id = ?",
        [item.quantity, item.accessory_id]
      );
    }

    // 4️⃣ Update total_amount
    await conn.query("UPDATE orders SET total_amount = ? WHERE id = ?", [
      totalAmount,
      orderId,
    ]);

    await conn.commit();

    res.status(201).json({
      message: "Order created successfully ✅",
      order_id: orderId,
      invoice_number,
      total_amount: totalAmount,
    });
  } catch (error: any) {
    await conn.rollback();
    res.status(400).json({ message: error.message });
  } finally {
    conn.release();
  }
};

/**
 * GET ALL ORDERS (include invoice_number)
 */
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;

    const [rows] = await db.query(`
      SELECT 
        o.id,
        o.invoice_number,
        c.name AS customer_name,
        c.phone AS customer_phone,
        o.total_amount,
        o.created_at
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `);

    return res.json({ orders: rows });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * GET ORDER BY ID (with items and invoice_number)
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const { id } = req.params;

    const [order]: any = await db.query(
      `SELECT o.id, o.invoice_number, o.total_amount, o.created_at, 
              c.name AS customer_name, c.phone AS customer_phone
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       WHERE o.id = ?`,
      [id]
    );

    if (order.length === 0)
      return res.status(404).json({ message: "Order not found" });

    const [items]: any = await db.query(
      `SELECT oi.quantity, oi.final_price, a.item_name
       FROM order_items oi
       JOIN accessories a ON oi.accessory_id = a.id
       WHERE oi.order_id = ?`,
      [id]
    );

    res.json({ ...order[0], items });
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * DELETE ORDER (restore stock safely)
 */
export const deleteOrder = async (req: Request, res: Response) => {
  const pool = await dbPromise;
  const conn = await pool.getConnection();

  try {
    const { id } = req.params;
    await conn.beginTransaction();

    const [items]: any = await conn.query(
      "SELECT accessory_id, quantity FROM order_items WHERE order_id = ?",
      [id]
    );

    if (items.length === 0) throw new Error("Order not found");

    for (const item of items) {
      await conn.query(
        "UPDATE accessories SET qty_on_hand = qty_on_hand + ? WHERE id = ?",
        [item.quantity, item.accessory_id]
      );
    }

    await conn.query("DELETE FROM order_items WHERE order_id = ?", [id]);
    await conn.query("DELETE FROM orders WHERE id = ?", [id]);

    await conn.commit();

    res.json({ message: "Order deleted successfully" });
  } catch (err: any) {
    await conn.rollback();
    res.status(400).json({ message: err.message });
  } finally {
    conn.release();
  }
};

/**
 * UPDATE ORDER (secure, with items)
 */
export const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { customer_id, items } = req.body;

  const pool = await dbPromise;
  const conn = await pool.getConnection();

  try {
    if (!customer_id && (!items || items.length === 0)) {
      return res.status(400).json({ message: "No data to update" });
    }

    await conn.beginTransaction();

    // Update customer_id if provided
    if (customer_id) {
      const [custResult]: any = await conn.query(
        "UPDATE orders SET customer_id = ? WHERE id = ?",
        [customer_id, id]
      );
      if (custResult.affectedRows === 0) throw new Error("Order not found");
    }

    let totalAmount = 0;

    if (items && items.length > 0) {
      // Restore stock from existing items
      const [existingItems]: any = await conn.query(
        "SELECT accessory_id, quantity FROM order_items WHERE order_id = ?",
        [id]
      );

      for (const item of existingItems) {
        await conn.query(
          "UPDATE accessories SET qty_on_hand = qty_on_hand + ? WHERE id = ?",
          [item.quantity, item.accessory_id]
        );
      }

      // Delete old items
      await conn.query("DELETE FROM order_items WHERE order_id = ?", [id]);

      // Insert new items
      for (const item of items) {
        const [rows]: any = await conn.query(
          "SELECT price, discount, qty_on_hand FROM accessories WHERE id = ? FOR UPDATE",
          [item.accessory_id]
        );

        if (rows.length === 0) throw new Error("Accessory not found");
        const { price, discount, qty_on_hand } = rows[0];

        if (qty_on_hand < item.quantity) {
          throw new Error(
            `Not enough stock for accessory ${item.accessory_id}`
          );
        }

        const finalPrice = (price - (discount || 0)) * item.quantity;
        totalAmount += finalPrice;

        await conn.query(
          `INSERT INTO order_items
           (order_id, accessory_id, quantity, price, discount, final_price)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            id,
            item.accessory_id,
            item.quantity,
            price,
            discount || 0,
            finalPrice,
          ]
        );

        await conn.query(
          "UPDATE accessories SET qty_on_hand = qty_on_hand - ? WHERE id = ?",
          [item.quantity, item.accessory_id]
        );
      }

      // Update total_amount
      await conn.query("UPDATE orders SET total_amount = ? WHERE id = ?", [
        totalAmount,
        id,
      ]);
    }

    await conn.commit();
    res.json({
      message: "Order updated successfully ✅",
      total_amount: totalAmount,
    });
  } catch (err: any) {
    await conn.rollback();
    res.status(400).json({ message: err.message });
  } finally {
    conn.release();
  }
};
