// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
  Scatter,
  ZAxis,
  Treemap,
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
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Eye,
  Code,
  Users,
  Cpu,
  Smartphone,
  Lock,
  Wifi,
  Target,
  Clock,
  Hash,
  Database,
  Server,
  Network,
  ShieldAlert,
  Bell,
  Star,
  Award,
  TrendingDown,
  Globe2,
  Cloud,
  Layers,
  Filter,
  Settings,
  HelpCircle,
  Info,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
  Bot,
  Sparkles,
  Scan,
  ScanLine,
  ScanSearch,
  GlobeLock,
  RefreshCw,
  Loader2,
  Copy,
  Check,
  X,
  AlertOctagon,
  Lightbulb,
  TargetIcon,
  Gauge,
  ShieldCheck,
  SmartphoneIcon,
  GlobeIcon,
  WifiOff,
  ServerIcon,
  NetworkIcon,
  DatabaseIcon,
  Code2,
  Image as ImageIcon,
  Type,
  Heading,
  Link2,
  Navigation,
  GlobeLockIcon,
  BotIcon,
  CpuIcon,
  HardDrive,
  Radio,
  BellRing,
  EyeOff,
  Fingerprint,
  Key,
  Mail,
  MessageCircle,
  Monitor,
  MonitorSmartphone,
  Package,
  Puzzle,
  QrCode,
  SearchCheck,
  ShieldHalf,
  SmartphoneCharging,
  Tablet,
  Terminal,
  Text,
  Timer,
  TimerOff,
  Upload,
  Video,
  Volume2,
  WifiIcon,
  Workflow,
  ZapOff,
  ZoomIn,
  ZoomOut,
  FileCode,
  FileJson,
  FileSpreadsheet,
  FileDigit,
  FileWarning,
  Folder,
  FolderOpen,
  FolderTree,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui";

// Types
interface ScanOption {
  value: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  time: string;
  recommendedFor: string;
}

interface AuditCheck {
  id: number;
  category: string;
  name: string;
  description: string;
  importance: "critical" | "high" | "medium" | "low";
  status: "pass" | "fail" | "warning";
  score: number;
  recommendation: string;
  details?: any;
  issue?: string | null;
}

interface SiteHealth {
  score: number;
  crawledPages: number;
  errors: number;
  warnings: number;
  notices: number;
  passes: number;
  issuesFound?: number;
}

interface TrafficData {
  organic: number;
  keywords: number;
  backlinks: number;
  domains: number;
}

interface CategoryScores {
  Technical: number;
  "On-Page": number;
  Performance: number;
  Content: number;
}

interface RealIssue {
  page: string;
  issue?: string;
  severity: string;
  recommendation: string;
  title?: string;
  length?: number;
  count?: number;
  images?: string[];
  ratio?: string;
}

interface RealIssues {
  missingH1: RealIssue[];
  longTitles: RealIssue[];
  missingAltText: RealIssue[];
  brokenLinks: RealIssue[];
  missingMetaDesc: RealIssue[];
  lowTextRatio: RealIssue[];
  duplicateTitles: RealIssue[];
  slowPages?: RealIssue[];
  duplicateContent?: RealIssue[];
  redirectChains?: RealIssue[];
  insecureResources?: RealIssue[];
}

interface TechnicalReport {
  crawlability?: any;
  performance?: any;
  security?: any;
  mobile?: any;
  international?: any;
  dns?: any;
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

interface CrawlInfo {
  pagesScanned?: number;
  scanType?: string;
  scanTime?: number;
  totalLinks?: number;
  uniquePages?: number;
}

interface AuditData {
  url: string;
  overallScore: number;
  healthScore: number;
  checks: AuditCheck[];
  summary: SiteHealth;
  categoryScores: CategoryScores;
  traffic: TrafficData;
  realIssues?: RealIssues;
  technicalReport?: TechnicalReport;
  aiInsights?: AIInsights;
  crawlInfo?: CrawlInfo;
  timestamp: string;
  auditId: string;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#8b5cf6",
  "#ec4899",
  "#84cc16",
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [progress, setProgress] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [scanInProgress, setScanInProgress] = useState(false);
  const [crawlStatus, setCrawlStatus] = useState("");
  const [scannedPages, setScannedPages] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    technical: true,
    onpage: true,
    performance: true,
    content: true,
    ai: true,
    issues: true,
    traffic: true,
  });

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
    setScannedPages(0);
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
            setScannedPages(
              Math.floor(
                (progress / 100) * (scanType === "limited" ? 20 : 100),
              ),
            );
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "bg-green-500/10 border-green-500/30 text-green-400";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      case "fail":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "critical":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-gray-900";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    if (score >= 50) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-500/20";
    if (score >= 70) return "bg-yellow-500/20";
    if (score >= 50) return "bg-orange-500/20";
    return "bg-red-500/20";
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const filteredChecks =
    selectedCategory === "all"
      ? auditData?.checks
      : auditData?.checks.filter((c) => c.category === selectedCategory);

  const issueStats = auditData?.realIssues
    ? {
        total: Object.values(auditData.realIssues).flat().length,
        critical: Object.values(auditData.realIssues)
          .flat()
          .filter((i: any) => i.severity === "critical").length,
        high: Object.values(auditData.realIssues)
          .flat()
          .filter((i: any) => i.severity === "high").length,
        medium: Object.values(auditData.realIssues)
          .flat()
          .filter((i: any) => i.severity === "medium").length,
        low: Object.values(auditData.realIssues)
          .flat()
          .filter((i: any) => i.severity === "warning" || i.severity === "low")
          .length,
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      <div
        className="max-w-7xl mx-auto space-y-4 md:space-y-6"
        id="audit-report"
      >
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
                      onChange={(e: any) => setUrl(e.target.value)}
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
                  value: auditData.summary.crawledPages,
                  icon: FileText,
                  color: "blue",
                },
                {
                  label: "Issues Found",
                  value: auditData.summary.issuesFound,
                  icon: AlertCircle,
                  color: "red",
                },
                {
                  label: "Passed Checks",
                  value: auditData.summary.passes,
                  icon: CheckCircle,
                  color: "green",
                },
                {
                  label: "SEO Score",
                  value: auditData.overallScore,
                  icon: TrendingUp,
                  color: "purple",
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
                  value="technical"
                  className="data-[state=active]:bg-gray-800"
                >
                  <Cpu className="h-4 w-4 mr-2" />
                  Technical
                </TabsTrigger>
                <TabsTrigger
                  value="issues"
                  className="data-[state=active]:bg-gray-800"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Issues
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="data-[state=active]:bg-gray-800"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  AI Insights
                </TabsTrigger>
                <TabsTrigger
                  value="traffic"
                  className="data-[state=active]:bg-gray-800"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Traffic
                </TabsTrigger>
                <TabsTrigger
                  value="report"
                  className="data-[state=active]:bg-gray-800"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Full Report
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent className="space-y-6">
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
                          className={`text-6xl font-bold ${getScoreColor(auditData.overallScore)}`}
                        >
                          {auditData.overallScore}
                        </div>
                        <div className="text-gray-400 mt-2">out of 100</div>
                      </div>
                      <div className="w-2/3">
                        <Progress
                          value={auditData.overallScore}
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
                      {Object.entries(auditData.categoryScores).map(
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
                                {score}%
                              </Badge>
                            </div>
                            <Progress value={score} className="h-2" />
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Issues Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={Object.entries(auditData.categoryScores).map(
                              ([name, value]) => ({
                                name,
                                value: 100 - value,
                              }),
                            )}
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
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Score Comparison
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={Object.entries(auditData.categoryScores).map(
                            ([name, score]) => ({ name, score }),
                          )}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis dataKey="name" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" domain={[0, 100]} />
                          <RechartsTooltip />
                          <Bar
                            dataKey="score"
                            fill="#3b82f6"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Technical Tab */}
              <TabsContent className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Technical Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
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
                              {auditData.technicalReport?.performance?.loadTime
                                ? `${(auditData.technicalReport.performance.loadTime / 1000).toFixed(2)}s`
                                : "N/A"}
                            </div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="text-sm text-gray-400 mb-1">
                              Page Size
                            </div>
                            <div className="text-lg font-semibold text-white">
                              {auditData.technicalReport?.performance?.pageSize
                                ? `${(auditData.technicalReport.performance.pageSize / 1024 / 1024).toFixed(2)} MB`
                                : "N/A"}
                            </div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="text-sm text-gray-400 mb-1">
                              Requests
                            </div>
                            <div className="text-lg font-semibold text-white">
                              {auditData.technicalReport?.performance
                                ?.requests || "N/A"}
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
                                  auditData.technicalReport?.mobile
                                    ?.mobileFriendly
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {auditData.technicalReport?.mobile
                                  ?.mobileFriendly
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
                              {auditData.technicalReport?.mobile?.tapTargets ||
                                0}
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
                                  auditData.technicalReport?.security?.ssl
                                    ?.valid
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {auditData.technicalReport?.security?.ssl?.valid
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
                              {auditData.technicalReport?.security
                                ?.securityScore || 0}
                              /100
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Issues Tab */}
              <TabsContent className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">All Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {filteredChecks?.map((check) => (
                        <div
                          key={check.id}
                          className={`p-4 rounded-lg border ${getStatusColor(check.status)}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-white">
                                {check.name}
                              </h4>
                              <p className="text-sm text-gray-300">
                                {check.description}
                              </p>
                              {check.issue && (
                                <p className="text-sm text-gray-300 mt-1">
                                  ⚠️ {check.issue}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge
                                className={getImportanceColor(check.importance)}
                              >
                                {check.importance}
                              </Badge>
                              <div className="text-lg font-semibold text-white mt-1">
                                {check.score}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Insights Tab */}
              <TabsContent className="space-y-6">
                {auditData.aiInsights && (
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
                          {auditData.aiInsights.recommendations.map(
                            (rec, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 p-4 bg-purple-900/20 rounded-lg border border-purple-800/30"
                              >
                                <div className="bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
                                  {idx + 1}
                                </div>
                                <span className="text-gray-300">{rec}</span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Content Optimization */}
                      {auditData.aiInsights.contentOptimization && (
                        <div>
                          <h4 className="font-semibold text-white mb-2">
                            Content Optimization
                          </h4>
                          <div className="p-4 bg-purple-900/10 rounded-lg border border-purple-800/30">
                            <p className="text-gray-300 leading-relaxed">
                              {auditData.aiInsights.contentOptimization}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Traffic Tab */}
              <TabsContent className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Traffic Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-2xl font-bold text-white mb-1">
                          {formatNumber(auditData.traffic.organic)}
                        </div>
                        <div className="text-sm text-gray-400">
                          Monthly Organic Traffic
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-2xl font-bold text-white mb-1">
                          {formatNumber(auditData.traffic.keywords)}
                        </div>
                        <div className="text-sm text-gray-400">
                          Ranking Keywords
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-2xl font-bold text-white mb-1">
                          {formatNumber(auditData.traffic.backlinks)}
                        </div>
                        <div className="text-sm text-gray-400">
                          Total Backlinks
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="text-2xl font-bold text-white mb-1">
                          {formatNumber(auditData.traffic.domains)}
                        </div>
                        <div className="text-sm text-gray-400">
                          Referring Domains
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Full Report Tab */}
              <TabsContent className="space-y-6">
                <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Complete Audit Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-semibold text-white mb-2">
                          Audit Summary
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm text-gray-400">
                              Audit ID
                            </div>
                            <div className="text-white text-sm">
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
                            <div className="text-white">
                              {auditData.crawlInfo?.scanType || "Single Page"}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Website</div>
                            <div className="text-white truncate">
                              {auditData.url}
                            </div>
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
