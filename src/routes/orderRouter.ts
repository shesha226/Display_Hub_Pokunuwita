import { Router } from "express";
import {
  createOrderController,
  getAllOrdersController,
  getOrderByIdController,
  updateOrderController,
  deleteOrderController,
} from "../controller/orderController";

import { validate } from "../middlewares/validate";
import { createOrderSchema, updateOrderSchema, deleteOrderSchema, } from "../schemas/orderSchemas";

const router = Router();

router.post("/", validate(createOrderSchema), createOrderController);
router.get("/", getAllOrdersController);
router.get("/:id", getOrderByIdController);
router.put("/:id", validate(updateOrderSchema), updateOrderController);
router.delete("/:id", deleteOrderController);

export default router;
