const Product = require("../models/productModel.js");

const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = "",
      minPrice = 0,
      maxPrice = 100000, // Fixed default max price
      sortBy = "creationAt",
      sortOrder = "desc",
    } = req.query;

    // Get category from URL params (for routes like /api/products/clothes)
    const category = req.params.category || "";

    // Build query object
    let query = {};

    // Search filter
    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter - only apply if category is not "all" or empty
    if (category && category !== "all" && category.trim() !== "") {
      query["category.name"] = { $regex: category, $options: "i" };
    }

    // Price range filter - handle string prices by converting them
    const minPriceNum = parseInt(minPrice);
    const maxPriceNum = parseInt(maxPrice);

    // Only apply price filter if values are different from defaults
    // Don't filter if using default range (0 to 100000)
    const hasActualPriceFilter = minPriceNum > 0 || maxPriceNum < 100000;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions = {};
    const order = sortOrder === "desc" ? -1 : 1;

    switch (sortBy) {
      case "price":
        sortOptions.price = order;
        break;
      case "name":
        sortOptions.title = order;
        break;
      case "rating":
        sortOptions["rating.rate"] = order;
        break;
      default:
        // Try both creationAt and createdAt for compatibility
        sortOptions.creationAt = order;
    }

    let products;
    let totalProducts;

    // Check if we need price filtering (prices are stored as strings)
    const needsPriceFilter = hasActualPriceFilter;

    if (needsPriceFilter) {
      // Use aggregation pipeline for string price filtering
      const pipeline = [
        {
          $addFields: {
            numericPrice: { $toInt: "$price" },
          },
        },
      ];

      // Add match stage for other filters
      if (Object.keys(query).length > 0) {
        pipeline.push({ $match: query });
      }

      // Add price filter
      const priceMatch = {};
      if (minPriceNum > 0) {
        priceMatch.numericPrice = { $gte: minPriceNum };
      }
      if (maxPriceNum < 100000) {
        priceMatch.numericPrice = {
          ...priceMatch.numericPrice,
          $lte: maxPriceNum,
        };
      }
      pipeline.push({ $match: priceMatch });

      // Add sort
      const sortStage = {};
      if (sortBy === "price") {
        sortStage.numericPrice = order;
      } else {
        sortStage[
          sortBy === "name"
            ? "title"
            : sortBy === "rating"
            ? "rating.rate"
            : "creationAt"
        ] = order;
      }
      pipeline.push({ $sort: sortStage });

      // Add pagination
      pipeline.push({ $skip: skip }, { $limit: limitNum });

      // Remove the temporary numericPrice field
      pipeline.push({
        $project: {
          numericPrice: 0,
        },
      });

      products = await Product.aggregate(pipeline);

      // Get total count with price filter
      const countPipeline = [
        {
          $addFields: {
            numericPrice: { $toInt: "$price" },
          },
        },
      ];
      if (Object.keys(query).length > 0) {
        countPipeline.push({ $match: query });
      }
      countPipeline.push({ $match: priceMatch }, { $count: "total" });

      const countResult = await Product.aggregate(countPipeline);
      totalProducts = countResult[0]?.total || 0;
    } else {
      // Use regular find for non-price queries
      products = await Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum);

      totalProducts = await Product.countDocuments(query);
    }

    const totalPages = Math.ceil(totalProducts / limitNum);

    // Response
    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum,
      },
      filters: {
        search,
        category,
        minPrice: parseInt(minPrice),
        maxPrice: parseInt(maxPrice),
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Product ID is required" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product by id:", error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Search products with advanced filtering
const searchProducts = async (req, res) => {
  try {
    const {
      q,
      page = 1,
      limit = 10,
      category = "",
      minPrice = 0,
      maxPrice = 100, // Fixed default
      sortBy = "relevance",
    } = req.query;

    if (!q) {
      return res
        .status(400)
        .json({ success: false, msg: "Search query is required" });
    }

    let query = {};

    // Text search
    const searchRegex = new RegExp(q, "i");
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { "category.name": searchRegex },
    ];

    // Category filter
    if (category && category !== "all") {
      query["category.name"] = { $regex: category, $options: "i" };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Check if we need price filtering (prices are stored as strings)
    const minPriceNum = parseInt(minPrice);
    const maxPriceNum = parseInt(maxPrice);
    const needsPriceFilter = minPriceNum > 0 || maxPriceNum < 100000;

    let products, total;

    if (needsPriceFilter) {
      // Use aggregation pipeline for string price filtering
      const pipeline = [
        {
          $addFields: {
            numericPrice: { $toInt: "$price" },
          },
        },
        { $match: query },
      ];

      // Add price filter
      const priceMatch = {};
      if (minPriceNum > 0) {
        priceMatch.numericPrice = { $gte: minPriceNum };
      }
      if (maxPriceNum < 100000) {
        priceMatch.numericPrice = {
          ...priceMatch.numericPrice,
          $lte: maxPriceNum,
        };
      }
      pipeline.push({ $match: priceMatch });

      // Sort options
      const sortStage = {};
      switch (sortBy) {
        case "price-low":
          sortStage.numericPrice = 1;
          break;
        case "price-high":
          sortStage.numericPrice = -1;
          break;
        case "rating":
          sortStage["rating.rate"] = -1;
          break;
        case "name":
          sortStage.title = 1;
          break;
        default:
          sortStage.creationAt = -1;
      }
      pipeline.push({ $sort: sortStage });

      // Add pagination
      pipeline.push({ $skip: skip }, { $limit: limitNum });

      // Remove the temporary numericPrice field
      pipeline.push({
        $project: {
          numericPrice: 0,
        },
      });

      products = await Product.aggregate(pipeline);

      // Get total count with price filter
      const countPipeline = [
        {
          $addFields: {
            numericPrice: { $toInt: "$price" },
          },
        },
        { $match: query },
        { $match: priceMatch },
        { $count: "total" },
      ];

      const countResult = await Product.aggregate(countPipeline);
      total = countResult[0]?.total || 0;
    } else {
      // Use regular find for non-price queries
      let sortOptions = {};
      switch (sortBy) {
        case "price-low":
          sortOptions.price = 1;
          break;
        case "price-high":
          sortOptions.price = -1;
          break;
        case "rating":
          sortOptions["rating.rate"] = -1;
          break;
        case "name":
          sortOptions.title = 1;
          break;
        default:
          sortOptions.creationAt = -1;
      }

      products = await Product.find(query)
        .sort(sortOptions)
        .limit(limitNum)
        .skip(skip);

      total = await Product.countDocuments(query);
    }

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalProducts: total,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
      searchQuery: q,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

const getProductsByCategorySlug = async (req, res) => {
  try {
    const { category, limit = 4, page = 1 } = req.query;

    if (!category) {
      return res
        .status(400)
        .json({ success: false, msg: "Category parameter is required" });
    }

    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    const query = {
      "category.slug": { $regex: category, $options: "i" },
    };

    const products = await Product.find(query).limit(limitNum).skip(skip);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitNum);

    if (products.length === 0) {
      return res.status(404).json({ success: false, msg: "No products found" });
    }

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Get featured/trending products
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    // Get products with highest ratings or most recent
    const products = await Product.aggregate([
      { $sample: { size: parseInt(limit) } },
    ]);

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Get product categories with counts
const getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category.name",
          count: { $sum: 1 },
          category: { $first: "$category" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Get price range for filters
const getPriceRange = async (req, res) => {
  try {
    const priceRange = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      priceRange: priceRange[0] || { minPrice: 0, maxPrice: 100 }, // Fixed default
    });
  } catch (error) {
    console.error("Error fetching price range:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  getFeaturedProducts,
  getCategories,
  getPriceRange,
  getProductsByCategorySlug,
};
