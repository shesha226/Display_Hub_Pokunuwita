import { Router } from "express";
import {
  createOrderController,
  getAllOrdersController,
  getOrderByIdController,
  updateOrderController,
  deleteOrderController,
} from "../controller/orderController";



const router = Router();

router.post("/", createOrderController);
router.get("/", getAllOrdersController);
router.get("/:id", getOrderByIdController);
router.put("/:id", updateOrderController);
router.delete("/:id", deleteOrderController);

export default router;
