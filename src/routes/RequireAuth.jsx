import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export const RequireAuth = ({ children, allowedRoles }) => {
  const { token, userRole } = useAuth();
  const location = useLocation();

  if (!token) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Logged in but role not authorized: redirect to home or unauthorized page
    return <Navigate to="/" replace />;
  }

  // Authorized
  return children;
};
