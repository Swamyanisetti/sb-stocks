const Stock = require("../models/stockModel");

// @desc Get all stocks with optional search / sector filter
// @route GET /api/stocks?search=&sector=
const getStocks = async (req, res) => {
  try {
    const { search, sector } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { symbol: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }
    if (sector) {
      query.sector = sector;
    }

    const stocks = await Stock.find(query).sort({ symbol: 1 });
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stocks", error: error.message });
  }
};

// @desc Get a single stock by symbol, including price history
// @route GET /api/stocks/:symbol
const getStockBySymbol = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ message: "Stock not found" });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stock", error: error.message });
  }
};

// @desc Create a new stock listing (admin)
// @route POST /api/stocks
const createStock = async (req, res) => {
  try {
    const { symbol, name, sector, exchange, price } = req.body;
    if (!symbol || !name || !price) {
      return res.status(400).json({ message: "Symbol, name and price are required" });
    }
    const exists = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (exists) return res.status(409).json({ message: "Stock symbol already exists" });

    const stock = await Stock.create({
      symbol: symbol.toUpperCase(),
      name,
      sector,
      exchange,
      price,
      previousClose: price,
      dayHigh: price,
      dayLow: price,
      history: [{ date: new Date(), price }],
    });
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ message: "Failed to create stock", error: error.message });
  }
};

// @desc Update a stock listing (admin)
// @route PUT /api/stocks/:id
const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    const fields = ["name", "sector", "exchange", "price", "dayHigh", "dayLow", "volume", "isActive"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) stock[field] = req.body[field];
    });

    if (req.body.price !== undefined) {
      stock.history.push({ date: new Date(), price: req.body.price });
    }

    const updated = await stock.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update stock", error: error.message });
  }
};

// @desc Delete (deactivate) a stock listing (admin)
// @route DELETE /api/stocks/:id
const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });
    await stock.deleteOne();
    res.json({ message: "Stock removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete stock", error: error.message });
  }
};

// @desc Simulate one market tick: nudge every active stock's price randomly
// Exported so it can be triggered by a scheduled interval in index.js
const simulateMarketTick = async () => {
  const stocks = await Stock.find({ isActive: true });
  await Promise.all(
    stocks.map(async (stock) => {
      const changePercent = (Math.random() - 0.5) * 0.04; // +/-2% per tick
      let newPrice = stock.price * (1 + changePercent);
      newPrice = Math.max(0.5, Number(newPrice.toFixed(2)));

      stock.previousClose = stock.price;
      stock.price = newPrice;
      stock.dayHigh = Math.max(stock.dayHigh, newPrice);
      stock.dayLow = Math.min(stock.dayLow, newPrice);
      stock.volume += Math.floor(Math.random() * 5000);

      stock.history.push({ date: new Date(), price: newPrice });
      if (stock.history.length > 200) stock.history = stock.history.slice(-200);

      await stock.save();
    })
  );
};

module.exports = {
  getStocks,
  getStockBySymbol,
  createStock,
  updateStock,
  deleteStock,
  simulateMarketTick,
};
