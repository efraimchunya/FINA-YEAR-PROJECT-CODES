import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import AdminLogin from "./pages/AdminLogin";
import TouristDashboard from "./pages/TouristDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { RequireAuth } from "./routes/RequireAuth";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/admin/signup" element={<SignupForm isAdminSignup={true} />} />
        <Route path="/admin/login" element={<AdminLogin />} />

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
        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />
      </Routes>
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
