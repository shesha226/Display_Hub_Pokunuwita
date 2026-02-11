import { OrderRepository } from "../repositories/orderRepository";

class OrderService {
  async createOrder(data: any) {
    const existingOrder = await OrderRepository.getOrderByIdRepo(data.id);
    if (existingOrder) {
      throw new Error("Order already exists");
    }
    return OrderRepository.createOrderRecord(data.customer_id, data.total_amount, data.invoice_number);
  }

  async getAllOrders() {
    return OrderRepository.getAllOrdersRepo();
  }

  async getOrderById(id: number) {
    const order = await OrderRepository.getOrderByIdRepo(id);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  async updateOrder(id: number, data: any) {
    const existingOrder = await OrderRepository.getOrderByIdRepo(id);
    if (!existingOrder) {
      throw new Error("Order not found");
    }
    return OrderRepository.updateOrderRepo(id, {
      customer_id: data.customer_id ?? existingOrder.customer_id,
      total_amount: data.total_amount ?? existingOrder.total_amount,
      invoice_number: data.invoice_number ?? existingOrder.invoice_number,
    });
  }

  async deleteOrder(id: number) {
    const existingOrder = await OrderRepository.getOrderByIdRepo(id);
    if (!existingOrder) {
      throw new Error("Order not found");
    }
    return OrderRepository.deleteOrderRepo(id);
  }
}

export const orderService = new OrderService();
