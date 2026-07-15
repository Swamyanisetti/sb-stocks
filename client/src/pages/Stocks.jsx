import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import StockCard from "../components/StockCard.jsx";
import Loader from "../components/Loader.jsx";

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStocks = async (query = "") => {
    setLoading(true);
    try {
      const { data } = await api.get("/stocks", { params: query ? { search: query } : {} });
      setStocks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStocks(search);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Hero banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1400&q=80"
            alt="Stock market trading floor"
            className="w-full h-40 sm:h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 via-indigo-500/40 to-transparent flex items-center px-6 sm:px-10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">Browse Stocks</h1>
              <p className="text-indigo-50 mt-1">Explore live prices and find your next trade.</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          <input
            className="flex-1 min-w-[220px] rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            placeholder="🔍 Search by symbol or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Results */}
        {loading ? (
          <Loader />
        ) : stocks.length === 0 ? (
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-gray-200 text-center py-14 px-6">
            <p className="text-gray-600">No stocks found.</p>
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

export default Stocks;