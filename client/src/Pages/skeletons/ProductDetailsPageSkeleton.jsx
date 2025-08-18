import React from "react";

const ProductDetailsPageSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 mb-6 animate-pulse">
        <div className="h-4 w-16 bg-zinc-700 rounded"></div>
        <div className="h-4 w-4 bg-zinc-700 rounded-full"></div>
        <div className="h-4 w-24 bg-zinc-700 rounded"></div>
        <div className="h-4 w-4 bg-zinc-700 rounded-full"></div>
        <div className="h-4 w-32 bg-zinc-700 rounded"></div>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-zinc-800 rounded-xl animate-pulse"></div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-zinc-700 rounded-lg animate-pulse"
                style={{ animationDelay: `${index * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="space-y-6">
          {/* Title and Badges */}
          <div className="space-y-2">
            <div className="h-8 w-3/4 bg-zinc-700 rounded-lg animate-pulse"></div>
            <div className="flex space-x-2">
              <div className="h-6 w-20 bg-zinc-700 rounded-full animate-pulse"></div>
              <div
                className="h-6 w-24 bg-zinc-700 rounded-full animate-pulse"
                style={{ animationDelay: "0.1s" }}
              ></div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-5 w-5 bg-zinc-700 rounded-sm animate-pulse"
                  style={{ animationDelay: `${index * 0.05}s` }}
                ></div>
              ))}
            </div>
            <div className="h-4 w-20 bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-4 w-px bg-zinc-700"></div>
            <div className="h-4 w-24 bg-zinc-700 rounded animate-pulse"></div>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="h-8 w-32 bg-zinc-700 rounded-lg animate-pulse"></div>
            <div className="h-5 w-48 bg-zinc-700 rounded animate-pulse"></div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-zinc-700 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-zinc-700 rounded animate-pulse"></div>
          </div>

          {/* Color Options */}
          <div className="space-y-2">
            <div className="h-5 w-20 bg-zinc-700 rounded animate-pulse"></div>
            <div className="flex space-x-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-8 rounded-full bg-zinc-700 animate-pulse"
                  style={{ animationDelay: `${index * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Size Options */}
          <div className="space-y-2">
            <div className="h-5 w-16 bg-zinc-700 rounded animate-pulse"></div>
            <div className="flex space-x-2">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-9 w-12 rounded-md bg-zinc-700 animate-pulse"
                  style={{ animationDelay: `${index * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <div className="h-5 w-24 bg-zinc-700 rounded animate-pulse"></div>
            <div className="flex items-center border border-zinc-700 rounded-md">
              <div className="h-10 w-10 bg-zinc-700 rounded-l-md animate-pulse"></div>
              <div className="h-10 w-12 bg-zinc-800 animate-pulse"></div>
              <div className="h-10 w-10 bg-zinc-700 rounded-r-md animate-pulse"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-12 w-full bg-zinc-700 rounded-lg animate-pulse"></div>
            <div
              className="h-12 w-full bg-zinc-700 rounded-lg animate-pulse"
              style={{ animationDelay: "0.15s" }}
            ></div>
            <div
              className="h-12 w-12 bg-zinc-700 rounded-lg animate-pulse"
              style={{ animationDelay: "0.3s" }}
            ></div>
          </div>

          {/* Additional Info */}
          <div className="border-t border-zinc-700 pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-zinc-700 animate-pulse"></div>
              <div className="h-4 w-40 bg-zinc-700 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-zinc-700 animate-pulse"></div>
              <div className="h-4 w-48 bg-zinc-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 animate-pulse">
        <div className="h-7 w-32 bg-zinc-700 rounded-lg mb-6"></div>

        {/* Review Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Overall Rating */}
          <div className="bg-zinc-800/50 rounded-xl p-6">
            <div className="h-6 w-40 bg-zinc-700 rounded mb-4"></div>
            <div className="flex items-end gap-2 mb-2">
              <div className="h-12 w-16 bg-zinc-700 rounded"></div>
              <div className="h-6 w-24 bg-zinc-700 rounded"></div>
            </div>
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-5 w-5 bg-zinc-700 rounded-sm"
                  style={{ animationDelay: `${index * 0.05}s` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-zinc-800/50 rounded-xl p-6">
            <div className="h-6 w-40 bg-zinc-700 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-zinc-700 rounded"></div>
                  <div className="h-3 flex-grow bg-zinc-700 rounded-full"></div>
                  <div className="h-4 w-8 bg-zinc-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Write Review CTA */}
          <div className="bg-zinc-800/50 rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="h-12 w-12 bg-zinc-700 rounded-full mb-3"></div>
            <div className="h-5 w-48 bg-zinc-700 rounded mb-4 mx-auto"></div>
            <div className="h-10 w-40 bg-zinc-700 rounded-lg"></div>
          </div>
        </div>

        {/* Review List */}
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="border-b border-zinc-800 pb-6"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Review Header */}
              <div className="flex justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-zinc-700 rounded-full"></div>
                  <div>
                    <div className="h-5 w-32 bg-zinc-700 rounded mb-1"></div>
                    <div className="h-4 w-24 bg-zinc-700 rounded"></div>
                  </div>
                </div>
                <div className="h-8 w-20 bg-zinc-700 rounded-lg"></div>
              </div>

              {/* Review Stars */}
              <div className="flex mb-3">
                {[...Array(5)].map((_, starIndex) => (
                  <div
                    key={starIndex}
                    className="h-4 w-4 bg-zinc-700 rounded-sm mr-1"
                  ></div>
                ))}
              </div>

              {/* Review Content */}
              <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-zinc-700 rounded"></div>
                <div className="h-4 w-full bg-zinc-700 rounded"></div>
                <div className="h-4 w-2/3 bg-zinc-700 rounded"></div>
              </div>

              {/* Review Images */}
              {index === 0 && (
                <div className="flex gap-2 mb-4">
                  {[...Array(2)].map((_, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="h-16 w-16 bg-zinc-700 rounded"
                    ></div>
                  ))}
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="h-5 w-5 bg-zinc-700 rounded"></div>
                  <div className="h-4 w-8 bg-zinc-700 rounded"></div>
                </div>
                <div className="h-5 w-20 bg-zinc-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12 animate-pulse">
        <div className="h-7 w-48 bg-zinc-700 rounded-lg mb-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-zinc-800/50 rounded-xl overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-square bg-zinc-700"></div>
              <div className="p-4 space-y-2">
                <div className="h-5 w-3/4 bg-zinc-700 rounded"></div>
                <div className="h-4 w-1/2 bg-zinc-700 rounded"></div>
                <div className="h-6 w-2/3 bg-zinc-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPageSkeleton;
