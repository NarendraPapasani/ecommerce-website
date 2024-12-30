import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductCard from "@/functions/ProductCard";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const category = query.get("category");
    fetchProductsByCategory(category);
  }, [location]);

  const fetchProductsByCategory = async (category) => {
    try {
      console.log(category);
      const response = await axios.get(
        `http://localhost:8000/api/products?category=${category}`
      );
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const searchFun = (e) => {
    const searchValue = e.target.value;
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const clickButt = (id) => {
    window.location.href = `/product/${id}`;
  };

  const addToCart = async (id) => {
    const cartItem = {
      productId: id,
      quantity: 1,
    };
    const resp = await axios.post(
      "http://localhost:8000/api/cart/add",
      cartItem,
      {
        withCredentials: true,
      }
    );
    console.log(resp);
    toast.success("Added to cart");
    window.location.href = "/cart";
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-1/2 m-10">
        <Input
          type="search"
          placeholder="Search here..."
          className="w-full p-8 text-white text-xl bg-transparent"
          onChange={searchFun}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          width="24"
          height="24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <ul className="flex flex-row flex-wrap justify-center">
        {filteredProducts.map((each) => (
          <ProductCard
            key={each._id}
            each={each}
            clickButt={clickButt}
            addToCart={addToCart}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProductListPage;
