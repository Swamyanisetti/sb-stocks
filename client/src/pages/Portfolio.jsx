import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/portfolio");
        setPortfolio(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  const holdings = portfolio?.holdings || [];
  const totalPL = portfolio?.totalPL || 0;
  const isProfit = totalPL >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Hero banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1200&q=80"
            alt="Investment portfolio charts"
            className="w-full h-40 sm:h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 via-indigo-500/50 to-transparent flex flex-col justify-center px-6 sm:px-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">My Portfolio</h1>
            <p className="text-indigo-50 mt-1">Track your holdings and performance.</p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-sky-200 p-5 hover:shadow-md hover:bg-white transition-all">
            <p className="text-sm text-gray-600">Total invested</p>
            <p className="text-xl font-bold text-gray-900">${(portfolio?.totalInvested || 0).toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-violet-200 p-5 hover:shadow-md hover:bg-white transition-all">
            <p className="text-sm text-gray-600">Current value</p>
            <p className="text-xl font-bold text-gray-900">${(portfolio?.totalValue || 0).toFixed(2)}</p>
          </div>
          <div
            className={`rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 p-5 hover:shadow-md hover:bg-white transition-all ${
              isProfit ? "ring-emerald-200" : "ring-rose-200"
            }`}
          >
            <p className="text-sm text-gray-600">Total P/L</p>
            <p className={`text-xl font-bold ${isProfit ? "text-emerald-600" : "text-rose-600"}`}>
              {isProfit ? "+" : ""}${totalPL.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Holdings */}
        {holdings.length === 0 ? (
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-gray-200 text-center py-14 px-6">
            <img
              src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=500&q=80"
              alt="Empty portfolio"
              className="w-32 h-32 object-cover rounded-2xl mx-auto mb-4 opacity-90"
            />
            <p className="text-gray-600 mb-4">You don't own any stocks yet.</p>
            <Link
              to="/stocks"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 transition-colors"
            >
              📈 Browse Stocks
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-200">
                  <th className="py-3 pl-5 pr-4">Symbol</th>
                  <th className="py-3 pr-4">Qty</th>
                  <th className="py-3 pr-4">Avg Buy Price</th>
                  <th className="py-3 pr-4">Current Price</th>
                  <th className="py-3 pr-4">Market Value</th>
                  <th className="py-3 pr-5">P/L</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.symbol} className="border-b border-gray-100 last:border-0 hover:bg-sky-50/60 transition-colors">
                    <td className="py-3 pl-5 pr-4 font-medium">
                      <Link to={`/stocks/${h.symbol}`} className="text-indigo-600 hover:text-indigo-700">
                        {h.symbol}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-gray-800">{h.quantity}</td>
                    <td className="py-3 pr-4 text-gray-800">${h.avgBuyPrice.toFixed(2)}</td>
                    <td className="py-3 pr-4 text-gray-800">${h.currentPrice.toFixed(2)}</td>
                    <td className="py-3 pr-4 text-gray-800">${h.marketValue.toFixed(2)}</td>
                    <td className={`py-3 pr-5 font-medium ${h.profitLoss >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {h.profitLoss >= 0 ? "+" : ""}${h.profitLoss.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;