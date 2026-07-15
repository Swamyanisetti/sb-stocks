const Watchlist = require("../models/watchlistModel");
const Stock = require("../models/stockModel");

// @desc Get the logged-in user's watchlist
// @route GET /api/watchlist
const getMyWatchlist = async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ user: req.user._id }).populate("stocks");
    if (!watchlist) watchlist = await Watchlist.create({ user: req.user._id, stocks: [] });
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch watchlist", error: error.message });
  }
};

// @desc Add a stock to the watchlist
// @route POST /api/watchlist/:symbol
const addToWatchlist = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    let watchlist = await Watchlist.findOne({ user: req.user._id });
    if (!watchlist) watchlist = await Watchlist.create({ user: req.user._id, stocks: [] });

    if (!watchlist.stocks.includes(stock._id)) {
      watchlist.stocks.push(stock._id);
      await watchlist.save();
    }
    const populated = await watchlist.populate("stocks");
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update watchlist", error: error.message });
  }
};

// @desc Remove a stock from the watchlist
// @route DELETE /api/watchlist/:symbol
const removeFromWatchlist = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    const watchlist = await Watchlist.findOne({ user: req.user._id });
    if (watchlist) {
      watchlist.stocks = watchlist.stocks.filter((id) => id.toString() !== stock._id.toString());
      await watchlist.save();
    }
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to update watchlist", error: error.message });
  }
};

module.exports = { getMyWatchlist, addToWatchlist, removeFromWatchlist };
