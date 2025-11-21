// app/components/Auth/AuthLayout.tsx
"use client";
import { useTheme } from "@/app/context/ThemeContext";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Sparkles, Shield, Zap, Target, CheckCircle } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  type: "login" | "register";
}

export default function AuthLayout({ children, type }: AuthLayoutProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise-Grade Security",
      description: "Bank-level encryption to protect your data",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered QA",
      description: "Smart automation for flawless deliverables",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Scope Accuracy",
      description: "Never miss a requirement again",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Real-time Monitoring",
      description: "24/7 quality assurance tracking",
    },
  ];

  return (
    <div
      className={clsx(
        "min-h-screen flex",
        isDark
          ? "bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900"
          : "bg-gradient-to-br from-gray-50 via-purple-50/40 to-gray-100"
      )}
    >
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right Side - Features & Branding */}
      <div
        className={clsx(
          "flex-1 hidden lg:flex items-center justify-center p-12 relative overflow-hidden",
          isDark ? "bg-slate-900/50" : "bg-white/50"
        )}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className={clsx(
              "absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20",
              isDark ? "bg-purple-500" : "bg-purple-300"
            )}
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className={clsx(
              "absolute bottom-1/4 -right-20 w-80 h-80 rounded-full blur-3xl opacity-20",
              isDark ? "bg-blue-500" : "bg-blue-300"
            )}
          />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center max-w-2xl"
        >
          {/* Logo Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className={clsx(
              "inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-xl mb-8 shadow-2xl border-2",
              isDark
                ? "bg-slate-800/80 border-slate-700/50 text-white backdrop-blur-sm"
                : "bg-white/80 border-gray-200/50 text-gray-900 backdrop-blur-sm"
            )}
          >
            <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
            QualifAI
            <div
              className={clsx(
                "text-sm px-2 py-1 rounded-full font-semibold",
                isDark
                  ? "bg-purple-500/20 text-purple-300"
                  : "bg-purple-100 text-purple-700"
              )}
            >
              AI
            </div>
          </motion.div>

          <h1
            className={clsx(
              "text-5xl font-bold mb-6",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Transform Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Quality Assurance
            </span>
          </h1>

          <p
            className={clsx(
              "text-xl mb-12 max-w-2xl mx-auto leading-relaxed",
              isDark ? "text-purple-200/80" : "text-gray-600"
            )}
          >
            Join thousands of agencies using AI to deliver perfect client work
            every time. Automate quality checks, eliminate missed deliverables,
            and scale with confidence.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className={clsx(
                  "p-4 rounded-xl text-left border-2 backdrop-blur-sm",
                  isDark
                    ? "bg-slate-800/50 border-slate-700/50 text-white"
                    : "bg-white/50 border-gray-200/50 text-gray-900"
                )}
              >
                <div
                  className={clsx(
                    "inline-flex items-center justify-center p-2 rounded-lg mb-3",
                    isDark
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-purple-100 text-purple-600"
                  )}
                >
                  {feature.icon}
                </div>
                <h3
                  className={clsx(
                    "font-semibold mb-2",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  {feature.title}
                </h3>
                <p
                  className={clsx(
                    "text-sm",
                    isDark ? "text-purple-200/70" : "text-gray-600"
                  )}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className={clsx(
              "inline-flex gap-8 px-6 py-4 rounded-2xl backdrop-blur-sm border-2",
              isDark
                ? "bg-slate-800/50 border-slate-700/50"
                : "bg-white/50 border-gray-200/50"
            )}
          >
            <div className="text-center">
              <div
                className={clsx(
                  "text-2xl font-bold",
                  isDark ? "text-white" : "text-gray-900"
                )}
              >
                500+
              </div>
              <div
                className={clsx(
                  "text-sm",
                  isDark ? "text-purple-300/80" : "text-gray-600"
                )}
              >
                Agencies
              </div>
            </div>
            <div className="text-center">
              <div
                className={clsx(
                  "text-2xl font-bold",
                  isDark ? "text-white" : "text-gray-900"
                )}
              >
                99.9%
              </div>
              <div
                className={clsx(
                  "text-sm",
                  isDark ? "text-purple-300/80" : "text-gray-600"
                )}
              >
                Accuracy
              </div>
            </div>
            <div className="text-center">
              <div
                className={clsx(
                  "text-2xl font-bold",
                  isDark ? "text-white" : "text-gray-900"
                )}
              >
                24/7
              </div>
              <div
                className={clsx(
                  "text-sm",
                  isDark ? "text-purple-300/80" : "text-gray-600"
                )}
              >
                Monitoring
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
