import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  FaAddressCard,
  FaTag,
  FaDollarSign,
  FaMinus,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaMobileAlt,
} from "react-icons/fa";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ComboboxDemo } from "@/components/comBox";
import { useNavigate } from "react-router-dom";

const CheckOut = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState({});
  const [cartTotal, setCartTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAddressFormVisible, setIsAddressFormVisible] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPrivacyPolicyChecked, setIsPrivacyPolicyChecked] = useState(false);
  const navigate = useNavigate();

  const toggleAddressForm = () => {
    setIsAddressFormVisible(!isAddressFormVisible);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce-website-crkh.onrender.com/api/address/all",
          {
            withCredentials: true,
          }
        );
        setAddresses(response.data.address.addresses);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    const fetchCartTotal = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce-website-crkh.onrender.com/api/cart/all",
          {
            withCredentials: true,
          }
        );
        setCart(response.data.data.cart);
        setCartTotal(response.data.data.cart.totalPrice);
      } catch (error) {
        console.error("Error fetching cart total:", error);
      }
    };

    fetchAddresses();
    fetchCartTotal();
  }, []);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsAddressFormVisible(true);
  };

  const handleApplyCoupon = () => {
    if (couponCode === "FIRST10") {
      setDiscount(cartTotal * 0.1);
      setCouponMessage("Coupon applied successfully!");
    } else {
      setDiscount(0);
      setCouponMessage("Invalid coupon code.");
    }
  };

  const addNewAddress = () => {
    navigate("/address");
  };

  const handleProceed = async () => {
    try {
      const data = {
        cartItems: cart.items,
        addressId: selectedAddress._id,
        totalPrice: totalAfterDiscount,
        paymentMethod,
      };
      const resp = await axios.post(
        "https://ecommerce-website-crkh.onrender.com/api/order/add",
        data,
        {
          withCredentials: true,
        }
      );
      if (resp.status === 200) {
        const response = await axios.delete(
          "https://ecommerce-website-crkh.onrender.com/api/cart/clear",
          { withCredentials: true }
        );
        navigate("/order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const totalAfterDiscount = cartTotal - discount - cartTotal * 0.02;

  const isProceedDisabled =
    !selectedAddress || !paymentMethod || !isPrivacyPolicyChecked;

  return (
    <div className="flex flex-col md:flex-row p-8">
      <div className="md:w-2/3 p-4">
        <div className="flex justify-between items-center mb-4">
          <Label htmlFor="addressDropdown" className="text-white">
            <FaAddressCard className="inline-block mr-2" /> Select Address
          </Label>
        </div>
        <div className="bg-gray-800 p-4 rounded-md">
          {addresses.length !== 0 ? (
            <select
              id="addressDropdown"
              className="w-full p-2 border border-gray-300 rounded-md text-white bg-black"
              placeholder="select an address"
              onChange={(e) => handleAddressSelect(addresses[e.target.value])}
            >
              <option value="">Select an address</option>
              {addresses.map((address, index) => (
                <option key={address.id} value={index}>
                  {address.fullName} - {address.town}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-white text-center">
              <h1 className="text-white text-2xl">No address found </h1>
              <button
                onClick={addNewAddress}
                className="text-blue-400 hover:underline"
              >
                Add new address
              </button>
            </div>
          )}
        </div>
        {isAddressFormVisible && selectedAddress && (
          <div className="mt-4 bg-gray-700 p-4 rounded-md">
            <div className="text-white mb-4 flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Your Address:</h1>
              <button onClick={toggleFormVisibility} className="text-white">
                {isFormVisible ? <FaMinus /> : <FaPlus />}
              </button>
            </div>
            {isFormVisible ? (
              <>
                {[
                  {
                    label: "Full Name",
                    name: "fullName",
                    type: "text",
                    placeholder: "Full Name",
                  },
                  {
                    label: "Mobile Number",
                    name: "mobileNumber",
                    type: "text",
                    placeholder: "Mobile Number",
                  },
                  {
                    label: "Area",
                    name: "area",
                    type: "text",
                    placeholder: "Area",
                  },
                  {
                    label: "Town",
                    name: "town",
                    type: "text",
                    placeholder: "Town",
                  },
                  {
                    label: "State",
                    name: "state",
                    type: "text",
                    placeholder: "State",
                  },
                  {
                    label: "Pincode",
                    name: "pincode",
                    type: "text",
                    placeholder: "Pincode",
                  },
                  {
                    label: "Country",
                    name: "country",
                    type: "text",
                    placeholder: "Country",
                  },
                  {
                    label: "LandMark",
                    name: "LandMark",
                    type: "text",
                    placeholder: "LandMark",
                  },
                  {
                    label: "Door No:",
                    name: "building",
                    type: "text",
                    placeholder: "Door No",
                  },
                ].map((field) => (
                  <div
                    key={field.name}
                    className="grid grid-cols-4 justify-start items-center gap-2 mb-4"
                  >
                    <Label
                      htmlFor={field.name}
                      className="text-right text-white"
                    >
                      {field.label}:
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={selectedAddress ? selectedAddress[field.name] : ""}
                      placeholder={field.placeholder}
                      className="col-span-3 border border-gray-300 rounded-md p-2 text-white bg-black"
                    />
                  </div>
                ))}
                <Button className="mt-4" style={{ fontFamily: "sans-serif" }}>
                  Save
                </Button>
              </>
            ) : (
              <div className="text-white flex flex-col justify-start items-start">
                <h1>Delivering to {selectedAddress.fullName}</h1>
                <p>
                  {selectedAddress.building}, {selectedAddress.area},{" "}
                  {selectedAddress.town}, {selectedAddress.state},{" "}
                </p>
                {selectedAddress.pincode}, {selectedAddress.country}
              </div>
            )}
          </div>
        )}
        <hr className="border-gray-600 my-4" />
        <div className="mt-4 bg-gray-700 p-4 rounded-md">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Payment Options
          </h2>
          <div className="flex flex-col gap-4">
            <div
              className={`p-4 rounded-md cursor-pointer ${
                paymentMethod === "cod" ? "bg-green-700" : "bg-gray-800"
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <div className="flex items-center">
                <FaMoneyBillWave className="text-white mr-2" />
                <span className="text-white">Cash on Delivery</span>
              </div>
            </div>
            <div
              className={`p-4 rounded-md cursor-pointer ${
                paymentMethod === "upi" ? "bg-green-700" : "bg-gray-800"
              }`}
              onClick={() => setPaymentMethod("upi")}
            >
              <div className="flex items-center">
                <FaMobileAlt className="text-white mr-2" />
                <span className="text-white">UPI Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:w-1/3 p-4 mt-0 md:mt-5">
        <div className="mb-4 flex justify-between items-center">
          <Label className="text-white">
            <FaDollarSign className="inline-block mr-2" /> Cart Total
          </Label>
          <div className="text-green-400">${cartTotal.toFixed(2)}</div>
        </div>
        <hr className="border-gray-600 my-2" />
        <div className="mb-4 flex justify-between items-center">
          <Label className="text-white">
            <FaTag className="inline-block mr-2" /> Discount (2%)
          </Label>
          <div className="text-red-400">-${(cartTotal * 0.02).toFixed(2)}</div>
        </div>
        <hr className="border-gray-600 my-2" />
        <div className="mb-4 flex justify-between items-center">
          <Label className="text-white">
            <FaDollarSign className="inline-block mr-2" /> Total After Discount
          </Label>
          <div className="text-yellow-400">
            ${totalAfterDiscount.toFixed(2)}
          </div>
        </div>
        <hr className="border-gray-600 my-2" />
        <div className="items-center mb-4 flex justify-end">
          <input
            type="checkbox"
            id="privacyPolicy"
            className="mr-2"
            checked={isPrivacyPolicyChecked}
            onChange={(e) => setIsPrivacyPolicyChecked(e.target.checked)}
          />
          <Label htmlFor="privacyPolicy" className="text-white">
            I agree to the Privacy Policy
          </Label>
        </div>
        <div className="mb-4 flex justify-between items-center">
          <Label htmlFor="couponCode" className="text-white">
            <FaTag className="inline-block mr-2" /> Coupon Code
          </Label>
          <Input
            id="couponCode"
            name="couponCode"
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter your Coupon Code here"
            className="border border-gray-300 rounded-md p-2 ml-3 text-white bg-black"
          />
        </div>
        <div className="flex justify-end">
          {couponMessage && (
            <div
              className={`flex items-center ${
                discount > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {discount > 0 ? <FaCheckCircle /> : <FaTimesCircle />}
              <span className="mr-16">{couponMessage}</span>
            </div>
          )}
          <Button
            className="mb-4 bg-lime-700 hover:border"
            style={{ fontFamily: "sans-serif" }}
            onClick={handleApplyCoupon}
          >
            Apply Coupon
          </Button>
        </div>
        <AlertDialog>
          <AlertDialogTrigger className="w-full text-lg sm:text-xl md:text-2xl lg:text-xl">
            <Button
              className="w-full bg-green-700 hover:bg-green-800"
              style={{ fontFamily: "sans-serif" }}
              disabled={isProceedDisabled}
            >
              Proceed
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Please Confirm your Order?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleProceed}>
                Proceed
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CheckOut;
