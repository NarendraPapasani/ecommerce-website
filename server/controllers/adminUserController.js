const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Address = require("../models/addressModel");
const Cart = require("../models/cartModel");
const Wishlist = require("../models/wishlistModel");

// Get all users with pagination and filtering
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const role = req.query.role || "";
    const status = req.query.status || "";

    // Build filter query
    let filter = {};
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    
    if (role) {
      filter.role = role;
    }
    
    if (status) {
      filter.accountStatus = status;
    }

    const users = await User.find(filter)
      .select("-password -emailVerificationCode -emailChangeCode")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Get user details by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select("-password -emailVerificationCode -emailChangeCode");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's orders
    const orders = await Order.findOne({ email: user.email });
    const userOrders = orders ? orders.orders : [];

    // Get user's addresses
    const addresses = await Address.findOne({ email: user.email });
    const userAddresses = addresses ? addresses.addresses : [];

    res.status(200).json({
      success: true,
      user,
      orders: userOrders,
      addresses: userAddresses,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};

// Update user status (active, inactive, suspended)
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { accountStatus } = req.body;

    if (!["active", "inactive", "suspended"].includes(accountStatus)) {
      return res.status(400).json({ message: "Invalid account status" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { accountStatus },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: `User status updated to ${accountStatus}`,
      user,
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({ message: "Failed to update user status" });
  }
};

// Delete user and all associated data
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deletion of admin users
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin users" });
    }

    // Delete associated data
    await Promise.all([
      Order.deleteOne({ email: user.email }),
      Address.deleteOne({ email: user.email }),
      Cart.deleteOne({ email: user.email }),
      Wishlist.deleteOne({ email: user.email }),
    ]);

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User and associated data deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ message: "Failed to update user role" });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const activeUsers = await User.countDocuments({ role: "user", accountStatus: "active" });
    const suspendedUsers = await User.countDocuments({ role: "user", accountStatus: "suspended" });
    const newUsersThisMonth = await User.countDocuments({
      role: "user",
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    // Get user registration trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const registrationTrends = await User.aggregate([
      { $match: { role: "user", createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        newUsersThisMonth,
        registrationTrends,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({ message: "Failed to fetch user statistics" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  updateUserRole,
  getUserStats,
};