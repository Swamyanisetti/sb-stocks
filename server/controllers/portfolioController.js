const Portfolio = require("../models/portfolioModel");
const Stock = require("../models/stockModel");

// @desc Get the logged-in user's portfolio with live valuation
// @route GET /api/portfolio
const getMyPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id }).populate(
      "holdings.stock",
      "symbol name price"
    );
    if (!portfolio) return res.json({ holdings: [], totalValue: 0, totalInvested: 0, totalPL: 0 });

    let totalValue = 0;
    let totalInvested = 0;

    const holdings = portfolio.holdings.map((h) => {
      const currentPrice = h.stock ? h.stock.price : 0;
      const marketValue = currentPrice * h.quantity;
      const investedValue = h.avgBuyPrice * h.quantity;
      totalValue += marketValue;
      totalInvested += investedValue;
      return {
        symbol: h.symbol,
        name: h.stock ? h.stock.name : h.symbol,
        quantity: h.quantity,
        avgBuyPrice: h.avgBuyPrice,
        currentPrice,
        marketValue,
        profitLoss: marketValue - investedValue,
      };
    });

    res.json({
      _id: portfolio._id,
      name: portfolio.name,
      holdings,
      totalValue,
      totalInvested,
      totalPL: totalValue - totalInvested,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch portfolio", error: error.message });
  }
};

module.exports = { getMyPortfolio };
