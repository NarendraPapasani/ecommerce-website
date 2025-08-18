const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

// Upload products from JSON fi

// Get all products with filtering, pagination, and search
router.get("/all", productController.getAllProducts);

router.get("/category/:category", productController.getAllProducts);

// Get products by category with all filtering options
router.get("/", productController.getProductsByCategorySlug);

// Search products
router.get("/search", productController.searchProducts);

// Get featured products
router.get("/featured", productController.getFeaturedProducts);

// Get categories with product counts
router.get("/categories", productController.getCategories);

// Get price range for filters
router.get("/price-range", productController.getPriceRange);

// Get a single product by ID (should be last to avoid conflicts)
router.get("/:id", productController.getProductById);

module.exports = router;
