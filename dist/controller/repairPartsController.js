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
exports.deleteRepairPartById = exports.updateRepair = exports.getPendingRepairs = exports.getRepairPartById = exports.getAllRepairParts = exports.createRepairPart = void 0;
const db_1 = __importDefault(require("../config/db"));
// POST new repair part with auto-generated invoice number
const createRepairPart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_name, phone_model, issue, repair_cost, status, advance } = req.body;
        if (!issue ||
            !customer_name ||
            !phone_model ||
            repair_cost == null ||
            advance == null) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const db = yield db_1.default;
        // Generate next invoice number
        const [rows] = yield db.query(`SELECT IFNULL(
          CONCAT('INV', LPAD(CAST(SUBSTRING(MAX(invoice_number), 4) AS UNSIGNED)+1, 4, '0')),
          'RINV0001'
        ) AS next_invoice
      FROM repairs`);
        const invoice_number = rows[0].next_invoice;
        // Insert new repair
        yield db.query(`INSERT INTO repairs 
        (invoice_number, customer_name, phone_model, issue, repair_cost, status, advance) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            invoice_number,
            customer_name,
            phone_model,
            issue,
            repair_cost,
            status || "pending",
            advance,
        ]);
        return res
            .status(201)
            .json({ message: "Repair part created successfully", invoice_number });
    }
    catch (err) {
        console.error("Error creating repair part:", err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});
exports.createRepairPart = createRepairPart;
// GET all repair parts
const getAllRepairParts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const [rows] = yield db.query("SELECT * FROM repairs ORDER BY id DESC");
        return res.status(200).json(rows);
    }
    catch (err) {
        console.error("Error fetching repair parts:", err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.getAllRepairParts = getAllRepairParts;
// GET repair part by ID
const getRepairPartById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const id = req.params.id;
        const [rows] = yield db.query("SELECT * FROM repairs WHERE id = ?", [
            id,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Repair part not found" });
        }
        res.json(rows[0]);
    }
    catch (err) {
        console.error("Error fetching repair part:", err);
        return res
            .status(500)
            .json({ message: "Internal Server Error", error: err });
    }
});
exports.getRepairPartById = getRepairPartById;
// GET only pending repairs
const getPendingRepairs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const [rows] = yield db.query("SELECT * FROM repairs WHERE status = 'pending' ORDER BY created_at DESC");
        res.status(200).json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getPendingRepairs = getPendingRepairs;
// UPDATE repair (partial or full)
const updateRepair = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const id = req.params.id;
        const { customer_name, phone_model, issue, repair_cost, status, advance } = req.body;
        const [existing] = yield db.query("SELECT * FROM repairs WHERE id = ?", [id]);
        if (existing.length === 0)
            return res.status(404).json({ message: "Repair not found" });
        yield db.query(`UPDATE repairs SET 
        customer_name = COALESCE(?, customer_name),
        phone_model = COALESCE(?, phone_model),
        issue = COALESCE(?, issue),
        repair_cost = COALESCE(?, repair_cost),
        status = COALESCE(?, status),
        advance = COALESCE(?, advance)
       WHERE id = ?`, [customer_name, phone_model, issue, repair_cost, status, advance, id]);
        const [updated] = yield db.query("SELECT * FROM repairs WHERE id = ?", [id]);
        res.status(200).json(updated[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateRepair = updateRepair;
// DELETE repair part by ID
const deleteRepairPartById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const id = req.params.id;
        const [existingPart] = yield db.query("SELECT * FROM repairs WHERE id = ?", [id]);
        if (existingPart.length === 0) {
            return res.status(404).json({ message: "Repair part not found" });
        }
        yield db.query("DELETE FROM repairs WHERE id = ?", [id]);
        return res
            .status(200)
            .json({ message: "Repair part deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting repair part:", err);
        return res
            .status(500)
            .json({ message: "Internal Server Error", error: err });
    }
});
exports.deleteRepairPartById = deleteRepairPartById;
