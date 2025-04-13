const express = require("express");
const { getDetailedAnalytics } = require("../controllers/DataVisController");

const router = express.Router();
router.get("/analytics", getDetailedAnalytics);

module.exports = router;
