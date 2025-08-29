const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
  getCategories,
  getProductAnalytics,
} = require("../controllers/adminProductController");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".csv", ".xlsx", ".xls"];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV and Excel files are allowed"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Routes

// Get all products with filters and pagination
// GET /admin/products?page=1&limit=20&search=phone&category=electronics&minPrice=100&maxPrice=1000&sortBy=price&sortOrder=asc
router.get("/", getAllProducts);

// Get product analytics
// GET /admin/products/analytics
router.get("/analytics", getProductAnalytics);

// Get all categories
// GET /admin/products/categories
router.get("/categories", getCategories);

// Bulk upload products
// POST /admin/products/bulk-upload (with file)
router.post("/bulk-upload", upload.single("file"), bulkUploadProducts);

// Get single product by ID
// GET /admin/products/:id
router.get("/:id", getProductById);

// Create new product
// POST /admin/products
router.post("/", createProduct);

// Update product
// PUT /admin/products/:id
router.put("/:id", updateProduct);

// Delete product
// DELETE /admin/products/:id
router.delete("/:id", deleteProduct);

module.exports = router;
