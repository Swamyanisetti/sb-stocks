import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios.js";
import StockChart from "../components/StockChart.jsx";
import TradeModal from "../components/TradeModal.jsx";
import Loader from "../components/Loader.jsx";

const StockDetail = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);

  const loadStock = useCallback(async () => {
    try {
      const { data } = await api.get(`/stocks/${symbol}`);
      setStock(data);
    } catch (error) {
      toast.error("Failed to load stock");
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  const checkWatchlist = useCallback(async () => {
    try {
      const { data } = await api.get("/watchlist");
      setInWatchlist(data.stocks?.some((s) => s.symbol === symbol.toUpperCase()));
    } catch (error) {
      // ignore
    }
  }, [symbol]);

  useEffect(() => {
    loadStock();
    checkWatchlist();
  }, [loadStock, checkWatchlist]);

  const toggleWatchlist = async () => {
    try {
      if (inWatchlist) {
        await api.delete(`/watchlist/${symbol}`);
        toast.info(`Removed ${symbol} from watchlist`);
      } else {
        await api.post(`/watchlist/${symbol}`);
        toast.success(`Added ${symbol} to watchlist`);
      }
      setInWatchlist(!inWatchlist);
    } catch (error) {
      toast.error("Failed to update watchlist");
    }
  };

  if (loading) return <Loader />;
  if (!stock) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100 flex items-center justify-center">
        <p className="text-center py-16 text-gray-600">Stock not found.</p>
      </div>
    );
  }

  const change = stock.price - stock.previousClose;
  const changePercent = stock.previousClose ? (change / stock.previousClose) * 100 : 0;
  const isUp = change >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Hero banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"
            alt="Stock market chart"
            className="w-full h-36 sm:h-44 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 via-indigo-500/40 to-transparent flex items-center justify-between px-6 sm:px-10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">{stock.symbol}</h1>
              <p className="text-indigo-50 text-sm sm:text-base">
                {stock.name} · {stock.sector} · {stock.exchange}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                ${stock.price.toFixed(2)}
              </p>
              <p className={`font-medium ${isUp ? "text-emerald-300" : "text-rose-300"}`}>
                {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(2)} ({Math.abs(changePercent).toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>

        {/* Chart card */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-gray-200 p-4 sm:p-6">
          <StockChart history={stock.history} />
        </div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-emerald-200 p-5 hover:shadow-md hover:bg-white transition-all">
            <p className="text-sm text-gray-600">Day High</p>
            <p className="font-semibold text-gray-900">${stock.dayHigh.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-rose-200 p-5 hover:shadow-md hover:bg-white transition-all">
            <p className="text-sm text-gray-600">Day Low</p>
            <p className="font-semibold text-gray-900">${stock.dayLow.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-sky-200 p-5 hover:shadow-md hover:bg-white transition-all">
            <p className="text-sm text-gray-600">Volume</p>
            <p className="font-semibold text-gray-900">{stock.volume.toLocaleString()}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setModalType("BUY")}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700 transition-colors"
          >
            Buy
          </button>
          <button
            onClick={() => setModalType("SELL")}
            className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-medium shadow-sm hover:bg-rose-700 transition-colors"
          >
            Sell
          </button>
          <button
            onClick={toggleWatchlist}
            className="px-5 py-2.5 rounded-xl bg-white text-indigo-600 font-medium ring-1 ring-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            {inWatchlist ? "★ Remove from Watchlist" : "☆ Add to Watchlist"}
          </button>
        </div>

        {modalType && (
          <TradeModal
            stock={stock}
            type={modalType}
            onClose={() => setModalType(null)}
            onSuccess={loadStock}
          />
        )}
      </div>
    </div>
  );
};

export default StockDetail;