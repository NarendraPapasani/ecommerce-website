const path = require("path");
const User = require(path.join(__dirname, "../../../server/models/userModel"));
const Order = require(path.join(
  __dirname,
  "../../../server/models/orderModel"
));

// Get all users with pagination and filters
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      filter.activated = status === "active";
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get users with pagination
    const users = await User.find(filter)
      .select("-password -refreshToken")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);

    // Get order counts for each user
    const usersWithOrderCount = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ userId: user._id });
        const totalSpent = await Order.aggregate([
          {
            $match: {
              userId: user._id,
              status: { $nin: ["cancelled", "refunded"] },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $toDouble: "$totalAmount" } },
            },
          },
        ]);

        return {
          ...user.toObject(),
          orderCount,
          totalSpent: totalSpent[0]?.total || 0,
        };
      })
    );

    res.status(200).json({
      status: "success",
      data: {
        users: usersWithOrderCount,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalUsers / limitNum),
          totalUsers,
          hasNextPage: pageNum < Math.ceil(totalUsers / limitNum),
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// Get single user by ID with order history
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get user details (excluding password)
    const user = await User.findById(id).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Get user's last 3 orders with populated product details
    const orders = await Order.find({ userId: id })
      .populate({
        path: "items.productId",
        select: "name price images category",
      })
      .sort({ createdAt: -1 })
      .limit(3);

    // Get user statistics with additional details
    const userStats = await Order.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: { $toDouble: "$totalAmount" } },
          avgOrderValue: { $avg: { $toDouble: "$totalAmount" } },
          lastOrderDate: { $max: "$createdAt" },
        },
      },
    ]);

    // Get favorite category from order items
    const favoriteCategory = await Order.aggregate([
      { $match: { userId: user._id } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    // Get order status distribution
    const orderStatusStats = await Order.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        user,
        orders,
        stats: {
          ...(userStats[0] || {
            totalOrders: 0,
            totalSpent: 0,
            avgOrderValue: 0,
            lastOrderDate: null,
          }),
          favoriteCategory:
            favoriteCategory[0]?._id || user.favoriteCategory || "N/A",
        },
        orderStatusStats,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

// Update user status (activate/deactivate)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, reason } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        status: "error",
        message: "isActive field must be a boolean value",
      });
    }

    const updateData = {
      activated: isActive,
      updatedAt: new Date(),
    };

    if (reason) {
      updateData.statusChangeReason = reason;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

// Update user details
const updateUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated via admin
    delete updateData.password;
    delete updateData.refreshToken;
    delete updateData._id;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User details updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update user details",
      error: error.message,
    });
  }
};

// Delete user (soft delete by deactivating)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { deleteReason } = req.body;

    // Check if user has active orders
    const activeOrders = await Order.countDocuments({
      userId: id,
      status: { $in: ["pending", "confirmed", "processing", "shipped"] },
    });

    if (activeOrders > 0) {
      return res.status(400).json({
        status: "error",
        message:
          "Cannot delete user with active orders. Please complete or cancel active orders first.",
      });
    }

    // Soft delete by deactivating the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        activated: false,
        isDeleted: true,
        deleteReason: deleteReason || "Deleted by admin",
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

// Get user analytics
const getUserAnalytics = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    // Build date filter
    const dateFilter = {};
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {};
      if (dateFrom) dateFilter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) dateFilter.createdAt.$lte = new Date(dateTo);
    }

    // Total users
    const totalUsers = await User.countDocuments(dateFilter);
    const activeUsers = await User.countDocuments({
      ...dateFilter,
      activated: true,
    });
    const inactiveUsers = await User.countDocuments({
      ...dateFilter,
      activated: false,
    });

    // New user registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          registrations: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Top customers by total spent (with user details)
    const topCustomers = await Order.aggregate([
      { $unwind: "$orders" },
      { $match: { "orders.orderStatus": { $nin: ["Cancelled"] } } },
      {
        $group: {
          _id: "$email",
          totalSpent: { $sum: "$orders.totalPrice" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "email",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    ]);

    // User activity stats (new order model)
    const orderDocs = await Order.find({}, "orders email");
    const usersWithOrders = orderDocs.filter(
      (doc) => doc.orders.length > 0
    ).length;
    const usersWithoutOrders = orderDocs.filter(
      (doc) => doc.orders.length === 0
    ).length;
    const avgOrdersPerUser = orderDocs.length
      ? orderDocs.reduce((sum, doc) => sum + doc.orders.length, 0) /
        orderDocs.length
      : 0;
    const activityStats = {
      usersWithOrders,
      usersWithoutOrders,
      avgOrdersPerUser,
    };

    res.status(200).json({
      status: "success",
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        dailyRegistrations,
        topCustomers,
        activityStats,
      },
    });
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user analytics",
      error: error.message,
    });
  }
};

// Export user data to CSV
const exportUsers = async (req, res) => {
  try {
    const { status, dateFrom, dateTo } = req.query;

    // Build filter
    const filter = {};
    if (status && status !== "all") {
      filter.activated = status === "active";
    }
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const users = await User.find(filter)
      .select("firstName lastName email phone activated createdAt")
      .sort({ createdAt: -1 });

    // Convert to CSV format
    let csvContent =
      "First Name,Last Name,Email,Phone,Status,Registration Date\n";

    users.forEach((user) => {
      csvContent += `"${user.firstName || ""}","${user.lastName || ""}","${
        user.email
      }","${user.phone || ""}","${
        user.activated ? "Active" : "Inactive"
      }","${user.createdAt.toDateString()}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="users-export-${
        new Date().toISOString().split("T")[0]
      }.csv"`
    );
    res.send(csvContent);
  } catch (error) {
    console.error("Error exporting users:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to export users",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserDetails,
  deleteUser,
  getUserAnalytics,
  exportUsers,
};
