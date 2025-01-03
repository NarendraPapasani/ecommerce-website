import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TotalPriceSkeleton = () => {
  return (
    <div className="sticky top-0 h-fit w-1/3 bg-gray-800 p-4 rounded">
      <div className="text-white flex flex-col items-end">
        <div className="block md:hidden flex justify-between w-full">
          <Skeleton width={100} height={24} />
          <Skeleton width={100} height={24} />
        </div>
        <div className="flex justify-between w-full">
          <Skeleton width={150} height={24} />
          <Skeleton width={100} height={24} />
        </div>
        <div className="flex justify-between w-full">
          <Skeleton width={150} height={24} />
          <Skeleton width={100} height={24} />
        </div>
        <div className="flex justify-between w-full">
          <Skeleton width={150} height={24} />
          <Skeleton width={100} height={24} />
        </div>
        <div className="flex justify-between w-full">
          <Skeleton width={150} height={24} />
          <Skeleton width={100} height={24} />
        </div>
        <Skeleton width={200} height={16} />
        <hr className="my-4 border-t-2 border-gray-300" />
        <div className="flex flex-row justify-end space-x-4 w-full">
          <Skeleton width={150} height={40} />
          <Skeleton width={150} height={40} />
        </div>
      </div>
    </div>
  );
};

export default TotalPriceSkeleton;
