import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCardSkeleton from "./ProductCardSkeleton";

const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-950 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10">
        {/* Hero Section Skeleton - Matching actual HeroSection */}
        <div className="relative overflow-hidden bg-zinc-950 py-16 md:py-24">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                {/* Welcome Badge */}
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5 bg-zinc-700" />
                  <Skeleton className="h-5 w-32 bg-zinc-700" />
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <Skeleton className="h-12 md:h-16 w-64 bg-zinc-700" />
                  <Skeleton className="h-12 md:h-16 w-48 bg-zinc-700" />
                  <Skeleton className="h-6 w-full bg-zinc-700" />
                  <Skeleton className="h-6 w-4/5 bg-zinc-700" />
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Skeleton className="h-12 w-32 bg-zinc-700" />
                  <Skeleton className="h-12 w-40 bg-zinc-700" />
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Skeleton className="h-2 w-2 rounded-full bg-zinc-700" />
                      <Skeleton className="h-4 w-28 bg-zinc-700" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Content - Quote Cards */}
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card
                    key={index}
                    className="border-zinc-800 bg-zinc-900/50 backdrop-blur"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full bg-zinc-700" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4 bg-zinc-700" />
                          <Skeleton className="h-4 w-full bg-zinc-700" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-zinc-800">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="text-center space-y-2">
                  <Skeleton className="h-8 w-16 mx-auto bg-zinc-700" />
                  <Skeleton className="h-4 w-20 mx-auto bg-zinc-700" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Products Section Skeleton */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-4">
                <Skeleton className="h-8 w-48 bg-zinc-700" />
                <Skeleton className="h-5 w-64 bg-zinc-700" />
              </div>
              <Skeleton className="h-10 w-40 bg-zinc-700" />
            </div>

            {/* Product Grid Skeleton - 6 products for featured */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>

            <div className="text-center py-8">
              <Skeleton className="h-5 w-24 mx-auto bg-zinc-700" />
            </div>
          </div>
        </section>

        {/* Featured Collections Carousel Section Skeleton */}
        <section className="py-16 bg-zinc-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 space-y-4">
              <Skeleton className="h-8 w-56 mx-auto bg-zinc-700" />
              <Skeleton className="h-5 w-80 mx-auto bg-zinc-700" />
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
                {/* Carousel Navigation Skeleton */}
                <Skeleton className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-zinc-600" />
                <Skeleton className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-zinc-600" />
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section Skeleton */}
        <section className="py-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-t border-zinc-800">
          <div className="container mx-auto px-4 text-center space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64 mx-auto bg-zinc-700" />
              <Skeleton className="h-5 w-96 mx-auto bg-zinc-700" />
              <Skeleton className="h-5 w-80 mx-auto bg-zinc-700" />
            </div>
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
