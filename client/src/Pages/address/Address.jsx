import AddressItem from "@/Pages/address/AddressItem";
import { useState, useEffect } from "react";
import axios from "axios";
import AddAddressButtonComp from "./addAddressButtonComp";
import AddressSkeleton from "@/Pages/skeletons/AddressSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { MapPin, Plus, Home, AlertCircle } from "lucide-react";

const Address = () => {
  const [addressList, setAddressList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAddress();
  }, []);

  const jwt = Cookies.get("jwt1");

  const getAddress = async () => {
    try {
      const resp = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/address/all`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );
      const respData = resp.data;
      setAddressList(respData.address.addresses);
    } catch (error) {
      console.log("client error", error);
      toast({
        title: "Error",
        description: "Failed to fetch addresses",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-4 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start sm:items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-600/30 flex-shrink-0">
              <MapPin className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold text-white">
                Manage Addresses
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                Add and manage your delivery addresses
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <AddressSkeleton key={index} />
            ))}
          </div>
        ) : addressList.length === 0 ? (
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <Home className="h-12 w-12 text-slate-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No addresses found
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Add your first delivery address to get started
                  </p>
                </div>
                <AddAddressButtonComp onAddressAdded={getAddress} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Add Address Button */}
            <div className="flex justify-start">
              <AddAddressButtonComp onAddressAdded={getAddress} />
            </div>

            {/* Address Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {addressList
                .slice(0)
                .reverse()
                .map((each) => (
                  <AddressItem
                    each={each}
                    key={each.addressId}
                    onUpdate={getAddress}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;
