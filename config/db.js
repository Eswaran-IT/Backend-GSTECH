// config/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,  // The database name from .env file
  waitForConnections: true,       // Wait for available connection
  connectionLimit: 10,            // Max 10 connections at a time
  queueLimit: 0                   // Unlimited query queue
});

// Function to check and keep MySQL connection alive
async function pingDatabase() {
  try {
    // Directly use pool.query() to ping the database
    await pool.query("SELECT 1");
    console.log("MySQL connection is active.");
  } catch (err) {
    console.error("Error pinging MySQL:", err.message);
  }
}

// Optionally ping MySQL every 5 minutes to keep it awake
setInterval(pingDatabase, 300000); // Ping every 5 minutes

// Get connection pool
function getPool() {
  return pool;
}

module.exports = { getPool };
