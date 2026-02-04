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
exports.deleteAccessory = exports.updateAccessory = exports.getAllAccessories = exports.getAccessoryById = exports.createAccessory = void 0;
const db_1 = __importDefault(require("../config/db"));
const createAccessory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, item_name, item_number, price, discount, offer_price, qty_on_hand, } = req.body;
        // Validation
        if (!category.trim() ||
            !item_name.trim() ||
            !(item_number === null || item_number === void 0 ? void 0 : item_number.trim()) ||
            !price == null ||
            !qty_on_hand == null) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const db = yield db_1.default;
        const [exsistingAccessory] = yield db.query("SELECT * FROM accessories WHERE item_name = ?", [item_name]);
        if (exsistingAccessory.length > 0) {
            return res.status(409).json({
                message: "Accessory already exists",
            });
        }
        // Insert new accessory
        const [result] = yield db.query(`INSERT INTO accessories 
         ( category,item_name, item_number, price, discount, offer_price, qty_on_hand) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            category,
            item_name,
            item_number,
            price,
            discount || 0,
            offer_price || 0,
            qty_on_hand,
        ]);
        const [rows] = yield db.query("SELECT * FROM accessories WHERE item_name = ?", [item_name]);
        return res.status(201).json({
            message: "Accessory created successfully",
            accessory: rows[0],
        });
    }
    catch (err) {
        console.error("Error creating accessory:", err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.createAccessory = createAccessory;
//getAllAccessoriesById
const getAccessoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const id = req.params.id;
        const [rows] = yield db.query("SELECT * FROM accessories WHERE id = ?", [
            id,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Accessory not found" });
        }
        res.json(rows[0]);
    }
    catch (err) {
        console.error("Error fetching accessories:", err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});
exports.getAccessoryById = getAccessoryById;
//getAllAccessories
const getAllAccessories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const [rows] = yield db.query("SELECT * FROM accessories");
        if (rows.length === 0) {
            return res.status(404).json({ message: "No accessories found" });
        }
        // Map rows to detailed JSON
        const accessories = rows.map((accessory) => ({
            id: accessory.id,
            category: accessory.category,
            item_name: accessory.item_name,
            item_number: accessory.item_number,
            price: Number(accessory.price),
            discount: Number(accessory.discount),
            offer_price: Number(accessory.offer_price),
            qty_on_hand: Number(accessory.qty_on_hand),
            created_at: accessory.created_at,
        }));
        return res.status(200).json({
            message: "Accessories fetched successfully",
            accessories,
        });
    }
    catch (err) {
        console.error("Error fetching accessories:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err,
        });
    }
});
exports.getAllAccessories = getAllAccessories;
//updateAccessoryById
const updateAccessory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const id = req.params.id;
        const { category, item_name, item_number, price, discount, offer_price, qty_on_hand, } = req.body;
        // Validation
        if (!category.trim() ||
            !(item_name === null || item_name === void 0 ? void 0 : item_name.trim()) ||
            !(item_number === null || item_number === void 0 ? void 0 : item_number.trim()) ||
            price == null ||
            qty_on_hand == null) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if accessory exists
        const [existingAccessory] = yield db.query("SELECT * FROM accessories WHERE id = ?", [id]);
        if (existingAccessory.length === 0) {
            return res.status(404).json({ message: "Accessory not found" });
        }
        // Check for duplicate item_name
        const [itemNameCheck] = yield db.query("SELECT * FROM accessories WHERE item_name = ? AND id != ?", [item_name, id]);
        if (itemNameCheck.length > 0) {
            return res
                .status(409)
                .json({ message: "Accessory with this name already exists" });
        }
        // Check for duplicate item_number
        const [itemNumberCheck] = yield db.query("SELECT * FROM accessories WHERE item_number = ? AND id != ?", [item_number, id]);
        if (itemNumberCheck.length > 0) {
            return res
                .status(409)
                .json({ message: "Accessory with this number already exists" });
        }
        // Update accessory
        yield db.query(`UPDATE accessories 
       SET category = ?, item_name = ?, item_number = ?, price = ?, discount = ?, offer_price = ?, qty_on_hand = ? 
       WHERE id = ?`, [
            category,
            item_name,
            item_number,
            price,
            discount || 0,
            offer_price || 0,
            qty_on_hand,
            id,
        ]);
        // Fetch updated accessory
        const [updatedRows] = yield db.query("SELECT * FROM accessories WHERE id = ?", [id]);
        return res.status(200).json({
            message: "Accessory updated successfully",
            accessory: updatedRows[0],
        });
    }
    catch (err) {
        console.error("Error updating accessory:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateAccessory = updateAccessory;
//deleteAccessoryById
const deleteAccessory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const id = Number(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ message: "Invalid ID" });
        // Check if accessory exists
        const [rows] = yield db.query("SELECT id FROM accessories WHERE id = ?", [
            id,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Accessory not found" });
        }
        // Check if accessory is used in orders
        const [used] = yield db.query("SELECT * FROM order_items WHERE accessory_id = ?", [id]);
        if (used.length > 0) {
            return res.status(400).json({
                message: "Cannot delete accessory. It is used in existing orders.",
            });
        }
        // Safe to delete
        yield db.query("DELETE FROM accessories WHERE id = ?", [id]);
        return res.status(200).json({ message: "Accessory deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting accessory:", err);
        return res
            .status(500)
            .json({ message: "Internal Server Error", error: err });
    }
});
exports.deleteAccessory = deleteAccessory;
