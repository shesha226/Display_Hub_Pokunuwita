import dbPromis from "../config/db";

export const insertOrderItem = async (
  order_id: number,
  accessory_id: number,
  quantity: number,
  price: number,
  discount: number,
  final_price: number
) => {
  const db = await dbPromis;
  const [result] = await db.query(
    `INSERT INTO order_items (order_id, accessory_id, quantity, price, discount, final_price) VALUES (?, ?, ?, ?, ?, ?)`,
    [order_id, accessory_id, quantity, price, discount, final_price]
  );
  return result;
};

export const updateOrderItem = async (
  id: number,
  quantity: number,
  price: number,
  discount: number,
  final_price: number
) => {
  const db = await dbPromis;
  const [result] = await db.query(
    `UPDATE order_items SET quantity = ?, price = ?, discount = ?, final_price = ? WHERE id = ?`,
    [quantity, price, discount, final_price, id]
  );
  return result;
};

export const deleteOrderItem = async (id: number) => {
  const db = await dbPromis;
  const [result] = await db.query(`DELETE FROM order_items WHERE id = ?`, [id]);
  return result;
};

export const getAllOrderItems = async () => {
  const db = await dbPromis;
  const [result] = await db.query(`SELECT * FROM order_items`);
  return result;
};

export const getOrderItemById = async (id: number) => {
  const db = await dbPromis;
  const [result] = await db.query(`SELECT * FROM order_items WHERE id = ?`, [
    id,
  ]);
  return result;
};
