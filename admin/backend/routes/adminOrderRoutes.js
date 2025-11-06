const express = require("express");
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  generateInvoice,
  generateShippingLabel,
  processRefund,
  getOrderAnalytics,
  getUserLastOrders,
} = require("../controllers/adminOrderController");

const router = express.Router();

// Routes

// Get all orders with filters and pagination
// GET /admin/orders?page=1&limit=20&status=pending&dateFrom=2024-01-01&dateTo=2024-12-31&search=john&sortBy=createdAt&sortOrder=desc
router.get("/", getAllOrders);

// Get order analytics
// GET /admin/orders/analytics?dateFrom=2024-01-01&dateTo=2024-12-31
router.get("/analytics", getOrderAnalytics);

// Get single order by ID
// GET /admin/orders/:id
router.get("/:id", getOrderById);

// Update order status
// PUT /admin/orders/:id/status
// Body: { status: "shipped", trackingNumber: "TRK123456", notes: "Order shipped via FedEx" }
router.put("/:id/status", updateOrderStatus);

// Generate invoice PDF
// GET /admin/orders/:id/invoice
router.get("/:id/invoice", generateInvoice);

router.get("/last-orders/:id", getUserLastOrders);

// Generate shipping label PDF
// GET /admin/orders/:id/shipping-label
router.get("/:id/shipping-label", generateShippingLabel);

// Process refund
// POST /admin/orders/:id/refund
// Body: { refundAmount: 100, reason: "Product defective" }
router.post("/:id/refund", processRefund);

module.exports = router;
