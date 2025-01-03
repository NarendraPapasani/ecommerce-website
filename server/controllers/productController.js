const Product = require("../models/productModel.js");
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
    console.log("Products fetched successfully");
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product by id:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getProductsByClothingCategory = async (req, res) => {
  const { category } = req.query;
  try {
    const products = await Product.find({
      category: new RegExp(category, "i"),
    });
    if (!products.length) {
      return res
        .status(404)
        .json({ msg: "No products found in this category" });
    }
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByClothingCategory,
};
