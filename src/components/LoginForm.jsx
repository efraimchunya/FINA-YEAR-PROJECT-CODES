import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider"; // ✅ IMPORT AUTH CONTEXT

// Zod validation schema
const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ GET login METHOD FROM CONTEXT

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login failed");

      // ✅ Update context instead of directly calling localStorage
      login({
        token: result.token,
        role: result.user.role,
        fullName: result.user.full_name || result.user.fullName,
      });

      // ✅ Redirect by role
      switch (result.user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "operator":
          navigate("/operator/dashboard");
          break;
        case "tourist":
          navigate("/tourist/dashboard");
          break;
        default:
          throw new Error("Unknown user role");
      }
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-100">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-orange-700 mb-4">Log In</h2>
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("emailOrUsername")}
            placeholder="Email or Username"
            className="w-full border p-2 rounded"
          />
          {errors.emailOrUsername && (
            <p className="text-sm text-red-500">{errors.emailOrUsername.message}</p>
          )}

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border p-2 rounded pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2.5 cursor-pointer text-gray-600"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/signup")}>
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
}
