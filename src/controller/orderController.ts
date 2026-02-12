import { Request, Response, NextFunction } from "express";
import { orderService } from "../services/orderService";

// CREATE ORDER
export const createOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_id, total_amount } = req.body;
    const order = await orderService.createOrder(customer_id, total_amount);
    res.status(201).json({ message: "Order created successfully ✅", order });
  } catch (err: any) {
    console.error("Create Order Error:", err);
    res.status(400).json({ message: err.message || "Internal Server Error" });
  }
};

// GET ALL ORDERS
export const getAllOrdersController = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (err: any) {
    console.error("Get All Orders Error:", err);
    res.status(400).json({ message: err.message || "Internal Server Error" });
  }
};

// GET ORDER BY ID
export const getOrderByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid order ID" });

    const order = await orderService.getOrderById(id);
    res.status(200).json({ message: "Order fetched successfully", order });
  } catch (err: any) {
    console.error("Get Order By ID Error:", err);
    res.status(400).json({ message: err.message || "Internal Server Error" });
  }
};

// UPDATE ORDER
export const updateOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid order ID" });

    const order = await orderService.updateOrder(id, req.body);
    res.status(200).json({ message: "Order updated successfully ✅", order });
  } catch (err: any) {
    console.error("Update Order Error:", err);
    res.status(400).json({ message: err.message || "Internal Server Error" });
  }
};

// DELETE ORDER
export const deleteOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid order ID" });

    const order = await orderService.deleteOrder(id);
    res.status(200).json({ message: "Order deleted successfully ✅", order });
  } catch (err: any) {
    console.error("Delete Order Error:", err);
    res.status(400).json({ message: err.message || "Internal Server Error" });
  }
};
