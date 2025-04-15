// config/dbsetup.js
require("dotenv").config();
const { getPool } = require("./db");

const { DB_NAME } = process.env;
const CONTACT_TABLE = "contacts";
const USER_TRACK_TABLE = "user_tracking";

async function setupDatabase() {
  const pool = getPool();
  try {
    // Create the database if it doesn't exist
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`Database '${DB_NAME}' ensured`);

    // Switch to the correct database
    await pool.query(`USE \`${DB_NAME}\``);

    // Create the contacts table if it doesn't exist
    const contactTableQuery = `
      CREATE TABLE IF NOT EXISTS ${CONTACT_TABLE} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;
    await pool.query(contactTableQuery);
    console.log("Contacts table ready");

    // Create user tracking table if it doesn't exist
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
    await pool.query(userTrackQuery);
    console.log("User tracking table ready");

  } catch (err) {
    console.error("Error in DB setup:", err.message);
    process.exit(1);
  }
}

module.exports = setupDatabase;
