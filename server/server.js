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
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/products", require("./routes/productRoute"));
app.use("/api/cart", authenticateController, require("./routes/cartRoute"));
app.use(
  "/api/address",
  authenticateController,
  require("./routes/addressRoute")
);
app.use("/api/order", authenticateController, require("./routes/orderRoute"));

app.get("/", (req, res) => {
  res.send("Server is running");
  res.sendFile(path.resolve(__dirname, "../client/index.html"));
  console.log(path.resolve(__dirname, "../client/dist/index.html"));
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
