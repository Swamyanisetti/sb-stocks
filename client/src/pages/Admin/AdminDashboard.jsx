import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, stocks: 0, transactions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, stocksRes, txRes] = await Promise.all([
          api.get("/users"),
          api.get("/stocks"),
          api.get("/transactions/all"),
        ]);
        setStats({
          users: usersRes.data.length,
          stocks: stocksRes.data.length,
          transactions: txRes.data.length,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Hero banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1200&q=80"
            alt="Trading platform analytics"
            className="w-full h-36 sm:h-44 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/85 via-indigo-600/50 to-transparent flex items-center px-6 sm:px-10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">Admin Dashboard</h1>
              <p className="text-indigo-50 mt-1">Platform-wide stats and management tools.</p>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-sky-200 p-5 flex items-center gap-4 hover:shadow-md hover:bg-white transition-all">
            <div className="p-3 rounded-xl bg-sky-200 text-sky-700 text-2xl">👥</div>
            <div>
              <p className="text-sm text-gray-600">Registered users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-violet-200 p-5 flex items-center gap-4 hover:shadow-md hover:bg-white transition-all">
            <div className="p-3 rounded-xl bg-violet-200 text-violet-700 text-2xl">📈</div>
            <div>
              <p className="text-sm text-gray-600">Listed stocks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.stocks}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-emerald-200 p-5 flex items-center gap-4 hover:shadow-md hover:bg-white transition-all">
            <div className="p-3 rounded-xl bg-emerald-200 text-emerald-700 text-2xl">🧾</div>
            <div>
              <p className="text-sm text-gray-600">Total transactions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.transactions}</p>
            </div>
          </div>
        </div>

        {/* Action */}
        <Link
          to="/admin/stocks"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 transition-colors"
        >
          ⚙️ Manage Stock Listings
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;