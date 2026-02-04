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
exports.getAllReports = void 0;
const db_1 = __importDefault(require("../config/db"));
/**
 * GET /reports/all
 * Returns 1 day, 7 days, 1 month, 6 months, 1 year reports
 */
const getAllReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield db_1.default;
        const [rows] = yield pool.query(`
      SELECT
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN repair_cost ELSE 0 END) AS day_profit,
        SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN repair_cost ELSE 0 END) AS week_profit,
        SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN repair_cost ELSE 0 END) AS month_profit,
        SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) THEN repair_cost ELSE 0 END) AS half_year_profit,
        SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) THEN repair_cost ELSE 0 END) AS year_profit,

        COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) AS day_items,
        COUNT(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) AS week_items,
        COUNT(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN 1 END) AS month_items,
        COUNT(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) THEN 1 END) AS half_year_items,
        COUNT(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) THEN 1 END) AS year_items
      FROM repairs
    `);
        res.json({
            day: {
                total_profit: Number(rows[0].day_profit),
                total_items_sold: Number(rows[0].day_items),
            },
            week: {
                total_profit: Number(rows[0].week_profit),
                total_items_sold: Number(rows[0].week_items),
            },
            month: {
                total_profit: Number(rows[0].month_profit),
                total_items_sold: Number(rows[0].month_items),
            },
            half_year: {
                total_profit: Number(rows[0].half_year_profit),
                total_items_sold: Number(rows[0].half_year_items),
            },
            year: {
                total_profit: Number(rows[0].year_profit),
                total_items_sold: Number(rows[0].year_items),
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch reports" });
    }
});
exports.getAllReports = getAllReports;
