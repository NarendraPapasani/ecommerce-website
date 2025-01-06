import React from "react";
import { FaBox, FaMapMarkerAlt, FaDollarSign, FaIdBadge } from "react-icons/fa";

const OrderItemSkeleton = () => {
  return (
    <li className="bg-gray-800 w-full md:w-3/4 mt-4 text-white p-4 rounded-lg shadow-lg mb-4 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
        <div className="flex-1">
          <div className="flex justify-center items-center space-x-2 mb-1">
            <FaBox className="text-yellow-500" />
            <span className="bg-gray-700 h-4 w-24 rounded-md"></span>
          </div>
          <p className="bg-gray-700 h-4 w-32 rounded-md"></p>
        </div>
        <div className="flex-1">
          <div className="flex justify-center items-center space-x-2 mb-1">
            <FaMapMarkerAlt className="text-green-500" />
            <span className="bg-gray-700 h-4 w-24 rounded-md"></span>
          </div>
          <p className="bg-gray-700 h-4 w-32 rounded-md"></p>
        </div>
        <div className="flex-1">
          <div className="flex justify-center items-center space-x-2 mb-1">
            <FaDollarSign className="text-blue-500" />
            <span className="bg-gray-700 h-4 w-24 rounded-md"></span>
          </div>
          <p className="bg-gray-700 h-4 w-32 rounded-md"></p>
        </div>
        <div className="flex-1">
          <div className="flex justify-center items-center space-x-2 mb-1">
            <FaIdBadge className="text-red-500" />
            <span className="bg-gray-700 h-4 w-24 rounded-md"></span>
          </div>
          <p className="bg-gray-700 h-4 w-32 rounded-md"></p>
        </div>
        <button className="bg-gray-700 h-10 w-24 rounded-md mt-2 md:mt-0"></button>
      </div>
      <hr className="border-gray-700" />
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
    </li>
  );
};

export default OrderItemSkeleton;
