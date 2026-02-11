import { AccessoryRepository } from "../repositories/accessoryRepository";

class AccessoryService {
  async createAccessory(data: any) {
    const exisiting = await AccessoryRepository.findAccessoryByNameOrNumber(data.item_name, data.item_number);
    if (exisiting) {
      throw new Error("Accessory already exists");
    }

    return AccessoryRepository.insertAccessory({
      ...data,
      discount: data.discount || 0,
      offer_price: data.offer_price || 0,
    })

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

  async updateAccessory(id: number, data: any) {
    const exisiting = await AccessoryRepository.getAccessoryById(id);
    if (!exisiting) {
      throw new Error("Accessory not found");
    }
    if (data.item_name || data.item_number) {
      const duplicate = await AccessoryRepository.findAccessoryByNameOrNumber(data.item_name, data.item_number, id);
      if (duplicate) {
        throw new Error("Accessory already exists");
      }
    }
    return AccessoryRepository.updateAccessory(id, {
      category: data.category ?? exisiting.category,
      item_name: data.item_name ?? exisiting.item_name,
      item_number: data.item_number ?? exisiting.item_number,
      price: data.price ?? exisiting.price,
      discount: data.discount ?? exisiting.discount,
      offer_price: data.offer_price ?? exisiting.offer_price,
      qty_on_hand: data.qty_on_hand ?? exisiting.qty_on_hand
    });

  }

  async deleteAccessory(id: number) {

    const exisiting = await AccessoryRepository.getAccessoryById(id);
    if (!exisiting) {
      throw new Error("Accessory not found");
    }

    const used = await AccessoryRepository.checkAccessoryUsedInOrders(id);
    if (used) {
      throw { status: 400, message: "Accessory is used in orders and cannot be deleted" };
    }
    return AccessoryRepository.deleteAccessory(id);


  }
}
export const accessoryService = new AccessoryService();