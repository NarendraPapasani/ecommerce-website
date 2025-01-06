const exporess = require("express");
const router = exporess.Router();

const orderController = require("../controllers/orderController");

router.post("/add", orderController.addOrder);

router.get("/all", orderController.getAllOrders);

router.get("/user", orderController.getUserOrders);

router.get("/:id", orderController.getOrderById);
router.delete("/cancel/:id", orderController.cancelOrder);

module.exports = router;
