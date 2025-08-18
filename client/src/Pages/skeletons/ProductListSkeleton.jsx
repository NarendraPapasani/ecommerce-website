import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCardSkeleton from "./ProductCardSkeleton";

const ProductListSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-950 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-zinc-400 mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12 bg-zinc-700" />
              <span className="mx-2">/</span>
              <Skeleton className="h-4 w-16 bg-zinc-700" />
              <span className="mx-2">/</span>
              <Skeleton className="h-4 w-20 bg-zinc-700" />
            </div>
          </nav>

          <Skeleton className="h-8 w-64 bg-zinc-700 mb-2" />
          <Skeleton className="h-5 w-48 bg-zinc-700" />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-zinc-900 p-6 rounded-lg space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 bg-zinc-700" />
                <Skeleton className="h-10 w-full bg-zinc-700" />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-zinc-700" />
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 bg-zinc-700" />
                      <Skeleton className="h-4 w-24 bg-zinc-700" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-zinc-700" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-10 w-full bg-zinc-700" />
                  <Skeleton className="h-10 w-full bg-zinc-700" />
                </div>
                <Skeleton className="h-4 w-full bg-zinc-700" />
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 bg-zinc-700" />
                <Skeleton className="h-10 w-full bg-zinc-700" />
              </div>

              {/* Results count */}
              <div className="pt-4">
                <Skeleton className="h-4 w-32 bg-zinc-700" />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <Skeleton className="h-10 w-32 mx-auto bg-zinc-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListSkeleton;
