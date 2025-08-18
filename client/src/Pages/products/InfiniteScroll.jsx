import React, { useEffect, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";

const InfiniteScroll = ({
  hasNextPage,
  loading,
  isHomePage,
  loadMore,
  children,
  hasInitialLoad = true, // Add this prop
  threshold = 100,
  className = "",
}) => {
  const loadingRef = useRef(null);
  const observerRef = useRef(null);

  const handleIntersection = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !loading) {
        loadMore();
      }
    },
    [hasNextPage, loading, loadMore]
  );

  useEffect(() => {
    const currentLoadingRef = loadingRef.current;

    if (currentLoadingRef) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      });

      observerRef.current.observe(currentLoadingRef);
    }

    return () => {
      if (observerRef.current && currentLoadingRef) {
        observerRef.current.unobserve(currentLoadingRef);
      }
    };
  }, [handleIntersection, threshold]);

  return (
    <div className={className}>
      {children}

      {/* Loading indicator for infinite scroll */}
      {hasNextPage && (
        <div ref={loadingRef} className="flex justify-center items-center py-8">
          {loading ? (
            <div className="flex items-center space-x-2 text-zinc-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading more products...</span>
            </div>
          ) : (
            <div className="text-zinc-500 text-sm">
              Scroll to load more products
            </div>
          )}
        </div>
      )}

      {/* End of results indicator */}
      {!hasNextPage && !loading && !isHomePage && hasInitialLoad && (
        <div className="text-center py-4 text-zinc-500">
          <p>You've reached the end of our product collection!</p>
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
