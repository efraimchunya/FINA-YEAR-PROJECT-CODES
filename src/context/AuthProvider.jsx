import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);
  const [userName, setUserName] = useState(localStorage.getItem("userName") || null);

  const login = ({ token, role, fullName }) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", fullName);
    setToken(token);
    setUserRole(role);
    setUserName(fullName);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUserRole(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ token, userRole, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
