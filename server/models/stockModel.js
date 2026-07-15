const mongoose = require("mongoose");

const historyPointSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const stockSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true },
    sector: { type: String, default: "General" },
    exchange: { type: String, default: "NASDAQ" },
    price: { type: Number, required: true },
    previousClose: { type: Number, required: true },
    dayHigh: { type: Number, required: true },
    dayLow: { type: Number, required: true },
    volume: { type: Number, default: 0 },
    history: { type: [historyPointSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

stockSchema.index({ symbol: "text", name: "text" });

module.exports = mongoose.model("Stock", stockSchema);
