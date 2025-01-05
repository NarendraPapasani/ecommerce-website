const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Product = require("./models/productModel"); // Adjust the path as necessary

// Load environment variables from .env file
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    uploadProducts();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Function to upload products
const uploadProducts = async () => {
  try {
    // Read the JSON file
    const filePath = path.join(__dirname, "products.json");
    const productsData = fs.readFileSync(filePath, "utf-8");
    const products = JSON.parse(productsData);

    // Insert products into the database
    await Product.insertMany(products);
    console.log("Products uploaded successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error uploading products:", error);
    mongoose.connection.close();
  }
};
