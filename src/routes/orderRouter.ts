import express from "express";
// මෙතන path එක ඔයාගේ folder නමට හරියටම ගැලපෙන්න ඕනේ.
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controller/orderController";

const router = express.Router();

// Get all orders
router.get("/", getOrders);

// Get single order by ID
router.get("/:id", getOrderById);

// Create a new order
router.post("/", createOrder);

// Update an order
router.put("/:id", updateOrder);

// Delete an order
router.delete("/:id", deleteOrder);

export default router;
