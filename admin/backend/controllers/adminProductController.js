const path = require("path");
const Product = require(path.join(
  __dirname,
  "../../../server/models/productModel"
));
const cloudinary = require("cloudinary").v2;
const csv = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all products with pagination and filters
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

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

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get products with pagination
    const products = await Product.find(filter)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      status: "success",
      data: {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalProducts / limitNum),
          totalProducts,
          hasNextPage: pageNum < Math.ceil(totalProducts / limitNum),
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { title, slug, price, stock, category, description, images } =
      req.body;

    // Validate required fields
    if (
      !title ||
      !slug ||
      !price ||
      stock === undefined ||
      !category ||
      !description
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Missing required fields: title, slug, price, stock, category, and description are required",
      });
    }

    // Validate stock is a number
    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({
        status: "error",
        message: "Stock must be a valid number greater than or equal to 0",
      });
    }

    let processedCategory = category;
    // Handle category with proper image assignment
    if (category) {
      // Define default category images
      const categoryImages = {
        Electronics:
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=150&h=150&fit=crop",
        Clothing:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop",
        Books:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&h=150&fit=crop",
        "Home & Garden":
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=150&fit=crop",
        Sports:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop",
      };

      // If category is a string, convert to proper format
      if (typeof category === "string") {
        processedCategory = [
          {
            id: "1",
            name: category,
            slug: category.toLowerCase().replace(/\s+/g, "-"),
            image:
              categoryImages[category] ||
              "https://via.placeholder.com/150x150?text=Category",
            creationAt: new Date(),
            updatedAt: new Date(),
          },
        ];
      } else if (Array.isArray(category)) {
        // Process array of categories
        processedCategory = category.map((cat, index) => ({
          id: cat.id || (index + 1).toString(),
          name: cat.name || cat,
          slug:
            cat.slug || (cat.name || cat).toLowerCase().replace(/\s+/g, "-"),
          image:
            cat.image ||
            categoryImages[cat.name || cat] ||
            "https://via.placeholder.com/150x150?text=Category",
          creationAt: cat.creationAt || new Date(),
          updatedAt: cat.updatedAt || new Date(),
        }));
      }
    }

    // Get next ID
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const nextId = lastProduct ? lastProduct.id + 1 : 1;

    // Upload images to Cloudinary if provided
    let uploadedImages = [];
    if (images && images.length > 0) {
      for (const imageUrl of images) {
        if (imageUrl.startsWith("data:")) {
          // Upload base64 image
          const result = await cloudinary.uploader.upload(imageUrl, {
            folder: "blinkshop/products",
            resource_type: "image",
          });
          uploadedImages.push(result.secure_url);
        } else {
          // Use existing URL
          uploadedImages.push(imageUrl);
        }
      }
    }

    const newProduct = new Product({
      id: nextId,
      title,
      slug,
      price,
      stock: parseInt(stock),
      category: processedCategory,
      description,
      images: uploadedImages,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: { product: savedProduct },
    });
  } catch (error) {
    console.error("Error creating product:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "Product with this ID or slug already exists",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle category processing
    if (updateData.category) {
      const categoryImages = {
        Electronics:
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=150&h=150&fit=crop",
        Clothing:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop",
        Books:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&h=150&fit=crop",
        "Home & Garden":
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&h=150&fit=crop",
        Sports:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop",
      };

      if (typeof updateData.category === "string") {
        updateData.category = [
          {
            id: "1",
            name: updateData.category,
            slug: updateData.category.toLowerCase().replace(/\s+/g, "-"),
            image:
              categoryImages[updateData.category] ||
              "https://via.placeholder.com/150x150?text=Category",
            creationAt: new Date(),
            updatedAt: new Date(),
          },
        ];
      } else if (Array.isArray(updateData.category)) {
        updateData.category = updateData.category.map((cat, index) => ({
          id: cat.id || (index + 1).toString(),
          name: cat.name || cat,
          slug:
            cat.slug || (cat.name || cat).toLowerCase().replace(/\s+/g, "-"),
          image:
            cat.image ||
            categoryImages[cat.name || cat] ||
            "https://via.placeholder.com/150x150?text=Category",
          creationAt: cat.creationAt || new Date(),
          updatedAt: cat.updatedAt || new Date(),
        }));
      }
    }

    // Handle image uploads if provided
    if (updateData.images && updateData.images.length > 0) {
      let uploadedImages = [];
      for (const imageUrl of updateData.images) {
        if (imageUrl.startsWith("data:")) {
          // Upload base64 image
          const result = await cloudinary.uploader.upload(imageUrl, {
            folder: "blinkshop/products",
            resource_type: "image",
          });
          uploadedImages.push(result.secure_url);
        } else {
          // Use existing URL
          uploadedImages.push(imageUrl);
        }
      }
      updateData.images = uploadedImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: { product: updatedProduct },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Delete images from Cloudinary
    if (deletedProduct.images && deletedProduct.images.length > 0) {
      for (const imageUrl of deletedProduct.images) {
        try {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`blinkshop/products/${publicId}`);
        } catch (error) {
          console.error("Error deleting image from Cloudinary:", error);
        }
      }
    }

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// Bulk upload products via CSV/Excel
const bulkUploadProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;
    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();

    let productsData = [];

    if (fileExtension === "csv") {
      // Parse CSV file
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          productsData = results;
          await processProducts(productsData, res);
        });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      // Parse Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      productsData = xlsx.utils.sheet_to_json(worksheet);
      await processProducts(productsData, res);
    } else {
      return res.status(400).json({
        status: "error",
        message: "Unsupported file format. Please use CSV or Excel files.",
      });
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Error in bulk upload:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to process bulk upload",
      error: error.message,
    });
  }
};

// Helper function to process products
const processProducts = async (productsData, res) => {
  try {
    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const productData of productsData) {
      try {
        // Get next ID
        const lastProduct = await Product.findOne().sort({ id: -1 });
        const nextId = lastProduct ? lastProduct.id + 1 : 1;

        // Parse category if it's a string
        let category = productData.category;
        if (typeof category === "string") {
          try {
            category = JSON.parse(category);
          } catch (error) {
            // If parsing fails, create a default category structure
            category = [
              {
                id: "1",
                name: category,
                slug: category.toLowerCase().replace(/\s+/g, "-"),
                image: "",
                creationAt: new Date(),
                updatedAt: new Date(),
              },
            ];
          }
        }

        // Parse images if it's a string
        let images = productData.images || [];
        if (typeof images === "string") {
          images = images.split(",").map((img) => img.trim());
        }

        const newProduct = new Product({
          id: nextId,
          title: productData.title,
          slug:
            productData.slug ||
            productData.title.toLowerCase().replace(/\s+/g, "-"),
          price: productData.price,
          stock: parseInt(productData.stock) || 0,
          category: category,
          description: productData.description,
          images: images,
        });

        await newProduct.save();
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          product: productData.title || "Unknown",
          error: error.message,
        });
      }
    }

    res.status(200).json({
      status: "success",
      message: "Bulk upload completed",
      data: results,
    });
  } catch (error) {
    console.error("Error processing products:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to process products",
      error: error.message,
    });
  }
};

// Get product categories with images
const getCategories = async (req, res) => {
  try {
    // Get existing categories from products
    const categories = await Product.aggregate([
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category.name",
          image: { $first: "$category.image" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          name: "$_id",
          image: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: { categories },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// Get product analytics
const getProductAnalytics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    // Category-wise count
    const categoryStats = await Product.aggregate([
      { $unwind: "$category" },
      { $group: { _id: "$category.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Price range analysis
    const priceStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: { $toDouble: "$price" } },
          minPrice: { $min: { $toDouble: "$price" } },
          maxPrice: { $max: { $toDouble: "$price" } },
        },
      },
    ]);

    // Stock analysis
    const stockStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: "$stock" },
          avgStock: { $avg: "$stock" },
          lowStockCount: {
            $sum: { $cond: [{ $lt: ["$stock", 10] }, 1, 0] },
          },
          outOfStockCount: {
            $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] },
          },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalProducts,
        categoryStats,
        priceStats: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 },
        stockStats: stockStats[0] || {
          totalStock: 0,
          avgStock: 0,
          lowStockCount: 0,
          outOfStockCount: 0,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching product analytics:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch product analytics",
      error: error.message,
    });
  }
};

// Get low stock products
const getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;

    const lowStockProducts = await Product.find({
      stock: { $lt: parseInt(threshold) },
    }).sort({ stock: 1 });

    res.status(200).json({
      status: "success",
      data: {
        products: lowStockProducts,
        count: lowStockProducts.length,
      },
    });
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch low stock products",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
  getCategories,
  getProductAnalytics,
  getLowStockProducts,
};
