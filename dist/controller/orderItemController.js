"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderItem = exports.updateOrderItem = exports.getOrderItemById = exports.getOrderItemsByOrderId = exports.createOrderItem = void 0;
const db_1 = __importDefault(require("../config/db"));
/**
 * CREATE ORDER ITEM
 */
const createOrderItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id, accessory_id, quantity, price, discount } = req.body;
        if (!order_id || !accessory_id || !quantity || !price) {
            return res.status(400).json({
                message: "order_id, accessory_id, quantity, and price are required",
            });
        }
        const final_price = price * quantity - (discount || 0);
        const db = yield db_1.default;
        const [result] = yield db.query(`INSERT INTO order_items 
       (order_id, accessory_id, quantity, price, discount, final_price)
       VALUES (?, ?, ?, ?, ?, ?)`, [order_id, accessory_id, quantity, price, discount || 0, final_price]);
        return res.status(201).json({
            message: "Order item added successfully",
            order_item_id: result.insertId,
        });
    }
    catch (err) {
        console.error("Error creating order item:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.createOrderItem = createOrderItem;
/**
 * GET ALL ITEMS FOR AN ORDER
 */
const getOrderItemsByOrderId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id } = req.params;
        const db = yield db_1.default;
        const [rows] = yield db.query(`SELECT oi.*, a.item_name, a.price AS accessory_price
       FROM order_items oi
       LEFT JOIN accessories a ON oi.accessory_id = a.id
       WHERE oi.order_id = ?`, [order_id]);
        return res.json(rows);
    }
    catch (err) {
        console.error("Error fetching order items:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getOrderItemsByOrderId = getOrderItemsByOrderId;
//Get order item by id
const getOrderItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const db = yield db_1.default;
        const [rows] = yield db.query(`SELECT oi.*, a.item_name, a.price AS accessory_price
       FROM order_items oi
       LEFT JOIN accessories a ON oi.accessory_id = a.id
       WHERE oi.id = ?`, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Order item not found" });
        }
        return res.json(rows[0]);
    }
    catch (err) {
        console.error("Error fetching order item:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getOrderItemById = getOrderItemById;
/**
 * UPDATE ORDER ITEM
 */
const updateOrderItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { quantity, price, discount } = req.body;
        if (!quantity && !price && discount === undefined) {
            return res
                .status(400)
                .json({ message: "At least one field is required" });
        }
        const db = yield db_1.default;
        // Calculate final_price if any relevant fields are provided
        const final_price = (price || 0) * (quantity || 0) - (discount || 0);
        const [result] = yield db.query(`UPDATE order_items 
       SET quantity = ?, price = ?, discount = ?, final_price = ?
       WHERE id = ?`, [quantity, price, discount || 0, final_price, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Order item not found" });
        }
        return res.json({ message: "Order item updated successfully" });
    }
    catch (err) {
        console.error("Error updating order item:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateOrderItem = updateOrderItem;
/**
 * DELETE ORDER ITEM
 */
const deleteOrderItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const db = yield db_1.default;
        const [result] = yield db.query("DELETE FROM order_items WHERE id = ?", [
            id,
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Order item not found" });
        }
        return res.json({ message: "Order item deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting order item:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteOrderItem = deleteOrderItem;
