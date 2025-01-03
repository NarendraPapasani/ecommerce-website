const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {
  authenticateController,
} = require("./middleWare/authenticateController");

app.use(express.json());
app.use(cookieParser());

const connectDb = require("./DB/connectDb");

app.use(
  cors({
    origin: "https://ecommified.netlify.app",
    credentials: true,
  })
);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/products", require("./routes/productRoute"));
app.use("/api/cart", authenticateController, require("./routes/cartRoute"));
app.use(
  "/api/address",
  authenticateController,
  require("./routes/addressRoute")
);
app.use("/api/order", authenticateController, require("./routes/orderRoute"));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist"));
});

const PORT = process.env.PORT || 8000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
  });
