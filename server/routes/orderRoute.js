const express = require("express");
const router = express.Router();
const { buyStock, sellStock } = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/buy", protect, buyStock);
router.post("/sell", protect, sellStock);

module.exports = router;
