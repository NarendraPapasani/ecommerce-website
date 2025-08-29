const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: {
    type: String,
    ref: "User",
    required: true,
  },
  orders: [
    {
      cartItems: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          title: { type: String, required: true },
          price: { type: Number, required: true },
          image: { type: String, required: true },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
      addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
      paymentMethod: {
        type: String,
        required: true,
      },
      orderStatus: {
        type: String,
        enum: [
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
          "Refunded",
          "Out for Delivery",
          "Shipped",
          "Returned",
        ],
        default: "Pending",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

orderSchema.pre("save", function (next) {
  this.orders.forEach((order) => {
    order.updatedAt = Date.now();
  });
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
