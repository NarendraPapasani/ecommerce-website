const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkProductInWishlist,
  getWishlistCount,
} = require("../controllers/wishlistController");

// GET /api/wishlist - Get user's wishlist
router.get("/", getWishlist);

// GET /api/wishlist/count - Get wishlist items count
router.get("/count", getWishlistCount);

// GET /api/wishlist/check/:productId - Check if product is in wishlist
router.get("/check/:productId", checkProductInWishlist);

// POST /api/wishlist/add - Add product to wishlist
router.post("/add", addToWishlist);

// DELETE /api/wishlist/remove/:productId - Remove product from wishlist
router.delete("/remove/:productId", removeFromWishlist);

// DELETE /api/wishlist/clear - Clear entire wishlist
router.delete("/clear", clearWishlist);

module.exports = router;
