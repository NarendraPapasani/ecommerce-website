const express = require("express");
const cartController = require("../controllers/cartController");
const {
  authenticateController,
} = require("../middleware/authenticateController");

const router = express.Router();

// Get all carts
router.get("/all", authenticateController, cartController.getCartProducts);

// Get cart statistics
router.get(
  "/statistics",
  authenticateController,
  cartController.getCartStatistics
);

//add to cart
router.post("/add", authenticateController, cartController.addToCart);

//remove from cart
router.delete(
  "/remove/:id",
  authenticateController,
  cartController.removeFromCart
);

//increment from cart
router.put(
  "/increment/:id",
  authenticateController,
  cartController.incrementFromCart
);

//decrement from cart
router.put(
  "/decrement/:id",
  authenticateController,
  cartController.decrementFromCart
);

//clear cart
router.delete("/clear", authenticateController, cartController.clearCart);

module.exports = router;
