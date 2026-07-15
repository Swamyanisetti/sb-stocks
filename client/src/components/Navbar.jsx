import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? "bg-white/15 text-white" : "text-indigo-100 hover:bg-white/10 hover:text-white"
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-950 border-b border-indigo-900 sticky top-0 z-20 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
          📈 SB Stocks
        </Link>

        {user ? (
          <div className="flex items-center gap-1">
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/stocks" className={linkClass}>Stocks</NavLink>
            <NavLink to="/portfolio" className={linkClass}>Portfolio</NavLink>
            <NavLink to="/watchlist" className={linkClass}>Watchlist</NavLink>
            <NavLink to="/transactions" className={linkClass}>History</NavLink>
            {user.role === "admin" && (
              <NavLink to="/admin" className={linkClass}>Admin</NavLink>
            )}
            <span className="ml-3 text-sm text-indigo-200 hidden sm:inline">
              Balance:{" "}
              <span className="font-semibold text-white">
                ${user.funds?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-indigo-900 shadow-sm hover:bg-indigo-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;