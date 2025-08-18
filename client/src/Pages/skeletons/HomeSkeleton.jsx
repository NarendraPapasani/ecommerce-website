import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCardSkeleton from "./ProductCardSkeleton";

const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-950 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10">
        {/* Hero Section Skeleton */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <Skeleton className="h-12 w-96 mx-auto bg-zinc-700 mb-4" />
            <Skeleton className="h-6 w-64 mx-auto bg-zinc-700 mb-8" />
            <div className="flex gap-4 justify-center">
              <Skeleton className="h-12 w-32 bg-zinc-700" />
              <Skeleton className="h-12 w-32 bg-zinc-700" />
            </div>
          </div>
        </section>

        {/* Carousel Section Skeleton */}
        <section className="py-16 bg-zinc-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Skeleton className="h-8 w-64 mx-auto bg-zinc-700 mb-4" />
              <Skeleton className="h-5 w-48 mx-auto bg-zinc-700" />
            </div>

            {/* Carousel Skeleton */}
            <div className="w-full max-w-6xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl">
                <Skeleton className="w-full h-64 md:h-96 bg-zinc-700" />
                <div className="absolute bottom-6 left-6 space-y-2">
                  <Skeleton className="h-8 w-48 bg-zinc-600" />
                  <Skeleton className="h-5 w-32 bg-zinc-600" />
                  <Skeleton className="h-10 w-24 bg-zinc-600" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section Skeleton */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <Skeleton className="h-8 w-48 bg-zinc-700 mb-4" />
                <Skeleton className="h-5 w-64 bg-zinc-700" />
              </div>
              <Skeleton className="h-10 w-32 bg-zinc-700" />
            </div>

            {/* Product Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>

            <div className="text-center py-8">
              <Skeleton className="h-5 w-24 mx-auto bg-zinc-700" />
            </div>
          </div>
        </section>

        {/* Newsletter Section Skeleton */}
        <section className="py-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-t border-zinc-800">
          <div className="container mx-auto px-4 text-center">
            <Skeleton className="h-8 w-64 mx-auto bg-zinc-700 mb-4" />
            <Skeleton className="h-5 w-96 mx-auto bg-zinc-700 mb-8" />
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Skeleton className="h-12 flex-1 bg-zinc-700" />
              <Skeleton className="h-12 w-32 bg-zinc-700" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeSkeleton;
