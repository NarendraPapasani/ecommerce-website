import { useState, useEffect } from "react";
import axios from "axios";
import OrderItem from "@/Pages/orders/OrderItem";
import OrderItemSkeleton from "@/Pages/skeletons/OrderItemSkeleton";
import OrdersSkeleton from "@/Pages/skeletons/OrdersSkeleton";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Cookies from "js-cookie";
import {
  Search,
  Package,
  ShoppingBag,
  Calendar,
  Filter,
  ArrowUpDown,
  AlertCircle,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Star,
  BarChart3,
  RefreshCw,
  Grid3X3,
  User,
  MapPin,
  CreditCard,
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const jwt = Cookies.get("jwt1");

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const resp = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/order/user`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );
      const sortedOrders = resp.data.data.orders[0].orders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
      setFilteredProducts(sortedOrders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchQuery(searchValue);
    filterOrders(searchValue, activeTab, sortBy);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    filterOrders(searchQuery, tab, sortBy);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    filterOrders(searchQuery, activeTab, sort);
  };

  const filterOrders = (search, tab, sort) => {
    let filtered = orders.filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(search.toLowerCase()) ||
        order.cartItems.some((item) =>
          item.title?.toLowerCase().includes(search.toLowerCase())
        );

      let matchesTab = true;
      if (tab !== "all") {
        const status = (order.orderStatus || "processing").toLowerCase();
        switch (tab) {
          case "pending":
            matchesTab = ["pending", "processing"].includes(status);
            break;
          case "shipped":
            matchesTab = ["shipped", "out for delivery"].includes(status);
            break;
          case "delivered":
            matchesTab = ["delivered", "completed"].includes(status);
            break;
          case "cancelled":
            matchesTab = status === "cancelled";
            break;
        }
      }

      return matchesSearch && matchesTab;
    });

    // Sort orders
    switch (sort) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "amount-high":
        filtered.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case "amount-low":
        filtered.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
    }

    setFilteredProducts(filtered);
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );
    const pendingOrders = orders.filter((order) =>
      ["pending", "processing"].includes(
        (order.orderStatus || "processing").toLowerCase()
      )
    ).length;
    const deliveredOrders = orders.filter((order) =>
      ["delivered", "completed"].includes(
        (order.orderStatus || "processing").toLowerCase()
      )
    ).length;

    return { totalOrders, totalAmount, pendingOrders, deliveredOrders };
  };

  const stats = getOrderStats();

  if (loading) {
    return <OrdersSkeleton />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-4 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-600/30">
                <ShoppingBag className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  Order History
                </h1>
                <p className="text-slate-400 text-sm">Manage your orders</p>
              </div>
            </div>
            <Button
              onClick={() => getOrders()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </div>

          {/* Compact Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-medium">
                      Total Orders
                    </p>
                    <p className="text-lg font-bold text-white">
                      {stats.totalOrders}
                    </p>
                  </div>
                  <Package className="h-4 w-4 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-medium">
                      Total Spent
                    </p>
                    <p className="text-lg font-bold text-emerald-400">
                      ₹{stats.totalAmount.toFixed(0)}
                    </p>
                  </div>
                  <BarChart3 className="h-4 w-4 text-emerald-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-medium">
                      Pending
                    </p>
                    <p className="text-lg font-bold text-orange-400">
                      {stats.pendingOrders}
                    </p>
                  </div>
                  <Clock className="h-4 w-4 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-medium">
                      Delivered
                    </p>
                    <p className="text-lg font-bold text-green-400">
                      {stats.deliveredOrders}
                    </p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compact Filter Bar */}
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search orders..."
                    className="pl-9 h-9 bg-slate-700/50 border-slate-600/50 text-white text-sm"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-40 h-9 bg-slate-700/50 border-slate-600/50 text-white text-sm">
                      <ArrowUpDown className="h-3 w-3 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="oldest">Oldest first</SelectItem>
                      <SelectItem value="amount-high">
                        Amount: High to Low
                      </SelectItem>
                      <SelectItem value="amount-low">
                        Amount: Low to High
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { value: "all", label: "All Orders", icon: Grid3X3 },
            { value: "pending", label: "Pending", icon: Clock },
            { value: "shipped", label: "Shipped", icon: Truck },
            { value: "delivered", label: "Delivered", icon: CheckCircle },
            { value: "cancelled", label: "Cancelled", icon: AlertCircle },
          ].map((tab) => (
            <Button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              variant={activeTab === tab.value ? "default" : "outline"}
              size="sm"
              className={`text-xs px-3 py-2 ${
                activeTab === tab.value
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
              }`}
            >
              <tab.icon className="h-3 w-3 mr-1" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <OrderItemSkeleton key={index} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-8 text-center">
              {searchQuery ? (
                <div className="space-y-4">
                  <AlertCircle className="h-12 w-12 text-slate-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      No orders found
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      No orders match your search "{searchQuery}".
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTab("all");
                      setFilteredProducts(orders);
                    }}
                    className="border-slate-600/50 text-white hover:bg-slate-700/50 text-xs px-4 py-2"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Package className="h-12 w-12 text-blue-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      {activeTab === "all"
                        ? "No orders yet"
                        : `No ${activeTab} orders`}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      {activeTab === "all"
                        ? "Start shopping to see your orders here."
                        : `No ${activeTab} orders at the moment.`}
                    </p>
                  </div>
                  {activeTab === "all" && (
                    <Button
                      onClick={() => (window.location.href = "/")}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Start Shopping
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((order) => (
              <OrderItem each={order} key={order._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
