import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbPromise from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// Create and login user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const db = await dbPromise;

    // Check if email exists
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if ((existing as any).length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    const userId = (result as any).insertId;

    // Generate JWT
    const token = jwt.sign({ id: userId, name, email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      id: userId,
      name,
      email,
      token,
      message: "User created and logged in",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const db = await dbPromise;
    const [rows] = await db.query(
      "SELECT id, name, email, password FROM users WHERE email = ?",
      [email]
    );
    const user = (rows as any)[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token,
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all users (protected)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const [rows] = await db.query("SELECT id, name, email FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get user by ID (protected)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const id = req.params.id;
    const [rows] = await db.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [id]
    );
    if ((rows as any).length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json((rows as any)[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update user (protected)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const id = req.params.id;
    const { name, email, password } = req.body;
    if (!name || !email)
      return res.status(400).json({ message: "Name and Email required" });

    let query = "UPDATE users SET name = ?, email = ?";
    const params: any[] = [name, email];
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ", password = ?";
      params.push(hashedPassword);
    }
    query += " WHERE id = ?";
    params.push(id);

    const [result] = await db.query(query, params);
    res.json({ message: "User updated", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete user (protected)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const db = await dbPromise;
    const id = req.params.id;
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "User deleted", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
