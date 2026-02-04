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
const promise_1 = __importDefault(require("mysql2/promise"));
require("dotenv/config");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
function initDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create connection without database
            const connection = yield promise_1.default.createConnection({
                host: DB_HOST,
                user: DB_USER,
                password: DB_PASSWORD,
            });
            // Create database if not exists
            yield connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
            console.log(`Database '${DB_NAME}' is ready`);
            // Close connection
            yield connection.end();
            // Create pool with database
            const pool = promise_1.default.createPool({
                host: DB_HOST,
                user: DB_USER,
                password: DB_PASSWORD,
                database: DB_NAME,
            });
            // Create users table if not exists
            yield pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);
            console.log("Table 'users' is ready");
            //create  customers table if not exists
            yield pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        phone VARCHAR(50)
      )
    `);
            console.log("Table 'customers' is ready");
            //create  orders table  if not exists
            yield pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  )
    `);
            console.log("Table 'orders' is ready");
            // REPAIRS TABLE
            yield pool.query(`
      CREATE TABLE IF NOT EXISTS repairs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(100),
        phone_model VARCHAR(100),
        issue VARCHAR(255),
        repair_cost DECIMAL(10,2),
        status ENUM('pending','completed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
            console.log("Table 'repairs' is ready");
            //COMPLETED REPAIRS TABLE
            yield pool.query(`
    CREATE TABLE IF NOT EXISTS completed_repairs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100),
  phone_model VARCHAR(100),
  issue VARCHAR(255),
  repair_cost DECIMAL(10,2),
  status ENUM('completed') DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
  `);
            console.log("Table 'completed_repairs' is ready");
            //create payments  table if not exists
            yield pool.query(`
  CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT NOT NULL,

    completed_repair_id INT NULL,
    order_id INT NULL,

    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'card', 'bank') DEFAULT 'cash',

    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    note VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_customer
      FOREIGN KEY (customer_id)
      REFERENCES customers(id)
      ON DELETE CASCADE,

    CONSTRAINT fk_payment_completed_repair
      FOREIGN KEY (completed_repair_id)
      REFERENCES completed_repairs(id)
      ON DELETE SET NULL,

    CONSTRAINT fk_payment_order
      FOREIGN KEY (order_id)
      REFERENCES orders(id)
      ON DELETE SET NULL
  )
`);
            console.log("Table 'payments' is ready");
            //create accessories table if not exists
            yield pool.query(`
  CREATE TABLE IF NOT EXISTS accessories (
    id INT AUTO_INCREMENT PRIMARY KEY,

    category ENUM(
      'tempered',
      'backcover',
      'battery',
      'charger',
      'phone',
      'handfree',
      'speakers',
      'earbuds',
      'other'
    ) NOT NULL DEFAULT 'other',

    item_name VARCHAR(100) NOT NULL,
    item_number VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    offer_price DECIMAL(10,2),
    qty_on_hand INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);
            console.log("Table 'accessories' is ready");
            // ORDER ITEMS TABLE (connect orders + accessories)
            yield pool.query(`
  CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    accessory_id INT,
    quantity INT,
    price DECIMAL(10,2),
    discount DECIMAL(10,2),
    final_price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (accessory_id) REFERENCES accessories(id)
  )

  
`);
            console.log("Table 'order_items' is ready");
            // REPORTS TABLE (optional, for storing monthly reports)
            yield pool.query(`
  CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_month INT NOT NULL,
    report_year INT NOT NULL,
    total_profit DECIMAL(10,2) DEFAULT 0,
    total_items_sold INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_month_year (report_month, report_year)
  )
`);
            console.log("Table 'reports' is ready");
            return pool;
        }
        catch (err) {
            console.error("DB initialization error:", err);
            process.exit(1);
        }
    });
}
const db = initDB();
exports.default = db;
