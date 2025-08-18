const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    razorpay: {
      paymentId: String,
      orderId: String,
      signature: String,
      gatewayResponse: {
        type: Object,
        default: {},
      },
    },
    cod: {
      confirmed: {
        type: Boolean,
        default: false,
      },
      deliveryStatus: {
        type: String,
        enum: ["pending", "delivered", "cancelled"],
        default: "pending",
      },
    },
    refund: {
      refunded: {
        type: Boolean,
        default: false,
      },
      refundAmount: {
        type: Number,
        default: 0,
      },
      refundId: {
        type: String,
        default: null,
      },
      refundReason: {
        type: String,
        default: null,
      },
      refundDate: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
