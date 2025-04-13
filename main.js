require("dotenv").config();
const express = require("express");
const cors = require("cors");
const setupDatabase = require("./config/dbsetup");

const app = express();

// Set the port to the one provided by the environment (Clever Cloud sets it) or fallback to 8080
const PORT = process.env.PORT || 8080;

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
  // Listen on the appropriate port and ensure it binds to 0.0.0.0 for external access
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  // If the database setup fails, log the error
  console.error("Failed to start server:", err.message);
});
