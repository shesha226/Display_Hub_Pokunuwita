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
exports.updateOrder = exports.deleteOrder = exports.getOrderById = exports.getAllOrders = exports.createOrder = void 0;
const db_1 = __importDefault(require("../config/db"));
/**
 * CREATE ORDER (SECURE) with auto invoice_number
 */
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer_id, items } = req.body;
    const pool = yield db_1.default;
    const conn = yield pool.getConnection();
    try {
        if (!customer_id || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Invalid order data" });
        }
        yield conn.beginTransaction();
        // 1️⃣ Generate next invoice_number
        const [invoiceRows] = yield conn.query(`SELECT IFNULL(
          CONCAT('ORD', LPAD(CAST(SUBSTRING(MAX(invoice_number), 4) AS UNSIGNED)+1, 4, '0')),
          'ORD0001'
        ) AS next_invoice
       FROM orders`);
        const invoice_number = invoiceRows[0].next_invoice;
        // 2️⃣ Insert order with invoice_number
        const [orderResult] = yield conn.query("INSERT INTO orders (customer_id, total_amount, invoice_number) VALUES (?, 0, ?)", [customer_id, invoice_number]);
        const orderId = orderResult.insertId;
        let totalAmount = 0;
        // 3️⃣ Process order items
        for (const item of items) {
            if (!item.accessory_id || !item.quantity || item.quantity <= 0) {
                throw new Error("Invalid item data");
            }
            const [rows] = yield conn.query("SELECT price, discount, qty_on_hand FROM accessories WHERE id = ? FOR UPDATE", [item.accessory_id]);
            if (rows.length === 0)
                throw new Error("Accessory not found");
            const { price, discount, qty_on_hand } = rows[0];
            if (qty_on_hand < item.quantity)
                throw new Error("Not enough stock");
            const finalPrice = (price - (discount || 0)) * item.quantity;
            totalAmount += finalPrice;
            yield conn.query(`INSERT INTO order_items
         (order_id, accessory_id, quantity, price, discount, final_price)
         VALUES (?, ?, ?, ?, ?, ?)`, [
                orderId,
                item.accessory_id,
                item.quantity,
                price,
                discount || 0,
                finalPrice,
            ]);
            yield conn.query("UPDATE accessories SET qty_on_hand = qty_on_hand - ? WHERE id = ?", [item.quantity, item.accessory_id]);
        }
        // 4️⃣ Update total_amount
        yield conn.query("UPDATE orders SET total_amount = ? WHERE id = ?", [
            totalAmount,
            orderId,
        ]);
        yield conn.commit();
        res.status(201).json({
            message: "Order created successfully ✅",
            order_id: orderId,
            invoice_number,
            total_amount: totalAmount,
        });
    }
    catch (error) {
        yield conn.rollback();
        res.status(400).json({ message: error.message });
    }
    finally {
        conn.release();
    }
});
exports.createOrder = createOrder;
/**
 * GET ALL ORDERS (include invoice_number)
 */
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const [rows] = yield db.query(`
      SELECT 
        o.id,
        o.invoice_number,
        c.name AS customer_name,
        c.phone AS customer_phone,
        o.total_amount,
        o.created_at
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `);
        return res.json({ orders: rows });
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllOrders = getAllOrders;
/**
 * GET ORDER BY ID (with items and invoice_number)
 */
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const { id } = req.params;
        const [order] = yield db.query(`SELECT o.id, o.invoice_number, o.total_amount, o.created_at, 
              c.name AS customer_name, c.phone AS customer_phone
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       WHERE o.id = ?`, [id]);
        if (order.length === 0)
            return res.status(404).json({ message: "Order not found" });
        const [items] = yield db.query(`SELECT oi.quantity, oi.final_price, a.item_name
       FROM order_items oi
       JOIN accessories a ON oi.accessory_id = a.id
       WHERE oi.order_id = ?`, [id]);
        res.json(Object.assign(Object.assign({}, order[0]), { items }));
    }
    catch (_a) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getOrderById = getOrderById;
/**
 * DELETE ORDER (restore stock safely)
 */
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = yield db_1.default;
    const conn = yield pool.getConnection();
    try {
        const { id } = req.params;
        yield conn.beginTransaction();
        const [items] = yield conn.query("SELECT accessory_id, quantity FROM order_items WHERE order_id = ?", [id]);
        if (items.length === 0)
            throw new Error("Order not found");
        for (const item of items) {
            yield conn.query("UPDATE accessories SET qty_on_hand = qty_on_hand + ? WHERE id = ?", [item.quantity, item.accessory_id]);
        }
        yield conn.query("DELETE FROM order_items WHERE order_id = ?", [id]);
        yield conn.query("DELETE FROM orders WHERE id = ?", [id]);
        yield conn.commit();
        res.json({ message: "Order deleted successfully" });
    }
    catch (err) {
        yield conn.rollback();
        res.status(400).json({ message: err.message });
    }
    finally {
        conn.release();
    }
});
exports.deleteOrder = deleteOrder;
/**
 * UPDATE ORDER (secure, with items)
 */
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { customer_id, items } = req.body;
    const pool = yield db_1.default;
    const conn = yield pool.getConnection();
    try {
        if (!customer_id && (!items || items.length === 0)) {
            return res.status(400).json({ message: "No data to update" });
        }
        yield conn.beginTransaction();
        // Update customer_id if provided
        if (customer_id) {
            const [custResult] = yield conn.query("UPDATE orders SET customer_id = ? WHERE id = ?", [customer_id, id]);
            if (custResult.affectedRows === 0)
                throw new Error("Order not found");
        }
        let totalAmount = 0;
        if (items && items.length > 0) {
            // Restore stock from existing items
            const [existingItems] = yield conn.query("SELECT accessory_id, quantity FROM order_items WHERE order_id = ?", [id]);
            for (const item of existingItems) {
                yield conn.query("UPDATE accessories SET qty_on_hand = qty_on_hand + ? WHERE id = ?", [item.quantity, item.accessory_id]);
            }
            // Delete old items
            yield conn.query("DELETE FROM order_items WHERE order_id = ?", [id]);
            // Insert new items
            for (const item of items) {
                const [rows] = yield conn.query("SELECT price, discount, qty_on_hand FROM accessories WHERE id = ? FOR UPDATE", [item.accessory_id]);
                if (rows.length === 0)
                    throw new Error("Accessory not found");
                const { price, discount, qty_on_hand } = rows[0];
                if (qty_on_hand < item.quantity) {
                    throw new Error(`Not enough stock for accessory ${item.accessory_id}`);
                }
                const finalPrice = (price - (discount || 0)) * item.quantity;
                totalAmount += finalPrice;
                yield conn.query(`INSERT INTO order_items
           (order_id, accessory_id, quantity, price, discount, final_price)
           VALUES (?, ?, ?, ?, ?, ?)`, [
                    id,
                    item.accessory_id,
                    item.quantity,
                    price,
                    discount || 0,
                    finalPrice,
                ]);
                yield conn.query("UPDATE accessories SET qty_on_hand = qty_on_hand - ? WHERE id = ?", [item.quantity, item.accessory_id]);
            }
            // Update total_amount
            yield conn.query("UPDATE orders SET total_amount = ? WHERE id = ?", [
                totalAmount,
                id,
            ]);
        }
        yield conn.commit();
        res.json({
            message: "Order updated successfully ✅",
            total_amount: totalAmount,
        });
    }
    catch (err) {
        yield conn.rollback();
        res.status(400).json({ message: err.message });
    }
    finally {
        conn.release();
    }
});
exports.updateOrder = updateOrder;
