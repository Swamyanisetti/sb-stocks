const express = require("express");
const router = express.Router();
const {
  getStocks,
  getStockBySymbol,
  createStock,
  updateStock,
  deleteStock,
} = require("../controllers/stockController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.get("/", getStocks);
router.get("/:symbol", getStockBySymbol);
router.post("/", protect, adminOnly, createStock);
router.put("/:id", protect, adminOnly, updateStock);
router.delete("/:id", protect, adminOnly, deleteStock);

module.exports = router;
