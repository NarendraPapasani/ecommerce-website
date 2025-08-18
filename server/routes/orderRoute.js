const exporess = require("express");
const router = exporess.Router();

const orderController = require("../controllers/orderController");
const {
  authenticateController,
} = require("../middleware/authenticateController");

router.post("/add", authenticateController, orderController.addOrder);

router.get("/all", authenticateController, orderController.getAllOrders);

router.get("/user", authenticateController, orderController.getUserOrders);

router.get("/:id", authenticateController, orderController.getOrderById);
router.delete(
  "/cancel/:id",
  authenticateController,
  orderController.cancelOrder
);

module.exports = router;
