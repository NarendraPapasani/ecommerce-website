const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Address = require("../models/addressModel");
const mongoose = require("mongoose");

const addOrder = async (req, res) => {
  try {
    const { cartItems, addressId, totalPrice, paymentMethod } = req.body;
    const { email } = req.user;

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
      item.image = product.image;
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

    let orderDetails = await Order.findOne({ email });
    if (!orderDetails) {
      orderDetails = new Order({
        email,
        orders: [],
      });
    }
    orderDetails.orders.push({
      cartItems: cartItems,
      addressId: addressId,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
    });

    await orderDetails.save();
    res.status(200).json({
      status: "success",
      message: "Order placed successfully",
      order: orderDetails,
    });
  } catch (error) {
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

module.exports = { addOrder, getAllOrders, getUserOrders, getOrderById };
