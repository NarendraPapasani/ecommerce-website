import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import {
  MapPin,
  User,
  Phone,
  Building,
  Edit,
  Trash2,
  Star,
  Home,
  MapIcon,
} from "lucide-react";

const AddressItem = (props) => {
  const { each, onUpdate } = props;
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
    fullName: fullName || "",
    mobileNumber: mobileNumber || "",
    town: town || "",
    state: state || "",
    pincode: pincode || "",
    country: country || "",
    area: area || "",
    building: building || "",
    defaultAddress: defaultAddress || false,
    LandMark: LandMark || "",
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    return requiredFields.every(
      (field) => address[field] && address[field].toString().trim() !== ""
    );
  };

  const handleUpdateAddress = async () => {
    if (!validateFields()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
        duration: 2000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/address/update/${addressId}`,
        address,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Success",
          description: "Address updated successfully",
          variant: "default",
          className: "bg-green-600 border-green-600 text-white",
          duration: 2000,
        });
        setIsEditOpen(false);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update address",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/address/delete/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Success",
          description: "Address deleted successfully",
          variant: "default",
          className: "bg-green-600 border-green-600 text-white",
          duration: 2000,
        });
        setIsDeleteOpen(false);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
        className: "bg-red-600 border-red-600 text-white",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 transition-all duration-200 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-600/30">
              <Home className="h-4 w-4 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold text-sm">{fullName}</h3>
          </div>

          <div className="flex items-center gap-1">
            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-slate-800/90 border-slate-700/50 text-white backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-white">
                    <Edit className="h-5 w-5 text-blue-400" />
                    Edit Address
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Update your delivery address information
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
                    onClick={() => setIsEditOpen(false)}
                    className="bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateAddress}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? "Updating..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-600/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-800/90 border-slate-700/50 text-white backdrop-blur-sm">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-red-400" />
                    Delete Address
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    Are you sure you want to delete this address? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isLoading ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Primary Address Badge */}
        {defaultAddress && (
          <div className="mt-2">
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Primary Address
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Phone Number */}
        <div className="flex items-center gap-2 pb-2 border-b border-slate-700/30">
          <Phone className="h-4 w-4 text-slate-400" />
          <span className="text-slate-300 text-sm">{mobileNumber}</span>
        </div>

        {/* Address Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <span className="text-white text-sm">{building}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <span className="text-white text-sm">{area}</span>
          </div>

          {LandMark && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span className="text-white text-sm">{LandMark}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-300 text-sm">
              {town}, {state} - {pincode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-300 text-sm">{country}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressItem;
