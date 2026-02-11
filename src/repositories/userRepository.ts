import dbPromis from "../config/db";

export const UserRepository = {
    async createUser(data: any) {
        const db = await dbPromis;
        const [result]: any = await db.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [data.name, data.email, data.password]
        );
        return result.insertId;
    },

    async getUserById(id: number) {
        const db = await dbPromis;
        const [rows]: any = await db.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );
        return rows[0];
    },

    async getAllUsers() {
        const db = await dbPromis;
        const [rows]: any = await db.query(
            "SELECT * FROM users"
        );
        return rows;
    },

    async updateUser(id: number, data: any) {
        const db = await dbPromis;
        const [result]: any = await db.query(
            "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
            [data.name, data.email, data.password, id]
        );
        return result.affectedRows > 0;
    },

    async deleteUser(id: number) {
        const db = await dbPromis;
        const [result]: any = await db.query(
            "DELETE FROM users WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    },

    async getUserByEmail(email: string) {
        const db = await dbPromis;
        const [rows]: any = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        return rows[0];
    },
};
