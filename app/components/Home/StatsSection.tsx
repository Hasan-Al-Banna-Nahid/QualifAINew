"use client";
import { motion } from "framer-motion";
import clsx from "clsx";

interface StatsSectionProps {
  isDark: boolean;
  isVisible: boolean;
}

export default function StatsSection({ isDark, isVisible }: StatsSectionProps) {
  const stats = [
    { number: "99%", label: "Accuracy Rate" },
    { number: "10x", label: "Faster QA" },
    { number: "50+", label: "Checks Automated" },
    { number: "24/7", label: "Monitoring" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="max-w-4xl mx-auto mt-16 relative z-10"
    >
      <div
        className={clsx(
          "rounded-2xl p-6 md:p-8 backdrop-blur-sm border",
          isDark
            ? "bg-slate-900/50 border-slate-700/50"
            : "bg-white/50 border-gray-200/50"
        )}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} isDark={isDark} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({
  number,
  label,
  isDark,
}: {
  number: string;
  label: string;
  isDark: boolean;
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          delay: Math.random() * 0.5 + 0.8,
        }}
        className={clsx(
          "text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent",
          isDark ? "from-blue-400 to-purple-400" : "from-blue-600 to-purple-600"
        )}
      >
        {number}
      </motion.div>
      <div
        className={clsx(
          "text-sm font-medium",
          isDark ? "text-blue-300/80" : "text-gray-600"
        )}
      >
        {label}
      </div>
    </motion.div>
  );
}
