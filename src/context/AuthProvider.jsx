import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load initial state from localStorage or set null
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);
  const [userName, setUserName] = useState(localStorage.getItem("userName") || null);
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || null);
  const [phone, setPhone] = useState(localStorage.getItem("userPhone") || null);
  const [image, setImage] = useState(localStorage.getItem("userImage") || null);

  // Login method stores all info in state and localStorage
  const login = ({ token, role, fullName, email, phone, image }) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", fullName);
    localStorage.setItem("userEmail", email || "");
    localStorage.setItem("userPhone", phone || "");
    localStorage.setItem("userImage", image || "");

    setToken(token);
    setUserRole(role);
    setUserName(fullName);
    setEmail(email);
    setPhone(phone);
    setImage(image);
  };

  // Logout clears all
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUserRole(null);
    setUserName(null);
    setEmail(null);
    setPhone(null);
    setImage(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, userRole, userName, email, phone, image, login, logout }}
    >
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
