require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { simulateMarketTick } = require("./controllers/stockController");

const userRoutes = require("./routes/userRoute");
const stockRoutes = require("./routes/stockRoute");
const orderRoutes = require("./routes/orderRoute");
const transactionRoutes = require("./routes/transactionRoute");
const portfolioRoutes = require("./routes/portfolioRoute");
const watchlistRoutes = require("./routes/watchlistRoute");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "SB Stocks API" }));

app.use("/api/users", userRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/watchlist", watchlistRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`SB Stocks API running on port ${PORT}`));

  // Simulate real-time market price movement every 10 seconds
  setInterval(() => {
    simulateMarketTick().catch((err) => console.error("Market tick failed:", err.message));
  }, 10000);
});
