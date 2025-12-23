const User = require("../models/userModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    // Check if account is active
    if (user.accountStatus !== "active") {
      return res.status(403).json({ message: "Account is not active" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update login statistics
    user.lastLoginAt = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, res);

    res.status(200).json({
      message: "Admin login successful",
      success: true,
      token,
      admin: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error during admin login" });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalProducts = await Product.countDocuments();
    
    // Get total orders count
    const orderStats = await Order.aggregate([
      { $unwind: "$orders" },
      { $group: { _id: null, totalOrders: { $sum: 1 } } }
    ]);
    const totalOrders = orderStats[0]?.totalOrders || 0;

    // Get recent orders
    const recentOrders = await Order.aggregate([
      { $unwind: "$orders" },
      { $sort: { "orders.createdAt": -1 } },
      { $limit: 5 },
      {
        $project: {
          email: 1,
          orderId: "$orders._id",
          totalPrice: "$orders.totalPrice",
          orderStatus: "$orders.orderStatus",
          createdAt: "$orders.createdAt",
        }
      }
    ]);

    // Get order status distribution
    const orderStatusStats = await Order.aggregate([
      { $unwind: "$orders" },
      { $group: { _id: "$orders.orderStatus", count: { $sum: 1 } } }
    ]);

    // Get monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
      { $unwind: "$orders" },
      { $match: { "orders.createdAt": { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$orders.createdAt" },
            month: { $month: "$orders.createdAt" }
          },
          revenue: { $sum: "$orders.totalPrice" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalProducts,
        totalOrders,
        recentOrders,
        orderStatusStats,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard statistics" });
  }
};

// Admin logout
const adminLogout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    console.error("Admin logout error:", error);
    res.status(500).json({ message: "Error during admin logout" });
  }
};

module.exports = {
  adminLogin,
  getDashboardStats,
  adminLogout,
};