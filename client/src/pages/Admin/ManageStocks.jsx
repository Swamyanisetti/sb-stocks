import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";

const emptyForm = { symbol: "", name: "", sector: "", exchange: "NASDAQ", price: "" };

const ManageStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/stocks");
      setStocks(data);
    } catch (error) {
      toast.error("Failed to load stocks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/stocks/${editingId}`, { ...form, price: Number(form.price) });
        toast.success("Stock updated");
      } else {
        await api.post("/stocks", { ...form, price: Number(form.price) });
        toast.success("Stock listed");
      }
      resetForm();
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (stock) => {
    setEditingId(stock._id);
    setForm({
      symbol: stock.symbol,
      name: stock.name,
      sector: stock.sector,
      exchange: stock.exchange,
      price: stock.price,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this stock listing?")) return;
    try {
      await api.delete(`/stocks/${id}`);
      toast.info("Stock removed");
      load();
    } catch (error) {
      toast.error("Failed to remove stock");
    }
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition disabled:bg-gray-100 disabled:text-gray-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Hero banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1200&q=80"
            alt="Stock listings management"
            className="w-full h-36 sm:h-44 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/85 via-indigo-600/50 to-transparent flex items-center px-6 sm:px-10">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">Manage Stock Listings</h1>
              <p className="text-indigo-50 mt-1">Add, update, or remove stocks available to trade.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-gray-200 p-6 grid sm:grid-cols-2 gap-4"
        >
          <div>
            <label className="text-sm font-medium text-gray-700">Symbol</label>
            <input
              name="symbol"
              required
              disabled={!!editingId}
              className={inputClass}
              value={form.symbol}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Company name</label>
            <input name="name" required className={inputClass} value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Sector</label>
            <input name="sector" className={inputClass} value={form.sector} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Exchange</label>
            <input name="exchange" className={inputClass} value={form.exchange} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Price (USD)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              required
              className={inputClass}
              value={form.price}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-end gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {editingId ? "Update Stock" : "Add Stock"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl bg-white text-gray-700 font-medium ring-1 ring-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Table */}
        {loading ? (
          <Loader />
        ) : (
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b border-gray-200">
                  <th className="py-3 pl-5 pr-4">Symbol</th>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Sector</th>
                  <th className="py-3 pr-4">Price</th>
                  <th className="py-3 pr-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((s) => (
                  <tr key={s._id} className="border-b border-gray-100 last:border-0 hover:bg-sky-50/60 transition-colors">
                    <td className="py-3 pl-5 pr-4 font-medium text-gray-900">{s.symbol}</td>
                    <td className="py-3 pr-4 text-gray-800">{s.name}</td>
                    <td className="py-3 pr-4 text-gray-800">{s.sector}</td>
                    <td className="py-3 pr-4 text-gray-800">${s.price.toFixed(2)}</td>
                    <td className="py-3 pr-5 flex gap-3">
                      <button onClick={() => handleEdit(s)} className="text-indigo-600 font-medium hover:text-indigo-700">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(s._id)} className="text-rose-600 font-medium hover:text-rose-700">
                        Delete
                      </button>
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

export default ManageStocks;