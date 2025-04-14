require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const setupDatabase = require("./config/dbsetup");

const app = express();

// 🔐 CORS - Allow only your frontend domain
app.use(cors({
  origin: "http://y5p.e9b.mytemp.website", // ✅ Replace with your actual frontend domain
  credentials: true
}));

// 🧠 Middleware - Parse JSON
app.use(express.json());

// 🛣️ Import Routes
const contactRoute = require("./routes/ContactRoute");
const userTrackingRoute = require("./routes/UserTrackingRoute");
const analyticsRoute = require("./routes/DataVisRoute");

// 📦 Register Routes
app.use("/", analyticsRoute);
app.use("/", contactRoute);
app.use("/", userTrackingRoute);

// 🗄️ DB Setup + Start Server
setupDatabase()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1); // Optional: Exit process if DB setup fails
  });
