const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create compound index to ensure one wishlist per user
wishlistSchema.index({ userId: 1 }, { unique: true });

// Index for efficient product queries
wishlistSchema.index({ "products.productId": 1 });

module.exports = mongoose.model("Wishlist", wishlistSchema);
