import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CartSkeletons = ({ count }) => {
  return (
    <div className="cart-skeletons">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="border border-white p-4 mb-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-100"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0 cursor-pointer">
              <Skeleton width={96} height={96} className="rounded w-" />
            </div>
            <div className="flex flex-col items-center mb-4 md:mb-0">
              <Skeleton width={200} height={24} />
              <div className="flex items-center mt-3">
                <Skeleton width={32} height={32} className="mx-2" />
                <Skeleton width={32} height={32} className="mx-2" />
                <Skeleton width={32} height={32} className="mx-2" />
              </div>
              <div className="flex items-center mt-2">
                <Skeleton width={100} height={16} className="mr-2" />
                <Skeleton width={100} height={16} />
              </div>
            </div>
            <div className="flex flex-col items-center mb-4 md:mb-0">
              <div className="flex items-center">
                <Skeleton width={50} height={24} className="mr-2" />
                <Skeleton width={50} height={16} className="line-through" />
              </div>
              <Skeleton width={24} height={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartSkeletons;
