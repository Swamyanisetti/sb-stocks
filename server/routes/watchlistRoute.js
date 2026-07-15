const express = require("express");
const router = express.Router();
const {
  getMyWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require("../controllers/watchlistController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getMyWatchlist);
router.post("/:symbol", protect, addToWatchlist);
router.delete("/:symbol", protect, removeFromWatchlist);

module.exports = router;
