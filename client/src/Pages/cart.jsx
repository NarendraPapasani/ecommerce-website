import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CartItem from "@/functions/CartItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Button } from "@/components/ui/button";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const Cart = () => {
  const [cartList, setCartList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const discountPercentage = 2;

  useEffect(() => {
    getCartItems();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowDetails(true);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getCartItems = async () => {
    try {
      const jwt = Cookies.get("jwt");
      const resp = await axios.get(
        "https://ecommerce-website-crkh.onrender.com/api/cart/all",
        {
          withCredentials: true,
        }
      );
      const respData = resp.data.data.cart;
      setCartList(respData.items);
      calculateTotalPrice(respData.totalPrice);
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const calculateTotalPrice = (totalPrice) => {
    setOriginalPrice(totalPrice.toFixed(2));
    const discountedTotal = totalPrice * (1 - discountPercentage / 100);
    setTotalPrice(discountedTotal.toFixed(2));
  };

  const increaseQuantity = async (_id) => {
    try {
      const resp = await axios.put(
        `https://ecommerce-website-crkh.onrender.com/api/cart/increment/${_id}`,
        {},
        {
          withCredentials: true,
        }
      );
      getCartItems();
    } catch (error) {
      console.log(error);
    }
  };

  const decreaseQuantity = async (_id) => {
    try {
      const resp = await axios.put(
        `https://ecommerce-website-crkh.onrender.com/api/cart/decrement/${_id}`,
        {},
        {
          withCredentials: true,
        }
      );

      getCartItems();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (_id) => {
    try {
      const resp = await axios.delete(
        `https://ecommerce-website-crkh.onrender.com/api/cart/remove/${_id}`,
        {
          withCredentials: true,
        }
      );
      toast("Item deleted", {
        type: "info",
        style: { backgroundColor: "orange", color: "white" },
      });
      getCartItems();
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const handleShopNow = () => {
    window.location.href = "/products/all";
  };

  return (
    <div className="m-4 md:m-10 h-[90vh] overflow-y-hidden">
      <h1 className="text-2xl md:text-4xl text-white mb-5">Shopping Cart</h1>
      {cartList.length === 0 ? (
        <div className="text-center text-white">
          <p className="text-lg md:text-xl mb-4">No items in the cart</p>
          <button
            onClick={handleShopNow}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row h-full pb-10 md:pb-32">
          <Scrollbars autoHide style={{ width: "100%", height: "100%" }}>
            <ul className="overflow-hidden">
              {cartList.map((each) => (
                <CartItem
                  each={each}
                  key={each._id}
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                  deleteItem={deleteItem}
                />
              ))}
            </ul>
          </Scrollbars>
          <div className="flex-shrink-0 mb-16 md:ml-4 mt-4 md:mt-0  md:w-1/3">
            <div className="sticky top-0 bg-gray-800 p-4 rounded">
              <div className="text-white flex flex-col items-end">
                <div className="block md:hidden flex justify-between w-full">
                  <span className="text-lg md:text-xl text-green-500 font-bold ml-2">
                    ${totalPrice}
                  </span>
                  <button
                    className="flex items-center mb-4"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? (
                      <FaArrowDown className="mr-2" />
                    ) : (
                      <FaArrowUp className="mr-2" />
                    )}

                    <span className="text-lg md:text-xl">Show Details</span>
                  </button>
                </div>
                {(showDetails || window.innerWidth >= 768) && (
                  <>
                    <div className="flex justify-between w-full">
                      <p className="text-lg md:text-xl">Original Price:</p>
                      <p className="text-lg md:text-xl line-through text-red-500">
                        ${originalPrice}
                      </p>
                    </div>
                    <div className="flex justify-between w-full">
                      <p className="text-lg md:text-xl">
                        Discount ({discountPercentage}%):
                      </p>
                      <p className="text-lg md:text-xl text-yellow-500">
                        -$
                        {((originalPrice * discountPercentage) / 100).toFixed(
                          2
                        )}
                      </p>
                    </div>
                    <div className="flex justify-between w-full">
                      <p className="text-lg md:text-xl">Total Price:</p>
                      <p className="text-lg md:text-xl text-green-500 font-bold">
                        ${totalPrice}
                      </p>
                    </div>
                    <div className="flex justify-between w-full">
                      <p className="text-lg md:text-xl">You Save:</p>
                      <p className="text-lg md:text-xl text-blue-500">
                        ${(originalPrice - totalPrice).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-400">
                      Including {discountPercentage}% discount
                    </p>
                    <hr className="my-4 border-t-2 border-gray-300" />
                  </>
                )}
                <div className="flex flex-row justify-end space-x-4 w-full">
                  <Button
                    className="text-white py-1 px-4 rounded border hover:bg-slate-800 border-white w-1/2"
                    onClick={handleShopNow}
                    style={{ height: "auto" }}
                  >
                    Continue Shopping
                  </Button>
                  <button
                    className="bg-green-500 border text-white py-1 px-4 md:py-2 rounded hover:bg-green-700 w-1/2"
                    style={{ height: "auto" }}
                    onClick={() => (window.location.href = "/checkout")}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Cart;
