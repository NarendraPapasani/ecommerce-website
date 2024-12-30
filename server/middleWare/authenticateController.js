const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticateController = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).send("Unauthorized token");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).send("Invalid Token");
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).send("User Not Found");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = { authenticateController };
