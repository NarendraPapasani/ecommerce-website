const path = require("path");
const Order = require(path.join(
  __dirname,
  "../../../server/models/orderModel"
));
const User = require(path.join(__dirname, "../../../server/models/userModel"));
const {
  sendOrderStatusUpdateEmail,
} = require("../../../server/lib/utils/emailService");
const PDFDocument = require("pdfkit");
const fs = require("fs");

// Get all orders with pagination and filters
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      dateFrom,
      dateTo,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build aggregation pipeline
    const pipeline = [];

    // First, unwind the orders array to get individual orders
    pipeline.push({ $unwind: "$orders" });

    // Build match conditions
    const matchConditions = {};

    if (status && status !== "all") {
      matchConditions["orders.orderStatus"] = new RegExp(status, "i");
    }

    if (dateFrom || dateTo) {
      matchConditions["orders.createdAt"] = {};
      if (dateFrom)
        matchConditions["orders.createdAt"].$gte = new Date(dateFrom);
      if (dateTo) matchConditions["orders.createdAt"].$lte = new Date(dateTo);
    }

    if (search) {
      matchConditions.$or = [
        { email: { $regex: search, $options: "i" } },
        { "orders.cartItems.title": { $regex: search, $options: "i" } },
        { "orders.orderStatus": { $regex: search, $options: "i" } },
      ];
    }

    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    // Add sorting
    const sortField =
      sortBy === "createdAt" ? "orders.createdAt" : `orders.${sortBy}`;
    pipeline.push({ $sort: { [sortField]: sortOrder === "desc" ? -1 : 1 } });

    // Calculate total count for pagination
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await Order.aggregate(countPipeline);
    const totalOrders = countResult[0]?.total || 0;

    // Add pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limitNum });

    // Populate address information
    pipeline.push({
      $lookup: {
        from: "addresses",
        localField: "orders.addressId",
        foreignField: "_id",
        as: "shippingAddress",
      },
    });

    // Execute aggregation
    const orders = await Order.aggregate(pipeline);

    // Transform the data to flatten structure
    const transformedOrders = orders.map((order) => ({
      _id: order._id,
      email: order.email,
      orderId: order.orders._id,
      cartItems: order.orders.cartItems,
      addressId: order.orders.addressId,
      shippingAddress: order.shippingAddress[0] || null,
      totalPrice: order.orders.totalPrice,
      paymentMethod: order.orders.paymentMethod,
      orderStatus: order.orders.orderStatus,
      createdAt: order.orders.createdAt,
      updatedAt: order.orders.updatedAt,
      trackingNumber: order.orders.trackingNumber || null,
      refundAmount: order.orders.refundAmount || null,
      refundReason: order.orders.refundReason || null,
      refundDate: order.orders.refundDate || null,
      adminNotes: order.orders.adminNotes || null,
    }));

    res.status(200).json({
      status: "success",
      data: {
        orders: transformedOrders,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalOrders / limitNum),
          totalOrders,
          hasNextPage: pageNum < Math.ceil(totalOrders / limitNum),
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params; // This is the orderId (subdocument ID)

    // Find the order document containing the specific order
    const orderDoc = await Order.findOne({ "orders._id": id }).populate(
      "orders.addressId"
    );

    if (!orderDoc) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Find the specific order in the orders array
    const specificOrder = orderDoc.orders.find(
      (order) => order._id.toString() === id
    );

    if (!specificOrder) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Transform the data
    const transformedOrder = {
      _id: orderDoc._id,
      email: orderDoc.email,
      orderId: specificOrder._id,
      cartItems: specificOrder.cartItems,
      addressId: specificOrder.addressId,
      shippingAddress: specificOrder.addressId,
      totalPrice: specificOrder.totalPrice,
      paymentMethod: specificOrder.paymentMethod,
      orderStatus: specificOrder.orderStatus,
      createdAt: specificOrder.createdAt,
      updatedAt: specificOrder.updatedAt,
      trackingNumber: specificOrder.trackingNumber || null,
      refundAmount: specificOrder.refundAmount || null,
      refundReason: specificOrder.refundReason || null,
      refundDate: specificOrder.refundDate || null,
      adminNotes: specificOrder.adminNotes || null,
    };

    res.status(200).json({
      status: "success",
      data: { order: transformedOrder },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // This is the orderId (subdocument ID)
    const { status, trackingNumber, notes, refundAmount, refundReason } =
      req.body;

    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
      "Refunded",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid order status",
      });
    }

    // Find the order document containing the specific order
    const orderDoc = await Order.findOne({ "orders._id": id });

    if (!orderDoc) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Find the specific order in the orders array
    const orderIndex = orderDoc.orders.findIndex(
      (order) => order._id.toString() === id
    );

    if (orderIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Store the old status for email notification
    const oldStatus = orderDoc.orders[orderIndex].orderStatus;
    const orderData = orderDoc.orders[orderIndex];

    // Update the specific order
    const updateFields = {
      orderStatus: status,
      updatedAt: new Date(),
    };

    if (trackingNumber) {
      updateFields.trackingNumber = trackingNumber;
    }

    if (notes) {
      updateFields.adminNotes = notes;
    }

    if (status === "Refunded") {
      updateFields.refundAmount =
        refundAmount || orderDoc.orders[orderIndex].totalPrice;
      updateFields.refundReason = refundReason || "Admin initiated refund";
      updateFields.refundDate = new Date();
    }

    // Update using array filters
    const updatedOrder = await Order.findOneAndUpdate(
      { "orders._id": id },
      {
        $set: Object.keys(updateFields).reduce((acc, key) => {
          acc[`orders.$.${key}`] = updateFields[key];
          return acc;
        }, {}),
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        status: "error",
        message: "Failed to update order",
      });
    }

    // Find the updated order
    const updatedOrderData = updatedOrder.orders.find(
      (order) => order._id.toString() === id
    );

    // Send email notification to customer
    try {
      const emailSent = await sendOrderStatusUpdateEmail(updatedOrder.email, {
        orderId: id,
        newStatus: status,
        oldStatus: oldStatus,
        trackingNumber: trackingNumber || null,
        adminNotes: notes || null,
        cartItems: updatedOrderData.cartItems,
        totalPrice: updatedOrderData.totalPrice,
        refundAmount: updateFields.refundAmount || null,
        refundReason: updateFields.refundReason || null,
      });

      if (emailSent) {
        console.log(
          `✅ Status update email sent to ${updatedOrder.email} for order ${id}`
        );
      } else {
        console.log(
          `⚠️ Failed to send email to ${updatedOrder.email} for order ${id}`
        );
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail the request if email fails, just log it
    }

    res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
      data: {
        order: {
          ...updatedOrderData.toObject(),
          email: updatedOrder.email,
          _id: updatedOrder._id,
          orderId: updatedOrderData._id,
        },
      },
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// Generate invoice PDF
const generateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Create PDF
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${order._id}.pdf"`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Add invoice header
    doc.fontSize(20).text("INVOICE", 50, 50);
    doc.fontSize(12).text(`Order ID: ${order._id}`, 50, 80);
    doc.text(`Date: ${order.createdAt.toDateString()}`, 50, 100);
    doc.text(`Status: ${order.status.toUpperCase()}`, 50, 120);

    // Add customer details
    doc.text("Bill To:", 50, 160);
    doc.text(
      `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      50,
      180
    );
    doc.text(order.shippingAddress.email, 50, 200);
    doc.text(order.shippingAddress.phone, 50, 220);
    doc.text(
      `${order.shippingAddress.street}, ${order.shippingAddress.city}`,
      50,
      240
    );
    doc.text(
      `${order.shippingAddress.state} - ${order.shippingAddress.zipCode}`,
      50,
      260
    );

    // Add items table
    let yPosition = 300;
    doc.text("Item", 50, yPosition);
    doc.text("Qty", 300, yPosition);
    doc.text("Price", 400, yPosition);
    doc.text("Total", 500, yPosition);

    yPosition += 20;
    doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
    yPosition += 10;

    order.cartItems.forEach((item) => {
      yPosition += 20;
      doc.text(item.title, 50, yPosition);
      doc.text(item.quantity.toString(), 300, yPosition);
      doc.text(`₹${item.price}`, 400, yPosition);
      doc.text(`₹${item.price * item.quantity}`, 500, yPosition);
    });

    // Add totals
    yPosition += 40;
    doc.moveTo(400, yPosition).lineTo(550, yPosition).stroke();
    yPosition += 10;
    doc.text(`Subtotal: ₹${order.totalAmount}`, 400, yPosition);
    yPosition += 20;
    doc.text(`Total: ₹${order.totalAmount}`, 400, yPosition);

    // Add footer
    yPosition += 60;
    doc.text("Thank you for your business!", 50, yPosition);

    doc.end();
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to generate invoice",
      error: error.message,
    });
  }
};

// Generate shipping label
const generateShippingLabel = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Create shipping label PDF
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="shipping-label-${order._id}.pdf"`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Add shipping label content
    doc.fontSize(16).text("SHIPPING LABEL", 50, 50);
    doc.fontSize(12).text(`Order ID: ${order._id}`, 50, 80);
    doc.text(`Tracking: ${order.trackingNumber || "TBD"}`, 50, 100);

    // From address (store address)
    doc.text("FROM:", 50, 140);
    doc.text("BlinkShop", 50, 160);
    doc.text("123 Store Street", 50, 180);
    doc.text("City, State 12345", 50, 200);

    // To address
    doc.text("TO:", 50, 240);
    doc.text(
      `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      50,
      260
    );
    doc.text(`${order.shippingAddress.street}`, 50, 280);
    doc.text(
      `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
      50,
      300
    );
    doc.text(`${order.shippingAddress.zipCode}`, 50, 320);
    doc.text(`Phone: ${order.shippingAddress.phone}`, 50, 340);

    // Add barcode placeholder
    doc.rect(50, 380, 300, 80).stroke();
    doc.text("BARCODE PLACEHOLDER", 150, 415);

    doc.end();
  } catch (error) {
    console.error("Error generating shipping label:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to generate shipping label",
      error: error.message,
    });
  }
};

// Process refund
const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refundAmount, reason } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    if (order.status === "refunded") {
      return res.status(400).json({
        status: "error",
        message: "Order is already refunded",
      });
    }

    // Update order with refund information
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status: "refunded",
        refundAmount: refundAmount || order.totalAmount,
        refundReason: reason,
        refundDate: new Date(),
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      message: "Refund processed successfully",
      data: { order: updatedOrder },
    });
  } catch (error) {
    console.error("Error processing refund:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to process refund",
      error: error.message,
    });
  }
};

// Get order analytics
const getOrderAnalytics = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    // Build date filter
    const dateFilter = {};
    if (dateFrom || dateTo) {
      dateFilter.createdAt = {};
      if (dateFrom) dateFilter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) dateFilter.createdAt.$lte = new Date(dateTo);
    }

    // Unwind all orders arrays for analytics
    const unwindPipeline = [];
    if (dateFrom || dateTo) {
      const match = {};
      if (dateFrom) match["orders.createdAt"] = { $gte: new Date(dateFrom) };
      if (dateTo) {
        match["orders.createdAt"] = match["orders.createdAt"] || {};
        match["orders.createdAt"].$lte = new Date(dateTo);
      }
      unwindPipeline.push({ $unwind: "$orders" });
      unwindPipeline.push({ $match: match });
    } else {
      unwindPipeline.push({ $unwind: "$orders" });
    }

    // Total orders
    const totalOrdersAgg = await Order.aggregate([
      ...unwindPipeline,
      { $count: "total" },
    ]);
    const totalOrders = totalOrdersAgg[0]?.total || 0;

    // Revenue stats (exclude Cancelled orders)
    const revenueStatsAgg = await Order.aggregate([
      ...unwindPipeline,
      { $match: { "orders.orderStatus": { $nin: ["Cancelled"] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$orders.totalPrice" },
          avgOrderValue: { $avg: "$orders.totalPrice" },
        },
      },
    ]);
    const revenueStats = revenueStatsAgg[0] || {
      totalRevenue: 0,
      avgOrderValue: 0,
    };

    // Order status distribution
    const statusStats = await Order.aggregate([
      ...unwindPipeline,
      {
        $group: {
          _id: "$orders.orderStatus",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Daily order trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dailyTrends = await Order.aggregate([
      { $unwind: "$orders" },
      { $match: { "orders.createdAt": { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$orders.createdAt" },
            month: { $month: "$orders.createdAt" },
            day: { $dayOfMonth: "$orders.createdAt" },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$orders.totalPrice" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$orders" },
      { $unwind: "$orders.cartItems" },
      {
        $group: {
          _id: "$orders.cartItems.title",
          totalSold: { $sum: "$orders.cartItems.quantity" },
          totalRevenue: {
            $sum: {
              $multiply: [
                "$orders.cartItems.quantity",
                "$orders.cartItems.price",
              ],
            },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalOrders,
        revenue: revenueStats,
        statusDistribution: statusStats,
        dailyTrends,
        topProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching order analytics:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch order analytics",
      error: error.message,
    });
  }
};

// Get last 3 orders for a specific user
const getUserLastOrders = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

    // First, find the user to get their email
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Find the order document for this user by email
    const orderDoc = await Order.findOne({ email: user.email });

    if (!orderDoc || !orderDoc.orders || orderDoc.orders.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No orders found for this user",
      });
    }

    // Sort the orders by date (newest first) and take the last 3
    const lastThreeOrders = [...orderDoc.orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    // Transform the data for consistent response format
    const transformedOrders = lastThreeOrders.map((order) => ({
      _id: orderDoc._id,
      email: orderDoc.email,
      orderId: order._id,
      cartItems: order.cartItems,
      addressId: order.addressId,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      trackingNumber: order.trackingNumber || null,
      refundAmount: order.refundAmount || null,
      refundReason: order.refundReason || null,
      refundDate: order.refundDate || null,
      adminNotes: order.adminNotes || null,
    }));

    res.status(200).json({
      status: "success",
      data: {
        orders: transformedOrders,
        user: {
          email: user.email,
          _id: user._id,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  generateInvoice,
  generateShippingLabel,
  processRefund,
  getOrderAnalytics,
  getUserLastOrders,
};
