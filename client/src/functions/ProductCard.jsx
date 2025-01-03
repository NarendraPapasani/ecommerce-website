import React from "react";
import "tailwindcss/tailwind.css"; // Make sure Tailwind CSS is properly set up in your project
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ProductCard = (props) => {
  const { each, clickButt } = props;
  const { _id, title, image } = each;
  const detailView = () => {
    clickButt(_id);
  };
  const handleAddCart = async () => {
    const jwt = Cookies.get("jwt1");
    if (!jwt) {
      toast.error("Please login to add to cart");
      return;
    }
    const cartItem = {
      productId: _id,
      quantity: 1,
    };
    const resp = await axios.post("/api/cart/add", cartItem, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      withCredentials: true,
    });
    if (resp.status === 200) {
      toast.success("Added to cart");
    }
  };
  return (
    <>
      <li className="shadow-lg rounded-lg overflow-hidden h-96 w-96 m-5 transform transition duration-500 hover:scale-105 hover:bg-white relative group border border-white">
        <img
          src={image}
          alt={title}
          className="w-full h-full p-10 rounded-md"
        />
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center bg-black bg-opacity-50 opacity-100 group-hover:opacity-100 transition-opacity duration-500 p-4 md:opacity-0 md:group-hover:opacity-100">
          <button
            className="bg-red-500 text-white px-4 py-2 mr-2 transform transition duration-500 hover:scale-110 hover:bg-white hover:text-red-500"
            onClick={handleAddCart}
          >
            Add to Cart
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 transform transition duration-500 hover:scale-110 hover:bg-white hover:text-green-500"
            onClick={detailView}
          >
            Click Here
          </button>
        </div>
      </li>
      <ToastContainer />
    </>
  );
};

export default ProductCard;
