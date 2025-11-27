"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Download,
  RefreshCw,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SERVICE_CONFIG = {
  wordpress: {
    name: "WordPress QA",
    color: "from-blue-500 to-cyan-500",
  },
  seo: {
    name: "SEO QA",
    color: "from-green-500 to-emerald-500",
  },
  ppc: {
    name: "PPC QA",
    color: "from-purple-500 to-pink-500",
  },
  "ai-automation": {
    name: "AI Automation QA",
    color: "from-orange-500 to-red-500",
  },
  content: {
    name: "Content QA",
    color: "from-indigo-500 to-purple-500",
  },
  "social-media": {
    name: "Social Media QA",
    color: "from-pink-500 to-rose-500",
  },
};

export default function QAResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientId = searchParams.get("clientId");

  const [qaData, setQaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load QA results from sessionStorage
    const storedResults = sessionStorage.getItem("qaResults");
    if (storedResults) {
      setQaData(JSON.parse(storedResults));
    }
    setIsLoading(false);
  }, []);

  const handleDownloadReport = () => {
    if (!qaData) return;

    const reportContent = JSON.stringify(qaData, null, 2);
    const blob = new Blob([reportContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qa-report-${qaData.clientName}-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case "failed":
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium">
            Passed
          </span>
        );
      case "failed":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-sm font-medium">
            Failed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-sm font-medium">
            Warning
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-cyan-50/50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-4"
          >
            <RefreshCw className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading QA results...
          </p>
        </div>
      </div>
    );
  }

  if (!qaData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-cyan-50/50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Results Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No QA results available. Please run a QA test first.
          </p>
          <button
            onClick={() => router.push(`/qualifai/quick-qa?clientId=${clientId}`)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Run QA Test
          </button>
        </div>
      </div>
    );
  }

  const completedCount = qaData.results.filter((r: any) => r.status === "completed").length;
  const failedCount = qaData.results.filter((r: any) => r.status === "failed").length;
  const totalCount = qaData.results.length;
  const successRate = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-cyan-50/50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(`/qualifai/quick-qa?clientId=${clientId}`)}
                className="p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  QA Results
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {qaData.clientName} • {new Date(qaData.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadReport}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Success Rate
              </span>
              {successRate >= 80 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : successRate >= 50 ? (
                <Minus className="w-5 h-5 text-yellow-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {successRate}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Total Tests
              </span>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalCount}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Passed
              </span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {completedCount}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Failed
              </span>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {failedCount}
            </div>
          </motion.div>
        </div>

        {/* Detailed Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Detailed Results
          </h2>

          <div className="space-y-4">
            {qaData.results.map((result: any, index: number) => {
              const serviceConfig = SERVICE_CONFIG[result.serviceType as keyof typeof SERVICE_CONFIG];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(result.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {serviceConfig?.name || result.serviceType}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Service Type: {result.serviceType}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>

                  {result.status === "failed" && result.error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
                        Error Details:
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {result.error}
                      </p>
                    </div>
                  )}

                  {result.status === "completed" && result.result && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm font-medium text-green-800 dark:text-green-400 mb-2">
                        QA Completed Successfully
                      </p>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        <p>Run ID: {result.result.id || 'N/A'}</p>
                        <p className="mt-1">
                          All quality checks passed for this service.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => router.push(`/qualifai/quick-qa?clientId=${clientId}`)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
          >
            Run Another QA
          </button>
          <button
            onClick={() => router.push(`/clients`)}
            className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:shadow-lg transition-all"
          >
            Back to Clients
          </button>
        </div>
      </div>
    </div>
  );
}
