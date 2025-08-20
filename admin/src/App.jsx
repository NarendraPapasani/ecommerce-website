import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/auth/AdminLogin';
import Dashboard from './pages/dashboard/Dashboard';
import AdminLayout from './components/layout/AdminLayout';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { Toaster } from './components/ui/toaster';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route
            path="/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <div className="text-white">Users Management - Coming Soon</div>
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <div className="text-white">Products Management - Coming Soon</div>
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <div className="text-white">Orders Management - Coming Soon</div>
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
