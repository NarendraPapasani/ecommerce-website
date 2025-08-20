import React, { useState, useEffect } from 'react';
import { adminUserService } from '../../services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
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
} from '../../components/ui/alert-dialog';
import { toast } from '../../hooks/use-toast';
import { 
  Loader2, 
  Search, 
  Users, 
  UserCheck, 
  UserX, 
  Eye,
  Trash2,
  Shield,
  Calendar
} from 'lucide-react';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    role: '',
    status: '',
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminUserService.getAllUsers(filters);
      if (response.success) {
        setUsers(response.users);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      setUpdating(userId);
      const response = await adminUserService.updateUserStatus(userId, newStatus);
      if (response.success) {
        toast({
          title: "Status updated",
          description: response.message,
        });
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user status",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      setUpdating(userId);
      const response = await adminUserService.updateUserRole(userId, newRole);
      if (response.success) {
        toast({
          title: "Role updated",
          description: response.message,
        });
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setUpdating(userId);
      const response = await adminUserService.deleteUser(userId);
      if (response.success) {
        toast({
          title: "User deleted",
          description: response.message,
        });
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-500/10 text-green-500 border-green-500/20',
      'inactive': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'suspended': 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      'user': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    };
    return colors[role] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users Management</h1>
          <p className="text-zinc-400">Manage and monitor user accounts</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search by name or email..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
            <Select value={filters.role} onValueChange={(value) => handleFilterChange('role', value)}>
              <SelectTrigger className="w-[150px] bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-[150px] bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({pagination.totalUsers || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-500">No users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/70 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                      <span className="text-sm font-semibold text-black">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-zinc-400">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-zinc-500" />
                        <span className="text-xs text-zinc-500">
                          Joined {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                      {user.role}
                    </Badge>
                    <Badge className={getStatusColor(user.accountStatus)}>
                      {user.accountStatus}
                    </Badge>
                    
                    <div className="flex items-center gap-2">
                      {user.role !== 'admin' && (
                        <>
                          <Select
                            value={user.accountStatus}
                            onValueChange={(value) => handleUpdateStatus(user._id, value)}
                            disabled={updating === user._id}
                          >
                            <SelectTrigger className="w-[120px] h-8 bg-zinc-700 border-zinc-600 text-white text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">
                                <div className="flex items-center gap-2">
                                  <UserCheck className="h-3 w-3" />
                                  Active
                                </div>
                              </SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="suspended">
                                <div className="flex items-center gap-2">
                                  <UserX className="h-3 w-3" />
                                  Suspended
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Select
                            value={user.role}
                            onValueChange={(value) => handleUpdateRole(user._id, value)}
                            disabled={updating === user._id}
                          >
                            <SelectTrigger className="w-[100px] h-8 bg-zinc-700 border-zinc-600 text-white text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-3 w-3" />
                                  Admin
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                disabled={updating === user._id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Delete User</AlertDialogTitle>
                                <AlertDialogDescription className="text-zinc-400">
                                  Are you sure you want to delete this user? This action cannot be undone and will remove all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                      
                      {updating === user._id && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
              <p className="text-sm text-zinc-400">
                Showing {((filters.page - 1) * filters.limit) + 1} to {Math.min(filters.page * filters.limit, pagination.totalUsers)} of {pagination.totalUsers} users
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={!pagination.hasPrevPage || loading}
                  className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                >
                  Previous
                </Button>
                <span className="px-3 py-1 text-sm bg-zinc-800 rounded text-white">
                  {filters.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;