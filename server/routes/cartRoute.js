const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

// Get all carts
router.get("/all", cartController.getCartProducts);

//add to cart
router.post("/add", cartController.addToCart);

//remove from cart
router.delete("/remove/:id", cartController.removeFromCart);

//increment from cart
router.put("/increment/:id", cartController.incrementFromCart);

//decrement from cart
router.put("/decrement/:id", cartController.decrementFromCart);

module.exports = router;
