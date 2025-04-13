require("dotenv").config(); // Load environment variables from the .env file
const express = require("express");
const cors = require("cors");
const setupDatabase = require("./config/dbsetup");

const app = express();

// Set up CORS to allow your GoDaddy frontend domain
app.use(cors({
  origin: "http://y5p.e9b.mytemp.website", // Replace with your GoDaddy domain
  credentials: true, // Allow credentials if necessary (cookies, etc.)
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
  // Listen without specifying a port (platform decides the port for you)
  app.listen(() => {
    console.log("Server is running (platform assigns the port automatically)");
  });
}).catch((err) => {
  console.error("Failed to start server:", err.message);
});
