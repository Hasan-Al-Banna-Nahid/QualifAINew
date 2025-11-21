"use client";
import { motion } from "framer-motion";
import clsx from "clsx";
import { ReactNode } from "react";

interface AnimatedBadgeProps {
  icon: ReactNode;
  text: string;
  isDark: boolean;
  className?: string;
}

export function AnimatedBadge({
  icon,
  text,
  isDark,
  className,
}: AnimatedBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={clsx(
        "inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-lg relative overflow-hidden group",
        isDark
          ? "bg-blue-900/40 text-blue-300 border border-blue-700/50"
          : "bg-blue-100 text-blue-700 border border-blue-300",
        className
      )}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
      >
        {icon}
      </motion.div>
      {text}

      {/* Pulsing glow effect */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={clsx(
          "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100",
          isDark ? "bg-blue-500/10" : "bg-blue-400/10"
        )}
      />
    </motion.div>
  );
}
