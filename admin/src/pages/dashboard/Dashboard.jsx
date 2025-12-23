import React, { useState, useEffect } from 'react';
import { adminDashboardService } from '../../services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Loader2, Users, Package, ShoppingCart, TrendingUp, Eye, User, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminDashboardService.getDashboardStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'Processing': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'Shipped': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      'Delivered': 'bg-green-500/10 text-green-500 border-green-500/20',
      'Cancelled': 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400">Overview of your ecommerce platform</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-zinc-500">
              +{stats?.totalAdmins || 0} admins
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Products</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-zinc-500">
              Active inventory
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-zinc-500">
              All time orders
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(stats?.monthlyRevenue?.reduce((total, month) => total + month.revenue, 0) || 0)}
            </div>
            <p className="text-xs text-zinc-500">
              Last 6 months
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div key={order.orderId} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-zinc-700">
                        <User className="h-4 w-4 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white truncate">
                          {order.email}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {formatCurrency(order.totalPrice)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                      <p className="text-xs text-zinc-500 mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-center py-4">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.orderStatusStats?.length > 0 ? (
                stats.orderStatusStats.map((statusStat) => (
                  <div key={statusStat._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(statusStat._id)}>
                        {statusStat._id}
                      </Badge>
                    </div>
                    <span className="text-lg font-semibold text-white">
                      {statusStat.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-center py-4">No order status data</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart Placeholder */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.monthlyRevenue?.length > 0 ? (
              stats.monthlyRevenue.map((month) => (
                <div key={`${month._id.year}-${month._id.month}`} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-zinc-400" />
                    <span className="text-white">
                      {new Date(month._id.year, month._id.month - 1).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-white">
                      {formatCurrency(month.revenue)}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {month.orders} orders
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-center py-4">No revenue data available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;