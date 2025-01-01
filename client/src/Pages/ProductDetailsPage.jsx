import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaMinus } from "react-icons/fa";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState({});
  const [quantity, setQuantity] = useState(1);
  const jwt = Cookies.get("jwt");

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/products/${id}`
        );
        setProductDetails(response.data.product);
      } catch (error) {
        console.error("Error fetching product details:", error.message);
      }
    };
    getProductDetails();
  }, [id]);

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  const clickBuyNow = () => {};

  const addToWishList = async () => {
    if (!jwt) {
      toast.error("Please login to add to cart");
    }
    const cartItem = {
      productId: productDetails._id,
      quantity: quantity,
    };
    await axios.post("http://localhost:8000/api/cart/add", cartItem, {
      withCredentials: true,
    });
    toast.success("Added to cart");
  };

  return (
    <>
      <div className="text-white p-6 flex items-center justify-center h-fit min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="product-page flex flex-col md:flex-row">
            <div className="product-image-container md:w-1/2">
              <img
                src={productDetails.image}
                alt={productDetails.title}
                className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
              />
            </div>
            <div className="product-details mt-6 md:mt-0 md:ml-6 md:w-1/2">
              <h1 className="text-2xl italic font-bold mb-2">
                {productDetails.title}
              </h1>
              <p className="text-2xl font-semibold text-green-400 mb-2">
                ${productDetails.price}
              </p>
              <p className="mb-4">
                Availability:{" "}
                <span className="text-green-500 font-semibold">In Stock</span>
              </p>
              <div className="flex items-center mb-4">
                <label htmlFor="quantity" className="mr-2">
                  Quantity:
                </label>
                <div className="flex items-center mt-3">
                  <button
                    className="text-white hover:text-white transition duration-300 ease-in-out mx-2 bg-zinc-400 p-1 rounded"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    <FaMinus />
                  </button>
                  <span className="text-white mx-2">{quantity}</span>
                  <button
                    className="text-white hover:text-white transition duration-300 ease-in-out mx-2 bg-zinc-400 p-1 rounded"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <button
                className="w-full py-2 mb-2 bg-blue-600 text-white rounded-lg hover:bg-white hover:text-black transition-colors duration-300"
                onClick={clickBuyNow}
              >
                <i className="fas fa-shopping-cart"></i> Buy Now
              </button>
              <button
                className="w-full py-2 mb-4 bg-pink-600 text-white rounded-lg hover:bg-white hover:text-black transition-colors duration-300"
                onClick={addToWishList}
              >
                &#10084; Add to cart
              </button>
              <div className="product-description">
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-300">{productDetails.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ProductDetailsPage;
