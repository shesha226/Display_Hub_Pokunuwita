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
exports.markRepairAsDone = void 0;
const db_1 = __importDefault(require("../config/db"));
const markRepairAsDone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const db = yield db_1.default;
        // pending repair එක select කරන්න
        const [rows] = yield db.query("SELECT * FROM repairs WHERE id = ?", [
            id,
        ]);
        if (rows.length === 0)
            return res.status(404).json({ message: "Repair not found" });
        const repair = rows[0];
        // completed_repairs table එකට insert කරන්න
        yield db.query(`INSERT INTO completed_repairs (customer_name, phone_model, issue, repair_cost, status) VALUES (?, ?, ?, ?, ?)`, [
            repair.customer_name,
            repair.phone_model,
            repair.issue,
            repair.repair_cost,
            "completed",
        ]);
        // pending table එකෙන් delete කරන්න
        yield db.query("DELETE FROM repairs WHERE id = ?", [id]);
        res.status(200).json({ message: "Repair marked as done" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.markRepairAsDone = markRepairAsDone;
