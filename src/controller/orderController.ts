import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/orderService";

// Create order
export const createOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_id, items } = req.body;
    const result = await OrderService.createOrder(customer_id, items);
    res.status(201).json({ message: "Order created", ...result });
  } catch (err: any) {
    next(err);
  }
};

// Get all orders
export const getAllOrdersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.status(200).json({ orders });
  } catch (err: any) {
    next(err);
  }
};

// Get single order by ID
export const getOrderByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const order = await OrderService.getOrderById(id);
    res.status(200).json(order);
  } catch (err: any) {
    next(err);
  }
};

// Update order
export const updateOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { customer_id, items } = req.body;
    const result = await OrderService.updateOrder(id, customer_id, items);
    res.status(200).json({ message: "Order updated", ...result });
  } catch (err: any) {
    next(err);
  }
};

// Delete order
export const deleteOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await OrderService.deleteOrder(id);
    res.status(200).json({ message: "Order deleted" });
  } catch (err: any) {
    next(err);
  }
};
