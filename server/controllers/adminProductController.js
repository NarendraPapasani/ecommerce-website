const Product = require("../models/productModel");

// Get all products with pagination and filtering
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Build filter query
    let filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }
    
    if (category) {
      filter["category.name"] = { $regex: category, $options: "i" };
    }

    const products = await Product.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({ message: "Failed to fetch product details" });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      price,
      category,
      description,
      images,
    } = req.body;

    // Validate required fields
    if (!title || !slug || !price || !category || !description || !images || !images.length) {
      return res.status(400).json({ 
        message: "All fields are required: title, slug, price, category, description, images" 
      });
    }

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({ message: "Product with this slug already exists" });
    }

    // Generate product ID (get the highest existing ID and increment)
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const newId = lastProduct ? lastProduct.id + 1 : 1;

    // Create new product
    const newProduct = new Product({
      id: newId,
      title,
      slug,
      price,
      category,
      description,
      images,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    // If slug is being updated, check if it already exists
    if (updateData.slug) {
      const existingProduct = await Product.findOne({ 
        slug: updateData.slug,
        _id: { $ne: productId }
      });
      if (existingProduct) {
        return res.status(400).json({ message: "Product with this slug already exists" });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

// Get product statistics
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    
    // Get category distribution
    const categoryStats = await Product.aggregate([
      { $unwind: "$category" },
      { $group: { _id: "$category.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get products added this month
    const newProductsThisMonth = await Product.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    // Get latest products
    const latestProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title slug price createdAt");

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        newProductsThisMonth,
        categoryStats,
        latestProducts,
      },
    });
  } catch (error) {
    console.error("Get product stats error:", error);
    res.status(500).json({ message: "Failed to fetch product statistics" });
  }
};

// Bulk delete products
const bulkDeleteProducts = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "Product IDs array is required" });
    }

    const result = await Product.deleteMany({ _id: { $in: productIds } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} products deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Bulk delete products error:", error);
    res.status(500).json({ message: "Failed to delete products" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  bulkDeleteProducts,
};