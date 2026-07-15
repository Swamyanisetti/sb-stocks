const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  depositFunds,
  withdrawFunds,
  getAllUsers,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/deposit", protect, depositFunds);
router.post("/withdraw", protect, withdrawFunds);
router.get("/", protect, adminOnly, getAllUsers);

module.exports = router;
