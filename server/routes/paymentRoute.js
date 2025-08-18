const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const {
  authenticateController,
} = require("../middleware/authenticateController");

router.post(
  "/create-order",
  authenticateController,
  paymentController.createOrder
);
router.get(
  "/verify-payment/:paymentId/:orderId/:signature",
  authenticateController,
  paymentController.verifyPayment
);
router.get(
  "/order/:orderId",
  authenticateController,
  paymentController.getPaymentByOrderId
);
router.put(
  "/order/:orderId/status",
  authenticateController,
  paymentController.updatePaymentStatus
);

module.exports = router;
