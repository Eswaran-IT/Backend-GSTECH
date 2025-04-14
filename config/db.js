// config/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

let connection;

async function connectDB() {
  try {
    // Establish connection to the MySQL server (without specifying DB name)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
    console.log("MySQL Database Connected");
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  }
}

function getConnection() {
  return connection;
}

module.exports = { connectDB, getConnection };
