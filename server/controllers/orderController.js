const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Address = require("../models/addressModel");
const Payment = require("../models/paymentModel");
const { sendOrderConfirmationEmail } = require("../lib/utils/emailService");
const mongoose = require("mongoose");

const addOrder = async (req, res) => {
  try {
    const {
      cartItems,
      addressId,
      totalPrice,
      paymentMethod,
      paymentDetails,
      paymentStatus = "pending",
    } = req.body;
    const { email, _id: userId } = req.user;

    // Start a mongoose session to perform stock decrements and order creation atomically
    const session = await mongoose.startSession();
    let savedOrderDetails = null;
    let savedPayment = null;

    try {
      await session.withTransaction(async () => {
        // Validate address ID inside transaction (reads are fine)
        if (!mongoose.Types.ObjectId.isValid(addressId)) {
          throw new Error("Invalid address ID format");
        }

        const address = await Address.findOne({
          "addresses._id": addressId,
        }).session(session);
        if (!address) {
          throw new Error(`Address with ID ${addressId} not found`);
        }

        // Validate product IDs, enrich cart items and ensure sufficient stock
        for (const item of cartItems) {
          const product = await Product.findById(item.productId).session(
            session
          );
          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
          }

          const qty = item.quantity || 1;
          if (product.stock < qty) {
            throw new Error(
              `Insufficient stock for product ${product.title}. Available ${product.stock}, required ${qty}`
            );
          }

          // Enrich item fields from product
          item.title = product.title;
          item.price = product.price;
          item.image =
            product.images && product.images.length > 0
              ? product.images[0]
              : "";
          item.slug = product.slug;
          item.description = product.description;
          item.category = product.category;

          // Decrement stock
          product.stock = product.stock - qty;
          await product.save({ session });
        }

        // Find or create order document for this user
        let orderDetails = await Order.findOne({ email }).session(session);
        if (!orderDetails) {
          orderDetails = new Order({ email, orders: [] });
        }

        // Add the new order
        orderDetails.orders.push({
          cartItems: cartItems,
          addressId: addressId,
          totalPrice: totalPrice,
          paymentMethod: paymentMethod,
        });

        await orderDetails.save({ session });

        // Get the newly created order ID
        const newOrder = orderDetails.orders[orderDetails.orders.length - 1];
        const orderId = newOrder._id;

        // Create payment document
        const paymentData = {
          userId: userId,
          orderId: orderId,
          paymentMethod: paymentMethod,
          amount: totalPrice,
          currency: "INR",
          status: paymentStatus === "completed" ? "completed" : "pending",
        };

        if (paymentMethod === "cod") {
          paymentData.cod = { confirmed: false, deliveryStatus: "pending" };
          paymentData.status = "pending";
        } else if (paymentMethod === "razorpay" && paymentDetails) {
          paymentData.razorpay = {
            paymentId: paymentDetails.razorpay_payment_id || null,
            orderId: paymentDetails.razorpay_order_id || null,
            signature: paymentDetails.razorpay_signature || null,
            gatewayResponse: paymentDetails,
          };
          paymentData.status = paymentStatus;
        }

        const payment = new Payment(paymentData);
        await payment.save({ session });

        // Update user's order count
        const orderedUser = await User.findById(userId).session(session);
        if (!orderedUser) {
          throw new Error("User not found");
        }

        orderedUser.orderCount = (orderedUser.orderCount || 0) + 1;
        await orderedUser.save({ session });

        // Persist references to return after commit
        savedOrderDetails = orderDetails;
        savedPayment = payment;
      });
    } finally {
      session.endSession();
    }

    // If everything committed successfully, respond
    res.status(200).json({
      status: "success",
      message: "Order placed successfully",
      order: savedOrderDetails,
      payment: savedPayment,
    });

    // Send order confirmation email asynchronously
    setImmediate(async () => {
      try {
        const orderId =
          savedOrderDetails.orders[savedOrderDetails.orders.length - 1]._id;
        await sendOrderConfirmationEmail(email, {
          cartItems: cartItems,
          totalPrice: totalPrice,
          paymentMethod: paymentMethod,
          orderId: orderId,
        });
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
      }
    });
  } catch (error) {
    console.error("Error in addOrder:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getAllOrders = async () => {};

const getUserOrders = async (req, res) => {
  try {
    const { email } = req.user;
    const orders = await Order.find({ email });
    if (!orders) {
      return res.status(404).json({
        status: "error",
        message: "No orders found",
      });
    }
    res.status(201).json({
      status: "success",
      data: {
        orders,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: `Invalid order ID format`,
      });
    }

    const orderDetails = await Order.findOne(
      { email, "orders._id": id },
      { "orders.$": 1 }
    );

    if (!orderDetails) {
      return res.status(404).json({
        status: "error",
        message: `Order with ID ${id} not found`,
      });
    }

    const order = orderDetails.orders[0];

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: `Invalid order ID format`,
      });
    }
    const orderDetails = await Order.findOne({ email, "orders._id": id });
    if (!orderDetails) {
      return res.status(404).json({
        status: "error",
        message: `Order with ID ${id} not found`,
      });
    }
    const order = orderDetails.orders[0];
    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        status: "error",
        message: `Order with ID ${id} is already cancelled`,
      });
    }
    order.orderStatus = "Cancelled";
    await orderDetails.save();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  addOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  cancelOrder,
};
