import { OrderItemRepository } from "../repositories/orderItemRepository";

class OrderItemService {
  async createOrderItem(data: any) {
    const existing = await OrderItemRepository.getOrderItemById(data.id);
    if (existing) {
      throw new Error("Order item already exists");
    }
    return OrderItemRepository.insertOrderItem(data);
  }

  async updateOrderItem(id: number, data: any) {
    const existing = await OrderItemRepository.getOrderItemById(data.id);
    if (!existing) {
      throw new Error("Order item not found");
    }

    return OrderItemRepository.updateOrderItem(id, data);
  }

  async deleteOrderItem(id: number) {
    const existing = await OrderItemRepository.getOrderItemById(id);
    if (!existing) {
      throw new Error("Order item not found");
    }
    return OrderItemRepository.deleteOrderItem(id);
  }

  async getAllOrderItems() {
    const existing = await OrderItemRepository.getAllOrderItems();
    if (!existing) {
      throw new Error("Order items not found");
    }
    return OrderItemRepository.getAllOrderItems();
  }

  async getOrderItemById(id: number) {
    const existing = await OrderItemRepository.getOrderItemById(id);
    if (!existing) {
      throw new Error("Order item not found");
    }
    return OrderItemRepository.getOrderItemById(id);
  }
}
export const orderItemService = new OrderItemService();