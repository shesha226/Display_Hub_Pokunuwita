import { Router } from "express";
import {
  createOrderItem,
  getOrderItemById,
  getOrderItems,
  updateOrderItem,
  deleteOrderItem,
} from "../controller/orderItemController";
import { validate } from "../middlewares/validate";
import { createOrderItemSchema, updateOrderItemSchema, deleteOrderItemSchema, getOrderItemSchema } from "../schemas/orederItemSchemas";

const router = Router();


router.post("/", validate(createOrderItemSchema), createOrderItem);


router.get("/order/:orderId", validate(getOrderItemSchema), getOrderItemById);

router.get("/", getOrderItems);

router.put("/:id", validate(updateOrderItemSchema), updateOrderItem);

router.delete("/:id", validate(deleteOrderItemSchema), deleteOrderItem);
export default router;
