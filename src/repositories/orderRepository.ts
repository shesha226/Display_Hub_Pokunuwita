import dbPromise from "../config/db";

export const OrderRepository = {
  // Create a new order
  async createOrderRecord(customer_id: number, total_amount: number, invoice_number: string) {
    const db = await dbPromise;
    const [result]: any = await db.query(
      "INSERT INTO orders (customer_id, total_amount, invoice_number) VALUES (?, ?, ?)",
      [customer_id, total_amount, invoice_number]
    );
    return result.insertId;
  },

  // Generate next invoice number
  async getNextInvoiceNumber() {
    const db = await dbPromise;
    const [rows]: any = await db.query(
      `SELECT IFNULL(
        CONCAT('ORD', LPAD(CAST(SUBSTRING(MAX(invoice_number), 4) AS UNSIGNED)+1, 4, '0')),
        'ORD0001'
      ) AS next_invoice
      FROM orders`
    );
    return rows[0].next_invoice;
  },

  // Get order by ID
  async getOrderById(id: number) {
    const db = await dbPromise;
    const [rows]: any = await db.query(
      `SELECT o.id, o.invoice_number, o.total_amount, o.created_at,
              c.name AS customer_name, c.phone AS customer_phone
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       WHERE o.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Get all orders
  async getAllOrders() {
    const db = await dbPromise;
    const [rows]: any = await db.query(
      `SELECT o.id, o.invoice_number, c.name AS customer_name, c.phone AS customer_phone,
              o.total_amount, o.created_at
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       ORDER BY o.created_at DESC`
    );
    return rows;
  },

  // Update an order
  async updateOrder(id: number, data: { customer_id: number, total_amount: number, invoice_number: string }) {
    const db = await dbPromise;
    const [result]: any = await db.query(
      "UPDATE orders SET customer_id = ?, total_amount = ?, invoice_number = ? WHERE id = ?",
      [data.customer_id, data.total_amount, data.invoice_number, id]
    );
    return result.affectedRows > 0;
  },

  // Delete order items by order_id
  async deleteOrderItems(order_id: number) {
    const db = await dbPromise;
    await db.query("DELETE FROM order_items WHERE order_id = ?", [order_id]);
  },

  // Delete an order
  async deleteOrder(id: number) {
    const db = await dbPromise;
    const [result]: any = await db.query("DELETE FROM orders WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  // Create multiple order items
  async createOrderItems(order_id: number, items: { accessory_id: number, quantity: number, price: number, discount: number }[]) {
    if (items.length === 0) return;
    const db = await dbPromise;
    const itemsToInsert = items.map(i => [order_id, i.accessory_id, i.quantity, i.price, i.discount]);
    await db.query(
      "INSERT INTO order_items (order_id, accessory_id, quantity, price, discount) VALUES ?",
      [itemsToInsert]
    );
  },

  // Get items for a specific order
  async getOrderItems(order_id: number) {
    const db = await dbPromise;
    const [rows]: any = await db.query(
      `SELECT oi.id, a.item_name, oi.quantity, oi.price, oi.discount,
              (oi.quantity * (oi.price - oi.discount)) AS final_price
       FROM order_items oi
       LEFT JOIN accessories a ON oi.accessory_id = a.id
       WHERE oi.order_id = ?`,
      [order_id]
    );
    return rows;
  }
};
