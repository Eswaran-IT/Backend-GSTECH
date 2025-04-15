// config/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Simple heartbeat query to keep the connection alive
async function keepConnectionAlive() {
  try {
    // Perform a dummy query (heartbeat) every minute
    const [rows] = await pool.query("SELECT 1");
    console.log("Database connection is alive.");
  } catch (err) {
    console.error("Error keeping DB connection alive:", err.message);
  }
}

// Keep pinging every 5 minutes to ensure the database connection remains active
setInterval(keepConnectionAlive, 300000); // Ping every 5 minutes

// For external usage, to execute database queries
function getPool() {
  return pool;
}

module.exports = { getPool };
