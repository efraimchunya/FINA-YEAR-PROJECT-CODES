// src/routes/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  return auth.token && auth.user.role.toLowerCase() === 'admin' ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
