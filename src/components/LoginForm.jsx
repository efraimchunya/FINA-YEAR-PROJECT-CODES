import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthProvider";

// ✅ Validation schema
const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth(); // From AuthProvider

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

      if (!res.ok) {
        throw new Error(result.message || "Login failed");
      }

      login({
        token: result.token,
        role: result.user.role,
        fullName: result.user.full_name || result.user.fullName || result.user.username,
        email: result.user.email,
        phone: result.user.phone,
        image: result.user.image,
      });

      switch (result.user.role) {
        case "tourist":
          navigate("/tourist/dashboard");
          break;
        case "operator":
          navigate("/operator/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
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
    <div className="min-h-screen flex items-center justify-center bg-orange-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md flex flex-col items-center">
        {/* ✅ Logo */}
        <img
          src="/icons/img/zanzibar-logo.png"
          alt="Zanzibar Logo"
          className="w-24 h-24 mb-4 object-contain rounded-full"
        />

        <h2 className="text-2xl font-bold text-center text-orange-700 mb-6">Login</h2>

        {/* ✅ Error */}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          {/* Email or Username */}
          <input
            {...register("emailOrUsername")}
            type="text"
            placeholder="Email or Username"
            className="w-full border p-2 rounded"
          />
          {errors.emailOrUsername && (
            <p className="text-sm text-red-500">{errors.emailOrUsername.message}</p>
          )}

          {/* Password Field */}
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border p-2 rounded pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2.5 text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* ✅ Switch to Signup */}
        <div className="text-center text-sm mt-4 text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up here
          </span>
        </div>
      </div>
    </div>
  );
}
