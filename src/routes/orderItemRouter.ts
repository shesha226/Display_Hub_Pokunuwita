import { Router } from "express";
import {
  createOrderItem,
  getOrderItemsByOrderId,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem,
} from "../controller/orderItemController";

const router = Router();

// ✅ Create a new order item
router.post("/", createOrderItem);

// ✅ Get order items by order id
router.get("/order/:orderId", getOrderItemsByOrderId);
// ✅ Get order item by ID
router.get("/:id", getOrderItemById);
// ✅ Update order item by ID
router.put("/:id", updateOrderItem);
// ✅ Delete order item by ID
router.delete("/:id", deleteOrderItem);
export default router;
