import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios.js";
import StockCard from "../components/StockCard.jsx";
import Loader from "../components/Loader.jsx";

const Watchlist = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/watchlist");
      setStocks(data.stocks || []);
    } catch (error) {
      toast.error("Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Hero banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80"
            alt="Stock watchlist charts"
            className="w-full h-40 sm:h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 via-indigo-500/40 to-transparent flex items-center px-6 sm:px-10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">My Watchlist</h1>
              <p className="text-indigo-50 mt-1">Keep an eye on the stocks that matter to you.</p>
            </div>
          </div>
        </div>

        {/* Stocks */}
        {stocks.length === 0 ? (
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-gray-200 text-center py-14 px-6">
            <img
              src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=500&q=80"
              alt="Empty watchlist"
              className="w-32 h-32 object-cover rounded-2xl mx-auto mb-4 opacity-90"
            />
            <p className="text-gray-600">You haven't added any stocks to your watchlist yet.</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Watchlist;