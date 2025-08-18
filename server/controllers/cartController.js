const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const getCartProducts = async (req, res) => {
  try {
    const { email } = req.user;
    const cart = await Cart.findOne({ email }).populate({
      path: "items.productId",
      model: "Product",
      select:
        "title description price image images category rating stock availability discount tags createdAt",
    });

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    // Update cart items with latest product details
    const updatedItems = cart.items
      .map((item) => {
        if (item.productId) {
          // Update with latest product data
          return {
            ...item.toObject(),
            title: item.productId.title,
            description: item.productId.description,
            image:
              item.productId.images && item.productId.images.length > 0
                ? item.productId.images[0]
                : item.image || "",
            images: item.productId.images,
            category: item.productId.category,
            rating: item.productId.rating,
            stock: item.productId.stock,
            availability: item.productId.availability,
            discount: item.productId.discount,
            tags: item.productId.tags,
            latestPrice: item.productId.price,
            priceChanged: item.productId.price !== item.price / item.quantity,
            productId: item.productId._id,
            product: item.productId,
          };
        }
        return item;
      })
      .filter((item) => item.productId); // Remove items where product no longer exists

    // Calculate updated totals based on current prices
    let updatedTotalPrice = 0;
    const itemsWithUpdatedPrices = updatedItems.map((item) => {
      const currentPrice = item.latestPrice * item.quantity;
      updatedTotalPrice += currentPrice;
      return {
        ...item,
        currentPrice,
        originalPrice: item.price,
        priceDifference: currentPrice - item.price,
      };
    });

    // Update cart in database if prices changed
    if (Math.abs(updatedTotalPrice - cart.totalPrice) > 0.01) {
      cart.totalPrice = updatedTotalPrice;
      cart.items = cart.items.filter((item) =>
        updatedItems.some(
          (updated) => updated._id.toString() === item._id.toString()
        )
      );
      await cart.save();
    }

    res.json({
      status: "success",
      data: {
        cart: {
          ...cart.toObject(),
          items: itemsWithUpdatedPrices,
          totalPrice: updatedTotalPrice,
          originalTotalPrice: cart.totalPrice,
          priceUpdated: Math.abs(updatedTotalPrice - cart.totalPrice) > 0.01,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
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

    // Check stock availability
    if (product.stock && product.stock < quantity) {
      return res.status(400).json({
        status: "error",
        message: `Only ${product.stock} items available in stock`,
      });
    }

    let cart = await Cart.findOne({ email });
    if (cart) {
      let index = cart.items.findIndex((item) =>
        item.productId.equals(productId)
      );
      if (index !== -1) {
        const newQuantity = cart.items[index].quantity + quantity;
        if (product.stock && product.stock < newQuantity) {
          return res.status(400).json({
            status: "error",
            message: `Only ${product.stock} items available in stock`,
          });
        }
        cart.items[index].quantity = newQuantity;
        cart.items[index].price = product.price * newQuantity;
        // Update with latest product details
        cart.items[index].title = product.title;
        cart.items[index].image =
          product.images && product.images.length > 0 ? product.images[0] : "";
        cart.items[index].category = product.category;
      } else {
        const item = {
          productId: product._id,
          title: product.title,
          description: product.description,
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : "",
          images: product.images,
          category: product.category,
          rating: product.rating,
          tags: product.tags,
          quantity,
          price: product.price * quantity,
          addedAt: new Date(),
        };
        cart.items.push(item);
      }
      cart.totalPrice += product.price * quantity;
      cart.updatedAt = new Date();
    } else {
      cart = new Cart({
        email,
        items: [
          {
            productId: product._id,
            title: product.title,
            description: product.description,
            image:
              product.images && product.images.length > 0
                ? product.images[0]
                : "",
            images: product.images,
            category: product.category,
            rating: product.rating,
            tags: product.tags,
            quantity,
            price: product.price * quantity,
            addedAt: new Date(),
          },
        ],
        totalPrice: product.price * quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await cart.save();

    // Populate the cart before sending response
    const populatedCart = await Cart.findOne({ email }).populate({
      path: "items.productId",
      model: "Product",
      select:
        "title description price image images category rating stock availability discount tags",
    });

    res.json({
      status: "success",
      data: {
        cart: populatedCart,
        message: "Item added to cart successfully",
      },
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
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

const getCartStatistics = async (req, res) => {
  try {
    const { email } = req.user;
    const cart = await Cart.findOne({ email }).populate({
      path: "items.productId",
      model: "Product",
      select: "category rating discount tags createdAt",
    });

    if (!cart || cart.items.length === 0) {
      return res.json({
        status: "success",
        data: {
          statistics: {
            totalItems: 0,
            uniqueProducts: 0,
            categories: [],
            averageRating: 0,
            totalSavings: 0,
            mostAddedCategory: null,
          },
        },
      });
    }

    // Calculate statistics
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueProducts = cart.items.length;

    // Category breakdown
    const categoryMap = {};
    cart.items.forEach((item) => {
      if (item.productId && item.productId.category) {
        const categoryName = item.productId.category.name || "Uncategorized";
        categoryMap[categoryName] =
          (categoryMap[categoryName] || 0) + item.quantity;
      }
    });

    const categories = Object.entries(categoryMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalItems) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    // Calculate average rating
    const ratingsSum = cart.items.reduce((sum, item) => {
      return sum + (item.productId?.rating?.rate || 0);
    }, 0);
    const averageRating =
      uniqueProducts > 0 ? (ratingsSum / uniqueProducts).toFixed(1) : 0;

    // Calculate potential savings from discounts
    const totalSavings = cart.items.reduce((sum, item) => {
      const discount = item.productId?.discount || 0;
      const savings = (item.price * discount) / 100;
      return sum + savings;
    }, 0);

    const mostAddedCategory = categories.length > 0 ? categories[0] : null;

    res.json({
      status: "success",
      data: {
        statistics: {
          totalItems,
          uniqueProducts,
          categories,
          averageRating: parseFloat(averageRating),
          totalSavings: totalSavings.toFixed(2),
          mostAddedCategory,
          cartValue: cart.totalPrice.toFixed(2),
        },
      },
    });
  } catch (error) {
    console.error("Error getting cart statistics:", error);
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
  getCartStatistics,
};
