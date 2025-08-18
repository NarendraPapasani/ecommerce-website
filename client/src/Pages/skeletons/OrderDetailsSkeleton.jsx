import React from "react";
import {
  FaBox,
  FaDollarSign,
  FaCalendarAlt,
  FaShoppingCart,
  FaMapMarkerAlt,
} from "react-icons/fa";

const OrderDetailsSkeleton = () => {
  return (
    <div className="text-white min-h-screen p-4 md:p-8 flex flex-col justify-center items-center animate-pulse">
      <h1 className="text-2xl md:text-3xl mb-4 md:mb-8 text-center text-white">
        Order Details
      </h1>
      <div className="w-full md:w-9/12 flex flex-col gap-4 md:gap-8">
        <div className="text-white bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg flex flex-col lg:flex-row">
          <div className="flex flex-col items-center lg:items-start flex-1 mb-4 lg:mb-0">
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 flex items-center text-gray-400">
              <FaMapMarkerAlt className="mr-2 text-blue-400" /> Shipping
              Address:
            </h3>
            <div className="bg-gray-700 h-4 w-32 rounded-md mb-2"></div>
            <div className="bg-gray-700 h-4 w-32 rounded-md mb-2"></div>
            <div className="bg-gray-700 h-4 w-32 rounded-md mb-2"></div>
            <div className="bg-gray-700 h-4 w-32 rounded-md mb-2"></div>
            <div className="bg-gray-700 h-4 w-32 rounded-md mb-2"></div>
            <div className="bg-gray-700 h-4 w-32 rounded-md mb-2"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 flex items-center text-gray-400">
              <FaBox className="mr-2 text-yellow-400" /> Order ID:
            </h2>
            <div className="bg-gray-700 h-4 w-48 rounded-md mb-2"></div>
            <p className="mb-2 flex items-center text-gray-400">
              <FaDollarSign className="mr-2 text-red-400" /> Status:
              <div className="bg-gray-700 h-4 w-24 rounded-md ml-2"></div>
            </p>
            <p className="mb-2 flex items-center text-gray-400">
              <FaDollarSign className="mr-2 text-red-400" /> Payment Method:
              <div className="bg-gray-700 h-4 w-24 rounded-md ml-2"></div>
            </p>
            <p className="mb-2 flex items-center text-gray-400">
              <FaDollarSign className="mr-2 text-red-400" /> Total Price:
              <div className="bg-gray-700 h-4 w-24 rounded-md ml-2"></div>
            </p>
            <p className="mb-4 flex items-center text-gray-400">
              <FaCalendarAlt className="mr-2 text-purple-400" /> Created At:
              <div className="bg-gray-700 h-4 w-32 rounded-md ml-2"></div>
            </p>
          </div>
        </div>
        <div className="p-4 md:p-6 rounded-lg shadow-lg bg-gray-800 mt-5 flex-1">
          <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 flex items-center text-gray-400">
            <FaShoppingCart className="mr-2 text-pink-400" /> Items:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 overflow-x-auto">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center bg-gray-700 p-4 rounded-lg shadow-md w-full"
              >
                <div className="w-24 h-24 bg-gray-600 rounded-md"></div>
                <div className="flex flex-col md:ml-4 mt-2 md:mt-0">
                  <span className="bg-gray-600 h-4 w-24 rounded-md mb-2"></span>
                  <span className="bg-gray-600 h-4 w-16 rounded-md mb-2"></span>
                  <span className="bg-gray-600 h-4 w-20 rounded-md mb-2"></span>
                  <span className="bg-gray-600 h-4 w-16 rounded-md"></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsSkeleton;
