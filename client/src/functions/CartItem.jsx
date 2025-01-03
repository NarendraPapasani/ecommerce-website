import {
  FaTrashAlt,
  FaPlus,
  FaMinus,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

const CartItem = (props) => {
  const { each, loading1 } = props;
  const { image, price, productId, quantity, title, _id } = each;
  const navigate = useNavigate();

  const discountedPrice = (price * 1.15).toFixed(2);
  const roundedPrice = price.toFixed(2);

  const imageClick = () => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="border border-white p-4 mb-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-100">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div
          className="flex items-center mb-4 md:mb-0 cursor-pointer"
          onClick={imageClick}
        >
          <img src={image} alt="product" className="w-24 h-24 rounded" />
        </div>
        <div className="flex flex-col items-center mb-4 md:mb-0">
          <h1 className="text-base font-semibold text-white break-words w-96">
            {title}
          </h1>
          <div className="flex items-center mt-3">
            <button
              className="text-white hover:text-white transition duration-300 ease-in-out mx-2 bg-zinc-400 p-1 rounded"
              onClick={() => props.decreaseQuantity(productId)}
            >
              <FaMinus />
            </button>
            {loading1 ? (
              <RotatingLines
                visible={true}
                height="20"
                width="20"
                color="blue"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              <span className="text-white mx-2">{quantity}</span>
            )}

            <button
              className="text-white hover:text-white transition duration-300 ease-in-out mx-2 bg-zinc-400 p-1 rounded"
              onClick={() => props.increaseQuantity(productId)}
            >
              <FaPlus />
            </button>
          </div>
          <div className="flex items-center mt-2">
            <div className="flex items-center mt-2 mr-2">
              <FaTruck className="text-blue-400 mr-1" />
              <span className="text-blue-400 text-sm">Free Delivery</span>
            </div>
            <div className="flex items-center mt-2">
              <FaCheckCircle className="text-green-400 mr-1" />
              <span className="text-green-400 text-sm">Quality Assured</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mb-4 md:mb-0">
          <div className="flex items-center">
            <p className="text-xl font-normal mr-2 text-green-400">
              ${roundedPrice}
            </p>
            <p className="text-sm font-light text-gray-300 line-through mr-2">
              ${discountedPrice}
            </p>
          </div>
          <button
            className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
            onClick={() => props.deleteItem(_id)}
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
