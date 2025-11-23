// components/animations/ProblemIndicator.tsx
"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Zap,
  Shield,
  Search,
  FileText,
  Code,
  Cpu,
} from "lucide-react";

export function ProblemIndicator({
  type,
  message,
  position,
}: {
  type: string;
  message: string;
  position: { x: number; y: number };
}) {
  const icons = {
    performance: Zap,
    security: Shield,
    seo: Search,
    content: FileText,
    technical: Code,
    plugins: Cpu,
  };

  const colors = {
    performance: "text-yellow-500",
    security: "text-red-500",
    seo: "text-purple-500",
    content: "text-blue-500",
    technical: "text-green-500",
    plugins: "text-indigo-500",
  };

  const Icon = icons[type as keyof typeof icons] || AlertTriangle;
  const color = colors[type as keyof typeof colors] || "text-gray-500";

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="absolute cursor-pointer z-50"
      style={{ left: position.x, top: position.y }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Pulsing Animation */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.7, 0.3, 0.7],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-current rounded-full"
      />

      {/* Main Icon */}
      <motion.div
        animate={{
          rotate: [0, -10, 10, 0],
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className={`relative ${color} bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border-2 border-current`}
      >
        <Icon className="w-4 h-4" />
      </motion.div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl z-50"
      >
        <div className="font-medium capitalize mb-1">{type}</div>
        <div className="text-gray-300">{message}</div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900" />
      </motion.div>

      {/* Arrow pointing to problem area */}
      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
        transition={{ duration: 1, repeat: Infinity }}
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-current"
      >
        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-current" />
      </motion.div>
    </motion.div>
  );
}
