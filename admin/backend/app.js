const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../server/.env") });

const app = express();

// Import routes
const adminProductRoutes = require("./routes/adminProductRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://blinkshopn.netlify.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));

// Connect to MongoDB (reuse existing connection)
const connectDb = require("../../server/DB/connectDb");

// API Routes
app.use("/admin/products", adminProductRoutes);
app.use("/admin/orders", adminOrderRoutes);
app.use("/admin/users", adminUserRoutes);

// Health check route
app.get("/admin/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Admin API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Admin API endpoint not found",
  });
});

const PORT = process.env.ADMIN_PORT || 4001;

// Start server
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Admin API Server running on port ${PORT}`);
      console.log(`Admin API: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`❌ Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  });

module.exports = app;
