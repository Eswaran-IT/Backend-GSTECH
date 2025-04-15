// config/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,  // We will set the DB name here
  waitForConnections: true,       // Wait for available connection
  connectionLimit: 10,            // Max 10 connections at a time
  queueLimit: 0                   // Unlimited query queue
});

async function pingDatabase() {
  try {
    const [rows] = await pool.query('SELECT 1');  // Query to keep the connection alive
    console.log("MySQL connection is active.");
  } catch (err) {
    console.error("Error pinging MySQL:", err.message);
  }
}

// Optionally ping MySQL every 5 minutes to keep it awake
setInterval(pingDatabase, 300000); // Ping every 5 minutes

function getPool() {
  return pool;
}

module.exports = { getPool };
