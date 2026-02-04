import * as repo from "../repositories/orderRepository";
import dbPromise from "../config/db";

export const createOrder = async (customer_id: number, items: any[]) => {
  if (!customer_id || items.length === 0) throw new Error("Invalid order data");

  const pool = await dbPromise;
  const conn = await pool.getConnection();
  let orderId: number;
  let totalAmount = 0;

  try {
    await conn.beginTransaction();

    const invoice_number = await repo.getNextInvoiceNumber();

    orderId = await repo.createOrderRecord(customer_id, invoice_number);

    for (const item of items) {
      if (!item.accessory_id || item.quantity <= 0)
        throw new Error("Invalid item");

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

    await conn.query("UPDATE orders SET total_amount = ? WHERE id = ?", [
      totalAmount,
      orderId,
    ]);

    await conn.commit();
    return { orderId, invoice_number, totalAmount };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getAllOrders = async () => {
  const orders = await repo.getAllOrdersRepo();
  return orders;
};

export const getOrderById = async (id: number) => {
  const order = await repo.getOrderByIdRepo(id);
  if (order.length === 0) throw new Error("Order not found");
  return order[0];
};

export const deleteOrder = async (id: number) => {
  const pool = await dbPromise;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const items = await repo.getOrderItemsRepo(id, conn);
    if (items.length === 0) throw new Error("Order not found");

    for (const item of items) {
      await conn.query(
        "UPDATE accessories SET qty_on_hand = qty_on_hand + ? WHERE id = ?",
        [item.quantity, item.accessory_id]
      );
    }

    await repo.deleteOrderRepo(id, conn);

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
