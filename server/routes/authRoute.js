const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  authenticateController,
} = require("../middleware/authenticateController");

// Authentication routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/google-auth", authController.googleAuth);
router.post("/logout", authController.logout);

// Email verification routes
router.post("/send-verification", authController.sendEmailVerificationCode);
router.post("/verify-email", authController.verifyEmailCode);

// Profile routes (protected)
router.get(
  "/profile/:id",
  authenticateController,
  authController.getUserProfile
);
router.put(
  "/profile",
  authenticateController,
  authController.updateUserProfile
);
router.put(
  "/profile-picture",
  authenticateController,
  authController.updateProfilePicture
);
router.put(
  "/change-password",
  authenticateController,
  authController.changePassword
);
router.get(
  "/statistics",
  authenticateController,
  authController.getUserStatistics
);

// Email change routes (protected)
router.post(
  "/send-email-change-verification",
  authenticateController,
  authController.sendEmailChangeVerification
);
router.post(
  "/verify-email-change",
  authenticateController,
  authController.verifyEmailChange
);

// Account deletion route (protected)
router.delete(
  "/delete-account",
  authenticateController,
  authController.deleteAccount
);

module.exports = router;
