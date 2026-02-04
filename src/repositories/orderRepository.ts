import dbPromise from "../config/db";

export const createOrderRecord = async (
  customer_id: number,
  invoice_number: string
) => {
  const db = await dbPromise;
  const [result]: any = await db.query(
    "INSERT INTO orders (customer_id, total_amount, invoice_number) VALUES (?, 0, ?)",
    [customer_id, invoice_number]
  );
  return result.insertId;
};

export const getNextInvoiceNumber = async () => {
  const db = await dbPromise;
  const [rows]: any = await db.query(
    `SELECT IFNULL(
        CONCAT('ORD', LPAD(CAST(SUBSTRING(MAX(invoice_number), 4) AS UNSIGNED)+1, 4, '0')),
        'ORD0001'
      ) AS next_invoice
     FROM orders`
  );
  return rows[0].next_invoice;
};

export const getOrderByIdRepo = async (id: number) => {
  const db = await dbPromise;
  const [rows]: any = await db.query(
    `SELECT o.id, o.invoice_number, o.total_amount, o.created_at,
            c.name AS customer_name, c.phone AS customer_phone
     FROM orders o
     LEFT JOIN customers c ON o.customer_id = c.id
     WHERE o.id = ?`,
    [id]
  );
  return rows;
};

export const getAllOrdersRepo = async () => {
  const db = await dbPromise;
  const [rows]: any = await db.query(
    `SELECT o.id, o.invoice_number, c.name AS customer_name, c.phone AS customer_phone,
            o.total_amount, o.created_at
     FROM orders o
     LEFT JOIN customers c ON o.customer_id = c.id
     ORDER BY o.created_at DESC`
  );
  return rows;
};

export const deleteOrderRepo = async (id: number, conn: any) => {
  await conn.query("DELETE FROM order_items WHERE order_id = ?", [id]);
  await conn.query("DELETE FROM orders WHERE id = ?", [id]);
};

export const getOrderItemsRepo = async (order_id: number, conn: any) => {
  const [items]: any = await conn.query(
    "SELECT accessory_id, quantity FROM order_items WHERE order_id = ?",
    [order_id]
  );
  return items;
};
