// app/qualifai/seo/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Play,
  Search,
  Globe,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Hash,
  Clock,
} from "lucide-react";

interface SEOIssue {
  type: "critical" | "warning" | "info";
  category: string;
  message: string;
}

interface SEOAnalysisData {
  url: string;
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  content: {
    wordCount: number;
    headings: {
      h1: number;
      h2: number;
      h3: number;
      h4: number;
      h5: number;
      h6: number;
    };
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
  };
  links: {
    internal: number;
    external: number;
  };
  performance: {
    httpStatusCode: number;
    loadedTime: string;
  };
  issues: SEOIssue[];
  score: number;
}

export default function SEOQAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");

  const [url, setUrl] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [analysisData, setAnalysisData] = useState<SEOAnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSEOAnalysis = async () => {
    if (!url) {
      setError("Please enter a URL to analyze");
      return;
    }

    setIsTesting(true);
    setError(null);
    setAnalysisData(null);

    try {
      const response = await fetch("/api/qualifai/seo-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to analyze SEO");
      }

      setAnalysisData(result.data);
    } catch (err: any) {
      console.error("SEO Analysis Error:", err);
      setError(err.message || "Failed to analyze SEO. Please try again.");
    } finally {
      setIsTesting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/50 to-teal-50/50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                SEO QA
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive SEO audit
              </p>
            </div>
          </div>
        </div>

        {/* URL Input */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="url-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Website URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="url-input"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isTesting) {
                      runSEOAnalysis();
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={runSEOAnalysis}
                disabled={isTesting || !url}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Play className="w-4 h-4" />
                <span>{isTesting ? "Analyzing..." : "Run Analysis"}</span>
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-3"
            >
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </motion.div>
          )}
        </div>

        {/* Loading State */}
        <AnimatePresence>
          {isTesting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
                />
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Crawling website and analyzing SEO...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This may take up to 2 minutes
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysisData && !isTesting && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              {/* Score Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    SEO Score
                  </h2>
                  <a
                    href={analysisData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-green-600 dark:text-green-400 hover:underline"
                  >
                    <span className="text-sm">{analysisData.url}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex items-center justify-center">
                  <div className="relative">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 88 * (1 - analysisData.score / 100)
                        }`}
                        className={`${getScoreColor(analysisData.score)} transition-all duration-1000`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className={`text-5xl font-bold ${getScoreColor(
                            analysisData.score
                          )}`}
                        >
                          {analysisData.score}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          out of 100
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta Information */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Meta Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Title
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {analysisData.title || "Not found"}
                      {analysisData.title && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({analysisData.title.length} chars)
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Description
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {analysisData.description || "Not found"}
                      {analysisData.description && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({analysisData.description.length} chars)
                        </span>
                      )}
                    </p>
                  </div>
                  {analysisData.canonicalUrl && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Canonical URL
                      </label>
                      <p className="text-gray-900 dark:text-white break-all">
                        {analysisData.canonicalUrl}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                      Content
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysisData.content.wordCount}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">words</p>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow">
                  <div className="flex items-center space-x-3 mb-2">
                    <Hash className="w-5 h-5 text-purple-500" />
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                      Headings
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    H1: {analysisData.content.headings.h1}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    H2-H6:{" "}
                    {analysisData.content.headings.h2 +
                      analysisData.content.headings.h3 +
                      analysisData.content.headings.h4 +
                      analysisData.content.headings.h5 +
                      analysisData.content.headings.h6}
                  </p>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow">
                  <div className="flex items-center space-x-3 mb-2">
                    <ImageIcon className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                      Images
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysisData.images.total}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {analysisData.images.withoutAlt} missing alt
                  </p>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow">
                  <div className="flex items-center space-x-3 mb-2">
                    <LinkIcon className="w-5 h-5 text-orange-500" />
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                      Links
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analysisData.links.internal + analysisData.links.external}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {analysisData.links.internal} internal, {analysisData.links.external}{" "}
                    external
                  </p>
                </div>
              </div>

              {/* Issues */}
              {analysisData.issues.length > 0 && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Issues Found ({analysisData.issues.length})
                  </h3>
                  <div className="space-y-3">
                    {analysisData.issues.map((issue, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-xl"
                      >
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {issue.category}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                issue.type === "critical"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  : issue.type === "warning"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              }`}
                            >
                              {issue.type}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {issue.message}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        analysisData.performance.httpStatusCode === 200
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}
                    >
                      {analysisData.performance.httpStatusCode === 200 ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        HTTP Status
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {analysisData.performance.httpStatusCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                      <Clock className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Load Time
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {new Date(analysisData.performance.loadedTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!analysisData && !isTesting && !error && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-12 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">
                Enter a URL and click "Run Analysis" to start SEO audit
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
