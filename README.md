# SB Stocks — Paper Trading Simulation Platform

A full-stack MERN application that lets users practice buying and selling US stocks
with virtual funds, in a risk-free simulated market environment.

## Tech Stack
- **Frontend:** React (Vite), React Router, Tailwind CSS, Chart.js, Axios, React Toastify
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT + bcrypt password hashing

## Project Structure
```
sb-stocks/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── api/          # Axios instance
│       ├── components/   # Reusable UI (Navbar, StockCard, TradeModal, StockChart...)
│       ├── context/       # AuthContext (JWT session state)
│       ├── pages/         # Route-level pages incl. Admin/
│       ├── App.jsx
│       └── main.jsx
└── server/          # Express backend
    ├── config/db.js
    ├── controllers/    # userController, stockController, orderController, ...
    ├── middlewares/authMiddleware.js  (JWT protect + adminOnly)
    ├── models/         # User, Stock, Transaction, Portfolio, Watchlist
    ├── routes/
    ├── seed.js         # seeds an admin user + starter stock listings
    └── index.js         # app entry point, mounts routes + market simulator
```

## Features
- Secure registration & login (JWT + bcrypt), role-based access (user / admin)
- Simulated real-time market data — stock prices tick every 10 seconds (±2% random walk) so charts and quotes move like a live market
- Stock browsing & search across listed US stocks, with per-stock history chart
- Paper trading: Buy / Sell modals that debit/credit a virtual wallet ($100,000 starting balance)
- Portfolio management: live holdings, average buy price, market value, and profit/loss
- Watchlist: star stocks to track without owning them
- Transaction history: full audit log of every buy/sell
- Admin panel: manage the stock catalog (create/update/delete listings), view users & all transactions

## Getting Started

### Prerequisites
- Node.js v16+
- npm
- MongoDB running locally (or a MongoDB Atlas connection string)

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env      # edit MONGO_URI / JWT_SECRET as needed
npm run seed               # creates an admin user + starter stock listings
npm run dev                 # starts the API on http://localhost:5000
```
Seeded admin login: **admin@sbstocks.com** / **Admin@123**

### 2. Frontend Setup
```bash
cd client
npm install
cp .env.example .env       # VITE_API_URL should point at your backend
npm run dev                 # starts the app on http://localhost:5173
```

### 3. Using the App
1. Register a new trading account (starts with $100,000 in virtual funds), or log in as the seeded admin.
2. Browse stocks, view live-updating charts, and place Buy/Sell orders.
3. Track your portfolio, watchlist, and transaction history from the navbar.
4. Log in as admin to add/edit/remove stock listings from `/admin/stocks`.

## Notes
- Real-time data is **simulated** server-side (a random-walk price tick every 10s) rather than pulled from a paid market-data API, so the app runs fully self-contained with no external API keys required. Swapping in a real market-data provider only requires updating `simulateMarketTick` in `server/controllers/stockController.js`.
- All trading is virtual — no real money or real brokerage connections are involved.
