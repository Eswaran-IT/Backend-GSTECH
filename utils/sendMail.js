const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async ({ name, email, phone, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",  // Keep Gmail service or switch it to GoDaddy (if necessary)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"GS Tech Groups" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "New Contact Form Submission",
    html: `
      <h2>Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
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
