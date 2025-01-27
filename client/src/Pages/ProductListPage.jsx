import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "@/functions/ProductCard";
import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const category = query.get("category");
    fetchProductsByCategory(category);
  }, [location]);

  const fetchProductsByCategory = async (category) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://ecommerce-website-crkh.onrender.com/api/products?category=${category}`
      );
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
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
    navigate(`/product/${id}`);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="relative width-[95vw] m-10">
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
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            : filteredProducts.map((each) => (
                <ProductCard key={each._id} each={each} clickButt={clickButt} />
              ))}
        </ul>
      </div>
    </>
  );
};

export default ProductListPage;
