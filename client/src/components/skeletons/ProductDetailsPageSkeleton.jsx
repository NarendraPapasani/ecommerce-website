import React from "react";

const ProductDetailsPageSkeleton = () => {
  return (
    <div className="text-white p-6 flex items-center justify-center h-fit min-h-screen animate-pulse">
      <div className="">
        <div className="product-page flex flex-col md:flex-row">
          <div className="product-image-container md:w-1/2">
            <div className="h-64 md:h-96 bg-gray-700 rounded-lg"></div>
          </div>
          <div className="product-details mt-6 md:mt-0 md:ml-6 md:w-1/2">
            <div className="bg-gray-700 h-8 w-3/4 rounded-md mb-4"></div>
            <div className="bg-gray-700 h-6 w-1/2 rounded-md mb-4"></div>
            <div className="bg-gray-700 h-4 w-full rounded-md mb-2"></div>
            <div className="bg-gray-700 h-4 w-full rounded-md mb-2"></div>
            <div className="bg-gray-700 h-4 w-full rounded-md mb-2"></div>
            <div className="bg-gray-700 h-4 w-full rounded-md mb-2"></div>
            <div className="flex items-center mb-4">
              <div className="bg-gray-700 h-8 w-24 rounded-md mr-4"></div>
              <div className="flex items-center">
                <div className="bg-gray-700 h-8 w-8 rounded-md mx-2"></div>
                <div className="bg-gray-700 h-8 w-8 rounded-md mx-2"></div>
                <div className="bg-gray-700 h-8 w-8 rounded-md mx-2"></div>
              </div>
            </div>
            <div className="bg-gray-700 h-10 w-full rounded-md mb-4"></div>
            <div className="bg-gray-700 h-10 w-full rounded-md mb-4"></div>
            <div className="bg-gray-700 h-6 w-1/2 rounded-md mb-4"></div>
            <div className="bg-gray-700 h-4 w-full rounded-md mb-2"></div>
            <div className="bg-gray-700 h-4 w-full rounded-md mb-2"></div>
            <div className="bg-gray-700 h-4 w-full rounded-md mb-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPageSkeleton;
