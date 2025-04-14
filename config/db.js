// config/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

function connectDB() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("MySQL Pool Created");
  } catch (err) {
    console.error("MySQL pool creation failed:", err.message);
    process.exit(1);
  }
}

function getPool() {
  return pool;
}

module.exports = { connectDB, getPool };
