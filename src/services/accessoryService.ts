import { AccessoryRepository } from "../repositories/accessoryRepository";

class AccessoryService {
  async createAccessory(data: { item_name: string; price: number; category: string; item_number: string; discount: number; offer_price: number; qty_on_hand: number }) {
    const { item_name, price, category, item_number, discount, offer_price, qty_on_hand } = data;

    // Validation
    if (!item_name || price == null || !category) {
      throw { status: 400, message: "Name, price, and category are required" };
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      throw { status: 400, message: "Price must be a number" };
    }

    // Check if exists
    const existing = await AccessoryRepository.findByName(item_name);
    if (existing.length > 0) {
      throw { status: 409, message: "Accessory already exists" };
    }

    // Create
    const accessory = await AccessoryRepository.create({
      item_name,
      price: numericPrice,
      category,
      item_number,
      discount,
      offer_price,
      qty_on_hand
    });

    return accessory;
  }

  async getAccessory(id: number) {
    const Accessory = await AccessoryRepository.getAccessoryById(id);
    if (!Accessory) {
      throw new Error("Accessory not found");
    }
    return Accessory;

  }

  async getAllAccessories() {
    return AccessoryRepository.getAllAccessories();

  }

  async updateAccessory(
    id: number,
    data: { item_name: string; price: number; category: string; item_number: string; discount: number; offer_price: number; qty_on_hand: number }
  ) {
    const { item_name, price, category, item_number, discount, offer_price, qty_on_hand } = data;

    // Validation
    if (!item_name || price == null || !category) {
      throw { status: 400, message: "Name, price, and category are required" };
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      throw { status: 400, message: "Price must be a number" };
    }

    const affectedRows = await AccessoryRepository.update(id, {
      item_name,
      price: numericPrice,
      category,
      item_number,
      discount,
      offer_price,
      qty_on_hand
    });

    if (affectedRows === 0) {
      throw { status: 404, message: "Accessory not found" };
    }

    return { id, item_name, price: numericPrice, category };
  }

  async deleteAccessory(id: number) {
    if (isNaN(id)) {
      throw { status: 400, message: "Invalid accessory ID" };
    }

    const affectedRows = await AccessoryRepository.delete(id);
    if (affectedRows === 0) {
      throw { status: 404, message: "Accessory not found" };
    }

    return { id };
  }
}
export const accessoryService = new AccessoryService();