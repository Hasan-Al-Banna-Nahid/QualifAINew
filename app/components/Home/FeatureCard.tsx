"use client";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import clsx from "clsx";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  isDark: boolean;
}

export default function AnimatedFeatureCard({
  icon,
  title,
  description,
  delay = 0,
  isDark,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card
        className={clsx(
          "border shadow-xl rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 relative",
          isDark
            ? "border-blue-200/20 bg-slate-900/40 hover:bg-slate-800/40"
            : "border-blue-200/40 bg-white/60 hover:bg-white/80"
        )}
      >
        <CardContent className="p-6 flex flex-col items-start space-y-4">
          <div className={clsx("p-3 rounded-xl bg-blue-500/10 text-blue-600")}>
            {icon}
          </div>
          <h3
            className={clsx(
              "text-xl font-semibold",
              isDark ? "text-blue-100" : "text-gray-800"
            )}
          >
            {title}
          </h3>
          <p
            className={clsx(
              "text-sm leading-relaxed",
              isDark ? "text-blue-300/80" : "text-gray-600"
            )}
          >
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
