"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderItemController_1 = require("../controller/orderItemController");
const router = (0, express_1.Router)();
// ✅ Create a new order item
router.post("/", orderItemController_1.createOrderItem);
// ✅ Get order items by order id
router.get("/order/:orderId", orderItemController_1.getOrderItemsByOrderId);
// ✅ Get order item by ID
router.get("/:id", orderItemController_1.getOrderItemById);
// ✅ Update order item by ID
router.put("/:id", orderItemController_1.updateOrderItem);
// ✅ Delete order item by ID
router.delete("/:id", orderItemController_1.deleteOrderItem);
exports.default = router;
