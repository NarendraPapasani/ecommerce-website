import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCardSkeleton = () => {
  return (
    <li className="shadow-lg rounded-lg overflow-hidden h-96 w-96 m-5 transform transition duration-500 hover:scale-105 hover:bg-white relative group border border-white">
      <Skeleton className="w-full h-48 p-10 rounded-md" />
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center bg-gray-800 bg-opacity-50 opacity-100 group-hover:opacity-100 transition-opacity duration-500 p-4 md:opacity-0 md:group-hover:opacity-100">
        <Skeleton className="w-24 h-10 mr-2" />
        <Skeleton className="w-24 h-10" />
      </div>
    </li>
  );
};

export default ProductCardSkeleton;
