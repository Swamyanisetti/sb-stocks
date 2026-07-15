import React from "react";
import { Link } from "react-router-dom";

const features = [
  { icon: "📡", title: "Real-Time Market Data", desc: "Live US stock prices and trends for accurate simulations." },
  { icon: "💼", title: "Virtual Portfolios", desc: "Create and manage multiple portfolios with diverse stocks." },
  { icon: "🛡️", title: "Risk-Free Trading", desc: "Practice buying and selling with virtual funds, zero financial risk." },
  { icon: "📈", title: "Strategy Testing", desc: "Analyze historical performance and refine your trading strategy." },
];

const Landing = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100">
    <section className="max-w-6xl mx-auto px-4 pt-16 pb-10">
      <div className="relative rounded-3xl overflow-hidden shadow-lg mb-14">
        <img
          src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1400&q=80"
          alt="Stock trading market data"
          className="w-full h-56 sm:h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/85 via-indigo-600/60 to-transparent flex flex-col justify-center px-6 sm:px-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-white drop-shadow-sm mb-4 max-w-xl">
            Master the Market, <span className="text-emerald-300">Risk-Free</span>
          </h1>
          <p className="text-indigo-50 text-base sm:text-lg max-w-xl mb-6">
            SB Stocks is a paper trading simulator that helps you practice buying and selling
            stocks with virtual funds, powered by simulated real-time US market data.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-semibold shadow-sm hover:bg-indigo-50 transition-colors"
            >
              🚀 Start Trading Free
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white font-medium ring-1 ring-white/40 hover:bg-white/20 transition-colors"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </div>
    </section>

    <section className="max-w-6xl mx-auto px-4 pb-20">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-sky-200 p-5 hover:shadow-md hover:bg-white hover:-translate-y-0.5 transition-all"
          >
            <div className="text-2xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Landing;