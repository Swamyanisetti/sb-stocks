const express = require("express");
const router = express.Router();
const { getMyPortfolio } = require("../controllers/portfolioController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getMyPortfolio);

module.exports = router;
