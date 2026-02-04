import { Request, Response } from "express";
import * as service from "../services/orderItemService";

/**
 * CREATE ORDER ITEM
 */
export const createOrderItem = async (req: Request, res: Response) => {
  try {
    const id = await service.createOrderItem(req.body);
    return res
      .status(201)
      .json({ message: "Order item created successfully", id });
  } catch (err: any) {
    console.error("Error creating order item:", err.message);
    return res.status(400).json({ message: err.message });
  }
};

/**
 * GET ALL ITEMS
 */
export const getOrderItems = async (req: Request, res: Response) => {
  try {
    const items = await service.getItems();
    return res.json(items);
  } catch (err: any) {
    console.error("Error fetching order items:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * GET ITEM BY ID
 */
export const getOrderItemById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const item = await service.getItem(id);
    if (!item) return res.status(404).json({ message: "Not found" });

    return res.json(item);
  } catch (err: any) {
    console.error("Error fetching order item:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * UPDATE ORDER ITEM
 */
export const updateOrderItem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const affected = await service.updateorderitems(id, req.body);
    if (!affected) return res.status(404).json({ message: "Not found" });

    return res.json({ message: "Order item updated successfully" });
  } catch (err: any) {
    console.error("Error updating order item:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * DELETE ORDER ITEM
 */
export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const affected = await service.deleteOrderItem(id);
    if (!affected) return res.status(404).json({ message: "Not found" });

    return res.json({ message: "Deleted" });
  } catch (err: any) {
    console.error("Error deleting order item:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
