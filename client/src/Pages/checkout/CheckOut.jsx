import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import Cookies from "js-cookie";
import { RotatingLines } from "react-loader-spinner";
import CheckOutSkeleton from "@/Pages/skeletons/CheckOutSkeleton";
import { useToast } from "@/hooks/use-toast";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import {
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Tag,
  Percent,
  CheckCircle,
  XCircle,
  Wallet,
  Smartphone,
  DollarSign,
  Package,
  User,
  Phone,
  Home,
  Building,
  Globe,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Calculator,
  AlertCircle,
  Gift,
  Edit,
  Plus,
  Check,
  X,
  Save,
} from "lucide-react";

const CheckOut = () => {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editableAddress, setEditableAddress] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [cart, setCart] = useState({});
  const [cartTotal, setCartTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPrivacyPolicyChecked, setIsPrivacyPolicyChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();
  const jwt = Cookies.get("jwt1");

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/address/all`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            withCredentials: true,
          }
        );
        setAddresses(response.data.address.addresses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setLoading(false);
      }
    };

    const fetchCartTotal = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/cart/all`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            withCredentials: true,
          }
        );
        setCart(response.data.data.cart);
        setCartTotal(Number(response.data.data.cart.totalPrice || 0));
      } catch (error) {
        console.error("Error fetching cart total:", error);
      }
    };

    fetchAddresses();
    fetchCartTotal();
  }, [jwt]);

  const handleAddressSelect = (addressIndex) => {
    const address = addresses[parseInt(addressIndex)];
    setSelectedAddress(address);
    setEditableAddress({ ...address }); // Create a copy for editing
    setIsEditingAddress(false); // Reset editing mode
    setActiveStep(2);
  };

  const handleEditAddress = () => {
    setIsEditingAddress(true);
  };

  const handleSaveAddress = async () => {
    // Basic validation
    if (
      !editableAddress.fullName ||
      !editableAddress.mobileNumber ||
      !editableAddress.building ||
      !editableAddress.area ||
      !editableAddress.town ||
      !editableAddress.state ||
      !editableAddress.pincode ||
      !editableAddress.country
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/address/update/${
          editableAddress.addressId
        }`,
        editableAddress,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        // Update the addresses list
        const updatedAddresses = addresses.map((addr) =>
          addr.addressId === editableAddress.addressId ? editableAddress : addr
        );
        setAddresses(updatedAddresses);
        setSelectedAddress(editableAddress);
        setIsEditingAddress(false);
        toast({
          title: "Success",
          description: "Address updated successfully!",
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast({
        title: "Error",
        description: "Failed to update address",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditableAddress({ ...selectedAddress }); // Reset to original
    setIsEditingAddress(false);
  };

  const handleAddressFieldChange = (field, value) => {
    setEditableAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyCoupon = () => {
    if (couponCode === "FIRST10") {
      setDiscount(cartTotal * 0.1);
      setCouponMessage("Coupon applied successfully! 10% off");
      toast({
        title: "Success",
        description: "Coupon applied successfully! 10% off",
        variant: "success",
      });
    } else if (couponCode === "SAVE20") {
      setDiscount(cartTotal * 0.2);
      setCouponMessage("Coupon applied successfully! 20% off");
      toast({
        title: "Success",
        description: "Coupon applied successfully! 20% off",
        variant: "success",
      });
    } else if (couponCode) {
      setDiscount(0);
      setCouponMessage("Invalid coupon code");
      toast({
        title: "Error",
        description: "Invalid coupon code",
        variant: "destructive",
      });
    }
  };

  const addNewAddress = () => {
    navigate("/addresses");
  };

  const handleProceed = async () => {
    if (paymentMethod === "cod") {
      await handleCODOrder();
    } else if (paymentMethod === "razorpay" || paymentMethod === "card") {
      await handleOnlinePayment();
    }
  };

  const handleCODOrder = async () => {
    try {
      setLoading1(true);
      const data = {
        cartItems: cart.items,
        addressId: selectedAddress._id,
        totalPrice: totalAfterDiscount,
        paymentMethod,
        paymentStatus: "pending", // COD is always pending until delivery
        priceBreakdown: {
          subtotal: cartTotal,
          discount: discount,
          platformFee: platformFee,
          deliveryFee: deliveryFee,
          codFee: codFee,
          total: totalAfterDiscount,
        },
      };
      const resp = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/order/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );
      if (resp.status === 200) {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/cart/clear`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            withCredentials: true,
          }
        );

        // Set success data for modal
        setOrderSuccessData({
          paymentId: "COD_" + Date.now(),
          orderId:
            resp.data.order?.orders?.[resp.data.order.orders.length - 1]?._id ||
            "ORDER_CREATED",
          amount: totalAfterDiscount,
          paymentMethod: "Cash on Delivery",
        });

        setIsOrderPlaced(true);
        setShowSuccessModal(true);
        setLoading1(false);

        // Redirect after showing success modal
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate("/orders");
        }, 3000);
      } else {
        toast({
          title: "Error",
          description: "Error placing order",
          variant: "destructive",
        });
        setLoading1(false);
        setIsOrderPlaced(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);

      let errorMessage = "Failed to place order";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Order Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading1(false);
      setIsOrderPlaced(false);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      setLoading1(true);
      // Generate a random receipt ID
      const generateRandomString = (length) => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        return result;
      };

      //current user from JWT
      const getCurrentUserId = () => {
        try {
          if (!jwt) return null;
          const decoded = jwtDecode(jwt);
          console.log("Decoded JWT:", decoded); // Debug log
          return decoded.userId || decoded.id || decoded._id;
        } catch (error) {
          console.error("Error decoding JWT:", error);
          return null;
        }
      };

      // Get current user ID
      const currentUserId = getCurrentUserId();

      if (!currentUserId) {
        toast({
          title: "Error",
          description: "Unable to get user information. Please login again.",
          variant: "destructive",
        });
        setLoading1(false);
        return;
      }

      // Fetch user details
      const userDetails = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/auth/profile/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      const receiptId = `ORDER_${Date.now()}_${generateRandomString(8)}`;

      const resp = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/payment/create-order`,
        {
          totalPrice: totalAfterDiscount,
          currency: "INR",
          reciptId: receiptId,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      const { data: responseData } = resp;
      const orderData = responseData.data;
      const key = `${import.meta.env.VITE_RAZORPAY_KEY_ID}`;

      if (resp.status === 200) {
        const options = {
          key: key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Blink Shop",
          description: "Product Purchase",
          order_id: orderData.id,
          prefill: {
            name: userDetails.data.user.name || "Customer",
            email: userDetails.data.user.email || "",
            contact: selectedAddress.mobileNumber || "",
          },
          theme: {
            color: "#3B82F6",
          },
          handler: async function (response) {
            // Extract the payment details from response
            const {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            } = response;

            console.log("Razorpay Response:", response);

            // For test mode, we might not get all details
            if (!razorpay_payment_id) {
              console.error("Missing payment ID in response:", response);
              toast({
                title: "Payment Error",
                description: "Payment ID is missing. Please try again.",
                variant: "destructive",
              });
              setLoading1(false);
              return;
            }

            try {
              // If we have signature, verify payment
              if (razorpay_signature && razorpay_order_id) {
                const verifyResp = await axios.get(
                  `${
                    import.meta.env.VITE_API_BASE_URL
                  }/api/payment/verify-payment/${razorpay_payment_id}/${razorpay_order_id}/${razorpay_signature}`,
                  {
                    headers: {
                      Authorization: `Bearer ${jwt}`,
                    },
                    withCredentials: true,
                  }
                );

                if (verifyResp.status !== 200) {
                  throw new Error("Payment verification failed");
                }
              }

              // Create order
              const orderRequestData = {
                cartItems: cart.items,
                addressId: selectedAddress._id,
                totalPrice: totalAfterDiscount,
                paymentMethod: "razorpay",
                paymentStatus: "completed",
                paymentDetails: {
                  razorpay_payment_id,
                  razorpay_order_id: razorpay_order_id || orderData.id,
                  razorpay_signature:
                    razorpay_signature || "test_mode_no_signature",
                  razorpay_order_receipt: orderData.receipt || receiptId,
                },
                priceBreakdown: {
                  subtotal: cartTotal,
                  discount: discount,
                  platformFee: platformFee,
                  deliveryFee: deliveryFee,
                  codFee: 0,
                  total: totalAfterDiscount,
                },
              };

              console.log("Creating order with data:", orderRequestData);

              const orderResponse = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/order/add`,
                orderRequestData,
                {
                  headers: {
                    Authorization: `Bearer ${jwt}`,
                  },
                  withCredentials: true,
                }
              );

              if (orderResponse.status === 200) {
                // Clear cart after successful payment
                await axios.delete(
                  `${import.meta.env.VITE_API_BASE_URL}/api/cart/clear`,
                  {
                    headers: {
                      Authorization: `Bearer ${jwt}`,
                    },
                    withCredentials: true,
                  }
                );

                // Set success data for modal
                setOrderSuccessData({
                  paymentId: razorpay_payment_id,
                  orderId:
                    orderResponse.data.order?.orders?.[
                      orderResponse.data.order.orders.length - 1
                    ]?._id || "ORDER_CREATED",
                  amount: totalAfterDiscount,
                  paymentMethod: "Razorpay",
                });

                setIsOrderPlaced(true);
                setShowSuccessModal(true);
                setLoading1(false);

                // Redirect after showing success modal
                setTimeout(() => {
                  setShowSuccessModal(false);
                  navigate("/orders");
                }, 3000);
              } else {
                throw new Error("Order creation failed");
              }
            } catch (error) {
              console.error("Payment processing error:", error);
              toast({
                title: "Payment Processing Failed",
                description:
                  error.response?.data?.message ||
                  "Payment was received but order creation failed. Please contact support with payment ID: " +
                    razorpay_payment_id,
                variant: "destructive",
              });
              setLoading1(false);
            }
          },
          modal: {
            ondismiss: function () {
              console.log("Payment modal dismissed");
              toast({
                title: "Payment Cancelled",
                description: "Payment was cancelled by user.",
                variant: "destructive",
              });
              setLoading1(false);
            },
            onhidden: function () {
              console.log("Payment modal hidden");
              setLoading1(false);
            },
          },
          // Handle payment failures
          error: function (error) {
            console.error("Razorpay error:", error);
            toast({
              title: "Payment Failed",
              description: `Payment failed: ${
                error.description || error.reason || "Unknown error occurred"
              }`,
              variant: "destructive",
            });
            setLoading1(false);
          },
        };

        // Check if Razorpay is loaded
        if (typeof window.Razorpay === "undefined") {
          toast({
            title: "Error",
            description:
              "Payment gateway not loaded. Please refresh and try again.",
            variant: "destructive",
          });
          setLoading1(false);
          return;
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
      }

      setLoading1(false);
    } catch (error) {
      console.error("Error processing online payment:", error);

      let errorMessage = "Error processing payment";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Payment Processing Error",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading1(false);
    }
  };

  const platformFee = 29;
  const deliveryFee = cartTotal > 1000 ? 0 : 99;
  const codFee = paymentMethod === "cod" ? 10 : 0;
  const totalAfterDiscount =
    Number(cartTotal || 0) -
    Number(discount || 0) +
    Number(platformFee || 0) +
    Number(deliveryFee || 0) +
    Number(codFee || 0);

  const isProceedDisabled =
    !selectedAddress || !paymentMethod || !isPrivacyPolicyChecked;

  const steps = [
    { id: 1, title: "Address", icon: MapPin },
    { id: 2, title: "Payment", icon: CreditCard },
    { id: 3, title: "Review", icon: CheckCircle },
  ];

  if (loading) {
    return <CheckOutSkeleton />;
  }

  if (loading1) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-zinc-950">
        <div className="text-center">
          <RotatingLines
            visible={true}
            height="100"
            width="100"
            color="#3b82f6"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
          <p className="text-white text-left mt-4 text-lg">
            Processing your order...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-4 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl md:text-xl text-left font-bold text-white mb-2 font-['Montserrat']">
            Checkout
          </h1>
          <Badge className="bg-blue-600 text-white hover:text-black font-semibold">
            Total: ₹{totalAfterDiscount.toFixed(2)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-7">
            {/* Address Selection */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                      <MapPin className="h-5 w-5 text-blue-400" />
                    </div>
                    Delivery Address
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="border-red-500/50 text-red-400 bg-red-500/10 w-fit"
                  >
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></div>
                    Required
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <RotatingLines
                      visible={true}
                      height="50"
                      width="50"
                      color="#3b82f6"
                      strokeWidth="5"
                      animationDuration="0.75"
                      ariaLabel="rotating-lines-loading"
                    />
                  </div>
                ) : addresses.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300 font-medium">
                          Select Address
                        </Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addNewAddress}
                          className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add New
                        </Button>
                      </div>

                      <Select onValueChange={handleAddressSelect}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700/70 transition-colors h-12">
                          <SelectValue placeholder="Choose your delivery address" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {addresses.map((address, index) => (
                            <SelectItem
                              key={address._id}
                              value={index.toString()}
                              className="focus:bg-slate-600 focus:text-white"
                            >
                              <div className="flex items-center gap-3 py-1">
                                <div className="p-1.5 rounded-md bg-blue-500/20">
                                  <Home className="h-3.5 w-3.5 text-blue-400" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {address.fullName}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {address.town}, {address.state}
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedAddress && (
                      <Card className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 border-slate-600/50 shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                                <CheckCircle className="h-5 w-5 text-emerald-400" />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold text-lg">
                                  Selected Address
                                </h3>
                                <p className="text-slate-400 text-sm">
                                  Your order will be delivered here
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!isEditingAddress ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleEditAddress}
                                  className="text-blue-400 border-blue-400 hover:bg-blue-400/10 transition-colors"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              ) : (
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSaveAddress}
                                    className="text-green-400 border-green-400 hover:bg-green-400/10 transition-colors"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Save
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancelEdit}
                                    className="text-red-400 border-red-400 hover:bg-red-400/10 transition-colors"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          {!isEditingAddress ? (
                            // Display Mode - Enhanced Layout
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3 p-3 bg-slate-600/30 rounded-lg border border-slate-600/50">
                                    <div className="p-2 rounded-md bg-blue-500/20">
                                      <User className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-left text-slate-400 uppercase tracking-wide">
                                        Contact Person
                                      </p>
                                      <p className="text-white font-medium">
                                        {selectedAddress.fullName}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 p-3 bg-slate-600/30 rounded-lg border border-slate-600/50">
                                    <div className="p-2 rounded-md bg-green-500/20">
                                      <Phone className="h-4 w-4 text-green-400" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-slate-400 uppercase tracking-wide">
                                        Phone Number
                                      </p>
                                      <p className="text-white text-start font-medium">
                                        {selectedAddress.mobileNumber}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div className="flex items-start gap-3 p-3 bg-slate-600/30 rounded-lg border border-slate-600/50">
                                    <div className="p-2 rounded-md bg-orange-500/20 mt-0.5">
                                      <MapPin className="h-4 w-4 text-orange-400" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-xs text-left text-slate-400 uppercase tracking-wide mb-1">
                                        Delivery Address
                                      </p>
                                      <div className="space-y-1 flex flex-col items-start">
                                        <p className="text-white text-sm">
                                          {selectedAddress.building},{" "}
                                          {selectedAddress.area}
                                        </p>
                                        <p className="text-slate-300 text-sm text-left">
                                          {selectedAddress.town},{" "}
                                          {selectedAddress.state}
                                        </p>
                                        <p className="text-slate-300 text-sm">
                                          {selectedAddress.country} -{" "}
                                          {selectedAddress.pincode}
                                        </p>
                                        {selectedAddress.LandMark && (
                                          <div className="flex items-center gap-2 mt-2">
                                            <Badge
                                              variant="outline"
                                              className="border-purple-500/50 text-purple-400 bg-purple-500/10"
                                            >
                                              <MapPin className="h-3 w-3 mr-1" />
                                              {selectedAddress.LandMark}
                                            </Badge>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Address Type Badge */}
                              <div className="flex items-center gap-2 pt-2">
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                  <Home className="h-3 w-3 mr-1" />
                                  {selectedAddress.addressType || "Home"}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Confirmed
                                </Badge>
                              </div>
                            </div>
                          ) : (
                            // Edit Mode
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-slate-300 text-sm">
                                    Full Name
                                  </Label>
                                  <Input
                                    value={editableAddress.fullName}
                                    onChange={(e) =>
                                      handleAddressFieldChange(
                                        "fullName",
                                        e.target.value
                                      )
                                    }
                                    className="bg-slate-800 border-slate-600 text-white mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-slate-300 text-sm">
                                    Mobile Number
                                  </Label>
                                  <Input
                                    value={editableAddress.mobileNumber}
                                    onChange={(e) =>
                                      handleAddressFieldChange(
                                        "mobileNumber",
                                        e.target.value
                                      )
                                    }
                                    className="bg-slate-800 border-slate-600 text-white mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-slate-300 text-sm">
                                    Building/House No
                                  </Label>
                                  <Input
                                    value={editableAddress.building}
                                    onChange={(e) =>
                                      handleAddressFieldChange(
                                        "building",
                                        e.target.value
                                      )
                                    }
                                    className="bg-slate-800 border-slate-600 text-white mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-slate-300 text-sm">
                                    Area/Street
                                  </Label>
                                  <Input
                                    value={editableAddress.area}
                                    onChange={(e) =>
                                      handleAddressFieldChange(
                                        "area",
                                        e.target.value
                                      )
                                    }
                                    className="bg-slate-800 border-slate-600 text-white mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-slate-300 text-sm">
                                    Town/City
                                  </Label>
                                  <Input
                                    value={editableAddress.town}
                                    onChange={(e) =>
                                      handleAddressFieldChange(
                                        "town",
                                        e.target.value
                                      )
                                    }
                                    className="bg-slate-800 border-slate-600 text-white mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-slate-300 text-sm">
                                    State
                                  </Label>
                                  <Input
                                    value={editableAddress.state}
                                    onChange={(e) =>
                                      handleAddressFieldChange(
                                        "state",
                                        e.target.value
                                      )
                                    }
                                    className="bg-slate-800 border-slate-600 text-white mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-slate-300 text-sm">
                                    Pincode
                                  </Label>
                                  <Input
                                    value={editableAddress.pincode}
                                    onChange={(e) =>
                                      handleAddressFieldChange(
                                        "pincode",
                                        e.target.value
                                      )
                                    }
                                    className="bg-slate-800 border-slate-600 text-white mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-slate-300 text-sm">
                                    Country
                                  </Label>
                                  <Input
                                    value={editableAddress.country}
                                    onChange={(e) =>
                                      handleAddressFieldChange(
                                        "country",
                                        e.target.value
                                      )
                                    }
                                    className="bg-slate-800 border-slate-600 text-white mt-1"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-slate-300 text-sm">
                                  Landmark (Optional)
                                </Label>
                                <Input
                                  value={editableAddress.LandMark || ""}
                                  onChange={(e) =>
                                    handleAddressFieldChange(
                                      "LandMark",
                                      e.target.value
                                    )
                                  }
                                  className="bg-slate-800 border-slate-600 text-white mt-1"
                                  placeholder="Enter landmark for easy identification"
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <Alert className="bg-orange-900/20 border-orange-600/30">
                    <AlertCircle className="h-4 w-4 text-orange-400" />
                    <AlertDescription className="text-orange-200">
                      No addresses found.{" "}
                      <Button
                        variant="link"
                        onClick={addNewAddress}
                        className="text-orange-400 hover:text-orange-300 p-0 h-auto"
                      >
                        Add a new address
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Payment Options */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  Payment Options
                </CardTitle>
                <p className="text-slate-400 text-sm mt-1">
                  Choose your preferred payment method
                </p>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {/* Razorpay Payment Option */}
                  <div className="relative">
                    <RadioGroupItem
                      value="razorpay"
                      id="razorpay"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="razorpay"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-slate-600 bg-slate-700/30 p-6 hover:bg-slate-700/50 hover:border-blue-400 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10 cursor-pointer transition-all duration-200 h-full"
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3 rounded-full bg-blue-500/20 border border-blue-500/30">
                          <Smartphone className="h-8 w-8 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            Razorpay Payment
                          </h3>
                          <p className="text-slate-400 text-sm mt-1">
                            Pay instantly using UPI, Cards, Net Banking
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Badge
                          variant="secondary"
                          className="bg-green-500/20 text-green-400 border-green-500/30"
                        >
                          Instant
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                        >
                          Secure
                        </Badge>
                      </div>

                      {/* Payment Methods Icons */}
                      <div className="flex items-center gap-2 mt-3 opacity-70">
                        <div className="text-xs text-slate-400">Supports:</div>
                        <div className="flex gap-1">
                          <div className="w-6 h-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-sm flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              UPI
                            </span>
                          </div>
                          <div className="w-6 h-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-sm"></div>
                          <div className="w-6 h-4 bg-gradient-to-r from-red-600 to-red-800 rounded-sm"></div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Cash on Delivery Option */}
                  <div className="relative">
                    <RadioGroupItem
                      value="cod"
                      id="cod"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="cod"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-slate-600 bg-slate-700/30 p-6 hover:bg-slate-700/50 hover:border-green-400 peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-500/10 cursor-pointer transition-all duration-200 h-full"
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3 rounded-full bg-green-500/20 border border-green-500/30">
                          <Wallet className="h-8 w-8 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            Cash on Delivery
                          </h3>
                          <p className="text-slate-400 text-sm mt-1">
                            Pay when you receive your order
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Badge
                          variant="secondary"
                          className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        >
                          +₹10 Fee
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-green-500/20 text-green-400 border-green-500/30"
                        >
                          Convenient
                        </Badge>
                      </div>

                      {/* COD Info */}
                      <div className="flex items-center gap-2 mt-3 opacity-70">
                        <div className="text-xs text-slate-400">
                          Available in most areas
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Payment Security Note */}
                <div className="mt-6 p-4 bg-slate-700/20 rounded-lg border border-slate-600/50">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium text-sm">
                        Secure Payments
                      </h4>
                      <p className="text-slate-400 text-xs mt-1">
                        All payments are secured with 256-bit SSL encryption.
                        Your payment information is never stored on our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-7">
            <Card className="bg-slate-800/50 border-slate-700 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-blue-400" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items Count */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Items ({cart.items?.length || 0})
                  </span>
                  <span className="text-white font-medium">
                    ₹{Number(cartTotal || 0).toFixed(2)}
                  </span>
                </div>

                {/* Delivery Fee */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Delivery Fee
                  </span>
                  <span
                    className={`font-medium ${
                      deliveryFee === 0 ? "text-green-400" : "text-white"
                    }`}
                  >
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>

                {/* Platform Fee */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Platform Fee
                  </span>
                  <span className="text-white font-medium">₹{platformFee}</span>
                </div>

                {/* COD Fee */}
                {paymentMethod === "cod" && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      COD Charges
                    </span>
                    <span className="text-white font-medium">₹{codFee}</span>
                  </div>
                )}

                {/* Discount */}
                {discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Discount
                    </span>
                    <span className="text-green-400 font-medium">
                      -₹{discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <Separator className="bg-slate-600" />

                {/* Total */}
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-emerald-400">
                    ₹{totalAfterDiscount.toFixed(2)}
                  </span>
                </div>

                {/* Free Delivery Progress */}
                {cartTotal < 1000 && (
                  <Alert className="bg-blue-900/20 border-blue-600/30">
                    <Truck className="h-4 w-4 text-blue-400" />
                    <AlertDescription className="text-blue-200 text-sm">
                      Add ₹{(1000 - Number(cartTotal || 0)).toFixed(2)} more for
                      free delivery!
                      <Progress
                        value={(cartTotal / 1000) * 100}
                        className="mt-2 h-2"
                      />
                    </AlertDescription>
                  </Alert>
                )}

                {/* Coupon Section */}
                <div className="space-y-3">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Apply Coupon
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      Apply
                    </Button>
                  </div>
                  {couponMessage && (
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        discount > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {discount > 0 ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {couponMessage}
                    </div>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3 mt-4">
                  <Checkbox
                    id="privacy"
                    checked={isPrivacyPolicyChecked}
                    onCheckedChange={setIsPrivacyPolicyChecked}
                  />
                  <Label
                    htmlFor="privacy"
                    className="text-slate-300 text-sm leading-relaxed"
                  >
                    I agree to the{" "}
                    <Button
                      variant="link"
                      className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                    >
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button
                      variant="link"
                      className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                    >
                      Privacy Policy
                    </Button>
                  </Label>
                </div>

                <Separator className="bg-slate-600" />

                {/* Place Order Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className={`w-full font-semibold py-3 text-base ${
                        paymentMethod === "cod"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : paymentMethod === "razorpay" ||
                            paymentMethod === "card"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-600 hover:bg-gray-700"
                      } text-white`}
                      disabled={isProceedDisabled}
                      size="lg"
                    >
                      {paymentMethod === "cod" ? (
                        <Wallet className="h-5 w-5 mr-2" />
                      ) : paymentMethod === "razorpay" ? (
                        <Smartphone className="h-5 w-5 mr-2" />
                      ) : paymentMethod === "card" ? (
                        <CreditCard className="h-5 w-5 mr-2" />
                      ) : (
                        <Calculator className="h-5 w-5 mr-2" />
                      )}
                      {paymentMethod === "cod"
                        ? `Place Order • ₹${totalAfterDiscount.toFixed(2)}`
                        : paymentMethod === "razorpay" ||
                          paymentMethod === "card"
                        ? `Pay Now • ₹${totalAfterDiscount.toFixed(2)}`
                        : `Select Payment Method • ₹${totalAfterDiscount.toFixed(
                            2
                          )}`}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white text-xl font-bold">
                        Order Confirmation
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-300">
                        Please review your order details before confirming
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Order Details Content */}
                    <div className="space-y-6 py-4">
                      {/* Products Section */}
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Order Items ({cart.items?.length || 0} items)
                        </h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto border border-slate-600 rounded-lg p-3">
                          {cart.items?.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg"
                            >
                              <img
                                src={item.product?.images?.[0] || item.image}
                                alt={item.product?.title || item.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="text-white font-medium text-sm line-clamp-2">
                                  {item.product?.title || item.title}
                                </h4>
                                <p className="text-slate-400 text-xs">
                                  {item.product?.category?.name ||
                                    item.category?.name ||
                                    "Uncategorized"}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-slate-300 text-sm">
                                    Qty: {item.quantity}
                                  </span>
                                  <span className="text-emerald-400 font-medium">
                                    ₹
                                    {Number(
                                      item.product?.price || item.price || 0
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Address Section */}
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Delivery Address
                        </h3>
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">
                                {selectedAddress?.fullName}
                              </span>
                            </div>
                            <p className="text-slate-300 text-sm">
                              {selectedAddress?.area}
                              {selectedAddress?.building &&
                                `, ${selectedAddress.building}`}
                            </p>
                            <p className="text-slate-300 text-sm">
                              {selectedAddress?.town}, {selectedAddress?.state}{" "}
                              - {selectedAddress?.pincode}
                            </p>
                            <p className="text-slate-400 text-sm">
                              Phone: {selectedAddress?.mobileNumber}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method Section */}
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                          {paymentMethod === "cod" ? (
                            <Wallet className="h-5 w-5" />
                          ) : paymentMethod === "razorpay" ? (
                            <Smartphone className="h-5 w-5" />
                          ) : (
                            <CreditCard className="h-5 w-5" />
                          )}
                          Payment Method
                        </h3>
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {paymentMethod === "cod" && (
                                <>
                                  <Wallet className="h-6 w-6 text-green-400" />
                                  <div>
                                    <p className="text-white font-medium">
                                      Cash on Delivery
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                      Pay when you receive your order
                                    </p>
                                  </div>
                                </>
                              )}
                              {paymentMethod === "razorpay" && (
                                <>
                                  <Smartphone className="h-6 w-6 text-blue-400" />
                                  <div>
                                    <p className="text-white font-medium">
                                      razorpay Payment
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                      Pay instantly using razorpay apps
                                    </p>
                                  </div>
                                </>
                              )}
                              {paymentMethod === "card" && (
                                <>
                                  <CreditCard className="h-6 w-6 text-purple-400" />
                                  <div>
                                    <p className="text-white font-medium">
                                      Card Payment
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                      Secure payment via card
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                            {paymentMethod === "cod" && (
                              <Badge
                                variant="outline"
                                className="border-green-600 text-green-400"
                              >
                                +₹10 COD Charges
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Summary Section */}
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                          <Calculator className="h-5 w-5" />
                          Order Summary
                        </h3>
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 space-y-3">
                          {/* Subtotal */}
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">
                              Subtotal ({cart.items?.length || 0} items)
                            </span>
                            <span className="text-white font-medium">
                              ₹{Number(cartTotal || 0).toFixed(2)}
                            </span>
                          </div>

                          {/* Platform Fee */}
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Platform Fee
                            </span>
                            <span className="text-white font-medium">
                              ₹{platformFee}
                            </span>
                          </div>

                          {/* Delivery Fee */}
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 flex items-center gap-2">
                              <Truck className="h-4 w-4" />
                              Delivery Fee
                            </span>
                            <span className="text-white font-medium">
                              {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                            </span>
                          </div>

                          {/* COD Fee */}
                          {paymentMethod === "cod" && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300 flex items-center gap-2">
                                <Wallet className="h-4 w-4" />
                                COD Charges
                              </span>
                              <span className="text-white font-medium">
                                ₹{codFee}
                              </span>
                            </div>
                          )}

                          {/* Discount */}
                          {discount > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-300 flex items-center gap-2">
                                <Percent className="h-4 w-4" />
                                Discount
                              </span>
                              <span className="text-green-400 font-medium">
                                -₹{discount.toFixed(2)}
                              </span>
                            </div>
                          )}

                          <Separator className="bg-slate-600" />

                          {/* Total */}
                          <div className="flex items-center justify-between text-lg font-bold">
                            <span className="text-white">Total Amount</span>
                            <span className="text-emerald-400">
                              ₹{totalAfterDiscount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <AlertDialogFooter className="gap-3">
                      <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleProceed}
                        className={`font-semibold ${
                          paymentMethod === "cod"
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {paymentMethod === "cod" ? (
                          <>
                            <Wallet className="h-4 w-4 mr-2" />
                            Confirm Order
                          </>
                        ) : (
                          <>
                            {paymentMethod === "razorpay" ? (
                              <Smartphone className="h-4 w-4 mr-2" />
                            ) : (
                              <CreditCard className="h-4 w-4 mr-2" />
                            )}
                            Proceed to Pay
                          </>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-4">
                  <Shield className="h-3 w-3" />
                  Secure & encrypted checkout
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Modal */}
        <AlertDialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <AlertDialogContent className="bg-slate-800 border-slate-700 max-w-md">
            <AlertDialogHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <AlertDialogTitle className="text-white text-2xl font-bold">
                Payment Successful!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-300 text-center">
                Your order has been placed successfully. You will be redirected
                to your orders page shortly.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {orderSuccessData && (
              <div className="space-y-4 py-4">
                <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Payment Method:</span>
                    <span className="text-white font-medium">
                      {orderSuccessData.paymentMethod}
                    </span>
                  </div>

                  {orderSuccessData.paymentMethod !== "Cash on Delivery" && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Payment ID:</span>
                      <span className="text-white font-mono text-sm">
                        {orderSuccessData.paymentId}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Order ID:</span>
                    <span className="text-white font-mono text-sm">
                      {orderSuccessData.orderId}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total Amount:</span>
                    <span className="text-emerald-400 font-bold text-lg">
                      ₹{orderSuccessData.amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    Redirecting to orders page...
                  </div>
                </div>
              </div>
            )}

            <AlertDialogFooter>
              <Button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/orders");
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                View Orders
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CheckOut;
