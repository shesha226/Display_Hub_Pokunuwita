import dbPromise from "../config/db";
export const PaymentRepository = {

    async createPayments(data: {
        customer_id: number,
        order_id?: number | null,
        completed_repair_id?: number | null,
        amount: number,
        payment_method: string,
        payment_date: string,
    }) {
        const db = await dbPromise;
        const [result] = await db.query(
            "INSERT INTO payments (customer_id, order_id, completed_repair_id, amount, payment_method, payment_date) VALUES (?, ?, ?, ?, ?, ?)",
            [data.customer_id, data.order_id, data.completed_repair_id, data.amount, data.payment_method, data.payment_date]
        );
        return result;
    },

    async getAllPayments() {
        const db = await dbPromise;
        const [rows] = await db.query("SELECT * FROM payments ORDER BY id DESC");
        return rows;
    },

    async findByCustomerId(customerId: number) {
        const db = await dbPromise;
        const [rows] = await db.query(
            `SELECT p.*, 
              r.phone_model AS repair_model,
              o.total_amount AS order_total
       FROM payments p
       LEFT JOIN completed_repairs r ON p.completed_repair_id = r.id
       LEFT JOIN orders o ON p.order_id = o.id
       WHERE p.customer_id = ?
       ORDER BY p.payment_date DESC`,
            [customerId]
        );

        return rows;
    },

    async findById(id: number) {
        const db = await dbPromise;

        if (!id) {
            throw new Error("Payment ID is required");
        }

        const [rows] = await db.query(
            "SELECT * FROM payments WHERE id = ?",
            [id]
        );
        return (rows as any)[0] || null;
    },

    async updateById(
        id: number,
        data: {
            amount: number;
            payment_date?: string;
            payment_method?: string;
            note?: string;
        }
    ) {
        const db = await dbPromise;

        const [result] = await db.query(
            `UPDATE payments
       SET amount = ?, payment_date = ?, payment_method = ?, note = ?
       WHERE id = ?`,
            [
                data.amount,
                data.payment_date || new Date(),
                data.payment_method || "cash",
                data.note || null,
                id,
            ]
        );

        return result;
    }
    ,

    async deletePaymentById(paymentId: number) {
        const db = await dbPromise;
        const [result] = await db.query("DELETE FROM payments WHERE id = ?", [paymentId]);
        return result;
    }
}
