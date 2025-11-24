// app/qualifai/wordpress/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  useWordPressAnalysis,
  type AnalysisResult,
  type Problem,
} from "@/app/(main)/hooks/useWordpressAnalysis";
import { ProblemIndicator } from "@/app/components/animations/ProblemIndicator";
import { ProblemModal } from "@/app/components/wordpress/ProblemModal";
import { APITestingPanel } from "@/app/components/wordpress/APITestingPanel";
import { FileUploadPanel } from "@/app/components/wordpress/FileUploadPanel";
import { DYNAMIC_QA_FEATURES } from "./data/qaFeatures";
import { cn } from "@/lib/utils";

// Import icons
import {
  Globe,
  Settings,
  TestTube,
  Zap,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Play,
  Download,
  Eye,
  Code,
  Upload,
  Shield,
  Search,
  Bot,
  Sparkles,
  FileText,
  ExternalLink,
  Rocket,
  Bug,
  Lightbulb,
  Camera,
  Wifi,
  X,
  Check,
  ArrowRight,
  Home,
  Users,
  TrendingUp,
  Award,
  Monitor,
  Smartphone,
  Wrench,
  Sliders,
  RotateCw,
  MoreHorizontal,
} from "lucide-react";

// Enhanced Website Preview Component
const EnhancedWebsitePreview = ({
  websiteUrl,
  problems,
  onProblemClick,
  onScreenshot,
}: {
  websiteUrl: string;
  problems: Problem[];
  onProblemClick: (problem: Problem) => void;
  onScreenshot: (screenshot: string) => void;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const captureScreenshot = useCallback(async () => {
    // Create a mock screenshot for demo
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#333333";
      ctx.font = "bold 24px Arial";
      ctx.fillText("Website Preview: " + websiteUrl, 50, 50);

      ctx.fillStyle = "#666666";
      ctx.font = "16px Arial";
      ctx.fillText("Live website content would be displayed here", 50, 100);

      // Add problem markers
      problems.forEach((problem, index) => {
        const color =
          problem.severity === "critical"
            ? "#ef4444"
            : problem.severity === "high"
            ? "#f97316"
            : problem.severity === "medium"
            ? "#eab308"
            : "#3b82f6";

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(100 + index * 120, 200, 6, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      const screenshot = canvas.toDataURL("image/png");
      onScreenshot(screenshot);
    }
  }, [websiteUrl, problems, onScreenshot]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Live Preview with Problem Indicators
        </h3>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={captureScreenshot}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Capture Screenshot</span>
          </motion.button>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Wifi className="w-4 h-4" />
            <span>Live Connection</span>
          </div>
        </div>
      </div>

      <div className="relative h-96 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 bg-white">
        {/* Website Preview */}
        <iframe
          ref={iframeRef}
          src={websiteUrl}
          className="w-full h-full"
          title="Website Preview"
          sandbox="allow-same-origin allow-scripts"
          onError={(e) => {
            console.error("Iframe failed to load:", e);
          }}
        />

        {/* Animated Problem Indicators */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {problems.map((problem, index) => (
              <ProblemIndicator
                key={`${problem.type}-${index}`}
                problem={problem}
                onProblemClick={onProblemClick}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm"
        >
          <div className="text-sm">
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>
                  Critical:{" "}
                  {problems.filter((p) => p.severity === "critical").length}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>
                  High: {problems.filter((p) => p.severity === "high").length}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>
                  Medium:{" "}
                  {problems.filter((p) => p.severity === "medium").length}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Analysis Results Component
const AnalysisResults = ({
  analysis,
  onProblemClick,
}: {
  analysis: AnalysisResult;
  onProblemClick: (problem: Problem) => void;
}) => {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Analysis Complete!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {analysis.summary}
            </p>

            {/* Problem Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {analysis.problems?.filter((p) => p.severity === "critical")
                    .length || 0}
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  Critical
                </div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {analysis.problems?.filter((p) => p.severity === "high")
                    .length || 0}
                </div>
                <div className="text-sm text-orange-600 dark:text-orange-400">
                  High
                </div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {analysis.problems?.filter((p) => p.severity === "medium")
                    .length || 0}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  Medium
                </div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {analysis.problems?.filter((p) => p.severity === "low")
                    .length || 0}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Low
                </div>
              </div>
            </div>

            {/* AI Recommendations Summary */}
            {analysis.aiRecommendations && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Recommendations
                </h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  {analysis.aiRecommendations.combined?.summary ||
                    analysis.aiRecommendations.fallback?.summary ||
                    "AI insights available"}
                </p>
              </div>
            )}
          </div>

          {/* Score Circle */}
          <div className="text-center ml-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl relative",
                analysis.score >= 90
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : analysis.score >= 70
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                  : "bg-gradient-to-r from-red-500 to-rose-500"
              )}
            >
              {analysis.score}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-white/30 border-t-transparent"
              />
            </motion.div>
            <div className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
              Grade: {analysis.grade}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analysis.insights?.map((insight: any, index: number) => {
          const category = DYNAMIC_QA_FEATURES.find(
            (cat) => cat.id === insight.category
          );
          return (
            <motion.div
              key={insight.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
            >
              <div className="flex items-center space-x-3 mb-4">
                {category && (
                  <div
                    className={cn(
                      "p-3 rounded-xl bg-gradient-to-r text-white shadow-lg",
                      category.color
                    )}
                  >
                    <category.icon className="w-5 h-5" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                    {insight.category}
                  </h4>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${insight.score}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className={cn(
                        "h-2 rounded-full transition-all duration-1000",
                        insight.score >= 90
                          ? "bg-green-500"
                          : insight.score >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      )}
                    />
                  </div>
                </div>
                <div
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    insight.score >= 90
                      ? "bg-green-500/20 text-green-600 dark:text-green-400"
                      : insight.score >= 70
                      ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                      : "bg-red-500/20 text-red-600 dark:text-red-400"
                  )}
                >
                  {insight.score}%
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                    Issues ({insight.issues?.length || 0})
                  </h5>
                  <ul className="space-y-1">
                    {insight.issues
                      ?.slice(0, 3)
                      .map((issue: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start space-x-2 text-sm text-red-600 dark:text-red-400"
                        >
                          <Bug className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{issue}</span>
                        </li>
                      ))}
                    {insight.issues?.length > 3 && (
                      <li className="text-xs text-gray-500 dark:text-gray-400">
                        +{insight.issues.length - 3} more issues
                      </li>
                    )}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-green-500" />
                    Recommendations
                  </h5>
                  <ul className="space-y-1">
                    {insight.recommendations
                      ?.slice(0, 2)
                      .map((rec: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start space-x-2 text-sm text-green-600 dark:text-green-400"
                        >
                          <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{rec}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* View Problems Button */}
              {insight.issues?.length > 0 && (
                <button
                  onClick={() => {
                    const firstProblem = analysis.problems?.find(
                      (p) => p.type === insight.category
                    );
                    if (firstProblem) onProblemClick(firstProblem);
                  }}
                  className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  View Problems
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* AI Recommendations Section */}
      {analysis.aiRecommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Bot className="w-5 h-5 mr-2" />
            AI-Powered Recommendations
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Priority Fixes */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                Priority Fixes
              </h4>
              <ul className="space-y-2">
                {(
                  analysis.aiRecommendations.combined?.priorityFixes ||
                  analysis.aiRecommendations.fallback?.priorityFixes ||
                  []
                )
                  .slice(0, 5)
                  .map((fix: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg"
                    >
                      <span className="text-red-500 font-bold">
                        {index + 1}.
                      </span>
                      <span className="text-red-700 dark:text-red-300 text-sm">
                        {fix}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Detailed Recommendations */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-green-500" />
                Detailed Recommendations
              </h4>
              <ul className="space-y-2">
                {(
                  analysis.aiRecommendations.combined?.recommendations ||
                  analysis.aiRecommendations.fallback?.recommendations ||
                  []
                )
                  .slice(0, 5)
                  .map((rec: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-700 dark:text-green-300 text-sm">
                        {rec}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Similar Sites Comparison */}
      {analysis.similarSites && analysis.similarSites.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Comparison with Top Sites
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.similarSites
              .slice(0, 3)
              .map((site: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {site.name}
                    </h4>
                    <div
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-bold",
                        site.score >= 90
                          ? "bg-green-500 text-white"
                          : site.score >= 80
                          ? "bg-yellow-500 text-white"
                          : "bg-blue-500 text-white"
                      )}
                    >
                      {site.score}
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {site.practices
                      ?.slice(0, 3)
                      .map((practice: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400"
                        >
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          <span>{practice}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Download Report Button */}
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all mx-auto shadow-lg"
        >
          <Download className="w-4 h-4" />
          <span className="font-semibold">Download Full Report (PDF)</span>
        </motion.button>
      </div>
    </div>
  );
};

// Main Component
export default function EnhancedWordPressQAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const mode = searchParams.get("mode") || "full-check";

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [customInstructions, setCustomInstructions] = useState("");
  const [activeTab, setActiveTab] = useState("configuration");
  const [showWebsitePreview, setShowWebsitePreview] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [showProblemModal, setShowProblemModal] = useState(false);

  const {
    runAnalysis,
    isRunning,
    error,
    data: analysis,
  } = useWordPressAnalysis();

  // Calculate total tests count
  const totalTestsCount = DYNAMIC_QA_FEATURES.reduce(
    (total, category) => total + category.tests.length,
    0
  );

  // Auto-select tests based on mode
  useEffect(() => {
    const allTests = DYNAMIC_QA_FEATURES.flatMap((category) =>
      category.tests.map((test) => `${category.id}-${test}`)
    );

    if (mode === "full-check") {
      setSelectedTests(allTests);
    } else if (mode === "quick-check") {
      const quickTests = DYNAMIC_QA_FEATURES.flatMap((category) =>
        category.tests.slice(0, 3).map((test) => `${category.id}-${test}`)
      );
      setSelectedTests(quickTests);
    }
  }, [mode]);

  const handleRunAnalysis = async () => {
    if (!websiteUrl) {
      alert("Please enter a website URL");
      return;
    }

    try {
      const request = {
        url: websiteUrl,
        tests: selectedTests,
        customInstructions,
        isLocalhost,
        clientId: clientId || undefined,
        mode,
        uploadedFiles,
      };

      console.log("Starting analysis with request:", request);
      await runAnalysis(request);
      setActiveTab("analysis");
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  const handleProblemClick = (problem: Problem) => {
    setSelectedProblem(problem);
    setShowProblemModal(true);
  };

  const handleScreenshot = (screenshotData: string) => {
    setScreenshot(screenshotData);
  };

  const toggleTest = (testId: string) => {
    setSelectedTests((prev) =>
      prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId]
    );
  };

  const toggleCategory = (categoryId: string) => {
    const categoryTests =
      DYNAMIC_QA_FEATURES.find((cat) => cat.id === categoryId)?.tests.map(
        (test) => `${categoryId}-${test}`
      ) || [];

    const allSelected = categoryTests.every((test) =>
      selectedTests.includes(test)
    );

    if (allSelected) {
      setSelectedTests((prev) =>
        prev.filter((test) => !categoryTests.includes(test))
      );
    } else {
      setSelectedTests((prev) => [
        ...prev,
        ...categoryTests.filter((test) => !prev.includes(test)),
      ]);
    }
  };

  const handleFilesUpload = (files: any[]) => {
    setUploadedFiles(files);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center space-x-4 mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                WordPress QA Analyzer
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {totalTestsCount}+ Automated Tests • Dynamic Analysis •
                Real-time Results
              </p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center space-x-4 mt-6 flex-wrap gap-2"
          >
            <button
              onClick={() => setShowWebsitePreview(!showWebsitePreview)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>
                {showWebsitePreview ? "Hide Preview" : "Show Preview"}
              </span>
            </button>
            <button
              onClick={() => window.open(websiteUrl, "_blank")}
              disabled={!websiteUrl}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Site</span>
            </button>
          </motion.div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-200">
                  Analysis Failed
                </h4>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {error.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Website Preview */}
        {showWebsitePreview && websiteUrl && (
          <EnhancedWebsitePreview
            websiteUrl={websiteUrl}
            problems={analysis?.problems || []}
            onProblemClick={handleProblemClick}
            onScreenshot={handleScreenshot}
          />
        )}

        {/* Tabs */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-2 border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { id: "configuration", name: "Configuration", icon: Settings },
              { id: "upload", name: "Design Files", icon: Upload },
              { id: "api-testing", name: "API Testing", icon: TestTube },
              { id: "analysis", name: "AI Analysis", icon: Bot },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 flex-shrink-0",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Configuration Tab */}
          {activeTab === "configuration" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Website Configuration */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Website Configuration
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website URL *
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50"
                        />
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <input
                        type="checkbox"
                        id="localhost"
                        checked={isLocalhost}
                        onChange={(e) => setIsLocalhost(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="localhost"
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        This is a localhost development site
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Custom Instructions (AI-Powered)
                    </label>
                    <textarea
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      placeholder="Specific requirements, focus areas, or custom checks..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Test Selection */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Test Selection
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedTests.length} of {totalTestsCount}+ tests
                      selected • {mode} mode
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        const allTests = DYNAMIC_QA_FEATURES.flatMap((cat) =>
                          cat.tests.map((test) => `${cat.id}-${test}`)
                        );
                        setSelectedTests(allTests);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => setSelectedTests([])}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DYNAMIC_QA_FEATURES.map((category) => {
                    const categoryTests = category.tests.map(
                      (test) => `${category.id}-${test}`
                    );
                    const selectedCount = categoryTests.filter((test) =>
                      selectedTests.includes(test)
                    ).length;
                    const allSelected = selectedCount === categoryTests.length;

                    return (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          "border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-lg relative overflow-hidden",
                          allSelected
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                        )}
                        onClick={() => toggleCategory(category.id)}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg bg-gradient-to-r text-white shadow-lg",
                              category.color
                            )}
                          >
                            <category.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {category.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedCount}/{category.tests.length} tests
                            </p>
                          </div>
                          <div
                            className={cn(
                              "w-5 h-5 rounded border-2 transition-colors",
                              allSelected
                                ? "bg-green-500 border-green-500"
                                : "border-gray-300 dark:border-gray-600"
                            )}
                          >
                            {allSelected && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {category.tests.map((test) => {
                            const testId = `${category.id}-${test}`;
                            return (
                              <div
                                key={testId}
                                className="flex items-center space-x-2 text-sm group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTest(testId);
                                }}
                              >
                                <div
                                  className={cn(
                                    "w-4 h-4 rounded border transition-colors flex items-center justify-center",
                                    selectedTests.includes(testId)
                                      ? "bg-blue-500 border-blue-500"
                                      : "border-gray-300 dark:border-gray-600"
                                  )}
                                >
                                  {selectedTests.includes(testId) && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    "transition-colors",
                                    selectedTests.includes(testId)
                                      ? "text-gray-900 dark:text-white font-medium"
                                      : "text-gray-600 dark:text-gray-400"
                                  )}
                                >
                                  {test}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center">
                <motion.button
                  onClick={handleRunAnalysis}
                  disabled={
                    !websiteUrl || selectedTests.length === 0 || isRunning
                  }
                  className={cn(
                    "flex items-center space-x-3 px-8 py-4 text-white rounded-xl transition-all duration-300 shadow-lg mx-auto hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden",
                    "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700"
                  )}
                  whileHover={{ scale: isRunning ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isRunning ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <RotateCw className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  <span className="font-semibold text-lg">
                    {isRunning
                      ? "Analyzing..."
                      : `Run Analysis (${selectedTests.length} tests)`}
                  </span>
                </motion.button>

                <p className="text-gray-600 dark:text-gray-400 mt-4">
                  <Rocket className="w-4 h-4 inline mr-1" />
                  Our AI will analyze your WordPress site and provide detailed
                  recommendations
                </p>
              </div>
            </motion.div>
          )}

          {/* File Upload Tab */}
          {activeTab === "upload" && (
            <FileUploadPanel onFilesUpload={handleFilesUpload} />
          )}

          {/* API Testing Tab */}
          {activeTab === "api-testing" && (
            <APITestingPanel websiteUrl={websiteUrl} />
          )}

          {/* Analysis Tab */}
          {activeTab === "analysis" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {isRunning ? (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Bot className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    AI Analysis in Progress
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Analyzing {websiteUrl} with {selectedTests.length} quality
                    checks...
                  </p>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 8, ease: "easeInOut" }}
                      className="h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {DYNAMIC_QA_FEATURES.slice(0, 4).map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.5 }}
                        className="text-center"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 2,
                            delay: index * 0.7,
                            repeat: Infinity,
                          }}
                          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2"
                        >
                          <category.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {category.name}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : analysis ? (
                <AnalysisResults
                  analysis={analysis}
                  onProblemClick={handleProblemClick}
                />
              ) : (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg text-center">
                  <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No Analysis Data
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Run an analysis to see detailed results and AI
                    recommendations.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Problem Modal */}
        <ProblemModal
          problem={selectedProblem}
          isOpen={showProblemModal}
          onClose={() => setShowProblemModal(false)}
          screenshot={screenshot}
          websiteUrl={websiteUrl}
        />
      </div>
    </div>
  );
}
