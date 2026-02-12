import dbPromise from "../config/db";

export const AccessoryRepository = {

  async findByName(item_name: string) {
    const db = await dbPromise;
    const [rows]: any = await db.query(
      "SELECT * FROM accessories WHERE item_name = ?",
      [item_name]
    );
    return rows;
  },

  async create(item: { item_name: string; price: number; category: string; item_number: string; discount: number; offer_price: number; qty_on_hand: number }) {
    const db = await dbPromise;
    const [result]: any = await db.query(
      "INSERT INTO accessories (item_name, price, category, item_number, discount, offer_price, qty_on_hand) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [item.item_name, item.price, item.category, item.item_number, item.discount, item.offer_price, item.qty_on_hand]
    );
    return { id: result.insertId, ...item };
  },


  async getAccessoryById(id: number) {
    const db = await dbPromise;
    const [rows] = await db.query(
      "SELECT * FROM accessories WHERE id = ?",
      [id]
    );
    return (rows as any)[0];
  },

  async getAllAccessories() {
    const db = await dbPromise;
    const [rows] = await db.query("SELECT * FROM accessories ORDER BY id DESC");

    return (rows as any[]).map((item) => ({
      ...item,
      price: Number(item.price),
      discount: Number(item.discount),
      offer_price: Number(item.offer_price),
      qty_on_hand: Number(item.qty_on_hand),
    }));
  },


  async update(
    id: number,
    data: { item_name: string; price: number; category: string; item_number: string; discount: number; offer_price: number; qty_on_hand: number }
  ) {
    const db = await dbPromise;
    const [result]: any = await db.query(
      "UPDATE accessories SET item_name = ?, price = ?, category = ?, item_number = ?, discount = ?, offer_price = ?, qty_on_hand = ? WHERE id = ?",
      [data.item_name, data.price, data.category, data.item_number, data.discount, data.offer_price, data.qty_on_hand, id]
    );
    return result.affectedRows;
  },

  async findById(id: number) {
    const db = await dbPromise;
    const [rows]: any = await db.query("SELECT * FROM accessories WHERE id = ?", [id]);
    return rows[0];
  },



  async delete(id: number) {
    const db = await dbPromise;
    const [result]: any = await db.query(
      "DELETE FROM accessories WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  },

  async findAccessoryByNameOrNumber(item_name: string, item_number: string, excludeId?: number) {
    const db = await dbPromise;
    let query = "SELECT * FROM accessories WHERE (item_name = ? OR item_number = ?)";
    const params: any[] = [item_name, item_number];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await db.query(query, params);
    return rows;
  },

  async checkAccessoryUsedInOrders(id: number) {
    const db = await dbPromise;
    const [rows] = await db.query(
      "SELECT * FROM order_items WHERE accessory_id = ?",
      [id]
    );
    return rows;
  },
};
