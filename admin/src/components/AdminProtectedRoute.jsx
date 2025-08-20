import React from 'react';
import { Navigate } from 'react-router-dom';
import { adminAuthService } from '../services/adminService';

const AdminProtectedRoute = ({ children }) => {
  const isAuthenticated = adminAuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;