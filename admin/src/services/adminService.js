import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const adminAuthService = {
  // Admin login
  login: async (email, password) => {
    const response = await api.post('/admin/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
    }
    return response.data;
  },

  // Admin logout
  logout: async () => {
    await api.post('/admin/logout');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  // Get current admin user
  getCurrentUser: () => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  },

  // Check if admin is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },
};

export const adminDashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },
};

export const adminUserService = {
  // Get all users
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (userId, accountStatus) => {
    const response = await api.put(`/admin/users/${userId}/status`, { accountStatus });
    return response.data;
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/admin/users/stats');
    return response.data;
  },
};

export const adminProductService = {
  // Get all products
  getAllProducts: async (params = {}) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  // Get product by ID
  getProductById: async (productId) => {
    const response = await api.get(`/admin/products/${productId}`);
    return response.data;
  },

  // Create product
  createProduct: async (productData) => {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (productId, productData) => {
    const response = await api.put(`/admin/products/${productId}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (productId) => {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  },

  // Bulk delete products
  bulkDeleteProducts: async (productIds) => {
    const response = await api.delete('/admin/products', { data: { productIds } });
    return response.data;
  },

  // Get product statistics
  getProductStats: async () => {
    const response = await api.get('/admin/products/stats');
    return response.data;
  },
};

export const adminOrderService = {
  // Get all orders
  getAllOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/admin/orders/${orderId}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId, orderStatus) => {
    const response = await api.put(`/admin/orders/${orderId}/status`, { orderStatus });
    return response.data;
  },

  // Bulk update order status
  bulkUpdateOrderStatus: async (orderIds, orderStatus) => {
    const response = await api.put('/admin/orders/status', { orderIds, orderStatus });
    return response.data;
  },

  // Get order statistics
  getOrderStats: async () => {
    const response = await api.get('/admin/orders/stats');
    return response.data;
  },
};

export default api;