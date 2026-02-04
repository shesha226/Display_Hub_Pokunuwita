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
exports.deleteCustomer = exports.updateCustomer = exports.getAllCustomers = exports.createCustomer = void 0;
const db_1 = __importDefault(require("../config/db"));
// CREATE
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, address, phone } = req.body;
        if (!name || !email || !address || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const db = yield db_1.default;
        const [exist] = yield db.query("SELECT id FROM customers WHERE email = ?", [email]);
        if (exist.length > 0) {
            return res.status(409).json({ message: "Email already exists" });
        }
        yield db.query("INSERT INTO customers (name, email, address, phone) VALUES (?, ?, ?, ?)", [name, email, address, phone]);
        res.status(201).json({ message: "Customer created" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
});
exports.createCustomer = createCustomer;
// READ ALL
const getAllCustomers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const [rows] = yield db.query("SELECT id, name, email, address, phone FROM customers");
        res.json({ customers: rows });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
});
exports.getAllCustomers = getAllCustomers;
// UPDATE
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, address, phone } = req.body;
        const { id } = req.params;
        const db = yield db_1.default;
        yield db.query("UPDATE customers SET name=?, email=?, address=?, phone=? WHERE id=?", [name, email, address, phone, id]);
        res.json({ message: "Customer updated" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
});
exports.updateCustomer = updateCustomer;
// DELETE
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        yield db.query("DELETE FROM customers WHERE id=?", [req.params.id]);
        res.json({ message: "Customer deleted" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
});
exports.deleteCustomer = deleteCustomer;
