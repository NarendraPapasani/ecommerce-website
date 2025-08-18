import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { useInfiniteProducts } from "@/Pages/products/useInfiniteProducts";
import ProductFilters from "@/Pages/products/ProductFilters";
import ProductGrid from "@/Pages/products/ProductGrid";
import Navbar from "@/Pages/home/Navbar";

const ProductListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get category from URL params (/products/clothes) or default to "all"
  const currentCategory = params.category || "all";

  // Initialize filters from URL parameters
  const getFiltersFromURL = () => ({
    search: searchParams.get("search") || "",
    category: currentCategory,
    minPrice: parseInt(searchParams.get("minPrice")) || 0,
    maxPrice: parseInt(searchParams.get("maxPrice")) || 100000, // Fixed default
    sortBy: searchParams.get("sortBy") || "creationAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
  });

  const [filters, setFilters] = useState(getFiltersFromURL);

  const {
    products,
    loading,
    error,
    hasNextPage,
    totalProducts,
    loadMore,
    searchProducts,
    updateFilters,
  } = useInfiniteProducts(filters);

  // Update filters when URL changes
  useEffect(() => {
    const newFilters = getFiltersFromURL();
    setFilters(newFilters);
    updateFilters(newFilters);
  }, [location, params.category]);

  // Update URL when filters change
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();

    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.minPrice > 0)
      params.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice < 100000)
      params.set("maxPrice", newFilters.maxPrice.toString());
    if (newFilters.sortBy !== "creationAt")
      params.set("sortBy", newFilters.sortBy);
    if (newFilters.sortOrder !== "desc")
      params.set("sortOrder", newFilters.sortOrder);

    const queryString = params.toString();
    const newPath =
      newFilters.category === "all"
        ? "/products"
        : `/products/${newFilters.category}`;

    navigate(`${newPath}${queryString ? `?${queryString}` : ""}`, {
      replace: true,
    });
  };

  const handleFiltersChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    updateFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const handleSearch = (searchQuery) => {
    const updatedFilters = { ...filters, search: searchQuery };
    setFilters(updatedFilters);
    updateFilters(updatedFilters);
    updateURL(updatedFilters);
  };

  const getCategoryDisplayName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-zinc-400 mb-4 font-['Montserrat']">
            <span
              className="hover:text-white cursor-pointer"
              onClick={() => navigate("/")}
            >
              Home
            </span>
            <span className="mx-2">/</span>
            <span
              className="hover:text-white cursor-pointer"
              onClick={() => navigate("/products")}
            >
              Products
            </span>
            {currentCategory && currentCategory !== "all" && (
              <>
                <span className="mx-2">/</span>
                <span className="text-blue-400">
                  {getCategoryDisplayName(currentCategory)}
                </span>
              </>
            )}
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-['Montserrat']">
            {currentCategory && currentCategory !== "all"
              ? `${getCategoryDisplayName(currentCategory)} Products`
              : "Products"}
          </h1>
          <p className="text-zinc-400 font-['Montserrat']">
            {currentCategory && currentCategory !== "all"
              ? `Explore our ${currentCategory} collection`
              : "Discover our complete product range"}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
              totalProducts={totalProducts}
              className="sticky top-24 bg-zinc-900 p-6 rounded-lg"
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
                <p className="text-red-400">Error: {error}</p>
              </div>
            )}

            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              hasMore={hasNextPage}
              onLoadMore={loadMore}
              isHomePage={false}
              className="min-h-96"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
