const { getConnection } = require("../config/db");
const sendMail = require("../utils/sendMail");
const { CONTACT_TABLE } = require("../utils/Constants");

const handleContactForm = async (req, res) => {
  const { name, email, phone, message } = req.body;

  // ✅ Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    const db = getConnection(); // use your promise-based connection

    const query = `INSERT INTO ${CONTACT_TABLE} (name, email, phone, message) VALUES (?, ?, ?, ?)`;
    const [results] = await db.execute(query, [name, email, phone, message]);

    console.log("✅ Contact saved:", results);

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
