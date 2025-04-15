const { getPool } = require("../config/db"); // Correctly importing the db pool
const sendMail = require("../utils/sendMail"); // Importing mail sending function
const { CONTACT_TABLE } = require("../utils/Constants"); // Assuming the table name is defined here

const handleContactForm = async (req, res) => {
  const { name, email, phone, message } = req.body;

  // ✅ Basic validation for required fields
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    const pool = getPool(); // Getting the database pool connection

    // MySQL query for inserting contact form data into the database
    const query = `INSERT INTO ${CONTACT_TABLE} (name, email, phone, message) VALUES (?, ?, ?, ?)`;
    const [results] = await pool.execute(query, [name, email, phone, message]);

    console.log("✅ Contact saved:", results);

    // Send email with contact form data
    const mailSent = await sendMail({ name, email, phone, message });

    if (!mailSent) {
      console.error("❌ Email sending failed");
      return res.status(500).json({ success: false, error: "Failed to send email" });
    }

    console.log("✅ Email sent successfully");

    return res.status(200).json({ success: true, message: "Submitted successfully" });

  } catch (err) {
    console.error("❌ Server Error:", err.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = { handleContactForm };
