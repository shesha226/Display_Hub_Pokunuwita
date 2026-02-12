import { OrderRepository } from "../repositories/orderRepository";

class OrderService {
  async createOrder(customer_id: number, total_amount: number) {
    const invoice_number = await OrderRepository.getNextInvoiceNumber();
    const orderId = await OrderRepository.createOrderRecord(customer_id, total_amount, invoice_number);
    const order = await OrderRepository.getOrderById(orderId);
    return order;
  }

  async getAllOrders() {
    return OrderRepository.getAllOrders();
  }

  async getOrderById(id: number) {
    const order = await OrderRepository.getOrderById(id);
    if (!order) throw new Error("Order not found");
    return order;
  }

  async updateOrder(id: number, data: any) {
    const success = await OrderRepository.updateOrder(id, data);
    if (!success) throw new Error("Order not found or update failed");
    return this.getOrderById(id);
  }

  async deleteOrder(id: number) {
    const order = await OrderRepository.getOrderById(id);
    if (!order) throw new Error("Order not found");

    // Delete child rows first (foreign key safety)
    await OrderRepository.deleteOrderItems(id);

    const success = await OrderRepository.deleteOrder(id);
    if (!success) throw new Error("Failed to delete order");

    return order;
  }
}

export const orderService = new OrderService();
