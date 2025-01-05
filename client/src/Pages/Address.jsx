import AddressItem from "@/functions/AddressItem";
import { useState, useEffect } from "react";
import axios from "axios";
import AddAddressButtonComp from "@/functions/AddAddressButtonComp";
import Cookies from "js-cookie";

const Address = () => {
  const [addressList, setAddressList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAddress();
  }, []);

  const jwt = Cookies.get("jwt1");

  const getAddress = async () => {
    try {
      const resp = await axios.get("/api/address/all", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      const respData = resp.data;
      setAddressList(respData.address.addresses);
    } catch (error) {
      console.log("client error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-14">
      <h1 className="text-2xl md:text-3xl text-white mb-6 md:mb-10">Address</h1>
      <div className="flex flex-col md:flex-row justify-center items-center md:flex-wrap">
        {isLoading ? (
          <p className="text-white">Loading...</p>
        ) : addressList.length === 0 ? (
          <div className="flex flex-col items-center">
            <p className="text-white text-2xl">No addresses found</p>
            <AddAddressButtonComp />
          </div>
        ) : (
          <>
            <AddAddressButtonComp />
            <ul>
              {addressList
                .slice(0)
                .reverse()
                .map((each) => (
                  <AddressItem each={each} key={each.addressId} />
                ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Address;
