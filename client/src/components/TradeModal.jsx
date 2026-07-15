import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const TradeModal = ({ stock, type, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { updateFunds } = useAuth();

  const total = (stock.price * quantity).toFixed(2);
  const isBuy = type === "BUY";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity <= 0) return toast.error("Enter a valid quantity");

    setSubmitting(true);
    try {
      const endpoint = isBuy ? "/orders/buy" : "/orders/sell";
      const { data } = await api.post(endpoint, { symbol: stock.symbol, quantity: Number(quantity) });
      updateFunds(data.funds);
      toast.success(`${isBuy ? "Bought" : "Sold"} ${quantity} share(s) of ${stock.symbol}`);
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="card w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-1">
          {isBuy ? "Buy" : "Sell"} {stock.symbol}
        </h3>
        <p className="text-sm text-gray-500 mb-4">Current price: ${stock.price.toFixed(2)}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              className="input mt-1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Estimated total</span>
            <span className="font-semibold">${total}</span>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 ${isBuy ? "btn-primary" : "btn-danger"}`}
            >
              {submitting ? "Processing..." : isBuy ? "Confirm Buy" : "Confirm Sell"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;
