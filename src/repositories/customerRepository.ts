import dbPromise from "../config/db";

export const insertCustomer = async (
  name: string,
  email: string,
  address: string,
  phone: string
) => {
  const db = await dbPromise;
  const [result] = await db.query(
    `INSERT INTO customers (name, email, address, phone) VALUES (?, ?, ?, ?)`,
    [name, email, address, phone]
  );
  return result;
};

export const getAllCustomers = async () => {
  const db = await dbPromise;
  const [rows] = await db.query(
    `SELECT id, name, email, address, phone FROM customers`
  );
  return rows;
};

export const getCustomerById = async (id: number) => {
  const db = await dbPromise;
  const [rows] = await db.query(`SELECT * FROM customers WHERE id = ?`, [id]);
  return rows;
};

export const getCustomerByEmail = async (email: string) => {
  const db = await dbPromise;
  const [rows] = await db.query("SELECT id FROM customers WHERE email=?", [
    email,
  ]);
  return rows;
};
export const updateCustomer = async (
  id: number,
  name: string,
  email: string,
  address: string,
  phone: string
) => {
  const db = await dbPromise;
  const [result] = await db.query(
    `UPDATE customers SET name=?, email=?, address=?, phone=? WHERE id=?`,
    [name, email, address, phone, id]
  );
  return result;
};

export const deleteCustomer = async (id: number) => {
  const db = await dbPromise;
  const [result] = await db.query("DELETE FEOM customers WHERE id=?", [id]);
  return result;
};
