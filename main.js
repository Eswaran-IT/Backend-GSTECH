// main.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const setupDatabase = require("./config/dbsetup");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://y5p.e9b.mytemp.website/", 
  credentials: true,
}));
app.use(express.json());

// Routes
const contactRoute = require("./routes/ContactRoute");
const userTrackingRoute = require("./routes/UserTrackingRoute");
const analyticsRoute = require("./routes/DataVisRoute");

app.use("/", analyticsRoute);
app.use("/", contactRoute);
app.use("/", userTrackingRoute);

// Setup DB and start server
setupDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to start server:", err.message);
});
