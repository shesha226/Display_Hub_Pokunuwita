import { OrderRepository } from "../repositories/orderRepository";

interface OrderItemPayload {
  accessory_id: number;
  quantity: number;
}

export const OrderService = {
  // Create a new order with items
  async createOrder(customer_id: number, items: OrderItemPayload[]) {
    if (!customer_id || !items || items.length === 0) {
      throw new Error("customer_id and items are required");
    }

    // Fetch accessory prices and discounts
    const accessoryIds = items.map(i => i.accessory_id);
    const db = await import("../config/db").then(m => m.default);
    const [accessories]: any = await db.query(
      `SELECT id, price, discount FROM accessories WHERE id IN (?)`,
      [accessoryIds]
    );

    let total_amount = 0;
    const orderItemsToInsert = items.map(item => {
      const accessory = accessories.find((a: any) => a.id === item.accessory_id);
      if (!accessory) throw new Error(`Accessory not found: ${item.accessory_id}`);

      const final_price = (accessory.price - accessory.discount) * item.quantity;
      total_amount += final_price;

      return {
        accessory_id: item.accessory_id,
        quantity: item.quantity,
        price: accessory.price,
        discount: accessory.discount,
      };
    });

    // Generate invoice
    const invoice_number = await OrderRepository.getNextInvoiceNumber();

    // Insert order
    const order_id = await OrderRepository.createOrderRecord(customer_id, total_amount, invoice_number);

    // Insert order items
    await OrderRepository.createOrderItems(order_id, orderItemsToInsert);

    return { order_id, total_amount, invoice_number };
  },

  // Fetch all orders
  async getAllOrders() {
    return OrderRepository.getAllOrders();
  },

  // Fetch single order by ID
  async getOrderById(id: number) {
    const order = await OrderRepository.getOrderById(id);
    if (!order) throw new Error("Order not found");

    const items = await OrderRepository.getOrderItems(id);
    return { ...order, items };
  },

  // Update an existing order
  async updateOrder(order_id: number, customer_id: number, items: OrderItemPayload[]) {
    if (!customer_id || !items || items.length === 0) {
      throw new Error("customer_id and items are required");
    }

    const db = await import("../config/db").then(m => m.default);
    const accessoryIds = items.map(i => i.accessory_id);
    const [accessories]: any = await db.query(
      `SELECT id, price, discount FROM accessories WHERE id IN (?)`,
      [accessoryIds]
    );

    let total_amount = 0;
    const orderItemsToInsert = items.map(item => {
      const accessory = accessories.find((a: any) => a.id === item.accessory_id);
      if (!accessory) throw new Error(`Accessory not found: ${item.accessory_id}`);

      const final_price = (accessory.price - accessory.discount) * item.quantity;
      total_amount += final_price;

      return {
        accessory_id: item.accessory_id,
        quantity: item.quantity,
        price: accessory.price,
        discount: accessory.discount,
      };
    });

    const invoice_number = await OrderRepository.getNextInvoiceNumber();

    // Update order table
    await OrderRepository.updateOrder(order_id, { customer_id, total_amount, invoice_number });

    // Delete old items and insert new
    await OrderRepository.deleteOrderItems(order_id);
    await OrderRepository.createOrderItems(order_id, orderItemsToInsert);

    return { order_id, total_amount, invoice_number };
  },

  // Delete order
  async deleteOrder(order_id: number) {
    await OrderRepository.deleteOrderItems(order_id);
    const deleted = await OrderRepository.deleteOrder(order_id);
    if (!deleted) throw new Error("Order not found");
    return true;
  }
};
