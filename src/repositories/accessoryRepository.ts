import dbPromise from "../config/db";

export const AccessoryRepository = {

  async insertAccessory(data: {
    category: string;
    item_name: string;
    item_number: string;
    price: number;
    discount: number;
    offer_price: number;
    qty_on_hand: number;
  }) {
    const db = await dbPromise;
    const [result] = await db.query(
      `INSERT INTO accessories 
        (category, item_name, item_number, price, discount, offer_price, qty_on_hand)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.category,
        data.item_name,
        data.item_number,
        data.price,
        data.discount,
        data.offer_price,
        data.qty_on_hand,
      ]
    );
    return { id: (result as any).insertId };
  },


  async getAccessoryById(id: number) {
    const db = await dbPromise;
    const [rows]: any = await db.query(
      "SELECT * FROM accessories WHERE id = ?",
      [id]
    );
    return (rows as any)[0] || null;
  },



  // Get all accessories
  async getAllAccessories() {
    const db = await dbPromise;
    const [rows] = await db.query(
      "SELECT * FROM accessories ORDER BY id DESC"
    );
    return rows;
  },

  // Update accessory
  async updateAccessory(
    id: number,
    data: {
      category: string;
      item_name: string;
      item_number: string;
      price: number;
      discount: number;
      offer_price: number;
      qty_on_hand: number;
    }
  ) {
    const db = await dbPromise;
    const [result] = await db.query(
      `UPDATE accessories 
       SET category=?, item_name=?, item_number=?, price=?, discount=?, offer_price=?, qty_on_hand=?
       WHERE id=?`,
      [
        data.category,
        data.item_name,
        data.item_number,
        data.price,
        data.discount,
        data.offer_price,
        data.qty_on_hand,
        id,
      ]
    );
    return (result as any).affectedRows > 0;
  },

  // Delete accessory
  async deleteAccessory(id: number) {
    const db = await dbPromise;
    const [result] = await db.query(
      "DELETE FROM accessories WHERE id = ?",
      [id]
    );
    return (result as any).affectedRows > 0;
  },

  // Check if accessory is used in any orders
  async checkAccessoryUsedInOrders(id: number) {
    const db = await dbPromise;
    const [rows] = await db.query(
      "SELECT * FROM order_items WHERE accessory_id = ?",
      [id]
    );
    return rows;
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

  async CheckAccessoryUsedInOrders(id: number) {
    const db = await dbPromise;
    const [rows] = await db.query(
      "SELECT * FROM order_items WHERE accessory_id = ?",
      [id]
    );
    return rows;
  }
};
