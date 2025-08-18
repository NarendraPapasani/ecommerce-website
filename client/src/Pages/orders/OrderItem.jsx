import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Package,
  MapPin,
  CreditCard,
  Calendar,
  Eye,
  Truck,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Wallet,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react";

const OrderItem = (props) => {
  const { each } = props;
  const {
    addressId,
    cartItems,
    createdAt,
    orderStatus = "Processing",
    totalPrice,
    _id,
    paymentMethod,
  } = each;
  const navigate = useNavigate();

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
        return <CheckCircle className="h-3 w-3" />;
      case "processing":
      case "confirmed":
        return <Clock className="h-3 w-3" />;
      case "shipped":
      case "out for delivery":
        return <Truck className="h-3 w-3" />;
      case "cancelled":
        return <XCircle className="h-3 w-3" />;
      case "pending":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case "cod":
      case "cash on delivery":
        return <Wallet className="h-3 w-3 text-emerald-400" />;
      case "razorpay":
      case "online":
        return <CreditCard className="h-3 w-3 text-blue-400" />;
      default:
        return <CreditCard className="h-3 w-3 text-slate-400" />;
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

  const formatAddress = (addressId) => {
    if (typeof addressId === "string" && addressId.length > 20) {
      return `${addressId.substring(0, 20)}...`;
    }
    return addressId;
  };

  const formatted = formatDate(createdAt);

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600/70 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-600/30">
              <Package className="h-4 w-4 text-blue-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold text-sm">
                  #{_id.slice(-8).toUpperCase()}
                </h3>
                <Badge
                  variant="outline"
                  className={getStatusColor(orderStatus)}
                  size="sm"
                >
                  {getStatusIcon(orderStatus)}
                  <span className="ml-1 text-xs font-medium">
                    {orderStatus}
                  </span>
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">
                  {formatted.date} at {formatted.time}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xl font-bold text-white">
                ₹{totalPrice.toFixed(2)}
              </p>
              <p className="text-slate-400 text-xs">{cartItems.length} items</p>
            </div>
            <Button
              onClick={() => navigate(`/order/${_id}`)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
            <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30">
              {getPaymentMethodIcon(paymentMethod)}
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400 font-medium">Payment</p>
              <p className="text-white font-medium text-xs">
                {paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : paymentMethod === "razorpay"
                  ? "Online Payment"
                  : paymentMethod || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
            <div className="p-1.5 rounded-lg bg-orange-500/20 border border-orange-500/30">
              <MapPin className="h-3 w-3 text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400 font-medium">Address</p>
              <p className="text-white font-medium text-xs" title={addressId}>
                {formatAddress(addressId)}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-600/50" />

        {/* Product Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-blue-400" />
              <h4 className="text-white font-medium text-sm">
                Items ({cartItems.length})
              </h4>
            </div>
            {cartItems.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white h-6 w-6 p-0"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cartItems.slice(0, 3).map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-center gap-2 p-3 bg-slate-700/20 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-colors"
              >
                <div className="relative">
                  <Avatar className="w-10 h-10 border border-slate-600">
                    <AvatarImage
                      src={item.image || item.product?.images?.[0]}
                      alt={item.title || item.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-slate-600 text-slate-300 text-xs">
                      {(item.title || item.name)?.charAt(0) || "P"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h5
                    className="text-white font-medium text-xs truncate"
                    title={item.title || item.name}
                  >
                    {item.title || item.name}
                  </h5>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-slate-400 text-xs">
                      {item.quantity} × ₹{item.price}
                    </span>
                    <span className="text-emerald-400 font-bold text-xs">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {cartItems.length > 3 && (
              <div className="flex items-center justify-center p-3 bg-slate-700/10 rounded-lg border border-dashed border-slate-600/30 hover:border-slate-500/50 transition-colors cursor-pointer">
                <div className="text-center">
                  <div className="p-2 rounded-full bg-slate-600/30 w-fit mx-auto mb-1">
                    <Package className="h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-slate-400 text-xs font-medium">
                    +{cartItems.length - 3} more
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItem;
