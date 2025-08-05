// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginForm from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import AdminLogin from "./pages/AdminLogin";
import TouristDashboard from "./pages/TouristDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./components/AdminUserManagement";

import { RequireAuth } from "./routes/RequireAuth";

// Optional 404 page (create this component if you want)
function NotFoundPage() {
  return <h2>404 - Page Not Found</h2>;
}

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/admin/signup" element={<SignupForm isAdminSignup={true} />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected routes */}
        <Route
          path="/tourist/dashboard"
          element={
            <RequireAuth allowedRoles={["tourist"]}>
              <TouristDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/operator/dashboard"
          element={
            <RequireAuth allowedRoles={["operator"]}>
              <OperatorDashboard />
            </RequireAuth>
          }
        />

        {/* Admin dashboard with nested route for user management */}
        <Route
          path="/admin/dashboard/*"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        >
          <Route path="users" element={<UserManagement />} />
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
