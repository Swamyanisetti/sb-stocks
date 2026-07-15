const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stock: { type: mongoose.Schema.Types.ObjectId, ref: "Stock", required: true },
    symbol: { type: String, required: true },
    transactionType: { type: String, enum: ["BUY", "SELL"], required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMode: { type: String, default: "VIRTUAL_WALLET" },
    orderType: { type: String, enum: ["MARKET"], default: "MARKET" },
    orderStatus: { type: String, enum: ["COMPLETED", "FAILED"], default: "COMPLETED" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
