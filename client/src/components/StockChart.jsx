import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const StockChart = ({ history = [] }) => {
  const labels = history.map((h) => new Date(h.date).toLocaleTimeString());
  const prices = history.map((h) => h.price);
  const isUp = prices.length > 1 && prices[prices.length - 1] >= prices[0];

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: prices,
        borderColor: isUp ? "#16a34a" : "#dc2626",
        backgroundColor: isUp ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: true, ticks: { callback: (v) => `$${v}` } },
    },
  };

  if (!history.length) {
    return <p className="text-sm text-gray-400">No price history available yet.</p>;
  }

  return <Line data={data} options={options} />;
};

export default StockChart;
