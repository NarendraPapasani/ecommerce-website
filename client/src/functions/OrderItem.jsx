import { FaBox, FaMapMarkerAlt, FaDollarSign, FaIdBadge } from "react-icons/fa";

const OrderItem = (props) => {
  const { each } = props;
  const { addressId, cartItems, createdAt, orderStatus, totalPrice, _id } =
    each;

  return (
    <li className="bg-gray-800 w-3/4 mt-4 text-white p-4 rounded-lg shadow-lg mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <div className="flex justify-start items-center space-x-2 mb-1">
            <FaBox className="text-yellow-500" />
            <span>Order Placed:</span>
          </div>
          <p>{new Date(createdAt).toLocaleString()}</p>
        </div>
        <div>
          <div className="flex justify-start items-center space-x-2 mb-1">
            <FaMapMarkerAlt className="text-green-500" />
            <span>Shipping Address:</span>
          </div>
          <p>{addressId}</p>
        </div>
        <div>
          <div className="flex justify-start items-center space-x-2 mb-1">
            <FaDollarSign className="text-blue-500" />
            <span>Total Amount:</span>
          </div>
          <p>₹{totalPrice.toFixed(2)}</p>
        </div>
        <div>
          <div className="flex justify-start items-center space-x-2 mb-1">
            <FaIdBadge className="text-red-500" />
            <span>Order ID:</span>
          </div>
          <p>{_id}</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-2 md:mt-0">
          View Order
        </button>
      </div>
      <hr className="border-gray-700" />
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-1 gap-4 mt-4 overflow-x-auto">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row items-center bg-gray-700 p-4 rounded-lg shadow-md w-full"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="flex flex-col md:ml-4 mt-2 md:mt-0">
              <span className="text-lg font-semibold">{item.name}</span>
              <span className="text-sm text-gray-400">
                Status: {orderStatus}
              </span>
              <span className="text-lg font-bold">${item.price}</span>
              <span className="text-sm text-gray-400">
                Quantity: {item.quantity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </li>
  );
};

export default OrderItem;
