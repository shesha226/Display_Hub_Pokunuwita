import { Request, Response, NextFunction } from "express";
import { orderItemService } from "../services/orderItemService";


export const createOrderItem = async (req: Request, res: Response) => {
  try {
    const id = await orderItemService.createOrderItem(req.body);
    return res
      .status(201)
      .json({ message: "Order item created successfully", id });
  } catch (err: any) {
    console.error("Error creating order item:", err.message);
    return res.status(400).json({ message: err.message });
  }
};


export const getOrderItems = async (req: Request, res: Response) => {
  try {
    const items = await orderItemService.getAllOrderItems();
    return res.json(items);
  } catch (err: any) {
    console.error("Error fetching order items:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrderItemById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const item = await orderItemService.getOrderItemById(id);
    if (!item) return res.status(404).json({ message: "Not found" });

    return res.json(item);
  } catch (err: any) {
    console.error("Error fetching order item:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateOrderItem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const affected = await orderItemService.updateOrderItem(id, req.body);
    if (!affected) return res.status(404).json({ message: "Not found" });

    return res.json({ message: "Order item updated successfully" });
  } catch (err: any) {
    console.error("Error updating order item:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const affected = await orderItemService.deleteOrderItem(id);
    if (!affected) return res.status(404).json({ message: "Not found" });

    return res.json({ message: "Deleted" });
  } catch (err: any) {
    console.error("Error deleting order item:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};