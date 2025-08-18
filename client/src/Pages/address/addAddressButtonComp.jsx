import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Plus, MapPin, User, Phone, Building, MapIcon } from "lucide-react";

const AddAddressButtonComp = ({ onAddressAdded }) => {
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
  const navigate = useNavigate();
  const jwt = Cookies.get("jwt1");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (checked) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      defaultAddress: checked,
    }));
  };

  const validateFields = () => {
    const requiredFields = [
      "fullName",
      "mobileNumber",
      "town",
      "state",
      "pincode",
      "country",
      "area",
      "building",
    ];

    // Check if all required fields are filled
    const emptyFields = requiredFields.filter(
      (field) => !address[field] || address[field].toString().trim() === ""
    );
    if (emptyFields.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
        duration: 2000,
      });
      return false;
    }

    // Validate mobile number
    if (!/^\d{10}$/.test(address.mobileNumber)) {
      toast({
        title: "Validation Error",
        description: "Mobile number should be 10 digits.",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
        duration: 2000,
      });
      return false;
    }

    // Validate pincode
    if (!/^\d{6}$/.test(address.pincode)) {
      toast({
        title: "Validation Error",
        description: "Pincode should be 6 digits.",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
        duration: 2000,
      });
      return false;
    }

    return true;
  };

  const saveAddress = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/address/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(address),
        }
      );

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Address added successfully.",
          variant: "default",
          className: "bg-green-600 border-green-600 text-white",
          duration: 2000,
        });
        setAddress({
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
        setIsDialogOpen(false);

        // Call the callback to refresh the address list
        if (onAddressAdded) {
          onAddressAdded();
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to save address.",
          variant: "destructive",
          className: "bg-red-600 border-red-600 text-white",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="border-2 border-dashed border-slate-600/50 hover:border-blue-400/50 transition-colors cursor-pointer group bg-slate-800/30">
          <CardContent className="flex flex-col items-center justify-center p-8 min-h-[200px]">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 group-hover:bg-blue-600/30 transition-colors mb-4 border border-blue-600/30">
              <Plus className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg text-white font-semibold mb-2">
              Add New Address
            </h3>
            <p className="text-sm text-slate-400 text-center">
              Click to add a new delivery address
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-slate-800/90 border-slate-700/50 text-white backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <MapPin className="h-5 w-5 text-blue-400" />
            Add New Address
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Fill in the details below to add a new delivery address.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="flex items-center gap-2 text-slate-300"
                >
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="mobileNumber"
                  className="flex items-center gap-2 text-slate-300"
                >
                  <Phone className="h-4 w-4" />
                  Mobile Number *
                </Label>
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  value={address.mobileNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="building"
                className="flex items-center gap-2 text-slate-300"
              >
                <Building className="h-4 w-4" />
                Building/House No *
              </Label>
              <Input
                id="building"
                name="building"
                value={address.building}
                onChange={handleChange}
                placeholder="House/Flat/Office No"
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="area"
                className="flex items-center gap-2 text-slate-300"
              >
                <MapIcon className="h-4 w-4" />
                Area/Street *
              </Label>
              <Input
                id="area"
                name="area"
                value={address.area}
                onChange={handleChange}
                placeholder="Area, Street, Sector"
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="LandMark" className="text-slate-300">
                Landmark (Optional)
              </Label>
              <Input
                id="LandMark"
                name="LandMark"
                value={address.LandMark}
                onChange={handleChange}
                placeholder="Nearby landmark"
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="town" className="text-slate-300">
                  City/Town *
                </Label>
                <Input
                  id="town"
                  name="town"
                  value={address.town}
                  onChange={handleChange}
                  placeholder="City/Town"
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-slate-300">
                  State *
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-slate-300">
                  Pincode *
                </Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-slate-300">
                Country *
              </Label>
              <Input
                id="country"
                name="country"
                value={address.country}
                onChange={handleChange}
                placeholder="Country"
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="defaultAddress"
                checked={address.defaultAddress}
                onCheckedChange={handleCheckboxChange}
              />
              <Label
                htmlFor="defaultAddress"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300"
              >
                Set as default address
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={loading}
            className="bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
          >
            Cancel
          </Button>
          <Button
            onClick={saveAddress}
            disabled={loading}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save Address"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddressButtonComp;
