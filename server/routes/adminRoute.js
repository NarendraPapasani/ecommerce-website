const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminUserController = require("../controllers/adminUserController");
const adminProductController = require("../controllers/adminProductController");
const adminOrderController = require("../controllers/adminOrderController");
const { adminMiddleware } = require("../middleware/adminMiddleware");

// Admin authentication routes
router.post("/login", adminController.adminLogin);
router.post("/logout", adminController.adminLogout);

// Admin dashboard routes (protected)
router.get("/dashboard/stats", adminMiddleware, adminController.getDashboardStats);

// Admin user management routes (protected)
router.get("/users", adminMiddleware, adminUserController.getAllUsers);
router.get("/users/stats", adminMiddleware, adminUserController.getUserStats);
router.get("/users/:userId", adminMiddleware, adminUserController.getUserById);
router.put("/users/:userId/status", adminMiddleware, adminUserController.updateUserStatus);
router.put("/users/:userId/role", adminMiddleware, adminUserController.updateUserRole);
router.delete("/users/:userId", adminMiddleware, adminUserController.deleteUser);

// Admin product management routes (protected)
router.get("/products", adminMiddleware, adminProductController.getAllProducts);
router.get("/products/stats", adminMiddleware, adminProductController.getProductStats);
router.get("/products/:productId", adminMiddleware, adminProductController.getProductById);
router.post("/products", adminMiddleware, adminProductController.createProduct);
router.put("/products/:productId", adminMiddleware, adminProductController.updateProduct);
router.delete("/products/:productId", adminMiddleware, adminProductController.deleteProduct);
router.delete("/products", adminMiddleware, adminProductController.bulkDeleteProducts);

// Admin order management routes (protected)
router.get("/orders", adminMiddleware, adminOrderController.getAllOrders);
router.get("/orders/stats", adminMiddleware, adminOrderController.getOrderStats);
router.get("/orders/:orderId", adminMiddleware, adminOrderController.getOrderById);
router.put("/orders/:orderId/status", adminMiddleware, adminOrderController.updateOrderStatus);
router.put("/orders/status", adminMiddleware, adminOrderController.bulkUpdateOrderStatus);

module.exports = router;