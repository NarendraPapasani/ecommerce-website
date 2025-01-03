import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddressItem = (props) => {
  const { each } = props;
  const {
    building,
    fullName,
    mobileNumber,
    town,
    state,
    pincode,
    country,
    area,
    defaultAddress,
    LandMark,
    addressId,
  } = each;

  const [address, setAddress] = useState({
    fullName: fullName,
    mobileNumber: mobileNumber,
    town: town,
    state: state,
    pincode: pincode,
    country: country,
    area: area,
    building: building,
    defaultAddress: defaultAddress,
    LandMark: LandMark,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateFields = () => {
    return Object.values(address).every((field) => field !== "");
  };

  const handleUpdateAddress = async () => {
    if (!validateFields()) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const response = await axios.put(
        `https://ecommerce-website-crkh.onrender.com/api/address/update/${each.addressId}`,
        address,
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        toast.success("Address updated successfully");
        window.location.reload();
      } else {
        toast.error("Address not updated");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelButt = () => {};

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://ecommerce-website-crkh.onrender.com/api/address/delete/${each.addressId}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        toast.success("Address deleted successfully");
        window.location.reload();
      } else {
        toast.error("Address not deleted");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative overflow-visible bg-gray-950 float-left min-h-[1px] m-5 w-auto mt-1 text-left">
      <div className="border border-gray-300 rounded-lg shadow-md h-[266px] w-[320px]">
        <div className="relative p-0 rounded-lg">
          <div className="border-b border-gray-300 h-10 pl-5 pt-3 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xs text-white leading-4">Default:</span>
              {defaultAddress && (
                <span className="text-xs text-yellow-500 leading-4 ml-2 flex items-center">
                  <FaStar className="mr-1" /> Primary Address
                </span>
              )}
            </div>
            <div className="flex items-center pr-5">
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-xs text-blue-500 mr-2">
                      <FaEdit />
                    </button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[425px] -mt-9"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    <DialogHeader>
                      <DialogTitle style={{ fontFamily: "sans-serif" }}>
                        Edit Your Address
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {[
                        { label: "Full Name", name: "fullName", type: "text" },
                        {
                          label: "Mobile Number",
                          name: "mobileNumber",
                          type: "text",
                        },
                        { label: "Area", name: "area", type: "text" },
                        { label: "Town", name: "town", type: "text" },
                        { label: "State", name: "state", type: "text" },
                        { label: "Pincode", name: "pincode", type: "text" },
                        { label: "Country", name: "country", type: "text" },
                        { label: "LandMark", name: "LandMark", type: "text" },
                        { label: "Door No:", name: "building", type: "text" },
                      ].map((field) => (
                        <div
                          key={field.name}
                          className="grid grid-cols-4 items-center gap-4"
                          style={{ fontFamily: "sans-serif" }}
                        >
                          <Label
                            htmlFor={field.name}
                            className="text-right text-black"
                            style={{ fontFamily: "sans-serif" }}
                          >
                            {field.label}
                          </Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            onChange={handleChange}
                            value={address[field.name]}
                            className="col-span-3 border border-gray-300 rounded-md p-2 text-black"
                            style={{ fontFamily: "sans-serif" }}
                          />
                        </div>
                      ))}
                      <div
                        className="grid grid-cols-4 items-center gap-4"
                        style={{ fontFamily: "sans-serif" }}
                      >
                        <div className="col-span-3 flex items-center">
                          <input
                            id="defaultAddress"
                            name="defaultAddress"
                            type="checkbox"
                            checked={address.defaultAddress}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <span
                            className="text-black"
                            style={{ fontFamily: "sans-serif" }}
                          >
                            Set as default address
                          </span>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        onClick={handleUpdateAddress}
                        style={{ fontFamily: "sans-serif" }}
                      >
                        Save
                      </Button>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="text-black"
                          style={{ fontFamily: "sans-serif" }}
                          onClick={cancelButt}
                        >
                          Close
                        </Button>
                      </DialogTrigger>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <ToastContainer />
              </>
              <AlertDialog>
                <AlertDialogTrigger className="w-full text-lg sm:text-xl md:text-2xl lg:text-xl">
                  <button className="text-xs text-red-500">
                    <FaTrash />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you want to Delete Address?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div className="pl-5 pt-2.5">
            <div className="w-full mb-2">
              <ul className="list-none pl-0 text-white">
                <li className="break-words">
                  <span className="text-white">
                    <h5 className="font-bold text-sm leading-5">{fullName}</h5>
                  </span>
                </li>
                <li className="break-words">
                  <span className="text-white">{building}</span>
                </li>
                <li className="break-words">
                  <span className="text-white">{area}</span>
                </li>
                <li className="break-words">
                  <span className="text-white">
                    {town}, {state}, {pincode}
                  </span>
                </li>
                <li className="break-words">
                  <span className="text-white">{country}</span>
                </li>
                <li className="break-words">
                  <span className="text-white">Mobile: {mobileNumber}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressItem;
