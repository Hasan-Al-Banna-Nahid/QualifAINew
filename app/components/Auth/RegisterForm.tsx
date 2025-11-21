// app/components/Auth/RegisterForm.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterFormData,
} from "@/app/(main)/lib/validations/auth";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  Sparkles,
  Check,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function RegisterForm() {
  const { theme } = useTheme();
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isDark = theme === "dark";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
    } catch (error: any) {
      setError("root", {
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    }
  };

  const passwordStrength = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password || ""),
    lowercase: /[a-z]/.test(password || ""),
    number: /\d/.test(password || ""),
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
              ? "bg-purple-900/40 text-purple-300 border border-purple-700/50"
              : "bg-purple-100 text-purple-700 border border-purple-300"
          )}
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          Join QualifAI Today
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p
          className={clsx(
            "mt-2 text-sm",
            isDark ? "text-purple-300/80" : "text-gray-600"
          )}
        >
          Start your journey with AI-powered quality assurance
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div>
          <label
            className={clsx(
              "block text-sm font-medium mb-2",
              isDark ? "text-purple-300" : "text-gray-700"
            )}
          >
            Full Name
          </label>
          <div className="relative">
            <User
              className={clsx(
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5",
                isDark ? "text-purple-400" : "text-gray-400",
                errors.name && "text-red-500"
              )}
            />
            <input
              {...register("name")}
              type="text"
              className={clsx(
                "w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-offset-2",
                isDark
                  ? "bg-slate-800 border-slate-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                  : "bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20",
                errors.name &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
              placeholder="Enter your full name"
            />
          </div>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 mt-1 text-sm text-red-500"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.name.message}
            </motion.p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            className={clsx(
              "block text-sm font-medium mb-2",
              isDark ? "text-purple-300" : "text-gray-700"
            )}
          >
            Email Address
          </label>
          <div className="relative">
            <Mail
              className={clsx(
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5",
                isDark ? "text-purple-400" : "text-gray-400",
                errors.email && "text-red-500"
              )}
            />
            <input
              {...register("email")}
              type="email"
              className={clsx(
                "w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-offset-2",
                isDark
                  ? "bg-slate-800 border-slate-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                  : "bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20",
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
              isDark ? "text-purple-300" : "text-gray-700"
            )}
          >
            Password
          </label>
          <div className="relative">
            <Lock
              className={clsx(
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5",
                isDark ? "text-purple-400" : "text-gray-400",
                errors.password && "text-red-500"
              )}
            />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className={clsx(
                "w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-offset-2",
                isDark
                  ? "bg-slate-800 border-slate-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                  : "bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20",
                errors.password &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
              placeholder="Create a password"
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

          {/* Password Strength */}
          {password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 space-y-2"
            >
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(passwordStrength).map(([key, isValid]) => (
                  <div key={key} className="flex items-center gap-1">
                    <div
                      className={clsx(
                        "w-3 h-3 rounded-full flex items-center justify-center",
                        isValid
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 dark:bg-gray-600"
                      )}
                    >
                      {isValid && <Check className="w-2 h-2" />}
                    </div>
                    <span
                      className={clsx(
                        "capitalize",
                        isValid
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                      )}
                    >
                      {key}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

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

        {/* Confirm Password Field */}
        <div>
          <label
            className={clsx(
              "block text-sm font-medium mb-2",
              isDark ? "text-purple-300" : "text-gray-700"
            )}
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock
              className={clsx(
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5",
                isDark ? "text-purple-400" : "text-gray-400",
                errors.confirmPassword && "text-red-500"
              )}
            />
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              className={clsx(
                "w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-offset-2",
                isDark
                  ? "bg-slate-800 border-slate-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                  : "bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20",
                errors.confirmPassword &&
                  "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={clsx(
                "absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors",
                isDark ? "hover:bg-slate-700" : "hover:bg-gray-100"
              )}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 mt-1 text-sm text-red-500"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.confirmPassword.message}
            </motion.p>
          )}
        </div>

        {/* Terms Agreement */}
        <div>
          <label className="flex items-start gap-3">
            <input
              {...register("agreeToTerms")}
              type="checkbox"
              className={clsx(
                "w-4 h-4 rounded border-2 focus:ring-2 focus:ring-offset-2 mt-1 flex-shrink-0",
                isDark
                  ? "bg-slate-800 border-slate-600 text-purple-600 focus:ring-purple-500/20"
                  : "bg-white border-gray-300 text-purple-600 focus:ring-purple-500/20"
              )}
            />
            <span
              className={clsx(
                "text-sm",
                isDark ? "text-purple-300" : "text-gray-700"
              )}
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-purple-500 hover:text-purple-400 font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-purple-500 hover:text-purple-400 font-medium"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreeToTerms && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 mt-1 text-sm text-red-500 ml-7"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.agreeToTerms.message}
            </motion.p>
          )}
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
              ? "bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-600/50"
              : "bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-600/50"
          )}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating account...
            </div>
          ) : (
            "Create Account"
          )}
        </motion.button>

        {/* Sign In Link */}
        <div className="text-center">
          <p
            className={clsx(
              "text-sm",
              isDark ? "text-purple-300/80" : "text-gray-600"
            )}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className={clsx(
                "font-semibold transition-colors",
                isDark
                  ? "text-purple-400 hover:text-purple-300"
                  : "text-purple-600 hover:text-purple-500"
              )}
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
}
