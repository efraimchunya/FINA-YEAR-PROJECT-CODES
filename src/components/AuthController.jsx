import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const demoUsers = [
  { id: 1, username: "admin", password: "admin123", role: "admin", fullName: "System Admin" },
  { id: 2, username: "tourist1", password: "tourist123", role: "tourist", fullName: "Sarah Johnson" },
  { id: 3, username: "operator1", password: "operator123", role: "operator", fullName: "Amina Hassan" },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login = async (credentials) => {
    const username = credentials.username.trim();
    const password = credentials.password.trim();

    const user = demoUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) return false;

    setCurrentUser({ ...user, isAuthenticated: true });
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
