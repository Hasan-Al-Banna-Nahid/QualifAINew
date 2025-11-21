"use client";
import { motion } from "framer-motion";
import clsx from "clsx";
import { ReactNode } from "react";

interface GlowCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
  isDark: boolean;
  delay?: number;
  className?: string;
  children?: ReactNode;
}

export function GlowCard({
  icon,
  title,
  description,
  gradient,
  isDark,
  delay = 0,
  className,
  children,
}: GlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: -10,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={clsx(
        "p-8 rounded-3xl border-2 relative overflow-hidden group cursor-pointer",
        isDark
          ? "bg-slate-900/40 border-slate-700/50"
          : "bg-white/60 border-gray-200/50",
        className
      )}
    >
      {/* Animated gradient border */}
      <div
        className={clsx(
          "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          `bg-gradient-to-r ${gradient}`
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={clsx(
            "inline-flex items-center justify-center p-4 rounded-2xl mb-6",
            isDark ? "bg-slate-800/50 text-white" : "bg-white text-gray-900"
          )}
        >
          {icon}
        </motion.div>

        <h3
          className={clsx(
            "text-2xl font-bold mb-4",
            isDark ? "text-white" : "text-gray-900"
          )}
        >
          {title}
        </h3>

        <p
          className={clsx(
            "text-lg leading-relaxed mb-6",
            isDark ? "text-blue-300/80" : "text-gray-600"
          )}
        >
          {description}
        </p>

        {children}
      </div>

      {/* Inner glow effect */}
      <div
        className={clsx(
          "absolute inset-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isDark
            ? "bg-gradient-to-br from-blue-500/5 to-purple-500/5"
            : "bg-gradient-to-br from-blue-400/5 to-purple-400/5"
        )}
      />
    </motion.div>
  );
}
