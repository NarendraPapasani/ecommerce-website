const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

// Get all products
router.get("/all", productController.getAllProducts);

// Get a single product by ID
router.get("/:id", productController.getProductById);

router.get("/", productController.getProductsByClothingCategory);

module.exports = router;
