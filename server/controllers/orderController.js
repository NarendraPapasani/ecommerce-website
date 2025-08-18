const Order = require("../models/orderModel");
const Product = require("../models/productModel");
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

    // Validate product IDs and add required fields
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          status: "error",
          message: `Product with ID ${item.productId} not found`,
        });
      }
      // Add required fields from the product
      item.title = product.title;
      item.price = product.price;
      item.image =
        product.images && product.images.length > 0 ? product.images[0] : "";
      item.slug = product.slug;
      item.description = product.description;
      item.category = product.category;
    }

    // Validate address ID
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        status: "error",
        message: `Invalid address ID format`,
      });
    }

    const address = await Address.findOne({
      "addresses._id": addressId,
    });
    if (!address) {
      return res.status(400).json({
        status: "error",
        message: `Address with ID ${addressId} not found`,
      });
    }

    // Find or create order document
    let orderDetails = await Order.findOne({ email });
    if (!orderDetails) {
      orderDetails = new Order({
        email,
        orders: [],
      });
    }

    // Add the new order
    orderDetails.orders.push({
      cartItems: cartItems,
      addressId: addressId,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
    });

    await orderDetails.save();

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

    // Add payment method specific details
    if (paymentMethod === "cod") {
      paymentData.cod = {
        confirmed: false,
        deliveryStatus: "pending",
      };
      paymentData.status = "pending"; // COD is always pending until delivery
    } else if (paymentMethod === "razorpay" && paymentDetails) {
      paymentData.razorpay = {
        paymentId: paymentDetails.razorpay_payment_id || null,
        orderId: paymentDetails.razorpay_order_id || null,
        signature: paymentDetails.razorpay_signature || null,
        gatewayResponse: paymentDetails,
      };
      paymentData.status = paymentStatus; // Use the provided status for online payments
    }

    console.log("Payment Data:", paymentData);

    // Create the payment document
    const payment = new Payment(paymentData);
    await payment.save();

    // Send response first to confirm order success
    res.status(200).json({
      status: "success",
      message: "Order placed successfully",
      order: orderDetails,
      payment: payment,
    });

    // Send order confirmation email after successful order placement
    // This runs asynchronously and doesn't affect the API response
    setImmediate(async () => {
      try {
        await sendOrderConfirmationEmail(email, {
          cartItems: cartItems,
          totalPrice: totalPrice,
          paymentMethod: paymentMethod,
          orderId: orderId,
        });
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
        // Email failure doesn't affect the order - it's already placed successfully
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
