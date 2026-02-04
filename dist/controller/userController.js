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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.loginUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
// Create and login user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Name, email, and password are required" });
        }
        const db = yield db_1.default;
        // Check if email exists
        const [existing] = yield db.query("SELECT id FROM users WHERE email = ?", [
            email,
        ]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Insert new user
        const [result] = yield db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);
        const userId = result.insertId;
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: userId, name, email }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(201).json({
            id: userId,
            name,
            email,
            token,
            message: "User created and logged in",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});
exports.createUser = createUser;
// Login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Email and password required" });
        const db = yield db_1.default;
        const [rows] = yield db.query("SELECT id, name, email, password FROM users WHERE email = ?", [email]);
        const user = rows[0];
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid password" });
        const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            token,
            message: "Login successful",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.loginUser = loginUser;
// Get all users (protected)
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const [rows] = yield db.query("SELECT id, name, email FROM users");
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllUsers = getAllUsers;
// Get user by ID (protected)
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const id = req.params.id;
        const [rows] = yield db.query("SELECT id, name, email FROM users WHERE id = ?", [id]);
        if (rows.length === 0)
            return res.status(404).json({ message: "User not found" });
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getUserById = getUserById;
// Update user (protected)
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const id = req.params.id;
        const { name, email, password } = req.body;
        if (!name || !email)
            return res.status(400).json({ message: "Name and Email required" });
        let query = "UPDATE users SET name = ?, email = ?";
        const params = [name, email];
        if (password) {
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            query += ", password = ?";
            params.push(hashedPassword);
        }
        query += " WHERE id = ?";
        params.push(id);
        const [result] = yield db.query(query, params);
        res.json({ message: "User updated", result });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateUser = updateUser;
// Delete user (protected)
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield db_1.default;
        const id = req.params.id;
        const [result] = yield db.query("DELETE FROM users WHERE id = ?", [id]);
        res.json({ message: "User deleted", result });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteUser = deleteUser;
