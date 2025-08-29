import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table";
import {
  ShoppingBagIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    recentOrders: [],
    topProducts: [],
    orderStatusCounts: {},
    productStats: {},
    userStats: {},
    trends: [],
  });

  useEffect(() => {
    async function fetchAllMetrics() {
      setLoading(true);
      try {
        // Orders
        const ordersRes = await fetch("http://localhost:4001/admin/orders");
        const ordersJson = await ordersRes.json();
        const orders = ordersJson.data?.orders || [];

        // Orders Analytics
        const analyticsRes = await fetch(
          "http://localhost:4001/admin/orders/analytics"
        );
        const analyticsJson = await analyticsRes.json();
        const analytics = analyticsJson.data || {};

        // Products
        const productsRes = await fetch("http://localhost:4001/admin/products");
        const productsJson = await productsRes.json();
        const products = productsJson.data?.products || [];

        // Products Analytics
        const prodAnalyticsRes = await fetch(
          "http://localhost:4001/admin/products/analytics"
        );
        const prodAnalyticsJson = await prodAnalyticsRes.json();
        const prodAnalytics = prodAnalyticsJson.data || {};

        // Users
        const usersRes = await fetch("http://localhost:4001/admin/users");
        const usersJson = await usersRes.json();
        const users = usersJson.data?.users || [];

        // Users Analytics
        const userAnalyticsRes = await fetch(
          "http://localhost:4001/admin/users/analytics"
        );
        const userAnalyticsJson = await userAnalyticsRes.json();
        const userAnalytics = userAnalyticsJson.data || {};

        // Metrics
        setMetrics({
          totalRevenue: analytics.revenue?.totalRevenue || 0,
          totalOrders: analytics.totalOrders || orders.length,
          totalProducts: prodAnalytics.totalProducts || products.length,
          totalUsers: userAnalytics.totalUsers || users.length,
          activeUsers: userAnalytics.activeUsers || 0,
          inactiveUsers: userAnalytics.inactiveUsers || 0,
          recentOrders: orders.slice(0, 5),
          topProducts: analytics.topProducts || [],
          orderStatusCounts: Object.fromEntries(
            (analytics.statusDistribution || []).map((s) => [s._id, s.count])
          ),
          productStats: prodAnalytics,
          userStats: userAnalytics,
          trends: analytics.dailyTrends || [],
        });
      } catch (err) {
        console.error("Dashboard metrics error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllMetrics();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Main metric cards
  const statsCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(metrics.totalRevenue),
      icon: CurrencyDollarIcon,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-500/20 to-emerald-600/10",
    },
    {
      title: "Total Orders",
      value: metrics.totalOrders.toLocaleString(),
      icon: ClipboardDocumentListIcon,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/20 to-blue-600/10",
    },
    {
      title: "Total Products",
      value: metrics.totalProducts.toLocaleString(),
      icon: ShoppingBagIcon,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/20 to-purple-600/10",
    },
    {
      title: "Total Users",
      value: metrics.totalUsers.toLocaleString(),
      icon: UserGroupIcon,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-500/20 to-orange-600/10",
    },
  ];

  // Order status cards
  const orderStatusCards = Object.entries(metrics.orderStatusCounts).map(
    ([status, value]) => {
      const statusMap = {
        pending: {
          color: "text-yellow-400",
          bg: "bg-yellow-500/20",
          icon: ClockIcon,
        },
        confirmed: {
          color: "text-blue-400",
          bg: "bg-blue-500/20",
          icon: CheckCircleIcon,
        },
        shipped: {
          color: "text-purple-400",
          bg: "bg-purple-500/20",
          icon: TruckIcon,
        },
        delivered: {
          color: "text-green-400",
          bg: "bg-green-500/20",
          icon: CheckCircleIcon,
        },
        cancelled: {
          color: "text-red-400",
          bg: "bg-red-500/20",
          icon: XCircleIcon,
        },
        refunded: {
          color: "text-pink-400",
          bg: "bg-pink-500/20",
          icon: XCircleIcon,
        },
      };
      const map = statusMap[status.toLowerCase()] || statusMap["pending"];
      return {
        title: status.charAt(0).toUpperCase() + status.slice(1),
        value,
        icon: map.icon,
        color: map.color,
        bgColor: map.bg,
      };
    }
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-zinc-800 rounded-lg w-64 animate-pulse"></div>
            <div className="h-4 bg-zinc-800 rounded-lg w-96 animate-pulse"></div>
          </div>
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                className="bg-zinc-900/50 border-zinc-800 animate-pulse"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-zinc-800 rounded w-24"></div>
                    <div className="h-8 bg-zinc-800 rounded w-32"></div>
                    <div className="h-3 bg-zinc-800 rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-['Montserrat']">
                Dashboard Overview
              </h1>
              <p className="text-zinc-400 font-['Montserrat']">
                Welcome back! Here's what's happening with your business today.
              </p>
            </div>
          </div>
        </div>
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:bg-zinc-900/70 transition-all duration-300 group overflow-hidden relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-400 font-['Montserrat']">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-white font-['Montserrat']">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full bg-gradient-to-br ${stat.gradient} shadow-lg`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Order Status Overview */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white font-['Montserrat'] flex items-center space-x-2">
              <ClipboardDocumentListIcon className="h-5 w-5 text-blue-400" />
              <span>Order Status Overview</span>
            </CardTitle>
            <CardDescription className="text-zinc-400 font-['Montserrat']">
              Current status distribution of all orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {orderStatusCards.map((status, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${status.bgColor} border border-zinc-800`}
                >
                  <div className="flex items-center space-x-3">
                    <status.icon className={`h-6 w-6 ${status.color}`} />
                    <div>
                      <p
                        className={`text-sm font-medium ${status.color} font-['Montserrat']`}
                      >
                        {status.title}
                      </p>
                      <p className="text-xl font-bold text-white font-['Montserrat']">
                        {status.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Recent Orders & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders: 100% on mobile, 66% on laptop */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white font-['Montserrat'] flex items-center space-x-2">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-blue-400" />
                  <span>Recent Orders</span>
                </CardTitle>
                <CardDescription className="text-zinc-400 font-['Montserrat']">
                  Latest orders from your customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics.recentOrders.map((order) => (
                      <TableRow key={order.orderId || order._id}>
                        <TableCell>
                          #
                          {(order.orderId || order._id).slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell>{order.email || "No email"}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.orderStatus === "delivered"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : order.orderStatus === "shipped"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : order.orderStatus === "cancelled"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            }`}
                          >
                            {order.orderStatus?.charAt(0).toUpperCase() +
                              order.orderStatus?.slice(1) || "Pending"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(order.totalPrice || 0)}
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {metrics.recentOrders.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-zinc-500 py-8"
                        >
                          No recent orders found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          {/* Top Products: 100% on mobile, 33% on laptop */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white font-['Montserrat'] flex items-center space-x-2">
                  <ShoppingBagIcon className="h-5 w-5 text-purple-400" />
                  <span>Top Selling Products</span>
                </CardTitle>
                <CardDescription className="text-zinc-400 font-['Montserrat']">
                  Most popular products by sales volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Units Sold</TableHead>
                        <TableHead>Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metrics.topProducts.map((product, index) => (
                        <TableRow key={product._id || index}>
                          <TableCell>{product._id || "N/A"}</TableCell>
                          <TableCell>{product.totalSold || 0}</TableCell>
                          <TableCell>
                            {formatCurrency(product.totalRevenue || 0)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {metrics.topProducts.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-zinc-500 py-8"
                          >
                            No product data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* User & Product Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Stats: 100% on mobile, 66% on laptop/desktop/tablet */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white font-['Montserrat'] flex items-center space-x-2">
                  <UserGroupIcon className="h-5 w-5 text-orange-400" />
                  <span>User Metrics</span>
                </CardTitle>
                <CardDescription className="text-zinc-400 font-['Montserrat']">
                  User activity and top customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-orange-500/20 border border-orange-800">
                    <p className="text-sm text-orange-400 font-medium">
                      Active Users
                    </p>
                    <p className="text-xl font-bold text-white">
                      {metrics.activeUsers}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-700/20 border border-zinc-800">
                    <p className="text-sm text-zinc-400 font-medium">
                      Inactive Users
                    </p>
                    <p className="text-xl font-bold text-white">
                      {metrics.inactiveUsers}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-zinc-400 font-medium mb-2">
                    Top Customers
                  </p>
                  <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Orders</TableHead>
                          <TableHead>Total Spent</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {metrics.userStats.topCustomers &&
                        metrics.userStats.topCustomers.length > 0 ? (
                          metrics.userStats.topCustomers.map(
                            (customer, idx) => (
                              <TableRow key={customer.user?._id || idx}>
                                <TableCell>
                                  {customer.user?.firstName +
                                    " " +
                                    (customer.user?.lastName || "") || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {customer.user?.email || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {customer.orderCount || 0}
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(customer.totalSpent || 0)}
                                </TableCell>
                              </TableRow>
                            )
                          )
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-center text-zinc-500 py-8"
                            >
                              No top customers found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Product Stats: 100% on mobile, 33% on laptop/desktop/tablet */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white font-['Montserrat'] flex items-center space-x-2">
                  <ShoppingBagIcon className="h-5 w-5 text-purple-400" />
                  <span>Product Metrics</span>
                </CardTitle>
                <CardDescription className="text-zinc-400 font-['Montserrat']">
                  Stock, category, and price analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-purple-500/20 border border-purple-800">
                    <p className="text-sm text-purple-400 font-medium">
                      Total Stock
                    </p>
                    <p className="text-xl font-bold text-white">
                      {metrics.productStats.stockStats?.totalStock || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-700/20 border border-zinc-800">
                    <p className="text-sm text-zinc-400 font-medium">
                      Low Stock Products
                    </p>
                    <p className="text-xl font-bold text-white">
                      {metrics.productStats.stockStats?.lowStockCount || 0}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-zinc-400 font-medium mb-2">
                    Category Distribution
                  </p>
                  <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead>Products</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {metrics.productStats.categoryStats &&
                        metrics.productStats.categoryStats.length > 0 ? (
                          metrics.productStats.categoryStats.map((cat, idx) => (
                            <TableRow key={cat._id || idx}>
                              <TableCell>
                                {cat._id || cat.name || "N/A"}
                              </TableCell>
                              <TableCell>{cat.count || 0}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              className="text-center text-zinc-500 py-8"
                            >
                              No category data found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
