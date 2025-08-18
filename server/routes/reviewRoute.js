const router = require("express").Router();
const reviewController = require("../controllers/reviewController");
const {
  authenticateController,
} = require("../middleware/authenticateController");

router.post("/add", authenticateController, reviewController.createNewReview);
router.get(
  "/:productId",
  authenticateController,
  reviewController.getReviewsByProductId
);
router.put(
  "/:reviewId/like",
  authenticateController,
  reviewController.likeReview
);
router.put(
  "/:reviewId/dislike",
  authenticateController,
  reviewController.dislikeReview
);
router.put(
  "/:reviewId",
  authenticateController,
  reviewController.updatedReviewByWroteUser
);
router.delete(
  "/:reviewId",
  authenticateController,
  reviewController.deleteReview
);

module.exports = router;
