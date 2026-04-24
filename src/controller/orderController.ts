import { Request, Response } from "express";
import { OrderRepository } from "../repositories/orderRepository";

// 1. Get all orders (Table එකට Data ගන්න)
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderRepository.getAllOrders();
    res.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// 2. Get single order by ID (Edit කරද්දී හා Items බලද්දී)
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderRepository.getOrderById(Number(id));

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const items = await OrderRepository.getOrderItems(Number(id));
    res.json({ ...order, items });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Failed to fetch order details" });
  }
};

// 3. Create a new order (අලුත් Order එකක් දාද්දී)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer_name, customer_phone, items, total_amount } = req.body;

    if (!customer_name || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Customer name and items are required" });
    }

    // Customer ව හොයාගන්නවා හෝ අලුතින් හදනවා
    const customer_id = await OrderRepository.getOrCreateCustomer(
      customer_name,
      customer_phone
    );

    // අලුත් Invoice Number එකක් හදනවා
    const invoice_number = await OrderRepository.getNextInvoiceNumber();

    // Order එක Database එකට Save කරනවා
    const order_id = await OrderRepository.createOrderRecord(
      customer_id,
      total_amount,
      invoice_number
    );

    // Order එකට අදාළ Items ටික Save කරනවා
    await OrderRepository.createOrderItems(order_id, items);

    res.status(201).json({
      message: "Order placed successfully",
      order: {
        id: order_id,
        invoice_number,
        customer_name,
        customer_phone,
        total_amount,
      },
    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// 4. Update an existing order (Order එක Edit කරද්දී)
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { customer_name, customer_phone, items, total_amount } = req.body;

    // පරණ Order එක තියෙනවද බලනවා
    const existingOrder = await OrderRepository.getOrderById(Number(id));
    if (!existingOrder)
      return res.status(404).json({ message: "Order not found" });

    // Customer ව හොයනවා/හදනවා
    const customer_id = await OrderRepository.getOrCreateCustomer(
      customer_name,
      customer_phone
    );

    // Order එක Update කරනවා
    await OrderRepository.updateOrder(Number(id), {
      customer_id,
      total_amount,
      invoice_number: existingOrder.invoice_number, // පරණ Invoice Number එකම තියාගන්නවා
    });

    // පරණ Items ටික මකලා අලුත් ටික දානවා
    await OrderRepository.deleteOrderItems(Number(id));
    await OrderRepository.createOrderItems(Number(id), items);

    res.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error in updateOrder:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
};

// 5. Delete an order (Order එකක් මකද්දී)
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // මුලින්ම Order Items ටික මකනවා
    await OrderRepository.deleteOrderItems(Number(id));

    // ඊටපස්සේ Order එක මකනවා
    await OrderRepository.deleteOrder(Number(id));

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};
