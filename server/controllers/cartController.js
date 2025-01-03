const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const getCartProducts = async (req, res) => {
  try {
    const { email } = req.user;
    const cart = await Cart.findOne({ email });
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }
    res.json({
      status: "success",
      data: {
        cart,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const { email } = req.user;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    let cart = await Cart.findOne({ email });
    if (cart) {
      let index = cart.items.findIndex((item) =>
        item.productId.equals(productId)
      );
      if (index !== -1) {
        cart.items[index].quantity += quantity;
        cart.items[index].price += product.price * quantity;
      } else {
        const item = {
          productId: product._id,
          title: product.title,
          image: product.image,
          quantity,
          price: product.price * quantity,
        };
        cart.items.push(item);
      }
      cart.totalPrice += product.price * quantity;
    } else {
      cart = new Cart({
        email,
        items: [
          {
            productId: product._id,
            title: product.title,
            image: product.image,
            quantity,
            price: product.price * quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
    }
    await cart.save();
    res.json({
      status: "success",
      data: {
        cart,
      },
    });
    console.log(cart);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
    console.log(error);
  }
};

const decrementFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;
    let cart = await Cart.findOne({ email });
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    let item = cart.items.find((item) => item.productId.toString() === id);
    if (!item) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found in cart" });
    }
    const unitPrice = item.price / item.quantity; // Calculate the unit price
    if (item.quantity > 1) {
      item.quantity -= 1;
      item.price -= unitPrice;
      cart.totalPrice -= unitPrice;
    } else {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== id
      );
      cart.totalPrice -= item.price;
    }
    await cart.save();
    res.json({ status: "success", data: { cart } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const incrementFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;
    let cart = await Cart.findOne({ email });
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    let item = cart.items.find((item) => item.productId.toString() === id);
    if (!item) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found in cart" });
    }
    const unitPrice = item.price / item.quantity; // Calculate the unit price
    item.quantity += 1;
    item.price += unitPrice;
    cart.totalPrice += unitPrice;
    await cart.save();
    res.json({ status: "success", data: { cart } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;
    let cart = await Cart.findOne({ email });
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    let item = cart.items.find((item) => item._id.toString() === id);
    if (!item) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found in cart" });
    }
    cart.items = cart.items.filter((item) => item._id.toString() !== id);
    cart.totalPrice -= item.price;
    await cart.save();
    res.json({ status: "success", data: { cart } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const { email } = req.user;
    const cart = await Cart.findOne({ email });
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    res.json({ status: "success", data: { cart } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getCartProducts,
  addToCart,
  decrementFromCart,
  incrementFromCart,
  removeFromCart,
  clearCart,
};
