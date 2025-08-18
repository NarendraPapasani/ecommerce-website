import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import OrderDetailsSkeleton from "@/Pages/skeletons/OrderDetailsSkeleton";
import {
  Package,
  MapPin,
  CreditCard,
  Calendar,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Truck,
  Wallet,
  ArrowLeft,
  Phone,
  User,
  Building,
  MapIcon,
  IndianRupee,
} from "lucide-react";
const OrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState({});
  const [address, setAddress] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const jwt = Cookies.get("jwt1");

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const getAddress = async (addressId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/address/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );
      setAddress(response.data.address[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/order/${id}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );
      setOrderDetails(response.data.data.order);
      getAddress(response.data.data.order.addressId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    try {
      const resp = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/order/cancel/${id}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );
      console.log(resp);
      toast({
        title: "Success",
        description: "Order cancelled successfully",
      });
      // Refresh order details
      fetchOrderDetails();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "processing":
      case "confirmed":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "shipped":
      case "out for delivery":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
      case "confirmed":
        return <Clock className="h-4 w-4" />;
      case "shipped":
      case "out for delivery":
        return <Truck className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case "cod":
      case "cash on delivery":
        return <Wallet className="h-4 w-4 text-emerald-400" />;
      case "razorpay":
      case "online":
        return <CreditCard className="h-4 w-4 text-blue-400" />;
      default:
        return <CreditCard className="h-4 w-4 text-slate-400" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  if (loading) {
    return <OrderDetailsSkeleton />;
  }

  const formatted = formatDate(orderDetails.createdAt);

  return (
    <div className="min-h-screen bg-slate-950 py-4">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Button
              onClick={() => navigate("/orders")}
              variant="outline"
              size="sm"
              className="bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Orders
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-600/30">
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">
                Order Details
              </h1>
              <p className="text-slate-400 text-sm">
                #{orderDetails._id?.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-600/30">
                      {getStatusIcon(orderDetails.orderStatus)}
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">
                        Order Status
                      </CardTitle>
                      <p className="text-slate-400 text-sm">
                        Current order state
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusColor(orderDetails.orderStatus)}
                  >
                    {getStatusIcon(orderDetails.orderStatus)}
                    <span className="ml-2">{orderDetails.orderStatus}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Order Date</p>
                      <p className="text-white text-sm font-medium">
                        {formatted.date} at {formatted.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <IndianRupee className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400">Total Amount</p>
                      <p className="text-white text-sm font-medium">
                        ₹{orderDetails.totalPrice?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator className="bg-slate-600/50" />
                <div className="flex items-center gap-3">
                  {getPaymentMethodIcon(orderDetails.paymentMethod)}
                  <div>
                    <p className="text-xs text-slate-400">Payment Method</p>
                    <p className="text-white text-sm font-medium">
                      {orderDetails.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : orderDetails.paymentMethod === "razorpay"
                        ? "Online Payment"
                        : orderDetails.paymentMethod || "Not specified"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-white text-lg">
                    Order Items ({orderDetails.cartItems?.length || 0})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {orderDetails.cartItems &&
                  orderDetails.cartItems.length > 0 ? (
                    orderDetails.cartItems.map((item, index) => (
                      <div
                        key={item.productId || index}
                        className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30"
                      >
                        <Avatar className="w-16 h-16 border border-slate-600">
                          <AvatarImage
                            src={item.image}
                            alt={item.title}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-slate-600 text-slate-300">
                            {item.title?.charAt(0) || "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-slate-400 text-xs">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-slate-400 text-xs">
                              Price: ₹{item.price}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-medium text-sm">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-400">No items in this order.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-400" />
                  <CardTitle className="text-white text-lg">
                    Shipping Address
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {address.fullName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-white text-sm">
                      {address.fullName}
                    </span>
                  </div>
                )}
                {address.mobileNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-white text-sm">
                      {address.mobileNumber}
                    </span>
                  </div>
                )}
                {address.building && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-slate-400" />
                    <span className="text-white text-sm">
                      {address.building}
                    </span>
                  </div>
                )}
                {(address.area || address.landMark) && (
                  <div className="flex items-center gap-2">
                    <MapIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-white text-sm">
                      {address.area}
                      {address.area && address.landMark && ", "}
                      {address.landMark}
                    </span>
                  </div>
                )}
                {(address.town || address.state || address.pincode) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-white text-sm">
                      {address.town}
                      {address.town && address.state && ", "}
                      {address.state}
                      {(address.town || address.state) &&
                        address.pincode &&
                        " - "}
                      {address.pincode}
                    </span>
                  </div>
                )}
                {address.country && (
                  <div className="flex items-center gap-2">
                    <MapIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-white text-sm">
                      {address.country}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Order Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {orderDetails.orderStatus?.toLowerCase() !== "cancelled" &&
                  orderDetails.orderStatus?.toLowerCase() !== "delivered" && (
                    <Button
                      onClick={cancelOrder}
                      variant="destructive"
                      size="sm"
                      className="w-full text-sm"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Order
                    </Button>
                  )}
                <Button
                  onClick={() => navigate("/orders")}
                  variant="outline"
                  size="sm"
                  className="w-full bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50 text-sm"
                >
                  <Package className="h-4 w-4 mr-2" />
                  View All Orders
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
