const Transaction = require("../models/transactionModel");

// @desc Get the logged-in user's transaction history
// @route GET /api/transactions
const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("stock", "symbol name");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
  }
};

// @desc Get all transactions across all users (admin)
// @route GET /api/transactions/all
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("stock", "symbol name");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
  }
};

module.exports = { getMyTransactions, getAllTransactions };
