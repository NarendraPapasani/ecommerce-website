import { useState, useEffect } from "react";
import axios from "axios";
import OrderItem from "@/functions/OrderItem";
import { Input } from "@/components/ui/input";
import { Scrollbars } from "react-custom-scrollbars-2";
import Cookies from "js-cookie";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    getOrders();
  }, []);
  const jwt = Cookies.get("jwt1");

  const getOrders = async () => {
    try {
      const resp = await axios.get("/api/order/user", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      const sortedOrders = resp.data.data.orders[0].orders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
      setFilteredProducts(sortedOrders);
    } catch (error) {
      console.log(error);
    }
  };

  const searchFun = (e) => {
    const searchValue = e.target.value;
    const filtered = orders.filter((order) =>
      order._id.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="m-4 md:m-10 h-[90vh] overflow-y-hidden">
      <div className="flex flex-col md:flex-row justify-around items-center md:flex-wrap">
        <h1 className="text-white text-3xl">Orders</h1>
        <div className="relative width-[95vw] m-10 md:w-1/2 flex items-center justify-center">
          <Input
            type="search"
            placeholder="Search here..."
            className="w-full p-8 text-white text-xl bg-transparent"
            onChange={searchFun}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            width="24"
            height="24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col md:flex-row h-full pb-10 md:pb-32">
        <Scrollbars autoHide style={{ width: "100%", height: "100%" }}>
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <h2 className="text-white text-2xl">Orders are empty</h2>
              <a href="/shop" className="text-blue-500 text-xl mt-4">
                Shop Now
              </a>
            </div>
          ) : (
            <ul className="flex flex-col md:flex-col justify-center items-center md:flex-wrap">
              {filteredProducts.map((each) => (
                <OrderItem each={each} key={each._id} />
              ))}
            </ul>
          )}
        </Scrollbars>
      </div>
    </div>
  );
};

export default Orders;
