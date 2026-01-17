// components/ui/audit-progress-modal.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  X,
  RefreshCw,
  Zap,
  Globe,
  Shield,
  FileText,
  Search,
  BarChart,
  Cpu,
} from "lucide-react";

interface AuditProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: {
    current: number;
    total: number;
    percentage: number;
    currentStep: string;
    currentUrl?: string;
  };
  stats?: {
    pagesCrawled: number;
    issuesFound: number;
    loadTime: number;
    seoScore: number;
  };
}

const auditSteps = [
  { id: 1, name: "DNS Resolution", icon: Globe },
  { id: 2, name: "Security Scan", icon: Shield },
  { id: 3, name: "Homepage Analysis", icon: Search },
  { id: 4, name: "Site Crawling", icon: Cpu },
  { id: 5, name: "SEO Analysis", icon: BarChart },
  { id: 6, name: "Performance Test", icon: Zap },
  { id: 7, name: "Report Generation", icon: FileText },
];

export function AuditProgressModal({
  isOpen,
  onClose,
  progress,
  stats,
}: AuditProgressModalProps) {
  const [glowPosition, setGlowPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowPosition((prev) => (prev >= 100 ? 0 : prev + 5));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl mx-4"
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl"
              animate={{
                backgroundPosition: `${glowPosition}%`,
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            <Card className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-gray-800 shadow-2xl overflow-hidden">
              {/* Animated Border */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <RefreshCw className="h-8 w-8 text-blue-400" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-2xl text-white flex items-center gap-2">
                        Analyzing Your Site
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          ...
                        </motion.span>
                      </CardTitle>
                      <p className="text-gray-400">
                        Performing comprehensive SEO audit across 100+ metrics
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Overall Progress</span>
                    <span className="font-semibold text-white">
                      {progress.percentage}%
                    </span>
                  </div>
                  <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress.percentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ left: ["0%", "100%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                </div>

                {/* Current Step */}
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="p-2 bg-blue-500/20 rounded-lg"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Search className="h-5 w-5 text-blue-400" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-medium text-white">
                        {progress.currentStep}
                      </p>
                      {progress.currentUrl && (
                        <p className="text-sm text-gray-400 truncate">
                          {progress.currentUrl}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      {progress.current}/{progress.total} checks
                    </span>
                  </div>
                </div>

                {/* Audit Steps */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {auditSteps.map((step) => {
                    const isActive = step.name === progress.currentStep;
                    const isCompleted =
                      auditSteps.findIndex(
                        (s) => s.name === progress.currentStep
                      ) >= step.id;

                    return (
                      <motion.div
                        key={step.id}
                        className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 ${
                          isActive
                            ? "bg-blue-500/10 border-blue-500"
                            : isCompleted
                            ? "bg-green-500/10 border-green-500"
                            : "bg-gray-800/50 border-gray-700"
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <step.icon
                          className={`h-5 w-5 ${
                            isActive
                              ? "text-blue-400"
                              : isCompleted
                              ? "text-green-400"
                              : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            isActive
                              ? "text-blue-300"
                              : isCompleted
                              ? "text-green-300"
                              : "text-gray-300"
                          }`}
                        >
                          {step.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Live Stats */}
                {stats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-400">Pages</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {stats.pagesCrawled}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Issues</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {stats.issuesFound}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-400">Load Time</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {stats.loadTime}ms
                      </p>
                    </div>

                    <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-gray-400">SEO Score</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {stats.seoScore}/100
                      </p>
                    </div>
                  </div>
                )}

                {/* Spinning Loader */}
                <div className="flex justify-center">
                  <motion.div
                    className="flex items-center gap-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="h-2 w-2 bg-blue-500 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      Analyzing {progress.currentStep.toLowerCase()}...
                    </span>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
