import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

// Schema
const getSchema = (allowAdmin) =>
  z
    .object({
      fullName: z.string().min(2, "Full name is required"),
      username: z.string().min(3, "Username is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
      role: allowAdmin
        ? z.enum(["tourist", "operator", "admin"])
        : z.enum(["tourist", "operator"]),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

export function SignupForm({ isAdminSignup = false }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const schema = getSchema(isAdminSignup);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const { confirmPassword, ...signupData } = data;

    try {
      // 1. Choose correct signup endpoint
      const signupUrl =
        signupData.role === "admin"
          ? "http://localhost:5000/api/auth/admin/signup"
          : "http://localhost:5000/api/auth/signup";

      const res = await fetch(signupUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Signup failed");

      // 2. Auto-login after signup
      const loginUrl =
        signupData.role === "admin"
          ? "http://localhost:5000/api/auth/admin/login"
          : "http://localhost:5000/api/auth/login";

      const loginRes = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrUsername: signupData.email || signupData.username,
          password: signupData.password,
        }),
      });

      const loginResult = await loginRes.json();
      if (!loginRes.ok) throw new Error(loginResult.message || "Login failed");

      // 3. Store token & redirect
      login({
        token: loginResult.token,
        role: loginResult.user.role,
        fullName:
          loginResult.user.full_name ||
          loginResult.user.fullName ||
          loginResult.user.username,
      });

      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => {
        switch (loginResult.user.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "operator":
            navigate("/operator/dashboard");
            break;
          case "tourist":
          default:
            navigate("/tourist/dashboard");
        }
      }, 1000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-orange-700 mb-4">Sign Up</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <input
            {...register("fullName")}
            placeholder="Full Name"
            className="w-full border p-2 rounded"
            aria-invalid={errors.fullName ? "true" : "false"}
          />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}

          <input
            {...register("username")}
            placeholder="Username"
            className="w-full border p-2 rounded"
            aria-invalid={errors.username ? "true" : "false"}
          />
          {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}

          <input
            {...register("email")}
            placeholder="Email"
            type="email"
            className="w-full border p-2 rounded"
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

          <select {...register("role")} className="w-full border p-2 rounded">
            <option value="tourist">Tourist</option>
            <option value="operator">Tour Operator</option>
            {isAdminSignup && <option value="admin">Admin</option>}
          </select>

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border p-2 rounded pr-10"
              aria-invalid={errors.password ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2.5 text-gray-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full border p-2 rounded pr-10"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-2.5 text-gray-600"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {!isAdminSignup && (
          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Log in here
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
