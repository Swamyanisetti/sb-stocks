const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Portfolio = require("../models/portfolioModel");
const Watchlist = require("../models/watchlistModel");

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// @desc Register a new user
// @route POST /api/users/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      contact,
    });

    // Bootstrap an empty portfolio and watchlist for the new user
    await Portfolio.create({ user: user._id, name: "Default Portfolio", holdings: [] });
    await Watchlist.create({ user: user._id, stocks: [] });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      funds: user.funds,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// @desc Authenticate a user and return a token
// @route POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      funds: user.funds,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// @desc Get the logged-in user's profile
// @route GET /api/users/profile
const getProfile = async (req, res) => {
  res.json(req.user);
};

// @desc Update the logged-in user's profile
// @route PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.contact = req.body.contact || user.contact;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      funds: updated.funds,
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed", error: error.message });
  }
};

// @desc Deposit virtual funds into the user's wallet
// @route POST /api/users/deposit
const depositFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Deposit amount must be greater than zero" });
    }
    const user = await User.findById(req.user._id);
    user.funds += Number(amount);
    await user.save();
    res.json({ funds: user.funds });
  } catch (error) {
    res.status(500).json({ message: "Deposit failed", error: error.message });
  }
};

// @desc Withdraw virtual funds from the user's wallet
// @route POST /api/users/withdraw
const withdrawFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user._id);
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Withdrawal amount must be greater than zero" });
    }
    if (amount > user.funds) {
      return res.status(400).json({ message: "Insufficient virtual funds" });
    }
    user.funds -= Number(amount);
    await user.save();
    res.json({ funds: user.funds });
  } catch (error) {
    res.status(500).json({ message: "Withdrawal failed", error: error.message });
  }
};

// @desc List all users (admin)
// @route GET /api/users
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  depositFunds,
  withdrawFunds,
  getAllUsers,
};
