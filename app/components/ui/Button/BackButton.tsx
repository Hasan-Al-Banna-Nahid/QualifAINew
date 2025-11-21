// app/components/ui/BackButton.tsx
"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import clsx from "clsx";

interface BackButtonProps {
  className?: string;
  label?: string;
  href: string;
}

export default function BackButton({
  className = "",
  label = "Back",
  href = "/",
}: BackButtonProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      onClick={() => router.push(href)}
      className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 group relative overflow-hidden",
        isDark
          ? "bg-slate-800/50 text-blue-300 border border-slate-700/50 hover:bg-slate-700/50 hover:border-blue-500/50"
          : "bg-white/50 text-blue-600 border border-gray-200/50 hover:bg-white/80 hover:border-blue-400/50",
        className
      )}
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      {label}

      {/* Glow effect */}
      <div
        className={clsx(
          "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isDark
            ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            : "bg-gradient-to-r from-blue-400/10 to-purple-400/10"
        )}
      />

      {/* Border glow */}
      <div
        className={clsx(
          "absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isDark ? "border-blue-500/30" : "border-blue-400/30"
        )}
      />
    </motion.button>
  );
}
