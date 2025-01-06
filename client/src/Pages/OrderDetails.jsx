import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  FaBox,
  FaDollarSign,
  FaCalendarAlt,
  FaShoppingCart,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Scrollbars } from "react-custom-scrollbars-2";
import Cookies from "js-cookie";
import OrderDetailsSkeleton from "@/components/skeletons/OrderDetailsSkeleton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const OrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState({});
  const [address, setAddress] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const jwt = Cookies.get("jwt1");

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const getAddress = async (addressId) => {
    try {
      const response = await axios.get(
        `https://ecommerce-website-crkh.onrender.com/api/address/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );
      setAddress(response.data.address[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `https://ecommerce-website-crkh.onrender.com/api/order/${id}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );
      setOrderDetails(response.data.data.order);
      getAddress(response.data.data.order.addressId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    try {
      const resp = await axios.delete(
        `https://ecommerce-website-crkh.onrender.com/api/order/cancel/${id}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );
      console.log(resp);
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to cancel order");
    }
  };

  if (loading) {
    return <OrderDetailsSkeleton />;
  }

  return (
    <div className="text-white min-h-screen p-4 md:p-8 flex flex-col justify-center items-center">
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
            <p className="text-green-400">{address.fullName}</p>
            <p className="text-green-400">{address.mobileNumber}</p>
            <p className="text-green-400">{address.building}</p>
            <p className="text-green-400">
              {address.area},{address.landMark}
            </p>
            <p className="text-green-400">
              {address.town},{address.state},{address.pincode}
            </p>
            <p className="text-green-400">{address.country}</p>
          </div>
          <div className="flex-1">
            <h2 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 flex items-center text-gray-400">
              <FaBox className="mr-2 text-yellow-400" /> Order ID:{" "}
              <span className="text-green-400">{orderDetails._id}</span>
            </h2>
            <p className="mb-2 flex items-center text-gray-400">
              <FaDollarSign className="mr-2 text-red-400" /> Status:{" "}
              <span className="text-green-400">{orderDetails.orderStatus}</span>
            </p>
            <p className="mb-2 flex items-center text-gray-400">
              <FaDollarSign className="mr-2 text-red-400" /> Payment Method:{" "}
              <span className="text-green-400">
                {orderDetails.paymentMethod}
              </span>
            </p>
            <p className="mb-2 flex items-center text-gray-400">
              <FaDollarSign className="mr-2 text-red-400" /> Total Price:{" "}
              <span className="text-green-400">${orderDetails.totalPrice}</span>
            </p>
            <p className="mb-4 flex items-center text-gray-400">
              <FaCalendarAlt className="mr-2 text-purple-400" /> Created At:{" "}
              <span className="text-green-400">
                {new Date(orderDetails.createdAt).toLocaleString()}
              </span>
            </p>
            <button
              onClick={cancelOrder}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 md:mt-0 w-full md:w-auto"
            >
              Cancel Order
            </button>
          </div>
        </div>
        <div className="p-4 md:p-6 rounded-lg shadow-lg bg-gray-800 mt-5 flex-1">
          <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 flex items-center text-gray-400">
            <FaShoppingCart className="mr-2 text-pink-400" /> Items:
          </h3>
          <Scrollbars autoHide style={{ width: "100%", height: "50vh" }}>
            {orderDetails.cartItems && orderDetails.cartItems.length > 0 ? (
              <ul className="overflow-hidden">
                {orderDetails.cartItems.map((item) => (
                  <li
                    key={item.productId}
                    className="flex flex-col md:flex-row justify-between items-center mt-2 md:mt-5 mb-2 md:mb-5 bg-gray-600 p-2 md:p-4 rounded-lg shadow-md"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      width="50"
                      className="mr-0 md:mr-4 mb-2 md:mb-0"
                    />
                    <div className="flex flex-col justify-end items-end">
                      <p className="font-semibold text-green-400">
                        {item.title}
                      </p>
                      <p className="text-green-400">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-green-400">Price: ${item.price}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-400">No items in this order.</p>
            )}
          </Scrollbars>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OrderDetails;
