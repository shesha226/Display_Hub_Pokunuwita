import { Request, Response } from "express";
import { orderService } from "../services/orderService";


export const createOrderController = async (req: Request, res: Response) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ message: "Order created ✅", order });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllOrdersController = async (_req: Request, res: Response) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({ orders });
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const order = await orderService.getOrderById(id);
    res.json({ order });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const updateOrderController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { customer_id, items } = req.body;

    if (!customer_id || !items) {
      return res.status(400).json({ message: "Customer ID and items are required" });
    }

    const existingOrder = await orderService.getOrderById(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    const result = await orderService.updateOrder(id, { customer_id, items });
    res.json({ message: "Order updated ✅" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteOrderController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await orderService.deleteOrder(id);
    res.json({ message: "Order deleted ✅" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};