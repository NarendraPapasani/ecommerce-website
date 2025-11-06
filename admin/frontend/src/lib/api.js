import axios from "axios";

const API_BASE_URL = "http://localhost:4001";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Products API
export const productAPI = {
  getAll: (params) => api.get("/admin/products", { params }),
  getById: (id) => api.get(`/admin/products/${id}`),
  create: (data) => api.post("/admin/products", data),
  update: (id, data) => api.put(`/admin/products/${id}`, data),
  delete: (id) => api.delete(`/admin/products/${id}`),
  bulkUpload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/admin/products/bulk-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getCategories: () => api.get("/admin/products/categories"),
  getAnalytics: () => api.get("/admin/products/analytics"),
};

// Orders API
export const orderAPI = {
  getAll: (params) => api.get("/admin/orders", { params }),
  getById: (id) => api.get(`/admin/orders/${id}`),
  updateStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  generateInvoice: (id) =>
    api.get(`/admin/orders/${id}/invoice`, { responseType: "blob" }),
  generateShippingLabel: (id) =>
    api.get(`/admin/orders/${id}/shipping-label`, { responseType: "blob" }),
  processRefund: (id, data) => api.post(`/admin/orders/${id}/refund`, data),
  getAnalytics: (params) => api.get("/admin/orders/analytics", { params }),
};

// Users API
export const userAPI = {
  getAll: (params) => api.get("/admin/users", { params }),
  getById: (id) => api.get(`/admin/users/${id}`),
  updateStatus: (id, data) => api.put(`/admin/users/${id}/status`, data),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  delete: (id, data) => api.delete(`/admin/users/${id}`, { data }),
  getAnalytics: (params) => api.get("/admin/users/analytics", { params }),
  export: (params) =>
    api.get("/admin/users/export", { params, responseType: "blob" }),
};

export default api;
