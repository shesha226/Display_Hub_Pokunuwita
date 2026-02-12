import dbPromise from "../config/db";

export const CustomerRepository = {
  // Insert a new customer
  async insertCustomer(
    name: string,
    email: string,
    address: string,
    phone: string
  ) {
    const db = await dbPromise;
    const [result] = await db.query(
      `INSERT INTO customers (name, email, address, phone) VALUES (?, ?, ?, ?)`,
      [name, email, address, phone]
    );
    return { id: (result as any).insertId };
  },


  async getAllCustomers() {
    const db = await dbPromise;
    const [rows] = await db.query(
      `SELECT id, name, email, address, phone FROM customers ORDER BY id DESC`
    );
    return rows;
  },


  async getCustomerById(id: number) {
    const db = await dbPromise;
    const [rows] = await db.query(
      `SELECT id, name, email, address, phone FROM customers WHERE id = ?`,
      [id]
    );
    return (rows as any)[0] || null;
  },


  async getCustomerByEmail(email: string, excludeId: number) {
    const db = await dbPromise;
    const [rows] = await db.query(
      `SELECT id FROM customers WHERE email = ? AND id != ?`,
      [email, excludeId]
    );
    return (rows as any)[0] || null;
  },

  async updateCustomer(
    id: number,
    data: { name: string; email: string; address: string; phone: string }
  ) {
    const db = await dbPromise;
    await db.query(
      `UPDATE customers SET name = ?, email = ?, address = ?, phone = ? WHERE id = ?`,
      [data.name, data.email, data.address, data.phone, id]
    );
    return { id, ...data };
  },

  async deleteCustomer(id: number) {
    const db = await dbPromise;
    const [result] = await db.query(
      `DELETE FROM customers WHERE id = ?`,
      [id]
    );
    return (result as any).affectedRows > 0;
  },
};
