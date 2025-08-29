const nodemailer = require("nodemailer");

// Create a transporter (you'll need to configure this with your email service)
const createTransporter = () => {
  // For development, you can use Gmail or other services
  // For production, use professional email services like SendGrid, AWS SES, etc.
  return nodemailer.createTransport({
    service: "gmail", // You can change this to your preferred service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });
};

// Common email styles
const emailStyles = `
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .order-summary { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .order-items { width: 100%; border-collapse: collapse; }
    .total { font-size: 18px; font-weight: bold; color: #059669; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    .brand-title { color: #3b82f6; margin: 0; font-size: 28px; }
    .brand-subtitle { color: #64748b; margin: 5px 0; }
    .verification-code { background: white; display: inline-block; padding: 20px 40px; border-radius: 8px; margin: 20px 0; }
    .code-text { font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 5px; }
    .info-box { background-color: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .info-title { margin: 0; color: #1e40af; }
  </style>
`;

// Generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send email verification code
const sendEmailVerification = async (userEmail, verificationCode) => {
  try {
    const transporter = createTransporter();

    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Email Verification - BlinkShop</title>
          ${emailStyles}
        </head>
        <body>
          <div class="container">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 class="brand-title">BlinkShop</h1>
              <p class="brand-subtitle">Your Ultimate Shopping Destination</p>
            </div>
            
            <div class="header">
              <h2 style="color: white; margin: 0 0 20px 0;">Email Verification</h2>
              <p style="color: white; margin-bottom: 30px;">Enter this verification code to complete your registration:</p>
              
              <div class="verification-code">
                <span class="code-text">${verificationCode}</span>
              </div>
              
              <p style="color: white; margin-top: 20px; font-size: 14px;">This code will expire in 10 minutes</p>
            </div>
            
            <div class="footer">
              <p>If you didn't request this verification, please ignore this email.</p>
              <p>&copy; 2025 BlinkShop. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "BlinkShop - Email Verification Code",
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email verification code sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  try {
    const transporter = createTransporter();

    const { cartItems, totalPrice, paymentMethod, orderId } = orderDetails;

    // Create order items HTML
    const orderItemsHTML = cartItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <img src="${item.image}" alt="${
          item.title
        }" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.title}</strong>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ₹${(parseFloat(item.price) * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join("");

    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation - BlinkShop</title>
          ${emailStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">BlinkShop</h1>
              <h2 style="margin: 10px 0;">Order Confirmation</h2>
              <p>Thank you for your purchase!</p>
            </div>
            
            <div class="content">
              <h2>Dear Customer,</h2>
              <p>Your order has been successfully placed. Here are the details:</p>
              
              <div class="order-summary">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
                
                <h4>Items Ordered:</h4>
                <table class="order-items">
                  <thead>
                    <tr style="background-color: #f3f4f6;">
                      <th style="padding: 10px; text-align: left;">Image</th>
                      <th style="padding: 10px; text-align: left;">Product</th>
                      <th style="padding: 10px; text-align: center;">Quantity</th>
                      <th style="padding: 10px; text-align: right;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderItemsHTML}
                  </tbody>
                </table>
                
                <div style="margin-top: 20px; text-align: right;">
                  <p class="total">Total Amount: ₹${totalPrice.toFixed(2)}</p>
                </div>
              </div>
              
              <p>We'll send you another email when your order ships. You can track your order status in your account.</p>
              
              <div class="info-box">
                <h4 class="info-title">What's Next?</h4>
                <ul style="margin: 10px 0;">
                  <li>We'll process your order within 1-2 business days</li>
                  <li>You'll receive a shipping confirmation email</li>
                  <li>Track your order in your account dashboard</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p>If you have any questions, please contact our customer support.</p>
              <p>&copy; 2025 BlinkShop. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Confirmation - Order #${orderId}`,
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return false;
  }
};

// Send order shipped notification
const sendOrderShippedEmail = async (userEmail, orderDetails) => {
  try {
    const transporter = createTransporter();

    const { orderId, trackingNumber, shippingCarrier, estimatedDelivery } =
      orderDetails;

    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Shipped - BlinkShop</title>
          ${emailStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">BlinkShop</h1>
              <h2 style="margin: 10px 0;">Your Order is on the Way!</h2>
              <p>Your package has been shipped</p>
            </div>
            
            <div class="content">
              <h2>Great News!</h2>
              <p>Your order has been shipped and is on its way to you.</p>
              
              <div class="order-summary">
                <h3>Shipping Details</h3>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
                <p><strong>Shipping Carrier:</strong> ${shippingCarrier}</p>
                <p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>
              </div>
              
              <div class="info-box">
                <h4 class="info-title">Track Your Package</h4>
                <p>You can track your package using the tracking number above on the carrier's website.</p>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for shopping with BlinkShop!</p>
              <p>&copy; 2025 BlinkShop. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Your Order #${orderId} has been Shipped!`,
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order shipped email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending order shipped email:", error);
    return false;
  }
};

// Send order delivered notification
const sendOrderDeliveredEmail = async (userEmail, orderDetails) => {
  try {
    const transporter = createTransporter();

    const { orderId, deliveryDate } = orderDetails;

    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Delivered - BlinkShop</title>
          ${emailStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">BlinkShop</h1>
              <h2 style="margin: 10px 0;">Order Delivered!</h2>
              <p>Your package has been successfully delivered</p>
            </div>
            
            <div class="content">
              <h2>Delivery Confirmed!</h2>
              <p>Your order has been successfully delivered.</p>
              
              <div class="order-summary">
                <h3>Delivery Details</h3>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Delivered On:</strong> ${deliveryDate}</p>
              </div>
              
              <div class="info-box">
                <h4 class="info-title">What's Next?</h4>
                <ul style="margin: 10px 0;">
                  <li>Enjoy your purchase!</li>
                  <li>Leave a review to help other customers</li>
                  <li>Contact us if you have any issues</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing BlinkShop!</p>
              <p>&copy; 2025 BlinkShop. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Your Order #${orderId} has been Delivered!`,
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order delivered email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending order delivered email:", error);
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (userEmail, resetToken) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset - BlinkShop</title>
          ${emailStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">BlinkShop</h1>
              <h2 style="margin: 10px 0;">Password Reset Request</h2>
              <p>We received a request to reset your password</p>
            </div>
            
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Reset Password
                </a>
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #3b82f6;">${resetUrl}</p>
              
              <div class="info-box">
                <h4 class="info-title">Security Note</h4>
                <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
              </div>
            </div>
            
            <div class="footer">
              <p>For security reasons, this link will expire in 1 hour.</p>
              <p>&copy; 2025 BlinkShop. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Reset Your BlinkShop Password",
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};

// Send order status update email
const sendOrderStatusUpdateEmail = async (userEmail, orderDetails) => {
  try {
    const transporter = createTransporter();

    const {
      orderId,
      newStatus,
      oldStatus,
      trackingNumber,
      adminNotes,
      cartItems,
      totalPrice,
      refundAmount,
      refundReason,
    } = orderDetails;

    const orderItemsHTML = cartItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <img src="${item.image}" alt="${
          item.title
        }" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.title}</strong>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ₹${(parseFloat(item.price) * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join("");

    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Status Update - BlinkShop</title>
          ${emailStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">BlinkShop</h1>
              <h2 style="margin: 10px 0;">Order Status Update</h2>
              <p>Your order status has been updated</p>
            </div>
            
            <div class="content">
              <h2>Dear Customer,</h2>
              <p>Your order status has been updated from <strong>${oldStatus}</strong> to <strong>${newStatus}</strong>.</p>
              
              <div class="order-summary">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${orderId}</p>
                ${
                  trackingNumber
                    ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>`
                    : ""
                }
                ${
                  adminNotes
                    ? `<p><strong>Admin Notes:</strong> ${adminNotes}</p>`
                    : ""
                }
                ${
                  refundAmount
                    ? `<p><strong>Refund Amount:</strong> ₹${refundAmount}</p>`
                    : ""
                }
                ${
                  refundReason
                    ? `<p><strong>Refund Reason:</strong> ${refundReason}</p>`
                    : ""
                }
                
                <h4>Items Ordered:</h4>
                <table class="order-items">
                  <thead>
                    <tr style="background-color: #f3f4f6;">
                      <th style="padding: 10px; text-align: left;">Image</th>
                      <th style="padding: 10px; text-align: left;">Product</th>
                      <th style="padding: 10px; text-align: center;">Quantity</th>
                      <th style="padding: 10px; text-align: right;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orderItemsHTML}
                  </tbody>
                </table>
                
                <div style="margin-top: 20px; text-align: right;">
                  <p class="total">Total Amount: ₹${totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p>If you have any questions, please contact our customer support.</p>
              <p>&copy; 2025 BlinkShop. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Status Update - Order #${orderId}`,
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order status update email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending order status update email:", error);
    return false;
  }
};

module.exports = {
  generateVerificationCode,
  sendEmailVerification,
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendPasswordResetEmail,
  sendOrderStatusUpdateEmail,
};
