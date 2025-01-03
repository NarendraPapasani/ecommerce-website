import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ element: Component }) => {
  const jwt = Cookies.get("jwt1");

  return jwt ? Component : <Navigate to="/login" />;
};

export default ProtectedRoute;
