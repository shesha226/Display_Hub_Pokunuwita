import dbPromise from "../config/db";

export const RepairRepository = {

    async createRepair(data: {
        customer_name: string;
        phone_model: string;
        issue: string;
        repair_cost: number;
        status: string;
        advance: number;
    }) {
        const db = await dbPromise;
        const [result]: any = await db.query(
            `INSERT INTO repairs 
       (customer_name, phone_model, issue, repair_cost, status, advance)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.customer_name,
                data.phone_model,
                data.issue,
                data.repair_cost,
                data.status,
                data.advance,
            ]
        );
        return { id: result.insertId };
    },

    async getRepair(id: number) {
        const db = await dbPromise;
        const [rows]: any = await db.query(
            "SELECT * FROM repairs WHERE id = ?",
            [id]
        );
        return rows[0] || null;
    },

    async getAllRepairs() {
        const db = await dbPromise;
        const [rows] = await db.query("SELECT * FROM repairs ORDER BY id DESC");
        return rows;
    },

    async updateRepair(
        id: number,
        data: {
            customer_name: string;
            phone_model: string;
            issue: string;
            repair_cost: number;
            status: string;
            advance: number;
        }
    ) {
        const db = await dbPromise;
        const [result]: any = await db.query(
            `UPDATE repairs 
       SET customer_name = ?, phone_model = ?, issue = ?, repair_cost = ?, status = ?, advance = ?
       WHERE id = ?`,
            [
                data.customer_name,
                data.phone_model,
                data.issue,
                data.repair_cost,
                data.status,
                data.advance,
                id,
            ]
        );
        return result.affectedRows > 0;
    },

    async deleteRepair(id: number) {
        const db = await dbPromise;
        const [result]: any = await db.query(
            "DELETE FROM repairs WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    },


    async findRepairByCustomerAndPhone(customer_name: string, phone_model: string, excludeId?: number) {
        const db = await dbPromise;
        let query = "SELECT * FROM repairs WHERE customer_name = ? AND phone_model = ?";
        const params: any[] = [customer_name, phone_model];
        if (excludeId) {
            query += " AND id != ?";
            params.push(excludeId);
        }
        const [rows] = await db.query(query, params);
        return rows;
    },
};
