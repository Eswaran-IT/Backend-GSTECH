require("dotenv").config();  // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const setupDatabase = require("./config/dbsetup");

const app = express();

// Set up CORS to allow any origin
app.use(cors({
  origin: "*",  // Allow any origin
  credentials: true,  // Allow credentials (cookies, etc.) if necessary
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
  const HOST = "0.0.0.0";  // Allow any device to access the server
  app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to start server:", err.message);
});
