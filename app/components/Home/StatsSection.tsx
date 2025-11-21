"use client";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  Target,
  Zap,
  CheckCircle,
  Clock,
  Shield,
  Brain,
  FileCheck,
  TrendingUp,
} from "lucide-react";

interface StatsSectionProps {
  isDark: boolean;
  isVisible: boolean;
}

export default function StatsSection({ isDark, isVisible }: StatsSectionProps) {
  const stats = [
    {
      number: "95%",
      label: "Scope Coverage",
      description: "Requirements automatically detected from SOWs",
      icon: <Target className="w-5 h-5" />,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      number: "12x",
      label: "QA Speed Increase",
      description: "Faster than manual quality checks",
      icon: <Zap className="w-5 h-5" />,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      number: "200+",
      label: "AI Checks",
      description: "Automated quality validations",
      icon: <Brain className="w-5 h-5" />,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      number: "0",
      label: "Missed Deliverables",
      description: "When using QualifAI consistently",
      icon: <Shield className="w-5 h-5" />,
      gradient: "from-red-500 to-orange-500",
    },
    {
      number: "5min",
      label: "Average Setup",
      description: "From upload to first QA run",
      icon: <Clock className="w-5 h-5" />,
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      number: "98%",
      label: "Accuracy Rate",
      description: "Across all service types",
      icon: <CheckCircle className="w-5 h-5" />,
      gradient: "from-teal-500 to-green-500",
    },
    {
      number: "50+",
      label: "Integrations",
      description: "Tools and platforms supported",
      icon: <FileCheck className="w-5 h-5" />,
      gradient: "from-yellow-500 to-amber-500",
    },
    {
      number: "47%",
      label: "Client Satisfaction",
      description: "Improvement in delivered quality",
      icon: <TrendingUp className="w-5 h-5" />,
      gradient: "from-rose-500 to-pink-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="max-w-6xl mx-auto mt-20 relative z-10"
    >
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Trusted by Top Agencies Worldwide
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className={clsx(
            "text-lg max-w-2xl mx-auto",
            isDark ? "text-blue-300/80" : "text-gray-600"
          )}
        >
          Real results from agencies using QualifAI to deliver flawless client
          work
        </motion.p>
      </div>

      <div
        className={clsx(
          "rounded-3xl p-6 md:p-8 backdrop-blur-sm border-2",
          isDark
            ? "bg-slate-900/40 border-slate-700/50"
            : "bg-white/60 border-gray-200/50"
        )}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} isDark={isDark} index={idx} />
          ))}
        </div>

        {/* Additional metrics bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 0.6, delay: 1.2 }}
          className={clsx(
            "mt-8 p-4 rounded-2xl border",
            isDark
              ? "bg-blue-900/20 border-blue-700/30"
              : "bg-blue-50 border-blue-200"
          )}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div
                className={clsx(
                  "text-lg font-bold",
                  isDark ? "text-blue-300" : "text-blue-600"
                )}
              >
                500+
              </div>
              <div
                className={clsx(
                  "text-xs",
                  isDark ? "text-blue-400/80" : "text-blue-600/80"
                )}
              >
                Agencies
              </div>
            </div>
            <div>
              <div
                className={clsx(
                  "text-lg font-bold",
                  isDark ? "text-green-300" : "text-green-600"
                )}
              >
                10K+
              </div>
              <div
                className={clsx(
                  "text-xs",
                  isDark ? "text-green-400/80" : "text-green-600/80"
                )}
              >
                Projects
              </div>
            </div>
            <div>
              <div
                className={clsx(
                  "text-lg font-bold",
                  isDark ? "text-purple-300" : "text-purple-600"
                )}
              >
                2M+
              </div>
              <div
                className={clsx(
                  "text-xs",
                  isDark ? "text-purple-400/80" : "text-purple-600/80"
                )}
              >
                Checks Run
              </div>
            </div>
            <div>
              <div
                className={clsx(
                  "text-lg font-bold",
                  isDark ? "text-orange-300" : "text-orange-600"
                )}
              >
                99.9%
              </div>
              <div
                className={clsx(
                  "text-xs",
                  isDark ? "text-orange-400/80" : "text-orange-600/80"
                )}
              >
                Uptime
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({
  number,
  label,
  description,
  icon,
  gradient,
  isDark,
  index,
}: {
  number: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  isDark: boolean;
  index: number;
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 },
      }}
      className="text-center group cursor-pointer p-4 rounded-2xl transition-all duration-300"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          delay: index * 0.1 + 0.5,
        }}
        className={clsx(
          "inline-flex items-center justify-center p-3 rounded-2xl mb-4 transition-all duration-300 group-hover:scale-110",
          isDark
            ? "bg-slate-800/50 text-white group-hover:bg-slate-700/50"
            : "bg-white text-gray-900 group-hover:bg-gray-50"
        )}
      >
        {icon}
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          delay: index * 0.1 + 0.7,
        }}
        className={clsx(
          "text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent",
          `${gradient}`
        )}
      >
        {number}
      </motion.div>

      <div
        className={clsx(
          "text-sm font-semibold mb-2 uppercase tracking-wide",
          isDark ? "text-blue-300" : "text-gray-700"
        )}
      >
        {label}
      </div>

      <div
        className={clsx(
          "text-xs leading-relaxed",
          isDark ? "text-blue-400/70" : "text-gray-600"
        )}
      >
        {description}
      </div>

      {/* Hover glow effect */}
      <div
        className={clsx(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10",
          isDark
            ? "bg-gradient-to-br from-blue-500/5 to-purple-500/5"
            : "bg-gradient-to-br from-blue-400/5 to-purple-400/5"
        )}
      />
    </motion.div>
  );
}
