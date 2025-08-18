const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

const createNewReview = async (req, res) => {
  try {
    const { productId, rating, comment, title } = req.body;
    const userId = req.user.id; // Get from JWT middleware

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Product ID, rating, and comment are required",
      });
    }

    // Check if product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Create new review
    const newReview = new Review({
      productId,
      userId,
      rating: parseInt(rating),
      comment: comment.trim(),
      title: title ? title.trim() : "",
    });

    const savedReview = await newReview.save();

    // Populate user data for response
    await savedReview.populate("userId", "firstName lastName email");

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review: savedReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getReviewsByProductId = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res
      .status(400)
      .json({ success: false, message: "Product ID is required" });
  }

  try {
    const reviews = await Review.find({ productId })
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const likeReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id; // Get from JWT middleware

  if (!reviewId) {
    return res
      .status(400)
      .json({ success: false, message: "Review ID is required" });
  }

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // Check if user already liked this review
    const userAlreadyLiked = review.likedBy.includes(userId);
    const userAlreadyDisliked = review.dislikedBy.includes(userId);

    if (userAlreadyLiked) {
      // User already liked, remove like
      review.likedBy = review.likedBy.filter((id) => id.toString() !== userId);
      review.likes = Math.max(0, review.likes - 1);
    } else {
      // If user previously disliked, remove dislike first
      if (userAlreadyDisliked) {
        review.dislikedBy = review.dislikedBy.filter(
          (id) => id.toString() !== userId
        );
        review.dislikes = Math.max(0, review.dislikes - 1);
      }
      // Add like
      review.likedBy.push(userId);
      review.likes += 1;
    }

    const updatedReview = await review.save();
    res.status(200).json({
      success: true,
      review: updatedReview,
      userLiked: review.likedBy.includes(userId),
      userDisliked: review.dislikedBy.includes(userId),
    });
  } catch (error) {
    console.error("Error liking review:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const dislikeReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id; // Get from JWT middleware

  if (!reviewId) {
    return res
      .status(400)
      .json({ success: false, message: "Review ID is required" });
  }

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // Check if user already disliked this review
    const userAlreadyLiked = review.likedBy.includes(userId);
    const userAlreadyDisliked = review.dislikedBy.includes(userId);

    if (userAlreadyDisliked) {
      // User already disliked, remove dislike
      review.dislikedBy = review.dislikedBy.filter(
        (id) => id.toString() !== userId
      );
      review.dislikes = Math.max(0, review.dislikes - 1);
    } else {
      // If user previously liked, remove like first
      if (userAlreadyLiked) {
        review.likedBy = review.likedBy.filter(
          (id) => id.toString() !== userId
        );
        review.likes = Math.max(0, review.likes - 1);
      }
      // Add dislike
      review.dislikedBy.push(userId);
      review.dislikes += 1;
    }

    const updatedReview = await review.save();
    res.status(200).json({
      success: true,
      review: updatedReview,
      userLiked: review.likedBy.includes(userId),
      userDisliked: review.dislikedBy.includes(userId),
    });
  } catch (error) {
    console.error("Error disliking review:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updatedReviewByWroteUser = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment, title } = req.body;
  const userId = req.user.id; // Get from JWT middleware

  if (!reviewId || !rating || !comment) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    if (review.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own reviews",
      });
    }

    review.rating = parseInt(rating);
    review.comment = comment.trim();
    review.title = title ? title.trim() : "";
    const updatedReview = await review.save();
    res.status(200).json({ success: true, review: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id; // Get from JWT middleware

  if (!reviewId) {
    return res
      .status(400)
      .json({ success: false, message: "Review ID is required" });
  }

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    if (review.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews",
      });
    }

    await Review.findByIdAndDelete(reviewId);
    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createNewReview,
  getReviewsByProductId,
  likeReview,
  dislikeReview,
  updatedReviewByWroteUser,
  deleteReview,
};
