import React from "react";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "@/Pages/skeletons/ProductCardSkeleton";
import { Package, Search } from "lucide-react";
import InfiniteScroll from "./InfiniteScroll";

const ProductGrid = ({
  products = [],
  loading = false,
  hasMore = false,
  onLoadMore,
  error = null,
  className,
  isHomePage,
  hasInitialLoad = true, // Add this prop to know if initial load is complete
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4",
}) => {
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400 text-lg">Error: {error}</p>
      </div>
    );
  }

  // Show initial loading skeletons when first loading (no products yet and loading)
  if (products.length === 0 && loading) {
    return (
      <div className={`grid ${gridCols} gap-6 mb-8`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <ProductCardSkeleton key={`initial-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Show no products message only when not loading and no products found AND initial load is complete
  if (products.length === 0 && !loading && hasInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-zinc-400 text-lg mb-2">No products found</p>
        <p className="text-zinc-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <InfiniteScroll
      hasNextPage={hasMore}
      loadMore={onLoadMore}
      loading={loading}
      className={className}
      isHomePage={isHomePage}
      hasInitialLoad={hasInitialLoad}
    >
      <div className={`grid ${gridCols} gap-6 mb-8`}>
        {products.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}

        {/* Loading skeletons */}
        {loading &&
          Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))}
      </div>
    </InfiniteScroll>
  );
};

export default ProductGrid;
