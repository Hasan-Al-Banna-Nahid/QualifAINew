"use client";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { X, Play, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useBodyScrollLock } from "@/app/(main)/hooks/useBodyScrollLock";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export function DemoModal({ isOpen, onClose, isDark }: DemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Use the scroll lock hook
  useBodyScrollLock(isOpen);

  const demoSteps = [
    {
      title: "Upload Your Scope Document",
      description: "Drag and drop your SOW, brief, or requirements document",
      video: "/demo/upload.mp4",
      features: [
        "PDF, DOCX, Markdown support",
        "AI-powered parsing",
        "Structured JSON output",
      ],
    },
    {
      title: "Review AI-Generated Requirements",
      description:
        "Edit and approve the structured requirements extracted by QualifAI",
      video: "/demo/review.mp4",
      features: [
        "Visual requirement mapping",
        "Priority assignment",
        "Service type categorization",
      ],
    },
    {
      title: "Run Automated QA Checks",
      description: "Execute service-specific quality assurance tests",
      video: "/demo/qa-run.mp4",
      features: [
        "Multi-service parallel testing",
        "Real-time progress tracking",
        "Detailed error reporting",
      ],
    },
    {
      title: "Analyze Comprehensive Reports",
      description: "Review compliance, gaps, and recommendations",
      video: "/demo/reports.mp4",
      features: [
        "Client-ready summaries",
        "Actionable insights",
        "Historical trend analysis",
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={clsx(
              "relative w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col",
              isDark
                ? "bg-slate-900 border border-slate-700"
                : "bg-white border border-gray-200"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <div>
                <h2
                  className={clsx(
                    "text-2xl font-bold",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  QualifAI Interactive Demo
                </h2>
                <p
                  className={clsx(
                    "text-sm mt-1",
                    isDark ? "text-blue-300/80" : "text-gray-600"
                  )}
                >
                  See how QualifAI transforms your quality assurance process
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={clsx(
                  "p-2 rounded-full transition-colors",
                  isDark
                    ? "hover:bg-slate-800 text-slate-400"
                    : "hover:bg-gray-100 text-gray-500"
                )}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Demo Steps */}
                  <div className="space-y-4">
                    <h3
                      className={clsx(
                        "text-lg font-semibold",
                        isDark ? "text-white" : "text-gray-900"
                      )}
                    >
                      How It Works
                    </h3>

                    <div className="space-y-3">
                      {demoSteps.map((step, index) => (
                        <motion.div
                          key={step.title}
                          whileHover={{ scale: 1.02 }}
                          className={clsx(
                            "p-4 rounded-xl border cursor-pointer transition-all duration-300",
                            currentStep === index
                              ? isDark
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-blue-400 bg-blue-50"
                              : isDark
                              ? "border-slate-700 hover:border-slate-600"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                          onClick={() => setCurrentStep(index)}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={clsx(
                                "flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs flex-shrink-0",
                                currentStep === index
                                  ? "bg-blue-500 text-white"
                                  : isDark
                                  ? "bg-slate-700 text-slate-300"
                                  : "bg-gray-200 text-gray-600"
                              )}
                            >
                              {index + 1}
                            </div>
                            <h4
                              className={clsx(
                                "font-semibold text-sm",
                                isDark ? "text-white" : "text-gray-900"
                              )}
                            >
                              {step.title}
                            </h4>
                          </div>
                          <p
                            className={clsx(
                              "text-xs mb-2",
                              isDark ? "text-slate-400" : "text-gray-600"
                            )}
                          >
                            {step.description}
                          </p>
                          <div className="space-y-1">
                            {step.features.map((feature) => (
                              <div
                                key={feature}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle
                                  className={clsx(
                                    "w-3 h-3 flex-shrink-0",
                                    currentStep === index
                                      ? "text-blue-500"
                                      : isDark
                                      ? "text-slate-500"
                                      : "text-gray-400"
                                  )}
                                />
                                <span
                                  className={clsx(
                                    "text-xs",
                                    isDark ? "text-slate-400" : "text-gray-600"
                                  )}
                                >
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Demo Preview */}
                  <div
                    className={clsx(
                      "rounded-xl p-6 flex flex-col",
                      isDark ? "bg-slate-800/50" : "bg-gray-100/50"
                    )}
                  >
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex-1 flex flex-col"
                    >
                      <div className="text-center mb-4">
                        <div
                          className={clsx(
                            "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3",
                            isDark ? "bg-blue-500/20" : "bg-blue-500/10"
                          )}
                        >
                          <Play
                            className={clsx(
                              "w-6 h-6",
                              isDark ? "text-blue-400" : "text-blue-600"
                            )}
                          />
                        </div>
                        <h3
                          className={clsx(
                            "text-lg font-bold mb-1",
                            isDark ? "text-white" : "text-gray-900"
                          )}
                        >
                          {demoSteps[currentStep].title}
                        </h3>
                        <p
                          className={clsx(
                            "text-sm mb-4",
                            isDark ? "text-slate-400" : "text-gray-600"
                          )}
                        >
                          {demoSteps[currentStep].description}
                        </p>
                      </div>

                      {/* Demo Video Placeholder */}
                      <div
                        className={clsx(
                          "flex-1 rounded-lg border-2 border-dashed flex items-center justify-center mb-4 min-h-[200px]",
                          isDark ? "border-slate-600" : "border-gray-300"
                        )}
                      >
                        <div className="text-center">
                          <div
                            className={clsx(
                              "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2",
                              isDark ? "bg-slate-700" : "bg-gray-200"
                            )}
                          >
                            <Play
                              className={clsx(
                                "w-6 h-6",
                                isDark ? "text-slate-400" : "text-gray-500"
                              )}
                            />
                          </div>
                          <p
                            className={clsx(
                              "text-xs",
                              isDark ? "text-slate-500" : "text-gray-500"
                            )}
                          >
                            Interactive demo video
                          </p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={clsx(
                          "px-6 py-2 rounded-lg font-semibold flex items-center gap-2 justify-center text-sm",
                          isDark
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        )}
                      >
                        <Zap className="w-4 h-4" />
                        Try This Step
                        <ArrowRight className="w-3 h-3" />
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0 flex justify-between items-center p-4 border-t border-gray-200 dark:border-slate-700">
              <div
                className={clsx(
                  "text-xs font-medium",
                  isDark ? "text-slate-400" : "text-gray-500"
                )}
              >
                Step {currentStep + 1} of {demoSteps.length}
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className={clsx(
                    "px-4 py-2 rounded-lg font-semibold border text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    isDark
                      ? "border-slate-600 text-slate-300 hover:bg-slate-800 disabled:hover:bg-transparent"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100 disabled:hover:bg-transparent"
                  )}
                >
                  Previous
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setCurrentStep(
                      Math.min(demoSteps.length - 1, currentStep + 1)
                    )
                  }
                  disabled={currentStep === demoSteps.length - 1}
                  className={clsx(
                    "px-4 py-2 rounded-lg font-semibold border text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    isDark
                      ? "border-blue-600 text-blue-400 hover:bg-blue-600/10 disabled:hover:bg-transparent"
                      : "border-blue-400 text-blue-600 hover:bg-blue-50 disabled:hover:bg-transparent"
                  )}
                >
                  Next
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
