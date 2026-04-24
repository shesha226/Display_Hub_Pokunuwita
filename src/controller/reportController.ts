import { Request, Response } from "express";
import dbPromise from "../config/db";

/**
 * GET /reports/all
 * Returns report data based on the requested range (today, 7d, 30d, 3m, 1y)
 */
export const getAllReports = async (req: Request, res: Response) => {
  try {
    const pool = await dbPromise;

    const range = (req.query.range as string) || "7d";

    let dateFilter = "created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
    if (range === "today") {
      dateFilter = "DATE(created_at) = CURDATE()";
    } else if (range === "30d") {
      dateFilter = "created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
    } else if (range === "3m") {
      dateFilter = "created_at >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)";
    } else if (range === "1y") {
      dateFilter = "created_at >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)";
    }

    // 1. Total Data
    const [totals]: any = await pool.query(`
      SELECT
        SUM(repair_cost) AS total_revenue,
        SUM(repair_cost) AS total_profit,
        COUNT(*) AS total_items_sold
      FROM repairs
      WHERE ${dateFilter} AND status = 'completed' 
    `);

    // 2. Daily Data (Error එක හැදුවේ මෙතනයි)
    // GROUP BY සහ ORDER BY යන දෙකම SELECT කරන DATE_FORMAT එකට සමාන කර ඇත.
    const [dailyData]: any = await pool.query(`
      SELECT
        DATE_FORMAT(created_at, '%Y-%m-%d') AS date,
        SUM(repair_cost) AS profit,
        SUM(repair_cost) AS revenue,
        COUNT(*) AS items_sold
      FROM repairs
      WHERE ${dateFilter} AND status = 'completed'
      GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
      ORDER BY DATE_FORMAT(created_at, '%Y-%m-%d') ASC
    `);

    // 3. Top Items
    const [topItems]: any = await pool.query(`
      SELECT
        phone_model AS name,
        COUNT(*) AS qty,
        SUM(repair_cost) AS revenue
      FROM repairs
      WHERE ${dateFilter} AND status = 'completed'
      GROUP BY phone_model
      ORDER BY qty DESC
      LIMIT 5
    `);

    res.json({
      total_profit: Number(totals[0]?.total_profit) || 0,
      total_revenue: Number(totals[0]?.total_revenue) || 0,
      total_items_sold: Number(totals[0]?.total_items_sold) || 0,
      daily_data: dailyData || [],
      top_items: topItems || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};
