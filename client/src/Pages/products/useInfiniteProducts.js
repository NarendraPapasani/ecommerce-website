import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

export const useInfiniteProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    minPrice: 0,
    maxPrice: 100, // Increased to match backend
    sortBy: "creationAt",
    sortOrder: "desc",
    limit: 12,
    ...initialFilters,
  });

  const abortControllerRef = useRef(null);

  const fetchProducts = useCallback(
    async (page = 1, resetProducts = false) => {
      try {
        // Cancel previous request only if it's not the same request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);

        // Determine the API endpoint based on category
        let apiUrl;
        if (filters.category && filters.category !== "all") {
          apiUrl = `${
            import.meta.env.VITE_API_BASE_URL
          }/api/products/category/${filters.category}`;
        } else {
          apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/products/all`;
        }

        const params = new URLSearchParams({
          page: page.toString(),
          limit: filters.limit.toString(),
          search: filters.search,
          minPrice: filters.minPrice.toString(),
          maxPrice: filters.maxPrice.toString(),
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        });

        const fullUrl = `${apiUrl}?${params}`;

        const response = await axios.get(fullUrl, {
          signal: abortControllerRef.current.signal,
        });

        const newProducts = response.data.products || [];
        const pagination = response.data.pagination || {};

        if (resetProducts || page === 1) {
          setProducts(newProducts);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
        }

        setHasNextPage(pagination.hasNextPage || false);
        setCurrentPage(pagination.currentPage || 1);
        setTotalProducts(pagination.totalProducts || 0);
      } catch (err) {
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          setError("Failed to fetch products");
          console.error("Error fetching products:", err);
        }
        // Don't log canceled errors as they are expected behavior
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasNextPage) {
      fetchProducts(currentPage + 1, false);
    }
  }, [fetchProducts, loading, hasNextPage, currentPage]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      category: "all",
      minPrice: 0,
      maxPrice: 100, // Match backend default
      sortBy: "creationAt",
      sortOrder: "desc",
      limit: 12,
    });
    setCurrentPage(1);
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(1, true);
  }, [fetchProducts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    products,
    loading,
    error,
    hasNextPage,
    currentPage,
    totalProducts,
    filters,
    loadMore,
    updateFilters,
    resetFilters,
    refetch: () => fetchProducts(1, true),
  };
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/categories`
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};

export const usePriceRange = () => {
  const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 1000 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/price-range`
        );
        setPriceRange(response.data.priceRange);
      } catch (error) {
        console.error("Error fetching price range:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceRange();
  }, []);

  return { priceRange, loading };
};
