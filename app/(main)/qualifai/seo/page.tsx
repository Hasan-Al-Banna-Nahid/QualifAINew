// app/(main)/qualifai/seo/page.tsx - FIXED VERSION
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

// Import only necessary icons
import {
  Search,
  Globe,
  Shield,
  Zap,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Link,
  BarChart3,
  Cpu,
  Smartphone,
  Bot,
  Sparkles,
  Scan,
  ScanSearch,
  Clock,
  Loader2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Users,
  Server,
  Network,
  Database,
  Activity,
  ShieldCheck,
  SmartphoneIcon,
  Timer,
  ShieldAlert,
  FileWarning,
  AlertOctagon,
  Layers,
  Gauge,
  GlobeLock,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui";

// Types based on your API response
interface ScanOption {
  value: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  time: string;
  recommendedFor: string;
}

interface Issue {
  type: string;
  count: number;
  severity: "error" | "warning" | "notice";
  affectedPages: Array<{
    url: string;
    details: string;
    discovered: string;
  }>;
}

interface TopIssue {
  title: string;
  count: number;
  percentage: number;
  type: "error" | "warning" | "notice";
}

interface AIInsights {
  recommendations: string[];
  competitiveAnalysis: string;
  contentOptimization: string;
  technicalImprovements?: string[];
  priorityActions?: Array<{
    action: string;
    impact: "high" | "medium" | "low";
    effort: "high" | "medium" | "low";
    priority: number;
  }>;
}

interface Performance {
  loadTime: number;
  pageSize: number;
  requests: number;
}

interface Mobile {
  friendly: boolean;
  hasViewport: boolean;
}

interface Security {
  hasSSL: boolean;
  securityScore: number;
}

interface Summary {
  totalPages: number;
  totalIssues: number;
  healthScore: number;
  performance: Performance;
  mobile: Mobile;
  security: Security;
}

interface TechnicalDetails {
  crawlability: any;
  mobile: any;
  international: any;
  performance: any;
  security: any;
  dns: any;
}

interface AuditData {
  url: string;
  auditId: string;
  timestamp: string;
  scanType: string;
  scanTime: number;

  // Main results from API
  siteHealth: {
    score: number;
    crawledPages: number;
    errors: number;
    warnings: number;
    notices: number;
  };

  topIssues: TopIssue[];

  // Categorized issues
  errors: Record<string, Issue>;
  warnings: Record<string, Issue>;
  notices: Record<string, Issue>;

  // Technical analysis
  technical: TechnicalDetails;

  // AI insights
  ai: AIInsights;

  // Summary for quick overview
  summary: Summary;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#ec4899",
  "#84cc16",
  "#f43f5e",
];

const SCAN_OPTIONS: ScanOption[] = [
  {
    value: "single",
    label: "Single Page Scan",
    description: "Analyze only the homepage for quick results",
    icon: Globe,
    color: "blue",
    time: "10-30 seconds",
    recommendedFor: "Quick checks, simple sites",
  },
  {
    value: "limited",
    label: "Limited Site Scan",
    description: "Scan up to 20 important pages",
    icon: Scan,
    color: "green",
    time: "1-3 minutes",
    recommendedFor: "Most websites, moderate analysis",
  },
  {
    value: "full",
    label: "Full Site Scan",
    description: "Comprehensive scan of up to 100 pages",
    icon: ScanSearch,
    color: "purple",
    time: "3-10 minutes",
    recommendedFor: "Enterprise sites, detailed audits",
  },
];

export default function QualifaiSEOAudit() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanType, setScanType] = useState("single");
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [progress, setProgress] = useState(0);
  const [scanInProgress, setScanInProgress] = useState(false);
  const [crawlStatus, setCrawlStatus] = useState("");
  const [scannedPages, setScannedPages] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const selectedScanOption = SCAN_OPTIONS.find((o) => o.value === scanType);

  useEffect(() => {
    if (selectedScanOption) {
      setEstimatedTime(selectedScanOption.time);
    }
  }, [scanType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      alert("Please enter a valid URL starting with http:// or https://");
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      alert("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setLoading(true);
    setScanInProgress(true);
    setProgress(0);
    setCrawlStatus("Initializing scan...");
    setAuditData(null);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          let increment = 0;
          switch (scanType) {
            case "single":
              increment = 8 + Math.random() * 4;
              break;
            case "limited":
              increment = 4 + Math.random() * 2;
              break;
            case "full":
              increment = 2 + Math.random() * 1;
              break;
          }
          const newProgress = prev + increment;
          if (newProgress >= 98) {
            clearInterval(progressInterval);
            return 98;
          }
          return newProgress;
        });

        if (progress < 20) {
          setCrawlStatus("Validating URL and checking accessibility...");
        } else if (progress < 40) {
          setCrawlStatus("Analyzing page structure and HTML...");
        } else if (progress < 60) {
          setCrawlStatus("Checking technical SEO factors...");
        } else if (progress < 80) {
          if (scanType === "single") {
            setCrawlStatus("Analyzing content and performance...");
          } else {
            setCrawlStatus(`Crawling site... ${scannedPages} pages scanned`);
          }
        } else {
          setCrawlStatus("Generating AI insights and final report...");
        }
      }, 500);

      const response = await fetch("/api/seo-audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          url: url.trim(),
          scanType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `API request failed with status ${response.status}`,
        );
      }

      const data = await response.json();
      setAuditData(data);
      setScannedPages(data?.summary?.totalPages || 0);

      clearInterval(progressInterval);
      setProgress(100);
      setCrawlStatus("Scan completed successfully!");

      setTimeout(() => {
        setScanInProgress(false);
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      console.error("Audit failed:", error);
      setCrawlStatus(`Scan failed: ${error.message}`);
      setProgress(0);
      alert(`SEO Audit Failed: ${error.message}`);
      setScanInProgress(false);
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      case "notice":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <XCircle className="h-5 w-5 text-red-400" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case "notice":
        return <AlertCircle className="h-5 w-5 text-blue-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500/20";
    if (score >= 60) return "bg-yellow-500/20";
    if (score >= 40) return "bg-orange-500/20";
    return "bg-red-500/20";
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString() || "0";
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Calculate total issues
  const totalIssues = auditData
    ? auditData.siteHealth.errors +
      auditData.siteHealth.warnings +
      auditData.siteHealth.notices
    : 0;

  // Calculate category scores based on issues
  const calculateCategoryScore = (category: string): number => {
    if (!auditData) return 0;

    const totalPages = auditData.siteHealth.crawledPages;
    let issues = 0;

    switch (category) {
      case "Technical":
        issues = Object.values(auditData.errors).reduce(
          (sum, issue) => sum + issue.count,
          0,
        );
        break;
      case "Content":
        issues =
          (auditData.errors.duplicateContent?.count || 0) +
          (auditData.errors.duplicateTitles?.count || 0) +
          (auditData.errors.duplicateMetaDescriptions?.count || 0);
        break;
      case "Performance":
        return auditData.technical?.performance
          ? Math.max(0, 100 - auditData.technical.performance.loadTime / 100)
          : 70;
      case "Mobile":
        return auditData.technical?.mobile?.mobileFriendly ? 90 : 50;
    }

    return Math.max(0, 100 - (issues / totalPages) * 100);
  };

  const categoryScores = {
    Technical: calculateCategoryScore("Technical"),
    Content: calculateCategoryScore("Content"),
    Performance: calculateCategoryScore("Performance"),
    Mobile: calculateCategoryScore("Mobile"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 md:space-y-4"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
            <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-blue-400" />
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Qualifai SEO Audit
            </h1>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 text-sm md:text-base">
              Professional Site Scanner
            </Badge>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Comprehensive SEO analysis with AI-powered insights, technical
            audits, and competitive benchmarking
          </p>
        </motion.div>

        {/* Main Scan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-2xl">
            <CardContent className="p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* URL Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website URL
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUrl(e.target.value)
                      }
                      className="pl-10 bg-gray-800 border-gray-700 text-white h-12 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    />
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    {url && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(url)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Scan Options */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Scan className="h-4 w-4" />
                    Scan Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {SCAN_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      return (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                            scanType === option.value
                              ? option.color === "blue"
                                ? "border-blue-500 bg-blue-500/10"
                                : option.color === "green"
                                  ? "border-green-500 bg-green-500/10"
                                  : "border-purple-500 bg-purple-500/10"
                              : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                          }`}
                          onClick={() => setScanType(option.value)}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Icon
                              className={`h-5 w-5 ${
                                option.color === "blue"
                                  ? "text-blue-400"
                                  : option.color === "green"
                                    ? "text-green-400"
                                    : "text-purple-400"
                              }`}
                            />
                            <span className="font-semibold text-white">
                              {option.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">
                            {option.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {option.time}
                            </span>
                            <span>{option.recommendedFor}</span>
                          </div>
                          {scanType === option.value && (
                            <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Selected
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading || !url}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-lg font-semibold"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        {scanInProgress ? (
                          <span className="flex items-center gap-2">
                            Scanning... {progress.toFixed(0)}%
                          </span>
                        ) : (
                          "Processing Results..."
                        )}
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Start {selectedScanOption?.label || "SEO"} Audit
                      </>
                    )}
                  </Button>

                  {/* Progress Bar */}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 space-y-3"
                    >
                      <div className="flex justify-between text-sm text-gray-300">
                        <span className="flex items-center gap-2">
                          <Activity className="h-3 w-3 animate-pulse" />
                          {crawlStatus}
                        </span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress} className="h-2 bg-gray-800" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Estimated time: {estimatedTime}</span>
                        <span>
                          {scannedPages > 0 && `Pages scanned: ${scannedPages}`}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        {auditData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 md:space-y-6"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                {
                  label: "Pages Scanned",
                  value: auditData.siteHealth.crawledPages,
                  icon: FileText,
                  color: "blue",
                  description: "Total pages analyzed",
                },
                {
                  label: "Issues Found",
                  value: totalIssues,
                  icon: AlertCircle,
                  color: "red",
                  description: `${auditData.siteHealth.errors} errors, ${auditData.siteHealth.warnings} warnings, ${auditData.siteHealth.notices} notices`,
                },
                {
                  label: "Health Score",
                  value: `${auditData.siteHealth.score}`,
                  icon: CheckCircle,
                  color: "green",
                  description: "Overall site health",
                },
                {
                  label: "Scan Time",
                  value: formatTime(auditData.scanTime),
                  icon: Timer,
                  color: "purple",
                  description: "Total audit duration",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            stat.color === "blue"
                              ? "bg-blue-500/10"
                              : stat.color === "red"
                                ? "bg-red-500/10"
                                : stat.color === "green"
                                  ? "bg-green-500/10"
                                  : "bg-purple-500/10"
                          }`}
                        >
                          <stat.icon
                            className={`h-5 w-5 ${
                              stat.color === "blue"
                                ? "text-blue-400"
                                : stat.color === "red"
                                  ? "text-red-400"
                                  : stat.color === "green"
                                    ? "text-green-400"
                                    : "text-purple-400"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-400">
                            {stat.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {stat.description}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Tabs Navigation */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-gray-900 p-1">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-gray-800"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="issues"
                  className="data-[state=active]:bg-gray-800"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Issues
                </TabsTrigger>
                <TabsTrigger
                  value="technical"
                  className="data-[state=active]:bg-gray-800"
                >
                  <Cpu className="h-4 w-4 mr-2" />
                  Technical
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="data-[state=active]:bg-gray-800"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  AI Insights
                </TabsTrigger>
                <TabsTrigger
                  value="performance"
                  className="data-[state=active]:bg-gray-800"
                >
                  <Gauge className="h-4 w-4 mr-2" />
                  Performance
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-gray-800"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Details
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent defaultValue={"overview"} className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      SEO Health Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div
                          className={`text-6xl font-bold ${getScoreColor(auditData.siteHealth.score)}`}
                        >
                          {auditData.siteHealth.score}
                        </div>
                        <div className="text-gray-400 mt-2">out of 100</div>
                      </div>
                      <div className="w-2/3">
                        <Progress
                          value={auditData.siteHealth.score}
                          className="h-3"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Poor</span>
                          <span>Average</span>
                          <span>Good</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Scores */}
                <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Category Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(categoryScores).map(
                        ([category, score]) => (
                          <div
                            key={category}
                            className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-white">
                                {category}
                              </span>
                              <Badge
                                className={
                                  score >= 80
                                    ? "bg-green-500"
                                    : score >= 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }
                              >
                                {Math.round(score)}%
                              </Badge>
                            </div>
                            <Progress value={score} className="h-2" />
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Issues Chart */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Top Issues Found
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={auditData.topIssues.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="title"
                          stroke="#9ca3af"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis stroke="#9ca3af" />
                        <RechartsTooltip
                          formatter={(value: number) => [
                            `${value} issues`,
                            "Count",
                          ]}
                          labelFormatter={(label) => `Issue: ${label}`}
                        />
                        <Bar
                          dataKey="count"
                          fill="#ef4444"
                          radius={[8, 8, 0, 0]}
                          name="Issue Count"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Issue Distribution */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Issue Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Errors",
                              value: auditData.siteHealth.errors,
                              color: "#ef4444",
                            },
                            {
                              name: "Warnings",
                              value: auditData.siteHealth.warnings,
                              color: "#f59e0b",
                            },
                            {
                              name: "Notices",
                              value: auditData.siteHealth.notices,
                              color: "#3b82f6",
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell key="cell-errors" fill="#ef4444" />
                          <Cell key="cell-warnings" fill="#f59e0b" />
                          <Cell key="cell-notices" fill="#3b82f6" />
                        </Pie>
                        <RechartsTooltip
                          formatter={(value: number) => [
                            `${value} issues`,
                            "Count",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Issues Tab */}
              <TabsContent defaultValue={"issues"} className="space-y-6">
                {/* Errors */}
                <Card className="bg-gradient-to-br from-red-900/20 to-red-950/20 border-red-800/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertOctagon className="h-5 w-5 text-red-400" />
                      Critical Errors ({auditData.siteHealth.errors})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(auditData.errors)
                      .filter(([_, issue]) => issue.count > 0)
                      .map(([key, issue]) => (
                        <div
                          key={key}
                          className="bg-red-500/10 rounded-lg p-4 border border-red-500/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">
                              {issue.type}
                            </h4>
                            <Badge variant="destructive">
                              {issue.count} issues
                            </Badge>
                          </div>
                          {issue.affectedPages.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-300">
                                Affected Pages:
                              </p>
                              <div className="max-h-32 overflow-y-auto bg-black/20 p-2 rounded">
                                {issue.affectedPages
                                  .slice(0, 5)
                                  .map((page, idx) => (
                                    <p
                                      key={idx}
                                      className="text-xs text-gray-400 truncate"
                                    >
                                      • {page.url}
                                    </p>
                                  ))}
                                {issue.affectedPages.length > 5 && (
                                  <p className="text-xs text-gray-500 italic">
                                    ... and {issue.affectedPages.length - 5}{" "}
                                    more
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </CardContent>
                </Card>

                {/* Warnings */}
                <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-950/20 border-yellow-800/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      Warnings ({auditData.siteHealth.warnings})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(auditData.warnings)
                      .filter(([_, issue]) => issue.count > 0)
                      .map(([key, issue]) => (
                        <div
                          key={key}
                          className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">
                              {issue.type}
                            </h4>
                            <Badge className="bg-yellow-500">
                              {issue.count} issues
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                {/* Notices */}
                <Card className="bg-gradient-to-br from-blue-900/20 to-blue-950/20 border-blue-800/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-400" />
                      Notices ({auditData.siteHealth.notices})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(auditData.notices)
                      .filter(([_, issue]) => issue.count > 0)
                      .map(([key, issue]) => (
                        <div
                          key={key}
                          className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">
                              {issue.type}
                            </h4>
                            <Badge className="bg-blue-500">
                              {issue.count} issues
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Technical Tab */}
              <TabsContent defaultValue={"technical"} className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Technical Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Performance */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Performance
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <div className="text-sm text-gray-400 mb-1">
                            Load Time
                          </div>
                          <div className="text-lg font-semibold text-white">
                            {auditData.technical?.performance?.loadTime
                              ? `${(auditData.technical.performance.loadTime / 1000).toFixed(2)}s`
                              : "N/A"}
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <div className="text-sm text-gray-400 mb-1">
                            Page Size
                          </div>
                          <div className="text-lg font-semibold text-white">
                            {auditData.technical?.performance?.pageSize
                              ? `${(auditData.technical.performance.pageSize / 1024 / 1024).toFixed(2)} MB`
                              : "N/A"}
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <div className="text-sm text-gray-400 mb-1">
                            Requests
                          </div>
                          <div className="text-lg font-semibold text-white">
                            {auditData.technical?.performance?.requests ||
                              "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Mobile Optimization
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">
                              Mobile Friendly
                            </span>
                            <Badge
                              variant={
                                auditData.technical?.mobile?.mobileFriendly
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {auditData.technical?.mobile?.mobileFriendly
                                ? "Yes"
                                : "No"}
                            </Badge>
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <div className="text-sm text-gray-400 mb-1">
                            Tap Targets
                          </div>
                          <div className="text-lg font-semibold text-white">
                            {auditData.technical?.mobile?.tapTargets || 0}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Security */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Security
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">
                              SSL Certificate
                            </span>
                            <Badge
                              variant={
                                auditData.technical?.security?.ssl?.valid
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {auditData.technical?.security?.ssl?.valid
                                ? "Valid"
                                : "Invalid"}
                            </Badge>
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <div className="text-sm text-gray-400 mb-1">
                            Security Score
                          </div>
                          <div className="text-lg font-semibold text-white">
                            {auditData.technical?.security?.securityScore || 0}
                            /100
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DNS */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <Network className="h-4 w-4" />
                        DNS Analysis
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">
                              CDN Detected
                            </span>
                            <Badge
                              variant={
                                auditData.technical?.dns?.cdnDetected?.length
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {auditData.technical?.dns?.cdnDetected?.length
                                ? "Yes"
                                : "No"}
                            </Badge>
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <div className="text-sm text-gray-400 mb-1">
                            A Records
                          </div>
                          <div className="text-lg font-semibold text-white">
                            {auditData.technical?.dns?.aRecords?.length || 0}
                          </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">
                              DNSSEC
                            </span>
                            <Badge
                              variant={
                                auditData.technical?.dns?.hasDNSSEC
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {auditData.technical?.dns?.hasDNSSEC
                                ? "Enabled"
                                : "Disabled"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Insights Tab */}
              <TabsContent defaultValue={"ai"} className="space-y-6">
                {auditData.ai && (
                  <Card className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border-purple-800/50">
                    <CardHeader>
                      <CardTitle className="text-white">
                        AI-Powered Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Recommendations */}
                      <div>
                        <h4 className="font-semibold text-white mb-3">
                          Top Recommendations
                        </h4>
                        <div className="space-y-3">
                          {auditData.ai.recommendations.map((rec, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-4 bg-purple-900/20 rounded-lg border border-purple-800/30"
                            >
                              <div className="bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
                                {idx + 1}
                              </div>
                              <span className="text-gray-300">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Priority Actions */}
                      {auditData.ai.priorityActions &&
                        auditData.ai.priorityActions.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-white mb-3">
                              Priority Actions
                            </h4>
                            <div className="space-y-3">
                              {auditData.ai.priorityActions.map(
                                (action, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-purple-900/10 rounded-lg p-4 border border-purple-800/30"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-white font-medium">
                                        {action.action}
                                      </span>
                                      <Badge
                                        className={`
                                    ${
                                      action.impact === "high"
                                        ? "bg-red-500"
                                        : action.impact === "medium"
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                    }
                                  `}
                                      >
                                        Priority: {action.priority}
                                      </Badge>
                                    </div>
                                    <div className="flex gap-4 text-sm text-gray-400">
                                      <span>Impact: {action.impact}</span>
                                      <span>Effort: {action.effort}</span>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                      {/* Content Optimization */}
                      {auditData.ai.contentOptimization && (
                        <div>
                          <h4 className="font-semibold text-white mb-2">
                            Content Optimization
                          </h4>
                          <div className="p-4 bg-purple-900/10 rounded-lg border border-purple-800/30">
                            <p className="text-gray-300 leading-relaxed">
                              {auditData.ai.contentOptimization}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent defaultValue={"performance"} className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {auditData.summary && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="text-2xl font-bold text-white mb-1">
                              {auditData.summary.performance.loadTime}ms
                            </div>
                            <div className="text-sm text-gray-400">
                              Load Time
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {auditData.summary.performance.loadTime < 1000
                                ? "Excellent"
                                : auditData.summary.performance.loadTime < 3000
                                  ? "Good"
                                  : "Needs Improvement"}
                            </div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="text-2xl font-bold text-white mb-1">
                              {formatNumber(
                                auditData.summary.performance.pageSize,
                              )}
                            </div>
                            <div className="text-sm text-gray-400">
                              Page Size
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {auditData.summary.performance.requests} requests
                            </div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="text-2xl font-bold text-white mb-1">
                              {auditData.summary.security.securityScore}/100
                            </div>
                            <div className="text-sm text-gray-400">
                              Security Score
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {auditData.summary.security.hasSSL
                                ? "SSL: ✓"
                                : "SSL: ✗"}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium">
                                Mobile Friendly
                              </span>
                              <Badge
                                variant={
                                  auditData.summary.mobile.friendly
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {auditData.summary.mobile.friendly
                                  ? "Yes"
                                  : "No"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400">
                              Viewport:{" "}
                              {auditData.summary.mobile.hasViewport ? "✓" : "✗"}
                            </p>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="text-white font-medium mb-2">
                              Total Issues
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-red-400">
                                  {auditData.siteHealth.errors}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Errors
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-400">
                                  {auditData.siteHealth.warnings}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Warnings
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">
                                  {auditData.siteHealth.notices}
                                </div>
                                <div className="text-xs text-gray-400">
                                  Notices
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent defaultValue={"overview"} className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Audit Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-semibold text-white mb-3">
                          Scan Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-400">
                              Audit ID
                            </div>
                            <div className="text-white text-sm font-mono">
                              {auditData.auditId}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">
                              Scan Date
                            </div>
                            <div className="text-white">
                              {new Date(auditData.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">
                              Scan Type
                            </div>
                            <div className="text-white capitalize">
                              {auditData.scanType}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">
                              Scan Duration
                            </div>
                            <div className="text-white">
                              {formatTime(auditData.scanTime)}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <div className="text-sm text-gray-400">
                              Website URL
                            </div>
                            <div className="text-white truncate">
                              {auditData.url}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-semibold text-white mb-3">
                          Crawl Statistics
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">
                              {auditData.siteHealth.crawledPages}
                            </div>
                            <div className="text-sm text-gray-400">
                              Pages Scanned
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-400">
                              {auditData.siteHealth.errors}
                            </div>
                            <div className="text-sm text-gray-400">
                              Critical Errors
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400">
                              {auditData.siteHealth.warnings}
                            </div>
                            <div className="text-sm text-gray-400">
                              Warnings
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">
                              {auditData.siteHealth.notices}
                            </div>
                            <div className="text-sm text-gray-400">Notices</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  );
}
