import React from "react";
import { Link } from "react-router-dom";

const StockCard = ({ stock }) => {
  const change = stock.price - stock.previousClose;
  const changePercent = stock.previousClose ? (change / stock.previousClose) * 100 : 0;
  const isUp = change >= 0;

  return (
    <Link
      to={`/stocks/${stock.symbol}`}
      className="card flex items-center justify-between hover:shadow-md transition-shadow"
    >
      <div>
        <p className="font-semibold text-gray-900">{stock.symbol}</p>
        <p className="text-sm text-gray-500 truncate max-w-[160px]">{stock.name}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">${stock.price.toFixed(2)}</p>
        <p className={`text-sm font-medium ${isUp ? "text-profit" : "text-loss"}`}>
          {isUp ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
        </p>
      </div>
    </Link>
  );
};

export default StockCard;
