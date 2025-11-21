// app/login/page.tsx
"use client";
import LoginForm from "@/app/components/Auth/LoginForm";
import AuthLayout from "@/app/components/Auth/AuthLayout";
import PublicRoute from "@/app/components/Auth/PublicRoute";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import clsx from "clsx";

function LoginPageContent() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <PublicRoute>
      <AuthLayout type="login">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onClick={() => router.push("/")}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 mb-6 group relative overflow-hidden",
            isDark
              ? "bg-slate-800/50 text-blue-300 border border-slate-700/50 hover:bg-slate-700/50"
              : "bg-white/50 text-blue-600 border border-gray-200/50 hover:bg-white/80"
          )}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
          {/* Glow effect */}
          <div
            className={clsx(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              isDark ? "bg-blue-500/10" : "bg-blue-400/10"
            )}
          />
        </motion.button>

        <LoginForm />
      </AuthLayout>
    </PublicRoute>
  );
}

export default function LoginPage() {
  return <LoginPageContent />;
}
