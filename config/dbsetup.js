// config/dbsetup.js
require("dotenv").config();
const { connectDB, getPool } = require("./db");

const { DB_NAME } = process.env;
const CONTACT_TABLE = "contacts";
const USER_TRACK_TABLE = "user_tracking";

async function setupDatabase() {
  try {
    // 1. Create pool
    connectDB();
    const pool = getPool();

    // 2. Get a connection from pool
    const connection = await pool.getConnection();

    // 3. Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`Database '${DB_NAME}' ensured`);

    // 4. Switch to that database
    await connection.changeUser({ database: DB_NAME });

    // 5. Create contact table if not exists
    const contactTableQuery = `
      CREATE TABLE IF NOT EXISTS ${CONTACT_TABLE} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;
    await connection.query(contactTableQuery);
    console.log("Contacts table ready");

    // 6. Create user tracking table if not exists
    const userTrackQuery = `
      CREATE TABLE IF NOT EXISTS ${USER_TRACK_TABLE} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(100),
        ip_address VARCHAR(45),
        country VARCHAR(100),
        browser_info VARCHAR(100),
        device_info VARCHAR(50),
        os_info VARCHAR(50),
        referrer TEXT,
        is_new_user BOOLEAN,
        entry_date DATE,
        entry_time TIME,
        exit_date DATE,
        exit_time TIME,
        time_spent INT,
        section_viewed JSON,
        interactions JSON
      )`;
    await connection.query(userTrackQuery);
    console.log("User tracking table ready");

    // 7. Release the connection back to pool
    connection.release();
  } catch (err) {
    console.error("Error in DB setup:", err.message);
    process.exit(1);
  }
}

module.exports = setupDatabase;
