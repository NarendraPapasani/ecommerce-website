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
import {
  ShoppingBagIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { orderAPI, userAPI, productAPI } from "../lib/api";

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
    },
    orders: {
      dailyTrends: [],
      statusDistribution: [],
      topProducts: [],
    },
    users: {
      dailyRegistrations: [],
      topCustomers: [],
      activityStats: {},
    },
    products: {
      categoryStats: [],
      priceStats: {},
    },
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [orderAnalytics, userAnalytics, productAnalytics] =
        await Promise.all([
          orderAPI.getAnalytics(dateRange),
          userAPI.getAnalytics(dateRange),
          productAPI.getAnalytics(),
        ]);

      setAnalytics({
        overview: {
          totalProducts: productAnalytics.data.data.totalProducts,
          totalOrders: orderAnalytics.data.data.totalOrders,
          totalUsers: userAnalytics.data.data.totalUsers,
          totalRevenue: orderAnalytics.data.data.revenue.totalRevenue,
        },
        orders: {
          dailyTrends: orderAnalytics.data.data.dailyTrends,
          statusDistribution: orderAnalytics.data.data.statusDistribution,
          topProducts: orderAnalytics.data.data.topProducts,
        },
        users: {
          dailyRegistrations: userAnalytics.data.data.dailyRegistrations,
          topCustomers: userAnalytics.data.data.topCustomers,
          activityStats: userAnalytics.data.data.activityStats,
        },
        products: {
          categoryStats: productAnalytics.data.data.categoryStats,
          priceStats: productAnalytics.data.data.priceStats,
        },
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => `₹${amount?.toLocaleString() || "0"}`;

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-600",
      confirmed: "bg-blue-600",
      processing: "bg-purple-600",
      shipped: "bg-indigo-600",
      delivered: "bg-green-600",
      cancelled: "bg-red-600",
      refunded: "bg-gray-600",
    };
    return colors[status] || "bg-gray-600";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-dark-800 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>

        {/* Date Range Filter */}
        <div className="flex gap-2">
          <Input
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
            className="w-auto"
          />
          <Input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="w-auto"
          />
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(analytics.overview.totalRevenue)}
                </p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-white">
                  {analytics.overview.totalOrders}
                </p>
              </div>
              <ClipboardDocumentListIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Customers
                </p>
                <p className="text-2xl font-bold text-white">
                  {analytics.overview.totalUsers}
                </p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-white">
                  {analytics.overview.totalProducts}
                </p>
              </div>
              <ShoppingBagIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Breakdown of orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.orders.statusDistribution.map((status) => (
                <div
                  key={status._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(
                        status._id
                      )}`}
                    ></div>
                    <span className="text-sm font-medium text-white capitalize">
                      {status._id}
                    </span>
                  </div>
                  <span className="text-sm text-slate-400">{status.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.orders.topProducts
                .slice(0, 5)
                .map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white">{product._id}</p>
                      <p className="text-sm text-slate-400">
                        {product.totalSold} units sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">
                        {formatCurrency(product.totalRevenue)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>Products distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.products.categoryStats.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    {category._id}
                  </span>
                  <span className="text-sm text-slate-400">
                    {category.count} products
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Highest spending customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.users.topCustomers
                .slice(0, 5)
                .map((customer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {(customer.user?.firstName ||
                          customer.user?.email ||
                          "Unknown") +
                          (customer.user?.lastName
                            ? ` ${customer.user.lastName}`
                            : "")}
                      </p>
                      <p className="text-sm text-slate-400">
                        {customer.orderCount} orders
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">
                        {formatCurrency(customer.totalSpent)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Sales Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily Sales Trend</CardTitle>
            <CardDescription>
              Orders and revenue over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.orders.dailyTrends.slice(-7).map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-dark-800 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <ChartBarIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-white">
                        {day._id.day}/{day._id.month}/{day._id.year}
                      </p>
                      <p className="text-sm text-slate-400">
                        {day.orders} orders
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">
                      {formatCurrency(day.revenue)}
                    </p>
                    <div className="flex items-center text-sm text-green-400">
                      <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                      Revenue
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Activity</CardTitle>
            <CardDescription>User engagement statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">
                  Customers with Orders
                </span>
                <span className="text-sm font-medium text-white">
                  {analytics.users.activityStats.usersWithOrders || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">
                  Customers without Orders
                </span>
                <span className="text-sm font-medium text-white">
                  {analytics.users.activityStats.usersWithoutOrders || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">
                  Avg Orders per Customer
                </span>
                <span className="text-sm font-medium text-white">
                  {analytics.users.activityStats.avgOrdersPerUser?.toFixed(1) ||
                    "0.0"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Product Pricing</CardTitle>
            <CardDescription>Price distribution analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Average Price</span>
                <span className="text-sm font-medium text-white">
                  {formatCurrency(analytics.products.priceStats.avgPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Lowest Price</span>
                <span className="text-sm font-medium text-white">
                  {formatCurrency(analytics.products.priceStats.minPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Highest Price</span>
                <span className="text-sm font-medium text-white">
                  {formatCurrency(analytics.products.priceStats.maxPrice)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
