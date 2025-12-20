import { Request, Response } from "express";
import dbPromise from "../config/db";

/**
 * GET /reports/all
 * Returns 1 day, 7 days, 1 month, 6 months, 1 year reports
 */
export const getAllReports = async (req: Request, res: Response) => {
  try {
    const pool = await dbPromise;

    const [rows]: any = await pool.query(`
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};
