// components/clients/StatusBadge.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
}) => {
  const statusConfig = {
    active: { color: "bg-green-500", text: "Active" },
    inactive: { color: "bg-red-500", text: "Inactive" },
    pending: { color: "bg-yellow-500", text: "Pending" },
  };

  const config = statusConfig[status];

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white",
        config.color,
        className
      )}
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-white/80 mr-2"
      />
      {config.text}
    </motion.span>
  );
};
