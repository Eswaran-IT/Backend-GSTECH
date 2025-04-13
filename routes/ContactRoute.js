const express = require("express");
const router = express.Router();
const { handleContactForm } = require("../controllers/ContactController");

router.post("/contact", handleContactForm);

module.exports = router;
