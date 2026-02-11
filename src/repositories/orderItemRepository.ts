import dbPromise from "../config/db";

export const OrderItemRepository = {
  async insertOrderItem(data: {
    order_id: number;
    accessory_id: number;
    quantity: number;
    price: number;
    discount: number;
    final_price: number;
  }) {
    const db = await dbPromise;
    const [result] = await db.query(
      `INSERT INTO order_items (order_id, accessory_id, quantity, price, discount, final_price) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.order_id,
        data.accessory_id,
        data.quantity,
        data.price,
        data.discount,
        data.final_price,
      ]
    );
    return { id: (result as any).insertId };
  },

  async updateOrderItem(id: number, data: {
    quantity: number;
    price: number;
    discount: number;
    final_price: number;
  }) {
    const db = await dbPromise;
    const [result] = await db.query(
      `UPDATE order_items SET quantity = ?, price = ?, discount = ?, final_price = ? WHERE id = ?`,
      [data.quantity, data.price, data.discount, data.final_price, id]
    );
    return (result as any).affectedRows > 0;
  },

  async deleteOrderItem(id: number) {
    const db = await dbPromise;
    const [result] = await db.query(`DELETE FROM order_items WHERE id = ?`, [id]);
    return (result as any).affectedRows > 0;
  },

  async getAllOrderItems() {
    const db = await dbPromise;
    const [result] = await db.query(`SELECT * FROM order_items`);
    return result;
  },

  async getOrderItemById(id: number) {
    const db = await dbPromise;
    const [result] = await db.query(`SELECT * FROM order_items WHERE id = ?`, [
      id,
    ]);
    return (result as any)[0] || null;
  },
};
