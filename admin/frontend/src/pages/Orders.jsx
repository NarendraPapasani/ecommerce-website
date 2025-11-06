import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Textarea } from "../components/ui/textarea";
import { toast } from "../hooks/use-toast";
import { Toaster } from "../components/ui/toaster";
import {
  Search,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronFirst,
  ChevronLast,
  Package,
  User,
  Calendar,
  DollarSign,
  Truck,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  ShoppingBag,
  Loader2,
} from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [errors, setErrors] = useState({});

  // Status update form
  const [statusUpdateForm, setStatusUpdateForm] = useState({
    status: "",
    trackingNumber: "",
    notes: "",
    refundAmount: "",
    refundReason: "",
  });

  const itemsPerPage = 10;

  const orderStatuses = [
    { value: "all", label: "All Orders", color: "default" },
    { value: "Pending", label: "Pending", color: "orange" },
    { value: "Processing", label: "Processing", color: "blue" },
    { value: "Shipped", label: "Shipped", color: "purple" },
    { value: "Out for Delivery", label: "Out for Delivery", color: "indigo" },
    { value: "Delivered", label: "Delivered", color: "green" },
    { value: "Cancelled", label: "Cancelled", color: "red" },
    { value: "Refunded", label: "Refunded", color: "gray" },
  ];

  const statusIcons = {
    Pending: Clock,
    Processing: RefreshCw,
    Shipped: Truck,
    "Out for Delivery": Package,
    Delivered: CheckCircle,
    Cancelled: XCircle,
    Refunded: DollarSign,
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Pending: "!bg-amber-500 !text-white !border-amber-600",
      Processing: "!bg-blue-600 !text-white !border-blue-700",
      Shipped: "!bg-purple-600 !text-white !border-purple-700",
      "Out for Delivery": "!bg-indigo-600 !text-white !border-indigo-700",
      Delivered: "!bg-green-600 !text-white !border-green-700",
      Cancelled: "!bg-red-600 !text-white !border-red-700",
      Refunded: "!bg-gray-600 !text-white !border-gray-700",
    };
    return statusColors[status] || "!bg-zinc-700 !text-white !border-zinc-600";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          backgroundColor: "#f59e0b",
          color: "#ffffff",
          borderColor: "#d97706",
        };
      case "Processing":
        return {
          backgroundColor: "#2563eb",
          color: "#ffffff",
          borderColor: "#1d4ed8",
        };
      case "Shipped":
        return {
          backgroundColor: "#7c3aed",
          color: "#ffffff",
          borderColor: "#6d28d9",
        };
      case "Out for Delivery":
        return {
          backgroundColor: "#4f46e5",
          color: "#ffffff",
          borderColor: "#4338ca",
        };
      case "Delivered":
        return {
          backgroundColor: "#16a34a",
          color: "#ffffff",
          borderColor: "#15803d",
        };
      case "Cancelled":
        return {
          backgroundColor: "#dc2626",
          color: "#ffffff",
          borderColor: "#b91c1c",
        };
      case "Refunded":
        return {
          backgroundColor: "#4b5563",
          color: "#ffffff",
          borderColor: "#374151",
        };
      default:
        return {
          backgroundColor: "#374151",
          color: "#ffffff",
          borderColor: "#1f2937",
        };
    }
  };

  const getStatusIcon = (status) => {
    return statusIcons[status] || Clock;
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(
        `http://localhost:4001/admin/orders?${params}`
      );
      const result = await response.json();

      if (response.ok && result.status === "success") {
        setOrders(result.data?.orders || []);
        const pagination = result.data?.pagination || {};
        setTotalPages(pagination.totalPages || 1);
        setTotalOrders(pagination.totalOrders || 0);
      } else {
        toast({
          variant: "destructive",
          title: "❌ Error",
          description: "Failed to fetch orders",
          className: "bg-red-900/90 border-red-800 text-red-100",
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        variant: "destructive",
        title: "❌ Network Error",
        description: "Failed to fetch orders. Please check your connection.",
        className: "bg-red-900/90 border-red-800 text-red-100",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!statusUpdateForm.status) {
      newErrors.status = "Status is required";
    }

    if (statusUpdateForm.status === "Refunded") {
      if (!statusUpdateForm.refundAmount) {
        newErrors.refundAmount = "Refund amount is required";
      }
      if (!statusUpdateForm.refundReason) {
        newErrors.refundReason = "Refund reason is required";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setActionLoading(true);
      const updateData = {
        status: statusUpdateForm.status,
        trackingNumber: statusUpdateForm.trackingNumber,
        notes: statusUpdateForm.notes,
      };

      if (statusUpdateForm.status === "Refunded") {
        updateData.refundAmount = parseFloat(statusUpdateForm.refundAmount);
        updateData.refundReason = statusUpdateForm.refundReason;
      }

      const response = await fetch(
        `http://localhost:4001/admin/orders/${selectedOrder.orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setShowOrderDetails(false);
        setSelectedOrder(null);
        setStatusUpdateForm({
          status: "",
          trackingNumber: "",
          notes: "",
          refundAmount: "",
          refundReason: "",
        });
        setErrors({});

        // Refresh orders list
        fetchOrders();

        // Show success toast after modal closes
        setTimeout(() => {
          toast({
            title: "✅ Success",
            description: `Order status updated to ${statusUpdateForm.status}. Customer has been notified via email.`,
            className: "bg-green-900/90 border-green-800 text-green-100",
          });
        }, 300);
      } else {
        setErrors({
          submit: result.message || "Failed to update order status",
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setErrors({ submit: "Failed to update order status" });
    } finally {
      setActionLoading(false);
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setStatusUpdateForm({
      status: order.orderStatus,
      trackingNumber: order.trackingNumber || "",
      notes: "",
      refundAmount: order.totalPrice?.toString() || "",
      refundReason: order.refundReason || "",
    });
    setErrors({});
    setShowOrderDetails(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className={
            i === currentPage
              ? "bg-blue-600 text-white"
              : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
          }
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalOrders)} of {totalOrders}{" "}
          orders
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
          >
            <ChevronFirst className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {pages}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
          >
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (loading && currentPage === 1) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
          <div className="space-y-3 lg:space-y-4">
            <div className="h-6 sm:h-8 bg-zinc-800 rounded-lg w-48 sm:w-64 animate-pulse"></div>
            <div className="h-3 sm:h-4 bg-zinc-800 rounded-lg w-64 sm:w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                className="bg-zinc-900/50 border-zinc-800 animate-pulse"
              >
                <CardContent className="p-4 lg:p-6">
                  <div className="space-y-3 lg:space-y-4">
                    <div className="h-3 sm:h-4 bg-zinc-800 rounded w-20 sm:w-24"></div>
                    <div className="h-6 sm:h-8 bg-zinc-800 rounded w-24 sm:w-32"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4 lg:p-6">
              <div className="animate-pulse space-y-3 lg:space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 sm:h-16 bg-zinc-800 rounded"
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="space-y-3 lg:space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-['Montserrat']">
                  Orders Management
                </h1>
                <p className="text-sm sm:text-base text-zinc-400 font-['Montserrat']">
                  Manage customer orders and track deliveries
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          {orderStatuses.slice(1).map((status) => {
            const count = orders.filter(
              (order) => order.orderStatus === status.value
            ).length;
            const StatusIcon = getStatusIcon(status.value);
            const cardColors = {
              Pending: "from-amber-600/20 to-amber-800/20 border-amber-800/30",
              Processing: "from-blue-600/20 to-blue-800/20 border-blue-800/30",
              Shipped:
                "from-purple-600/20 to-purple-800/20 border-purple-800/30",
              "Out for Delivery":
                "from-indigo-600/20 to-indigo-800/20 border-indigo-800/30",
              Delivered:
                "from-green-600/20 to-green-800/20 border-green-800/30",
              Cancelled: "from-red-600/20 to-red-800/20 border-red-800/30",
              Refunded: "from-gray-600/20 to-gray-800/20 border-gray-800/30",
            };
            const iconColors = {
              Pending: "text-amber-400",
              Processing: "text-blue-400",
              Shipped: "text-purple-400",
              "Out for Delivery": "text-indigo-400",
              Delivered: "text-green-400",
              Cancelled: "text-red-400",
              Refunded: "text-gray-400",
            };
            const textColors = {
              Pending: "text-amber-200",
              Processing: "text-blue-200",
              Shipped: "text-purple-200",
              "Out for Delivery": "text-indigo-200",
              Delivered: "text-green-200",
              Cancelled: "text-red-200",
              Refunded: "text-gray-200",
            };
            return (
              <Card
                key={status.value}
                className={`bg-gradient-to-br ${
                  cardColors[status.value] ||
                  "from-zinc-600/20 to-zinc-800/20 border-zinc-800/30"
                }`}
              >
                <CardContent className="p-2 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-xs sm:text-sm ${
                          textColors[status.value] || "text-zinc-200"
                        }`}
                      >
                        {status.label}
                      </p>
                      <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white">
                        {count}
                      </p>
                    </div>
                    <StatusIcon
                      className={`h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 ${
                        iconColors[status.value] || "text-zinc-400"
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-row flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 min-w-0 max-w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
              <Input
                placeholder="Search orders by customer, items, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-zinc-800/50 border-zinc-700 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(searchTerm || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="border-zinc-700 hover:border-zinc-600 bg-zinc-800/50 text-zinc-300 hover:text-white"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white font-['Montserrat']">
              Orders ({totalOrders})
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Manage customer orders and update their status
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No orders found
                </h3>
                <p className="text-zinc-400 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search criteria"
                    : "Orders will appear here once customers place them"}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-800">
                        <TableHead className="text-zinc-300">
                          <span className="sm:hidden">ID</span>
                          <span className="hidden sm:inline">Order ID</span>
                        </TableHead>
                        <TableHead className="text-zinc-300 hidden sm:table-cell">
                          Customer
                        </TableHead>
                        <TableHead className="text-zinc-300 hidden md:table-cell">
                          Items
                        </TableHead>
                        <TableHead className="text-zinc-300 hidden sm:table-cell">
                          Amount
                        </TableHead>
                        <TableHead className="text-zinc-300">Status</TableHead>
                        <TableHead className="text-zinc-300 hidden sm:table-cell">
                          Date
                        </TableHead>
                        <TableHead className="text-zinc-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => {
                        const StatusIcon = getStatusIcon(order.orderStatus);
                        return (
                          <TableRow
                            key={order.orderId}
                            className="border-zinc-800"
                          >
                            <TableCell className="font-medium text-white">
                              <span className="sm:hidden">
                                {order.orderId?.slice(-8)}
                              </span>
                              <span className="hidden sm:inline">
                                {order.orderId}
                              </span>
                            </TableCell>

                            <TableCell className="hidden sm:table-cell">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-zinc-500" />
                                </div>
                                <div>
                                  <p className="font-medium text-white text-sm">
                                    {order.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="hidden md:table-cell">
                              <div className="text-sm text-zinc-300">
                                {order.cartItems?.length || 0} item(s)
                              </div>
                            </TableCell>

                            <TableCell className="hidden sm:table-cell">
                              <span className="font-medium text-white">
                                ₹{order.totalPrice}
                              </span>
                            </TableCell>

                            <TableCell>
                              <Badge
                                style={getStatusStyle(order.orderStatus)}
                                className={getStatusColor(order.orderStatus)}
                              >
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {order.orderStatus}
                              </Badge>
                            </TableCell>

                            <TableCell className="hidden sm:table-cell">
                              <div className="text-sm text-zinc-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </TableCell>

                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openOrderDetails(order)}
                                className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white inline-flex items-center gap-1 disabled:opacity-50"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="p-4 border-t border-zinc-800">
                    {renderPagination()}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800 sm:m-4">
          <DialogHeader>
            <DialogTitle className="text-white font-['Montserrat']">
              Order Details
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Order #{selectedOrder?.orderId?.slice(-8)} -{" "}
              {selectedOrder?.email}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-800/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-400" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-blue-200/70">Email</p>
                      <p className="text-white">{selectedOrder.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-200/70">Order Date</p>
                      <p className="text-white">
                        {new Date(selectedOrder.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-200/70">Payment Method</p>
                      <p className="text-white">
                        {selectedOrder.paymentMethod}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-600/10 to-green-800/10 border-green-800/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Package className="h-5 w-5 text-green-400" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-green-200/70">Total Amount</p>
                      <p className="text-2xl font-bold text-white">
                        ₹{selectedOrder.totalPrice}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-200/70">Items Count</p>
                      <p className="text-white">
                        {selectedOrder.cartItems?.length || 0} items
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-green-200/70">
                        Current Status
                      </p>
                      <Badge
                        style={getStatusStyle(selectedOrder.orderStatus)}
                        className={getStatusColor(selectedOrder.orderStatus)}
                      >
                        {selectedOrder.orderStatus}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-800/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-purple-400" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.cartItems?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-purple-900/20 border border-purple-800/30 rounded-lg hover:bg-purple-900/30 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded border border-purple-700/50"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                          <div>
                            <p className="font-medium text-white">
                              {item.title}
                            </p>
                            <p className="text-sm text-purple-200/70">
                              Quantity: {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-white">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    )) || <p className="text-purple-200/70">No items found</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Status Update Form */}
              <Card className="">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-orange-400" />
                    Update Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStatusUpdate} className="space-y-4">
                    {errors.submit && (
                      <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
                        <div className="flex items-center gap-2 text-red-300">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{errors.submit}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                          Order Status *
                        </label>
                        <Select
                          value={statusUpdateForm.status}
                          onValueChange={(value) =>
                            setStatusUpdateForm({
                              ...statusUpdateForm,
                              status: value,
                            })
                          }
                        >
                          <SelectTrigger className="bg-zinc-800/80 border-orange-700/50 text-white focus:border-orange-500">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {orderStatuses.slice(1).map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      status.value === "Pending"
                                        ? "bg-amber-400"
                                        : status.value === "Processing"
                                        ? "bg-blue-400"
                                        : status.value === "Shipped"
                                        ? "bg-purple-400"
                                        : status.value === "Out for Delivery"
                                        ? "bg-indigo-400"
                                        : status.value === "Delivered"
                                        ? "bg-green-400"
                                        : status.value === "Cancelled"
                                        ? "bg-red-400"
                                        : status.value === "Refunded"
                                        ? "bg-gray-400"
                                        : "bg-zinc-400"
                                    }`}
                                  ></div>
                                  {status.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.status && (
                          <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.status}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-white">
                          Tracking Number
                        </label>
                        <Input
                          value={statusUpdateForm.trackingNumber}
                          onChange={(e) =>
                            setStatusUpdateForm({
                              ...statusUpdateForm,
                              trackingNumber: e.target.value,
                            })
                          }
                          placeholder="Enter tracking number"
                          className="bg-zinc-800/80 text-white"
                        />
                      </div>
                    </div>

                    {statusUpdateForm.status === "Refunded" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">
                            Refund Amount *
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={statusUpdateForm.refundAmount}
                            onChange={(e) =>
                              setStatusUpdateForm({
                                ...statusUpdateForm,
                                refundAmount: e.target.value,
                              })
                            }
                            placeholder="Enter refund amount"
                            className="bg-zinc-800/80 text-white"
                          />
                          {errors.refundAmount && (
                            <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.refundAmount}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">
                            Refund Reason *
                          </label>
                          <Textarea
                            value={statusUpdateForm.refundReason}
                            onChange={(e) =>
                              setStatusUpdateForm({
                                ...statusUpdateForm,
                                refundReason: e.target.value,
                              })
                            }
                            placeholder="Enter reason for refund"
                            className="bg-zinc-800/80 text-white "
                            rows={3}
                          />
                          {errors.refundReason && (
                            <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.refundReason}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Admin Notes
                      </label>
                      <Textarea
                        value={statusUpdateForm.notes}
                        onChange={(e) =>
                          setStatusUpdateForm({
                            ...statusUpdateForm,
                            notes: e.target.value,
                          })
                        }
                        placeholder="Add any notes about this status update"
                        className="bg-zinc-800/80 text-white"
                        rows={3}
                      />
                    </div>

                    <DialogFooter className="gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowOrderDetails(false)}
                        className="bg-zinc-800/80 border-zinc-600 hover:bg-zinc-700 text-zinc-200 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={actionLoading}
                        className={`${
                          statusUpdateForm.status === "Refunded"
                            ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-red-500"
                            : statusUpdateForm.status === "Delivered"
                            ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-green-500"
                            : statusUpdateForm.status === "Cancelled"
                            ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-red-500"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-blue-500"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {actionLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            {statusUpdateForm.status === "Refunded" &&
                              "💰 Process Refund"}
                            {statusUpdateForm.status === "Delivered" &&
                              "✅ Mark Delivered"}
                            {statusUpdateForm.status === "Cancelled" &&
                              "❌ Cancel Order"}
                            {statusUpdateForm.status === "Shipped" &&
                              "🚚 Mark Shipped"}
                            {statusUpdateForm.status === "Processing" &&
                              "⚡ Start Processing"}
                            {statusUpdateForm.status === "Pending" &&
                              "⏳ Mark Pending"}
                            {statusUpdateForm.status === "Out for Delivery" &&
                              "🚛 Out for Delivery"}
                            {!statusUpdateForm.status && "Update Status"}
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
