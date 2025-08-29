const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserDetails,
  deleteUser,
  getUserAnalytics,
  exportUsers,
} = require("../controllers/adminUserController");

const router = express.Router();

// Routes

// Get all users with filters and pagination
// GET /admin/users?page=1&limit=20&search=john&status=active&sortBy=createdAt&sortOrder=desc
router.get("/", getAllUsers);

// Get user analytics
// GET /admin/users/analytics?dateFrom=2024-01-01&dateTo=2024-12-31
router.get("/analytics", getUserAnalytics);

// Export users to CSV
// GET /admin/users/export?status=active&dateFrom=2024-01-01&dateTo=2024-12-31
router.get("/export", exportUsers);

// Get single user by ID with order history
// GET /admin/users/:id
router.get("/:id", getUserById);

// Update user status (activate/deactivate)
// PUT /admin/users/:id/status
// Body: { isActive: false, reason: "Account suspended for violation" }
router.put("/:id/status", updateUserStatus);

// Update user details
// PUT /admin/users/:id
// Body: { name: "Updated Name", email: "new@email.com", phone: "+1234567890" }
router.put("/:id", updateUserDetails);

// Delete user (soft delete)
// DELETE /admin/users/:id
// Body: { deleteReason: "Account deleted at user request" }
router.delete("/:id", deleteUser);

module.exports = router;
