// main.js
require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const setupDatabase = require("./config/dbsetup");

const app = express();

// Set up CORS to allow your GoDaddy frontend domain
app.use(cors({
  origin: "http://y5p.e9b.mytemp.website", // Replace with your GoDaddy frontend domain
  credentials: true, // Allow credentials (cookies, etc.) if necessary
}));

// Middleware to parse JSON data in request bodies
app.use(express.json());

// Import Routes
const contactRoute = require("./routes/ContactRoute");
const userTrackingRoute = require("./routes/UserTrackingRoute");
const analyticsRoute = require("./routes/DataVisRoute");

// Register Routes
app.use("/", analyticsRoute);
app.use("/", contactRoute);
app.use("/", userTrackingRoute);

// Set up database and start the server
setupDatabase().then(() => {
  const PORT = process.env.PORT || 3000; // You can adjust the port here
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to start server:", err.message);
});
