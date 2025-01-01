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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddAddressButtonComp = () => {
  const [address, setAddress] = useState({
    fullName: "",
    mobileNumber: "",
    town: "",
    state: "",
    pincode: "",
    country: "",
    area: "",
    building: "",
    defaultAddress: false,
    LandMark: "",
  });
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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

  const handleAddAddress = async () => {
    if (!validateFields()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const resp = await axios.post(
        "http://localhost:8000/api/address/add",
        address,
        {
          withCredentials: true,
        }
      );
      console.log(resp);
      if (resp.status === 200) {
        setLoading(false);
        setIsSaved(true);
        toast.success("Address saved successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.log("client error", error);
      setLoading(false);
    }
  };

  const cancelButt = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div
            className="border border-dashed border-gray-400 m-5 rounded-lg bg-none h-66 w-80 box-border text-center table-cell align-middle cursor-pointer"
            style={{ fontFamily: "sans-serif" }}
          >
            <div className="relative p-5 box-border rounded-lg">
              <div
                id="ya-myab-plus-address-icon"
                className="inline-block bg-no-repeat bg-left-center"
                style={{
                  backgroundImage:
                    'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMfFBUB8Kc3yAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAABmJLR0QA/wD/AP+gvaeTAAAAP0lEQVRYw+3UsQkAMAwDsPz/o29pHkjnlCKDV6PJVb8myZkKBgYGBgYGBvYg7Da+VTAwMD8GBgYGBgYGBraWBpeqjFTlGtDAAAAAAElFTkSuQmCC")',
                  width: "50px",
                  height: "50px",
                  marginBottom: "0px",
                }}
              />
              <div
                className="font-bold text-2xl leading-8 mb-0 text-white"
                style={{ fontFamily: "sans-serif" }}
              >
                Add address
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px] -mt-9"
          style={{ fontFamily: "sans-serif" }}
        >
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "sans-serif" }}>
              Add Address
            </DialogTitle>
            <DialogDescription
              className="text-black"
              style={{ fontFamily: "sans-serif" }}
            >
              Fill in the details below to add a new address.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {[
              { label: "Full Name", name: "fullName", type: "text" },
              { label: "Mobile Number", name: "mobileNumber", type: "text" },
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
              onClick={handleAddAddress}
              disabled={isSaved}
              style={{ fontFamily: "sans-serif" }}
            >
              {isSaved ? "Saved" : "Save Address"}
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
  );
};

export default AddAddressButtonComp;
