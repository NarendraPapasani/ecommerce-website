const {
  razorpayInstance,
  verifyPaymentSignature,
} = require("../lib/utils/razorpay");
const Payment = require("../models/paymentModel");

const createOrder = async (req, res) => {
  const { totalPrice, currency, reciptId } = req.body;
  console.log(req.body);

  try {
    // Check if Razorpay is properly configured
    if (!razorpayInstance) {
      console.error(
        "Razorpay instance is not configured. Check your environment variables."
      );
      return res.status(500).json({
        status: "error",
        message: "Payment gateway not configured. Please contact support.",
      });
    }

    if (!totalPrice || !currency || !reciptId) {
      return res.status(400).json({
        status: "error",
        message: "Total price, currency, and receipt ID are required",
      });
    }

    const order = await razorpayInstance.orders.create({
      amount: totalPrice * 100,
      currency,
      receipt: reciptId,
    });

    return res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create order",
    });
  }
};

const verifyPayment = async (req, res) => {
  const { paymentId, orderId, signature } = req.params;
  try {
    if (!paymentId || !orderId || !signature) {
      return res.status(400).json({
        status: "error",
        message: "Payment ID, Order ID, and Signature are required",
      });
    }

    // Use the improved signature verification
    const isSignatureValid = verifyPaymentSignature({
      order_id: orderId,
      payment_id: paymentId,
      signature: signature,
    });

    if (!isSignatureValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid payment signature",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      status: "error",
      message: "Payment verification failed",
    });
  }
};

const getPaymentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { _id: userId } = req.user;

    const payment = await Payment.findOne({ orderId, userId });

    if (!payment) {
      return res.status(404).json({
        status: "error",
        message: "Payment not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        payment,
      },
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const { _id: userId } = req.user;

    const payment = await Payment.findOneAndUpdate(
      { orderId, userId },
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        status: "error",
        message: "Payment not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Payment status updated successfully",
      data: {
        payment,
      },
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentByOrderId,
  updatePaymentStatus,
};
