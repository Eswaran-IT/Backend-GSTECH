const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async ({ name, email, phone, message }) => {
  // Create a transporter using Gmail's SMTP settings
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",  // Gmail's SMTP server
    port: 465,  // SSL Port (use 587 for TLS)
    secure: true,  // true for SSL, false for TLS
    auth: {
      user: process.env.EMAIL_USER,  // Your Gmail email address
      pass: process.env.EMAIL_PASS,  // Your Gmail app password (if 2FA is enabled)
    },
  });

  const mailOptions = {
    from: `"GS Tech Groups" <${process.env.EMAIL_USER}>`,  // Sender's email
    to: process.env.EMAIL_USER,  // Send to your own Gmail email
    subject: "New Contact Form Submission",  // Email subject
    html: `
      <h2>Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,  // HTML content of the email
  };

  try {
    // Try to send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    return true;
  } catch (err) {
    // Specific handling for different error types
    console.error("Mail Error: ", err);

    // Handling common Nodemailer SMTP errors
    if (err.code === 'EAUTH') {
      console.error("Authentication error - Check username and password!");
    } else if (err.code === 'ECONNECTION') {
      console.error("Network connection error - Ensure the SMTP server is accessible!");
    } else if (err.code === 'EENVELOPE') {
      console.error("Envelope error - Check sender and recipient email format!");
    } else if (err.code === 'ETIMEDOUT') {
      console.error("Timeout error - Check if the server is taking too long to respond.");
    } else {
      console.error("Unexpected error occurred:", err.message);
    }

    // Return false to indicate failure
    return false;
  }
};

module.exports = sendMail;
