import dbPromise from "../config/db";

export const insertAccessory = async (
  category: string,
  item_name: string,
  item_number: string,
  price: number,
  discount: number,
  offer_price: number,
  qty_on_hand: number
) => {
  const db = await dbPromise;

  const [result] = await db.query(
    `INSERT INTO accessories 
      (category, item_name, item_number, price, discount, offer_price, qty_on_hand)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      category,
      item_name,
      item_number,
      price,
      discount,
      offer_price,
      qty_on_hand,
    ]
  );
  return result;
};

export const getAccessoryById = async (id: number) => {
  const db = await dbPromise;
  const [rows] = await db.query("SELECT * FROM accessories WHERE id = ?", [id]);
  return rows;
};

export const getAllAccessories = async () => {
  const db = await dbPromise;
  const [rows] = await db.query("SELECT * FROM accessories");
  return rows;
};

export const updateAccessory = async (
  id: number,
  category: string,
  item_name: string,
  item_number: string,
  price: number,
  discount: number,
  offer_price: number,
  qty_on_hand: number
) => {
  const db = await dbPromise;
  const [result] = await db.query(
    `UPDATE accessories 
     SET category=?, item_name=?, item_number=?, price=?, discount=?, offer_price=?, qty_on_hand=?
     WHERE id=?`,
    [
      category,
      item_name,
      item_number,
      price,
      discount,
      offer_price,
      qty_on_hand,
      id,
    ]
  );
  return result;
};

export const deleteAccessory = async (id: number) => {
  const db = await dbPromise;
  const [result] = await db.query("DELETE FROM accessories WHERE id = ?", [id]);
  return result;
};

export const checkAccessoryUsedInOrders = async (id: number) => {
  const db = await dbPromise;
  const [rows] = await db.query(
    "SELECT * FROM order_items WHERE accessory_id = ?",
    [id]
  );
  return rows;
};

export const findAccessoryByNameOrNumber = async (
  item_name: string,
  item_number: string,
  excludeId?: number
) => {
  const db = await dbPromise;
  let query = "SELECT * FROM accessories WHERE (item_name=? OR item_number=?)";
  const params: any[] = [item_name, item_number];

  if (excludeId) {
    query += " AND id != ?";
    params.push(excludeId);
  }

  const [rows] = await db.query(query, params);
  return rows;
};
