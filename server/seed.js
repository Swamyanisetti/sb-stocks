// Seeds the database with an admin account and a starter set of US-listed stocks.
// Run with: npm run seed
require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/userModel");
const Stock = require("./models/stockModel");

const stockSeed = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", price: 210.5 },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology", price: 445.2 },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", price: 178.3 },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Discretionary", price: 195.6 },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive", price: 248.9 },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology", price: 512.4 },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology", price: 132.8 },
  { symbol: "NFLX", name: "Netflix Inc.", sector: "Media", price: 685.1 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financials", price: 210.7 },
  { symbol: "V", name: "Visa Inc.", sector: "Financials", price: 275.4 },
  { symbol: "DIS", name: "The Walt Disney Company", sector: "Media", price: 112.3 },
  { symbol: "KO", name: "The Coca-Cola Company", sector: "Consumer Staples", price: 68.9 },
];

const seed = async () => {
  await connectDB();

  const adminEmail = "admin@sbstocks.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash("Admin@123", 10);
    await User.create({
      name: "SB Stocks Admin",
      email: adminEmail,
      password: hashed,
      role: "admin",
      funds: 1000000,
    });
    console.log(`Admin created -> email: ${adminEmail} / password: Admin@123`);
  } else {
    console.log("Admin already exists, skipping");
  }

  for (const s of stockSeed) {
    const exists = await Stock.findOne({ symbol: s.symbol });
    if (exists) continue;
    await Stock.create({
      ...s,
      previousClose: s.price,
      dayHigh: s.price,
      dayLow: s.price,
      volume: Math.floor(Math.random() * 1000000),
      history: [{ date: new Date(), price: s.price }],
    });
    console.log(`Seeded stock ${s.symbol}`);
  }

  console.log("Seeding complete");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
