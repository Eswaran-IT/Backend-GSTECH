const express = require("express");
const { trackUser } = require("../controllers/UsertrackingController");
const router = express.Router();

router.post("/track", trackUser);

module.exports = router;
