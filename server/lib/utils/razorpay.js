require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");

let razorpayInstance = null;

// Check if Razorpay credentials are available
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    console.log("Razorpay configured successfully");
  } catch (error) {
    console.error("Error configuring Razorpay:", error);
  }
} else {
  console.warn(
    "Razorpay credentials not found in environment variables. Payment features will be disabled."
  );
}

const verifyPaymentSignature = (data) => {
  if (!process.env.RAZORPAY_SECRET) {
    throw new Error("Razorpay secret not configured");
  }

  const { order_id, payment_id, signature } = data;
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(`${order_id}|${payment_id}`)
    .digest("hex");

  return generatedSignature === signature;
};

module.exports = {
  razorpayInstance,
  verifyPaymentSignature,
};
