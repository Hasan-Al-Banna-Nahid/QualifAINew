// app/components/Auth/LoginForm.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/app/(main)/lib/validations/auth";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const { theme } = useTheme();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const isDark = theme === "dark";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error: any) {
      setError("root", {
        message:
          error.response?.data?.message || "Login failed. Please try again.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        "w-full max-w-md p-8 rounded-3xl shadow-2xl border-2 backdrop-blur-sm",
        isDark
          ? "bg-slate-900/80 border-slate-700/50 text-white"
          : "bg-white/80 border-gray-200/50 text-gray-900"
      )}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={clsx(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4",
            isDark
              ? "bg-blue-900/40 text-blue-300 border border-blue-700/50"
              : "bg-blue-100 text-blue-700 border border-blue-300"
          )}
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          Welcome Back to QualifAI
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Sign In
        </h2>
        <p
          className={clsx(
            "mt-2 text-sm",
            isDark ? "text-blue-300/80" : "text-gray-600"
          )}
        >
          Enter your credentials to access your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div>
          <label
            className={clsx(
              "block text-sm font-medium mb-2",
              isDark ? "text-blue-300" : "text-gray-700"
            )}
          >
            Email Address
          </label>
          <div className="relative">
            <Mail
              className={clsx(
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5",
                isDark ? "text-blue-400" : "text-gray-400",
                errors.email && "text-red-500"
              )}
            />
            <input
              {...register("email")}
              type="email"
              className={clsx(
                "w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-offset-2",
                isDark
                  ? "bg-slate-800 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20",
                errors.email &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 mt-1 text-sm text-red-500"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            className={clsx(
              "block text-sm font-medium mb-2",
              isDark ? "text-blue-300" : "text-gray-700"
            )}
          >
            Password
          </label>
          <div className="relative">
            <Lock
              className={clsx(
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5",
                isDark ? "text-blue-400" : "text-gray-400",
                errors.password && "text-red-500"
              )}
            />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className={clsx(
                "w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-offset-2",
                isDark
                  ? "bg-slate-800 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500/20"
                  : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20",
                errors.password &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={clsx(
                "absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors",
                isDark ? "hover:bg-slate-700" : "hover:bg-gray-100"
              )}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 mt-1 text-sm text-red-500"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.password.message}
            </motion.p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              {...register("rememberMe")}
              type="checkbox"
              className={clsx(
                "w-4 h-4 rounded border-2 focus:ring-2 focus:ring-offset-2",
                isDark
                  ? "bg-slate-800 border-slate-600 text-blue-600 focus:ring-blue-500/20"
                  : "bg-white border-gray-300 text-blue-600 focus:ring-blue-500/20"
              )}
            />
            <span
              className={clsx(
                "ml-2 text-sm",
                isDark ? "text-blue-300" : "text-gray-700"
              )}
            >
              Remember me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className={clsx(
              "text-sm font-medium transition-colors",
              isDark
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-500"
            )}
          >
            Forgot password?
          </Link>
        </div>

        {/* Error Message */}
        {errors.root && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={clsx(
              "p-3 rounded-xl border-2 flex items-center gap-2",
              isDark
                ? "bg-red-900/20 border-red-700/50 text-red-300"
                : "bg-red-50 border-red-200 text-red-700"
            )}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{errors.root.message}</span>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className={clsx(
            "w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group",
            isDark
              ? "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-600/50"
              : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-600/50"
          )}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </motion.button>

        {/* Sign Up Link */}
        <div className="text-center">
          <p
            className={clsx(
              "text-sm",
              isDark ? "text-blue-300/80" : "text-gray-600"
            )}
          >
            Don't have an account?{" "}
            <Link
              href="/register"
              className={clsx(
                "font-semibold transition-colors",
                isDark
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              )}
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
}
