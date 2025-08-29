import { useState, useEffect } from "react";
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
  Users,
  User,
  Calendar,
  DollarSign,
  ShoppingBag,
  Loader2,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Clock,
  TrendingUp,
  Package,
} from "lucide-react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingCustomerDetails, setLoadingCustomerDetails] = useState(false);
  const [errors, setErrors] = useState({});

  // Status update form
  const [statusUpdateForm, setStatusUpdateForm] = useState({
    isActive: true,
    reason: "",
  });

  const [deleteForm, setDeleteForm] = useState({
    deleteReason: "",
  });

  const itemsPerPage = 10;

  const customerStatuses = [
    { value: "all", label: "All Customers", color: "default" },
    { value: "active", label: "Active", color: "green" },
    { value: "inactive", label: "Inactive", color: "red" },
  ];

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(
        `http://localhost:4001/admin/users?${params}`
      );
      const result = await response.json();

      if (response.ok && result.status === "success") {
        setCustomers(result.data?.users || []);
        const pagination = result.data?.pagination || {};
        setTotalPages(pagination.totalPages || 1);
        setTotalCustomers(pagination.totalUsers || 0);
      } else {
        toast({
          variant: "destructive",
          title: "❌ Error",
          description: "Failed to fetch customers",
          className: "bg-red-900/90 border-red-800 text-red-100",
        });
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        variant: "destructive",
        title: "❌ Network Error",
        description: "Failed to fetch customers. Please check your connection.",
        className: "bg-red-900/90 border-red-800 text-red-100",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (customerId) => {
    try {
      console.log("Fetching customer details for ID:", customerId); // Debug log
      setLoadingCustomerDetails(true);

      // Fetch user details and orders from admin API
      const ordersResponse = await fetch(
        `http://localhost:4001/admin/orders/last-orders/${customerId}`
      );

      console.log("Response status:", ordersResponse.status); // Debug log

      if (ordersResponse.ok) {
        const ordersResult = await ordersResponse.json();
        console.log("Backend Response:", ordersResult); // Debug log

        if (ordersResult.status === "success" && ordersResult.data) {
          // Extract user and orders from the backend response
          const { user, orders } = ordersResult.data;

          // Sort orders by creation date (newest first) and take last 3
          const sortedOrders = orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);

          // Combine user details with fetched orders
          const combinedData = {
            user: user,
            orders: sortedOrders,
            stats: {
              totalOrders: orders.length,
              totalSpent: orders.reduce(
                (sum, order) => sum + (order.totalPrice || 0),
                0
              ),
              avgOrderValue:
                orders.length > 0
                  ? orders.reduce(
                      (sum, order) => sum + (order.totalPrice || 0),
                      0
                    ) / orders.length
                  : 0,
              lastOrderDate: orders.length > 0 ? orders[0].createdAt : null,
              favoriteCategory: "General", // Can be calculated from order items if needed
            },
          };

          console.log("Setting customer data:", combinedData); // Debug log
          setSelectedCustomer(combinedData);
          setShowCustomerDetails(true);
          console.log("Modal should be open now"); // Debug log
        } else {
          console.error("Invalid response format:", ordersResult); // Debug log
          toast({
            variant: "destructive",
            title: "❌ Error",
            description: "Invalid response format from server",
            className: "bg-red-900/90 border-red-800 text-red-100",
          });
        }
      } else {
        console.error(
          "Response not ok:",
          ordersResponse.status,
          ordersResponse.statusText
        ); // Debug log
        toast({
          variant: "destructive",
          title: "❌ Error",
          description: `Failed to fetch customer details (${ordersResponse.status})`,
          className: "bg-red-900/90 border-red-800 text-red-100",
        });
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: "Failed to fetch customer details",
        className: "bg-red-900/90 border-red-800 text-red-100",
      });
    } finally {
      setLoadingCustomerDetails(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      setActionLoading(true);
      const response = await fetch(
        `http://localhost:4001/admin/users/${selectedCustomer.user._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(statusUpdateForm),
        }
      );

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setShowStatusModal(false);
        setSelectedCustomer(null);
        setStatusUpdateForm({
          isActive: true,
          reason: "",
        });
        setErrors({});

        // Refresh customers list
        fetchCustomers();

        // Show success toast after modal closes
        setTimeout(() => {
          toast({
            title: "✅ Success",
            description: `Customer ${
              statusUpdateForm.isActive ? "activated" : "deactivated"
            } successfully`,
            className: "bg-green-900/90 border-green-800 text-green-100",
          });
        }, 300);
      } else {
        setErrors({
          submit: result.message || "Failed to update customer status",
        });
      }
    } catch (error) {
      console.error("Error updating customer status:", error);
      setErrors({ submit: "Failed to update customer status" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCustomer = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      setActionLoading(true);
      const response = await fetch(
        `http://localhost:4001/admin/users/${selectedCustomer.user._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deleteForm),
        }
      );

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setShowDeleteModal(false);
        setSelectedCustomer(null);
        setDeleteForm({
          deleteReason: "",
        });
        setErrors({});

        // Refresh customers list
        fetchCustomers();

        // Show success toast after modal closes
        setTimeout(() => {
          toast({
            title: "✅ Success",
            description: "Customer deleted successfully",
            className: "bg-green-900/90 border-green-800 text-green-100",
          });
        }, 300);
      } else {
        setErrors({ submit: result.message || "Failed to delete customer" });
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      setErrors({ submit: "Failed to delete customer" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCustomers = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(
        `http://localhost:4001/admin/users/export?${params}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `customers-export-${new Date().toISOString().split("T")[0]}.csv`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast({
          title: "✅ Success",
          description: "Customer data exported successfully",
          className: "bg-green-900/90 border-green-800 text-green-100",
        });
      } else {
        throw new Error("Export failed");
      }
    } catch (error) {
      console.error("Error exporting customers:", error);
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: "Failed to export customer data",
        className: "bg-red-900/90 border-red-800 text-red-100",
      });
    }
  };

  const openStatusModal = (customer) => {
    setSelectedCustomer({ user: customer });
    setStatusUpdateForm({
      isActive: customer.activated === false ? true : false,
      reason: "",
    });
    setErrors({});
    setShowStatusModal(true);
  };

  const openDeleteModal = (customer) => {
    setSelectedCustomer({ user: customer });
    setDeleteForm({
      deleteReason: "",
    });
    setErrors({});
    setShowDeleteModal(true);
  };

  // Test function to open modal with dummy data

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
          {Math.min(currentPage * itemsPerPage, totalCustomers)} of{" "}
          {totalCustomers} customers
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
          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                className="bg-zinc-900/50 border-zinc-800 animate-pulse"
              >
                <CardContent className="p-2 sm:p-4 lg:p-6">
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
              <div className="p-2 bg-purple-600 rounded-lg">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-['Montserrat']">
                  Customer Management
                </h1>
                <p className="text-sm sm:text-base text-zinc-400 font-['Montserrat']">
                  Manage customer accounts and view their activity
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExportCustomers}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          {[
            {
              label: "Total Customers",
              value: totalCustomers,
              icon: Users,
              color: "from-blue-600/20 to-blue-800/20 border-blue-800/30",
              iconColor: "text-blue-400",
              textColor: "text-blue-200",
            },
            {
              label: "Active",
              value: customers.filter((c) => c.activated !== false).length,
              icon: UserCheck,
              color: "from-green-600/20 to-green-800/20 border-green-800/30",
              iconColor: "text-green-400",
              textColor: "text-green-200",
            },
            {
              label: "Inactive",
              value: customers.filter((c) => c.activated === false).length,
              icon: UserX,
              color: "from-red-600/20 to-red-800/20 border-red-800/30",
              iconColor: "text-red-400",
              textColor: "text-red-200",
            },
            {
              label: "With Orders",
              value: customers.filter((c) => (c.orderCount || 0) > 0).length,
              icon: ShoppingBag,
              color: "from-purple-600/20 to-purple-800/20 border-purple-800/30",
              iconColor: "text-purple-400",
              textColor: "text-purple-200",
            },
          ].map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <Card key={index} className={`bg-gradient-to-br ${stat.color}`}>
                <CardContent className="p-2 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs sm:text-sm ${stat.textColor}`}>
                        {stat.label}
                      </p>
                      <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white">
                        {stat.value}
                      </p>
                    </div>
                    <StatIcon
                      className={`h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 ${stat.iconColor}`}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
              <Input
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-zinc-800/50 border-zinc-700 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {customerStatuses.map((status) => (
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

        {/* Customers Table */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white font-['Montserrat']">
              Customers ({totalCustomers})
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Manage customer accounts and view their information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {customers.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No customers found
                </h3>
                <p className="text-zinc-400 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search criteria"
                    : "Customers will appear here once they register"}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-800">
                        <TableHead className="text-zinc-300">
                          Customer
                        </TableHead>
                        <TableHead className="text-zinc-300 hidden md:table-cell">
                          Contact
                        </TableHead>
                        <TableHead className="text-zinc-300">Orders</TableHead>
                        <TableHead className="text-zinc-300">Spent</TableHead>
                        <TableHead className="text-zinc-300">Status</TableHead>
                        <TableHead className="text-zinc-300 hidden sm:table-cell">
                          Joined
                        </TableHead>
                        <TableHead className="text-zinc-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((customer) => {
                        const isActive = customer.activated !== false;
                        return (
                          <TableRow
                            key={customer._id}
                            className="border-zinc-800 hover:bg-zinc-800/30"
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <p className="font-medium text-white text-sm">
                                    {customer.firstName && customer.lastName
                                      ? `${customer.firstName} ${customer.lastName}`
                                      : customer.email?.split("@")[0] ||
                                        "Unknown User"}
                                  </p>
                                  <p className="text-xs text-zinc-400">
                                    {customer.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="text-sm">
                                {customer.phone && (
                                  <p className="text-zinc-300 flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {customer.phone}
                                  </p>
                                )}
                                {customer.city && (
                                  <p className="text-zinc-400 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {customer.city}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Package className="h-3 w-3 text-zinc-400" />
                                <span className="text-white">
                                  {customer.orderCount || 0}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-white">
                                ₹{(customer.totalSpent || 0).toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  isActive
                                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                                    : "bg-red-500/20 text-red-300 border-red-500/30"
                                }
                              >
                                {isActive ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Inactive
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <div className="text-sm text-zinc-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(
                                  customer.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    fetchCustomerDetails(customer._id)
                                  }
                                  disabled={loadingCustomerDetails}
                                  className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:opacity-50"
                                >
                                  {loadingCustomerDetails ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openStatusModal(customer)}
                                  className={`border-zinc-700 hover:bg-zinc-700 ${
                                    isActive
                                      ? "bg-red-600/20 text-red-300 hover:text-red-200"
                                      : "bg-green-600/20 text-green-300 hover:text-green-200"
                                  }`}
                                >
                                  {isActive ? (
                                    <UserX className="h-4 w-4" />
                                  ) : (
                                    <UserCheck className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDeleteModal(customer)}
                                  className="bg-red-600/20 border-red-700/50 text-red-300 hover:bg-red-600/30 hover:text-red-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
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

      {/* Customer Details Modal */}
      <Dialog open={showCustomerDetails} onOpenChange={setShowCustomerDetails}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-zinc-900 border-zinc-800 overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-bold text-white font-['Montserrat']">
              Customer Details
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Complete customer information and activity overview
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-600 hover:scrollbar-thumb-zinc-500">
              {/* Customer Info & Stats Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-400" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Name:</span>
                        <span className="text-white">
                          {selectedCustomer.user.firstName &&
                          selectedCustomer.user.lastName
                            ? `${selectedCustomer.user.firstName} ${selectedCustomer.user.lastName}`
                            : selectedCustomer.user.email?.split("@")[0] ||
                              "Unknown User"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          Email:
                        </span>
                        <span className="text-white truncate ml-2">
                          {selectedCustomer.user.email}
                        </span>
                      </div>
                      {selectedCustomer.user.phone && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            Phone:
                          </span>
                          <span className="text-white">
                            {selectedCustomer.user.phone}
                          </span>
                        </div>
                      )}
                      {selectedCustomer.user.city && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            City:
                          </span>
                          <span className="text-white">
                            {selectedCustomer.user.city}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Joined:
                        </span>
                        <span className="text-white">
                          {new Date(
                            selectedCustomer.user.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Status:</span>
                        <Badge
                          className={
                            selectedCustomer.user.activated !== false
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : "bg-red-500/20 text-red-300 border-red-500/30"
                          }
                        >
                          {selectedCustomer.user.activated !== false
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Statistics */}
                <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-800/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                      Order Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200 text-sm">
                          Total Orders
                        </span>
                        <span className="text-2xl font-bold text-white">
                          {selectedCustomer.stats?.totalOrders || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200 text-sm">
                          Total Spent
                        </span>
                        <span className="text-xl font-bold text-white">
                          ₹
                          {(
                            selectedCustomer.stats?.totalSpent || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200 text-sm">
                          Average Order
                        </span>
                        <span className="text-lg font-semibold text-white">
                          ₹
                          {(
                            selectedCustomer.stats?.avgOrderValue || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Activity */}
                <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-800/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-400" />
                      Activity Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200 text-sm">
                          Last Order
                        </span>
                        <span className="text-white text-sm">
                          {selectedCustomer.stats?.lastOrderDate
                            ? new Date(
                                selectedCustomer.stats.lastOrderDate
                              ).toLocaleDateString()
                            : "No orders yet"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200 text-sm">
                          Favorite Category
                        </span>
                        <span className="text-white text-sm">
                          {selectedCustomer.stats?.favoriteCategory || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200 text-sm">
                          Account Age
                        </span>
                        <span className="text-white text-sm">
                          {Math.floor(
                            (new Date() -
                              new Date(selectedCustomer.user.createdAt)) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-400" />
                    Last 3 Orders ({selectedCustomer.orders?.length || 0})
                  </CardTitle>
                  <CardDescription className="text-zinc-400 text-sm">
                    Fetched from admin API • Most recent orders first
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-zinc-700 scrollbar-thumb-zinc-500 hover:scrollbar-thumb-zinc-400 pr-2">
                    {selectedCustomer.orders?.length > 0 ? (
                      selectedCustomer.orders.map((order) => (
                        <div
                          key={order._id}
                          className="p-4 bg-zinc-700/50 rounded-lg border border-zinc-600/50 space-y-3"
                        >
                          {/* Order Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                <Package className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-white">
                                  Order #{order.orderId || order._id.slice(-8)}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-zinc-400">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(
                                      order.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                  <span>
                                    {order.cartItems?.length || 0} items
                                  </span>
                                  {order.paymentMethod && (
                                    <span className="capitalize">
                                      {order.paymentMethod}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-white text-lg">
                                ₹{(order.totalPrice || 0)?.toLocaleString()}
                              </p>
                              <Badge
                                className={`mt-1 ${
                                  order.orderStatus?.toLowerCase() ===
                                  "delivered"
                                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                                    : order.orderStatus?.toLowerCase() ===
                                      "shipped"
                                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                    : order.orderStatus?.toLowerCase() ===
                                      "cancelled"
                                    ? "bg-red-500/20 text-red-300 border-red-500/30"
                                    : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                }`}
                              >
                                {(order.orderStatus || "pending")
                                  ?.charAt(0)
                                  .toUpperCase() +
                                  (order.orderStatus || "pending")?.slice(1)}
                              </Badge>
                            </div>
                          </div>

                          {/* Order Items */}
                          {order.cartItems && order.cartItems.length > 0 && (
                            <div className="border-t border-zinc-600/50 pt-3">
                              <p className="text-sm font-medium text-zinc-300 mb-2">
                                Cart Items:
                              </p>
                              <div className="space-y-2">
                                {order.cartItems
                                  .slice(0, 3)
                                  .map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between text-sm"
                                    >
                                      <div className="flex items-center space-x-3">
                                        {(item.productId?.images?.[0] ||
                                          item.product?.images?.[0] ||
                                          item.image) && (
                                          <img
                                            src={
                                              item.productId?.images?.[0] ||
                                              item.product?.images?.[0] ||
                                              item.image
                                            }
                                            alt={
                                              item.productId?.name ||
                                              item.product?.name ||
                                              item.name ||
                                              item.title
                                            }
                                            className="w-8 h-8 rounded object-cover"
                                            onError={(e) => {
                                              e.target.style.display = "none";
                                            }}
                                          />
                                        )}
                                        <div>
                                          <p className="text-zinc-300 font-medium">
                                            {item.productId?.name ||
                                              item.product?.name ||
                                              item.name ||
                                              item.title ||
                                              "Product not found"}
                                          </p>
                                          <p className="text-zinc-500 text-xs">
                                            Qty: {item.quantity} × ₹
                                            {(
                                              item.price ||
                                              item.productId?.price ||
                                              item.product?.price ||
                                              0
                                            )?.toLocaleString()}
                                          </p>
                                        </div>
                                      </div>
                                      <p className="text-zinc-300 font-medium">
                                        ₹
                                        {(
                                          item.quantity *
                                          (item.price ||
                                            item.productId?.price ||
                                            item.product?.price ||
                                            0)
                                        )?.toLocaleString()}
                                      </p>
                                    </div>
                                  ))}
                                {order.cartItems.length > 3 && (
                                  <p className="text-xs text-zinc-500 text-center pt-1">
                                    +{order.cartItems.length - 3} more items
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Additional Order Info */}
                          <div className="border-t border-zinc-600/50 pt-2">
                            <div className="flex justify-between items-center text-xs text-zinc-500">
                              <span>Email: {order.email}</span>
                              {order.trackingNumber && (
                                <span>Tracking: {order.trackingNumber}</span>
                              )}
                            </div>
                            {order.adminNotes && (
                              <div className="mt-2">
                                <p className="text-xs text-zinc-400">
                                  <strong>Admin Notes:</strong>{" "}
                                  {order.adminNotes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">
                          No orders found
                        </h3>
                        <p className="text-zinc-400">
                          This customer hasn't placed any orders yet
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter className="flex-shrink-0 border-t border-zinc-800 pt-4 mt-4">
            <Button
              onClick={() => setShowCustomerDetails(false)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white font-['Montserrat']">
              {statusUpdateForm.isActive ? "Activate" : "Deactivate"} Customer
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {statusUpdateForm.isActive
                ? "This will reactivate the customer account and allow them to place orders."
                : "This will deactivate the customer account and prevent them from placing new orders."}
            </DialogDescription>
          </DialogHeader>
          {errors.submit && (
            <div className="bg-red-900/20 border border-red-800/30 text-red-300 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {errors.submit}
            </div>
          )}
          <form onSubmit={handleStatusUpdate}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">
                  Reason (Optional)
                </label>
                <Textarea
                  value={statusUpdateForm.reason}
                  onChange={(e) =>
                    setStatusUpdateForm({
                      ...statusUpdateForm,
                      reason: e.target.value,
                    })
                  }
                  placeholder="Enter reason for status change"
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400 resize-none"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowStatusModal(false);
                  setErrors({});
                }}
                className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={actionLoading}
                className={
                  statusUpdateForm.isActive
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {statusUpdateForm.isActive
                      ? "Activating..."
                      : "Deactivating..."}
                  </>
                ) : (
                  <>
                    {statusUpdateForm.isActive ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    {statusUpdateForm.isActive ? "Activate" : "Deactivate"}{" "}
                    Customer
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400 font-['Montserrat']">
              Delete Customer
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              This action cannot be undone. This will permanently delete the
              customer account and all associated data.
            </DialogDescription>
          </DialogHeader>
          {errors.submit && (
            <div className="bg-red-900/20 border border-red-800/30 text-red-300 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {errors.submit}
            </div>
          )}
          <form onSubmit={handleDeleteCustomer}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-300">
                  Reason for Deletion <span className="text-red-400">*</span>
                </label>
                <Textarea
                  value={deleteForm.deleteReason}
                  onChange={(e) =>
                    setDeleteForm({
                      ...deleteForm,
                      deleteReason: e.target.value,
                    })
                  }
                  placeholder="Enter reason for deleting this customer (required)"
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400 resize-none"
                  required
                  rows={3}
                />
              </div>
              <div className="bg-red-900/20 border border-red-800/30 text-red-300 px-4 py-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">
                      Warning: This action is irreversible
                    </p>
                    <p className="text-sm text-red-400 mt-1">
                      Deleting this customer will remove all their order
                      history, addresses, and account data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setErrors({});
                }}
                className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={actionLoading || !deleteForm.deleteReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Customer
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
