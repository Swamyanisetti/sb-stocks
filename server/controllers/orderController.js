const mongoose = require("mongoose");
const Stock = require("../models/stockModel");
const User = require("../models/userModel");
const Portfolio = require("../models/portfolioModel");
const Transaction = require("../models/transactionModel");

// @desc Place a BUY order (virtual funds -> holdings)
// @route POST /api/orders/buy
const buyStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const qty = Number(quantity);

    if (!symbol || !qty || qty <= 0) {
      return res.status(400).json({ message: "Symbol and a positive quantity are required" });
    }

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase(), isActive: true });
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    const cost = stock.price * qty;
    const user = await User.findById(req.user._id);

    if (user.funds < cost) {
      return res.status(400).json({ message: "Insufficient virtual funds for this order" });
    }

    let portfolio = await Portfolio.findOne({ user: user._id });
    if (!portfolio) portfolio = await Portfolio.create({ user: user._id, holdings: [] });

    const holding = portfolio.holdings.find((h) => h.symbol === stock.symbol);
    if (holding) {
      const totalQty = holding.quantity + qty;
      holding.avgBuyPrice = (holding.avgBuyPrice * holding.quantity + cost) / totalQty;
      holding.quantity = totalQty;
    } else {
      portfolio.holdings.push({
        stock: stock._id,
        symbol: stock.symbol,
        quantity: qty,
        avgBuyPrice: stock.price,
      });
    }

    user.funds -= cost;

    const transaction = await Transaction.create({
      user: user._id,
      stock: stock._id,
      symbol: stock.symbol,
      transactionType: "BUY",
      quantity: qty,
      price: stock.price,
      total: cost,
    });

    await portfolio.save();
    await user.save();

    res.status(201).json({ transaction, funds: user.funds, portfolio });
  } catch (error) {
    res.status(500).json({ message: "Buy order failed", error: error.message });
  }
};

// @desc Place a SELL order (holdings -> virtual funds)
// @route POST /api/orders/sell
const sellStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const qty = Number(quantity);

    if (!symbol || !qty || qty <= 0) {
      return res.status(400).json({ message: "Symbol and a positive quantity are required" });
    }

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    const portfolio = await Portfolio.findOne({ user: req.user._id });
    const holding = portfolio && portfolio.holdings.find((h) => h.symbol === stock.symbol);

    if (!holding || holding.quantity < qty) {
      return res.status(400).json({ message: "You do not own enough shares to sell" });
    }

    const proceeds = stock.price * qty;
    holding.quantity -= qty;
    if (holding.quantity === 0) {
      portfolio.holdings = portfolio.holdings.filter((h) => h.symbol !== stock.symbol);
    }

    const user = await User.findById(req.user._id);
    user.funds += proceeds;

    const transaction = await Transaction.create({
      user: user._id,
      stock: stock._id,
      symbol: stock.symbol,
      transactionType: "SELL",
      quantity: qty,
      price: stock.price,
      total: proceeds,
    });

    await portfolio.save();
    await user.save();

    res.status(201).json({ transaction, funds: user.funds, portfolio });
  } catch (error) {
    res.status(500).json({ message: "Sell order failed", error: error.message });
  }
};

module.exports = { buyStock, sellStock };
