// components/ProblemModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Code,
  Settings,
  Zap,
} from "lucide-react";
import { Problem } from "@/app/(main)/hooks/useWordpressAnalysis";
import { useState } from "react";

interface ProblemModalProps {
  problem: Problem | null;
  isOpen: boolean;
  onClose: () => void;
  screenshot?: string;
  websiteUrl?: string;
}

const FixStep = ({
  step,
  index,
  isCompleted,
}: {
  step: string;
  index: number;
  isCompleted: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
  >
    <div
      className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
        isCompleted ? "bg-green-500 text-white" : "bg-blue-500 text-white"
      )}
    >
      {isCompleted ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <span>{index + 1}</span>
      )}
    </div>
    <div className="flex-1">
      <p
        className={cn(
          "text-sm",
          isCompleted
            ? "text-gray-500 line-through"
            : "text-gray-900 dark:text-white"
        )}
      >
        {step}
      </p>
    </div>
  </motion.div>
);

export const ProblemModal: React.FC<ProblemModalProps> = ({
  problem,
  isOpen,
  onClose,
  screenshot,
  websiteUrl,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showFixGuide, setShowFixGuide] = useState(false);

  if (!problem) return null;

  const getFixSteps = (problem: Problem): string[] => {
    const baseSteps: { [key: string]: string[] } = {
      performance: [
        "Identify the specific element causing performance issues",
        "Optimize images and media files",
        "Implement lazy loading for below-the-fold content",
        "Minify CSS and JavaScript files",
        "Enable browser caching",
        "Test performance improvements",
      ],
      security: [
        "Update WordPress core to latest version",
        "Update plugins and themes",
        "Implement security headers",
        "Configure proper file permissions",
        "Install security plugin",
        "Run security scan",
      ],
      seo: [
        "Add missing meta tags and descriptions",
        "Optimize heading structure",
        "Improve image alt text",
        "Fix broken internal links",
        "Submit sitemap to search engines",
        "Monitor search console for improvements",
      ],
      content: [
        "Review and improve content quality",
        "Fix grammatical and spelling errors",
        "Add relevant images and media",
        "Improve content structure",
        "Update outdated information",
        "Optimize for readability",
      ],
      technical: [
        "Fix HTML validation errors",
        "Resolve JavaScript console errors",
        "Optimize database queries",
        "Improve server configuration",
        "Implement CDN if needed",
        "Monitor technical performance",
      ],
      accessibility: [
        "Add proper ARIA labels",
        "Improve keyboard navigation",
        "Fix color contrast issues",
        "Add skip navigation links",
        "Test with screen readers",
        "Validate WCAG compliance",
      ],
    };

    return (
      baseSteps[problem.type] || [
        "Analyze the specific issue",
        "Research best practices",
        "Implement solution",
        "Test the fix",
        "Deploy to production",
        "Verify improvements",
      ]
    );
  };

  const fixSteps = getFixSteps(problem);

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleClose = () => {
    setCompletedSteps([]);
    setShowFixGuide(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    problem.severity === "critical"
                      ? "bg-red-500 text-white"
                      : problem.severity === "high"
                      ? "bg-orange-500 text-white"
                      : problem.severity === "medium"
                      ? "bg-yellow-500 text-white"
                      : "bg-blue-500 text-white"
                  )}
                >
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                    {problem.type} Issue
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {problem.message}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Problem Details */}
              <div className="space-y-6">
                {/* Severity & Element */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Severity
                    </h4>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        problem.severity === "critical"
                          ? "bg-red-100 text-red-800"
                          : problem.severity === "high"
                          ? "bg-orange-100 text-orange-800"
                          : problem.severity === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      )}
                    >
                      {problem.severity.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Affected Element
                    </h4>
                    <code className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                      {problem.element}
                    </code>
                  </div>
                </div>

                {/* Quick Fix */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                    Quick Fix
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    {problem.fix}
                  </p>
                </div>

                {/* Fix Guide Toggle */}
                <button
                  onClick={() => setShowFixGuide(!showFixGuide)}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold">
                      {showFixGuide ? "Hide" : "Show"} Step-by-Step Fix Guide
                    </span>
                  </div>
                  <ArrowRight
                    className={cn(
                      "w-5 h-5 transition-transform",
                      showFixGuide && "rotate-90"
                    )}
                  />
                </button>
              </div>

              {/* Right Column - Screenshot & Live Preview */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Live Preview
                </h4>
                <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
                  <iframe
                    src={websiteUrl}
                    className="w-full h-64"
                    title="Website Preview"
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>

                {screenshot && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Screenshot Reference
                    </h4>
                    <img
                      src={screenshot}
                      alt="Problem reference"
                      className="rounded-lg border border-gray-300 dark:border-gray-600 w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Step-by-Step Fix Guide */}
            <AnimatePresence>
              {showFixGuide && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Settings className="w-4 h-4 mr-2 text-blue-500" />
                    Step-by-Step Fix Guide
                  </h4>

                  <div className="space-y-2">
                    {fixSteps.map((step, index) => (
                      <div
                        key={index}
                        onClick={() => toggleStep(index)}
                        className="cursor-pointer"
                      >
                        <FixStep
                          step={step}
                          index={index}
                          isCompleted={completedSteps.includes(index)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Fix Progress
                      </span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {completedSteps.length}/{fixSteps.length} steps
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            (completedSteps.length / fixSteps.length) * 100
                          }%`,
                        }}
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setCompletedSteps(
                    Array.from({ length: fixSteps.length }, (_, i) => i)
                  );
                }}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark All as Fixed</span>
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
