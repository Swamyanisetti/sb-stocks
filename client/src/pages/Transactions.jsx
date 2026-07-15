import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/transactions");
        setTransactions(data);
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
            alt="Trading history charts"
            className="w-full h-36 sm:h-44 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 via-indigo-500/40 to-transparent flex items-center px-6 sm:px-10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">Transaction History</h1>
              <p className="text-indigo-50 mt-1">A record of every trade you've made.</p>
            </div>
          </div>
        </div>

        {/* Table */}
        {transactions.length === 0 ? (
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-gray-200 text-center py-14 px-6">
            <p className="text-gray-600">No transactions yet.</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-200">
                  <th className="py-3 pl-5 pr-4">Date</th>
                  <th className="py-3 pr-4">Symbol</th>
                  <th className="py-3 pr-4">Type</th>
                  <th className="py-3 pr-4">Qty</th>
                  <th className="py-3 pr-4">Price</th>
                  <th className="py-3 pr-5">Total</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id} className="border-b border-gray-100 last:border-0 hover:bg-sky-50/60 transition-colors">
                    <td className="py-3 pl-5 pr-4 text-gray-800">{new Date(t.createdAt).toLocaleString()}</td>
                    <td className="py-3 pr-4 font-medium text-gray-900">{t.symbol}</td>
                    <td
                      className={`py-3 pr-4 font-medium ${
                        t.transactionType === "BUY" ? "text-indigo-600" : "text-rose-600"
                      }`}
                    >
                      {t.transactionType === "BUY" ? "▲ " : "▼ "}
                      {t.transactionType}
                    </td>
                    <td className="py-3 pr-4 text-gray-800">{t.quantity}</td>
                    <td className="py-3 pr-4 text-gray-800">${t.price.toFixed(2)}</td>
                    <td className="py-3 pr-5 font-medium text-gray-900">${t.total.toFixed(2)}</td>
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

export default Transactions;