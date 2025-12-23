const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    // Check if user account is active
    if (user.accountStatus !== "active") {
      return res.status(403).json({ message: "Account is not active" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed", error: error.message });
  }
};

module.exports = { adminMiddleware };