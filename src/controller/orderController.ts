import { Request, Response } from "express";
import * as service from "../services/orderService";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const { customer_id, items } = req.body;
    const result = await service.createOrder(customer_id, items);
    res.status(201).json({ message: "Order created ✅", ...result });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllOrdersController = async (_req: Request, res: Response) => {
  try {
    const orders = await service.getAllOrders();
    res.json({ orders });
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const order = await service.getOrderById(id);
    res.json({ order });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const deleteOrderController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await service.deleteOrder(id);
    res.json({ message: "Order deleted ✅" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
