import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import StockCard from "../components/StockCard.jsx";
import Loader from "../components/Loader.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [portfolioRes, stocksRes] = await Promise.all([
          api.get("/portfolio"),
          api.get("/stocks"),
        ]);
        setPortfolio(portfolioRes.data);
        setStocks(stocksRes.data.slice(0, 6));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  const totalPL = portfolio?.totalPL || 0;
  const isProfit = totalPL >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

        {/* Hero banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80"
            alt="Stock trading chart"
            className="w-full h-48 sm:h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 via-indigo-500/50 to-transparent flex flex-col justify-center px-6 sm:px-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-indigo-50 mt-1">
              Here's a snapshot of your virtual trading account.
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-sky-200 p-5 flex items-center gap-4 hover:shadow-md hover:bg-white transition-all">
            <div className="p-3 rounded-xl bg-sky-200 text-sky-700 text-2xl">💰</div>
            <div>
              <p className="text-sm text-gray-600">Available funds</p>
              <p className="text-2xl font-bold text-gray-900">
                ${user?.funds?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-violet-200 p-5 flex items-center gap-4 hover:shadow-md hover:bg-white transition-all">
            <div className="p-3 rounded-xl bg-violet-200 text-violet-700 text-2xl">📊</div>
            <div>
              <p className="text-sm text-gray-600">Portfolio value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(portfolio?.totalValue || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div
            className={`rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 p-5 flex items-center gap-4 hover:shadow-md hover:bg-white transition-all ${
              isProfit ? "ring-emerald-200" : "ring-rose-200"
            }`}
          >
            <div
              className={`p-3 rounded-xl text-2xl ${
                isProfit ? "bg-emerald-200 text-emerald-700" : "bg-rose-200 text-rose-700"
              }`}
            >
              {isProfit ? "📈" : "📉"}
            </div>
            <div>
              <p className="text-sm text-gray-600">Unrealized P/L</p>
              <p className={`text-2xl font-bold ${isProfit ? "text-emerald-600" : "text-rose-600"}`}>
                {isProfit ? "+" : ""}${totalPL.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Link
            to="/stocks"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 transition-colors"
          >
            📈 Browse Stocks
          </Link>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-600 font-medium ring-1 ring-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            📊 View Portfolio
          </Link>
        </div>

        {/* Market movers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Market Movers</h2>
            <Link to="/stocks" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
              See all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stocks.map((s) => (
              <div
                key={s._id}
                className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-gray-200 hover:shadow-md hover:bg-white hover:-translate-y-0.5 transition-all"
              >
                <StockCard stock={s} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;