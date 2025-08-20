const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Address = require("../models/addressModel");

// Get all orders with pagination and filtering
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || "";
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "orders.createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Build aggregation pipeline
    let pipeline = [
      { $unwind: "$orders" },
    ];

    // Add filters
    let matchStage = {};
    
    if (status) {
      matchStage["orders.orderStatus"] = status;
    }
    
    if (search) {
      matchStage.$or = [
        { email: { $regex: search, $options: "i" } },
        { "orders._id": { $regex: search, $options: "i" } },
      ];
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Add sorting
    pipeline.push({ $sort: { [sortBy]: sortOrder } });

    // Get total count for pagination
    const totalPipeline = [...pipeline, { $count: "total" }];
    const totalResult = await Order.aggregate(totalPipeline);
    const totalOrders = totalResult[0]?.total || 0;
    const totalPages = Math.ceil(totalOrders / limit);

    // Add pagination
    pipeline.push(
      { $skip: skip },
      { $limit: limit }
    );

    // Project the result
    pipeline.push({
      $project: {
        email: 1,
        orderId: "$orders._id",
        cartItems: "$orders.cartItems",
        addressId: "$orders.addressId",
        totalPrice: "$orders.totalPrice",
        paymentMethod: "$orders.paymentMethod",
        orderStatus: "$orders.orderStatus",
        createdAt: "$orders.createdAt",
        updatedAt: "$orders.updatedAt",
      }
    });

    const orders = await Order.aggregate(pipeline);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get order details by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const orderDoc = await Order.findOne({ "orders._id": orderId });
    if (!orderDoc) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderDoc.orders.find(o => o._id.toString() === orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Get user details
    const user = await User.findOne({ email: orderDoc.email }).select("-password");
    
    // Get address details
    const addressDoc = await Address.findOne({ "addresses._id": order.addressId });
    const address = addressDoc?.addresses.find(a => a._id.toString() === order.addressId.toString());

    res.status(200).json({
      success: true,
      order: {
        ...order.toObject(),
        email: orderDoc.email,
        user,
        address,
      },
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ message: "Failed to fetch order details" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const orderDoc = await Order.findOneAndUpdate(
      { "orders._id": orderId },
      { 
        $set: { 
          "orders.$.orderStatus": orderStatus,
          "orders.$.updatedAt": new Date()
        }
      },
      { new: true }
    );

    if (!orderDoc) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedOrder = orderDoc.orders.find(o => o._id.toString() === orderId);

    res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      order: {
        ...updatedOrder.toObject(),
        email: orderDoc.email,
      },
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    // Get total orders count
    const totalOrdersResult = await Order.aggregate([
      { $unwind: "$orders" },
      { $count: "total" }
    ]);
    const totalOrders = totalOrdersResult[0]?.total || 0;

    // Get order status distribution
    const statusStats = await Order.aggregate([
      { $unwind: "$orders" },
      { $group: { _id: "$orders.orderStatus", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get revenue statistics
    const revenueStats = await Order.aggregate([
      { $unwind: "$orders" },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$orders.totalPrice" },
          averageOrderValue: { $avg: "$orders.totalPrice" },
        }
      }
    ]);

    // Get orders this month
    const ordersThisMonth = await Order.aggregate([
      { $unwind: "$orders" },
      {
        $match: {
          "orders.createdAt": {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      },
      { $count: "total" }
    ]);

    // Get daily orders for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyOrders = await Order.aggregate([
      { $unwind: "$orders" },
      { $match: { "orders.createdAt": { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$orders.createdAt" }
          },
          count: { $sum: 1 },
          revenue: { $sum: "$orders.totalPrice" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$orders" },
      { $unwind: "$orders.cartItems" },
      {
        $group: {
          _id: "$orders.cartItems.productId",
          title: { $first: "$orders.cartItems.title" },
          totalQuantity: { $sum: "$orders.cartItems.quantity" },
          totalRevenue: { $sum: { $multiply: ["$orders.cartItems.price", "$orders.cartItems.quantity"] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        ordersThisMonth: ordersThisMonth[0]?.total || 0,
        totalRevenue: revenueStats[0]?.totalRevenue || 0,
        averageOrderValue: revenueStats[0]?.averageOrderValue || 0,
        statusStats,
        dailyOrders,
        topProducts,
      },
    });
  } catch (error) {
    console.error("Get order stats error:", error);
    res.status(500).json({ message: "Failed to fetch order statistics" });
  }
};

// Bulk update order status
const bulkUpdateOrderStatus = async (req, res) => {
  try {
    const { orderIds, orderStatus } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ message: "Order IDs array is required" });
    }

    // Update multiple orders
    const updatePromises = orderIds.map(orderId =>
      Order.findOneAndUpdate(
        { "orders._id": orderId },
        { 
          $set: { 
            "orders.$.orderStatus": orderStatus,
            "orders.$.updatedAt": new Date()
          }
        }
      )
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: `${orderIds.length} orders status updated to ${orderStatus}`,
      updatedCount: orderIds.length,
    });
  } catch (error) {
    console.error("Bulk update order status error:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
  bulkUpdateOrderStatus,
};