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
  Chrome,
  Zap,
  Shield,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function RegisterForm() {
  const { theme } = useTheme();
  const { register: registerUser, authActionLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
  const emailValue = watch("email");
  const nameValue = watch("name");

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

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      // You can add Google registration here if needed
      // For now, we'll use the same signInWithGoogle function
      await registerUser({
        name: "Google User", // This would come from Google profile
        email: "google@example.com", // This would come from Google
        password: "google-password", // This would be handled differently
      });
    } catch (error: any) {
      setError("root", {
        message:
          error.message || "Google registration failed. Please try again.",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const passwordStrength = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password || ""),
    lowercase: /[a-z]/.test(password || ""),
    number: /\d/.test(password || ""),
  };

  const isSubmitting = authActionLoading || googleLoading;

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

      {/* Enhanced Google Sign Up Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
        className={clsx(
          "w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group mb-6 border-2",
          isDark
            ? "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 disabled:opacity-50"
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 shadow-sm"
        )}
      >
        {/* Animated Background */}
        <motion.div
          className={clsx(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            isDark
              ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10"
              : "bg-gradient-to-r from-purple-50 to-pink-50"
          )}
        />

        {/* Google Icon with Animation */}
        <motion.div
          animate={googleLoading ? { rotate: 360 } : {}}
          transition={{
            duration: 2,
            repeat: googleLoading ? Infinity : 0,
            ease: "linear",
          }}
          className="relative z-10"
        >
          <Chrome className="w-5 h-5" />
        </motion.div>

        <span className="relative z-10 font-medium">
          {googleLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Creating account...
            </div>
          ) : (
            "Sign up with Google"
          )}
        </span>

        {/* Premium Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className={clsx(
            "absolute -top-1 -right-1 px-2 py-1 rounded-full text-xs font-bold",
            isDark ? "bg-yellow-500 text-black" : "bg-yellow-400 text-gray-900"
          )}
        >
          <Zap className="w-3 h-3 inline mr-1" />
          Fast
        </motion.div>
      </motion.button>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div
            className={clsx(
              "w-full border-t",
              isDark ? "border-gray-600" : "border-gray-300"
            )}
          />
        </div>
        <div className="relative flex justify-center text-sm">
          <span
            className={clsx(
              "px-3 bg-inherit font-medium",
              isDark ? "text-gray-400" : "text-gray-500"
            )}
          >
            Or sign up with email
          </span>
        </div>
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
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors",
                isDark ? "text-purple-400" : "text-gray-400",
                errors.name && "text-red-500",
                nameValue && !errors.name && "text-green-500"
              )}
            />
            <input
              {...register("name")}
              type="text"
              disabled={isSubmitting}
              className={clsx(
                "w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                isDark
                  ? "bg-slate-800 border-slate-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                  : "bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20",
                errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : nameValue && !errors.name
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                  : ""
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
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors",
                isDark ? "text-purple-400" : "text-gray-400",
                errors.email && "text-red-500",
                emailValue && !errors.email && "text-green-500"
              )}
            />
            <input
              {...register("email")}
              type="email"
              disabled={isSubmitting}
              className={clsx(
                "w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                isDark
                  ? "bg-slate-800 border-slate-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                  : "bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20",
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : emailValue && !errors.email
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                  : ""
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
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors",
                isDark ? "text-purple-400" : "text-gray-400",
                errors.password && "text-red-500",
                password && !errors.password && "text-green-500"
              )}
            />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              disabled={isSubmitting}
              className={clsx(
                "w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                isDark
                  ? "bg-slate-800 border-slate-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                  : "bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20",
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : password && !errors.password
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                  : ""
              )}
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
              className={clsx(
                "absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors disabled:opacity-50",
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
                        "w-3 h-3 rounded-full flex items-center justify-center transition-colors",
                        isValid
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 dark:bg-gray-600"
                      )}
                    >
                      {isValid && <Check className="w-2 h-2" />}
                    </div>
                    <span
                      className={clsx(
                        "capitalize transition-colors",
                        isValid
                          ? "text-green-600 dark:text-green-400 font-medium"
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
                "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors",
                isDark ? "text-purple-400" : "text-gray-400",
                errors.confirmPassword && "text-red-500"
              )}
            />
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              disabled={isSubmitting}
              className={clsx(
                "w-full pl-10 pr-12 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                isDark
                  ? "bg-slate-800 border-slate-600 text-white focus:border-purple-500 focus:ring-purple-500/20"
                  : "bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20",
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : watch("confirmPassword") && !errors.confirmPassword
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                  : ""
              )}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isSubmitting}
              className={clsx(
                "absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors disabled:opacity-50",
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
              disabled={isSubmitting}
              className={clsx(
                "w-4 h-4 rounded border-2 focus:ring-2 focus:ring-offset-2 mt-1 flex-shrink-0 disabled:opacity-50",
                isDark
                  ? "bg-slate-800 border-slate-600 text-purple-600 focus:ring-purple-500/20"
                  : "bg-white border-gray-300 text-purple-600 focus:ring-purple-500/20"
              )}
            />
            <span
              className={clsx(
                "text-sm",
                isDark ? "text-purple-300" : "text-gray-700",
                isSubmitting && "opacity-50"
              )}
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className={clsx(
                  "font-medium transition-colors",
                  isDark
                    ? "text-purple-400 hover:text-purple-300"
                    : "text-purple-600 hover:text-purple-500",
                  isSubmitting && "pointer-events-none"
                )}
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className={clsx(
                  "font-medium transition-colors",
                  isDark
                    ? "text-purple-400 hover:text-purple-300"
                    : "text-purple-600 hover:text-purple-500",
                  isSubmitting && "pointer-events-none"
                )}
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

        {/* Enhanced Submit Button */}
        <motion.button
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className={clsx(
            "w-full py-4 px-4 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group",
            isDark
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:from-purple-400 disabled:to-pink-400"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:from-purple-400 disabled:to-pink-400"
          )}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

          {/* Security Badge */}
          <div className="absolute -top-1 -left-1">
            <Shield
              className={clsx(
                "w-4 h-4",
                isDark ? "text-green-400" : "text-green-500"
              )}
            />
          </div>

          {isSubmitting ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="flex items-center gap-2">
                Creating your account
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ...
                </motion.span>
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Create QualifAI Account
            </div>
          )}
        </motion.button>

        {/* Sign In Link */}
        <div className="text-center">
          <p
            className={clsx(
              "text-sm",
              isDark ? "text-purple-300/80" : "text-gray-600",
              isSubmitting && "opacity-50"
            )}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className={clsx(
                "font-semibold transition-colors",
                isDark
                  ? "text-purple-400 hover:text-purple-300"
                  : "text-purple-600 hover:text-purple-500",
                isSubmitting && "pointer-events-none"
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
