// app/(main)/qualifai/seo/page.tsx - CLEAN VERSION
"use client";

import React, { useState, useEffect, useRef } from "react";
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  Activity,
  ShieldCheck,
  Timer,
  AlertOctagon,
  Layers,
  Gauge,
  Download,
  Sun,
  Moon,
  Printer,
  // FilePdf,
  ExternalLink,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Target,
  Award,
  Star,
  Rocket,
  TrendingDown,
  Eye,
  EyeOff,
  Filter,
  Info,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Network,
  Database,
  Server,
  Code,
  Lock,
  Unlock,
  File,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  // CardDescription,
  Button,
  Input,
  Badge,
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui";

// Import your theme context
import { useTheme } from "@/app/context/ThemeContext";

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
  siteHealth: {
    score: number;
    crawledPages: number;
    errors: number;
    warnings: number;
    notices: number;
  };
  topIssues: TopIssue[];
  errors: Record<string, Issue>;
  warnings: Record<string, Issue>;
  notices: Record<string, Issue>;
  technical: TechnicalDetails;
  ai: AIInsights;
  summary: Summary;
}

const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#ec4899", // Pink
  "#84cc16", // Lime
  "#f43f5e", // Rose
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
  const { theme, toggleTheme } = useTheme();
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
  const [exportingPdf, setExportingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const [filterSeverity, setFilterSeverity] = useState<string[]>([
    "error",
    "warning",
    "notice",
  ]);
  const [chartType, setChartType] = useState<"bar" | "pie" | "radar">("bar");

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
        return theme === "dark"
          ? "bg-red-500/10 border-red-500/30 text-red-400"
          : "bg-red-50 border-red-200 text-red-700";
      case "warning":
        return theme === "dark"
          ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
          : "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "notice":
        return theme === "dark"
          ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
          : "bg-blue-50 border-blue-200 text-blue-700";
      default:
        return theme === "dark"
          ? "bg-gray-500/10 border-gray-500/30 text-gray-400"
          : "bg-gray-50 border-gray-200 text-gray-700";
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

  // Calculate category scores
  const calculateCategoryScore = (category: string): number => {
    if (!auditData) return 0;

    const totalPages = auditData.siteHealth.crawledPages;
    if (totalPages === 0) return 0;

    let issues = 0;
    let maxPossibleIssues = totalPages;

    switch (category) {
      case "Technical":
        issues = auditData.siteHealth.errors;
        maxPossibleIssues = totalPages * 5;
        break;
      case "Content":
        issues = auditData.siteHealth.warnings;
        maxPossibleIssues = totalPages * 3;
        break;
      case "Performance":
        const perfScore = auditData.technical?.performance?.loadTime || 3000;
        return Math.max(0, 100 - perfScore / 100);
      case "Mobile":
        const mobileIssues = auditData.siteHealth.notices;
        maxPossibleIssues = totalPages * 2;
        issues = mobileIssues;
        break;
      case "Security":
        return auditData.summary.security.securityScore;
    }

    const score = Math.max(0, 100 - (issues / maxPossibleIssues) * 100);
    return Math.min(100, Math.round(score));
  };

  const categoryScores = {
    Technical: calculateCategoryScore("Technical"),
    Content: calculateCategoryScore("Content"),
    Performance: calculateCategoryScore("Performance"),
    Mobile: calculateCategoryScore("Mobile"),
    Security: calculateCategoryScore("Security"),
  };

  const categoryData = Object.entries(categoryScores).map(([name, score]) => ({
    name,
    score,
    fill: COLORS[Object.keys(categoryScores).indexOf(name) % COLORS.length],
  }));

  // Generate PDF Report
  const generatePDF = async () => {
    if (!auditData || !reportRef.current) return;

    setExportingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add Qualifai Branding
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, 210, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text("Qualifai SEO Audit Report", 105, 20, { align: "center" });

      doc.setFontSize(12);
      doc.text(
        `Generated: ${new Date(auditData.timestamp).toLocaleString()}`,
        105,
        30,
        { align: "center" },
      );

      // Add PieChart Icon
      doc.setFontSize(40);
      doc.text("Q", 20, 25);

      // Website Info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text("Website Analysis", 20, 50);
      doc.setFontSize(12);
      doc.text(`URL: ${auditData.url}`, 20, 60);
      doc.text(`Scan Type: ${auditData.scanType.toUpperCase()}`, 20, 66);
      doc.text(`Pages Scanned: ${auditData.siteHealth.crawledPages}`, 20, 72);
      doc.text(`Total Issues: ${totalIssues}`, 20, 78);

      // Health Score
      doc.setFillColor(
        auditData.siteHealth.score >= 80
          ? 34
          : auditData.siteHealth.score >= 60
            ? 250
            : auditData.siteHealth.score >= 40
              ? 249
              : 239,
        auditData.siteHealth.score >= 80
          ? 197
          : auditData.siteHealth.score >= 60
            ? 204
            : auditData.siteHealth.score >= 40
              ? 115
              : 68,
        auditData.siteHealth.score >= 80
          ? 94
          : auditData.siteHealth.score >= 60
            ? 21
            : auditData.siteHealth.score >= 40
              ? 22
              : 68,
      );
      doc.circle(180, 55, 15, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text(`${auditData.siteHealth.score}`, 180, 58, { align: "center" });
      doc.setFontSize(8);
      doc.text("Score", 180, 63, { align: "center" });

      // Issues Summary
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text("Issues Summary", 20, 90);

      const issuesData = [
        ["Severity", "Count", "Percentage"],
        [
          "Critical Errors",
          auditData.siteHealth.errors.toString(),
          `${Math.round((auditData.siteHealth.errors / totalIssues) * 100)}%`,
        ],
        [
          "Warnings",
          auditData.siteHealth.warnings.toString(),
          `${Math.round((auditData.siteHealth.warnings / totalIssues) * 100)}%`,
        ],
        [
          "Notices",
          auditData.siteHealth.notices.toString(),
          `${Math.round((auditData.siteHealth.notices / totalIssues) * 100)}%`,
        ],
      ];

      autoTable(doc, {
        startY: 95,
        head: [issuesData[0]],
        body: issuesData.slice(1),
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      });

      // Top Issues
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text("Top Issues Found", 20, finalY);

      const topIssuesData = auditData.topIssues
        .slice(0, 10)
        .map((issue) => [
          issue.title,
          issue.count.toString(),
          `${Math.round(issue.percentage)}%`,
          issue.type.toUpperCase(),
        ]);

      autoTable(doc, {
        startY: finalY + 5,
        head: [["Issue", "Count", "Affected %", "Severity"]],
        body: topIssuesData,
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      });

      // AI Recommendations
      const recommendationsY = (doc as any).lastAutoTable.finalY + 10;
      doc.addPage();
      doc.setFontSize(16);
      doc.text("AI-Powered Recommendations", 20, 20);
      doc.setFontSize(12);

      let yPos = 30;
      auditData.ai.recommendations.forEach((rec, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`${index + 1}. ${rec}`, 20, yPos);
        yPos += 10;
      });

      // Priority Actions
      yPos += 10;
      doc.setFontSize(16);
      doc.text("Priority Actions", 20, yPos);
      yPos += 10;
      doc.setFontSize(12);

      auditData.ai.priorityActions?.forEach((action, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`${index + 1}. ${action.action}`, 20, yPos);
        doc.setFontSize(10);
        doc.text(
          `   Priority: ${action.priority} | Impact: ${action.impact} | Effort: ${action.effort}`,
          20,
          yPos + 5,
        );
        yPos += 15;
        doc.setFontSize(12);
      });

      // Save PDF
      doc.save(
        `qualifai-audit-${auditData.url.replace(/[^a-zA-Z0-9]/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`,
      );
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF report");
    } finally {
      setExportingPdf(false);
    }
  };

  // Download JSON data
  const downloadJSON = () => {
    if (!auditData) return;
    const dataStr = JSON.stringify(auditData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qualifai-audit-${auditData.url.replace(/[^a-zA-Z0-9]/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Toggle severity filter
  const toggleSeverityFilter = (severity: string) => {
    setFilterSeverity((prev) =>
      prev.includes(severity)
        ? prev.filter((s) => s !== severity)
        : [...prev, severity],
    );
  };

  // Render content based on active tab
  const renderTabContent = () => {
    if (!auditData) return null;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Health Score Card */}
            <Card
              className={
                theme === "dark"
                  ? "bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-800"
                  : "bg-white border-gray-200"
              }
            >
              <CardHeader>
                <CardTitle
                  className={theme === "dark" ? "text-white" : "text-gray-900"}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-400" />
                      SEO Health Score
                    </span>
                    <Badge
                      className={
                        auditData.siteHealth.score >= 80
                          ? "bg-green-500"
                          : auditData.siteHealth.score >= 60
                            ? "bg-yellow-500"
                            : auditData.siteHealth.score >= 40
                              ? "bg-orange-500"
                              : "bg-red-500"
                      }
                    >
                      {auditData.siteHealth.score >= 80
                        ? "Excellent"
                        : auditData.siteHealth.score >= 60
                          ? "Good"
                          : auditData.siteHealth.score >= 40
                            ? "Fair"
                            : "Poor"}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center">
                    <div
                      className={`text-7xl font-bold ${getScoreColor(auditData.siteHealth.score)}`}
                    >
                      {auditData.siteHealth.score}
                    </div>
                    <div
                      className={
                        theme === "dark"
                          ? "text-gray-400 mt-2"
                          : "text-gray-600 mt-2"
                      }
                    >
                      out of 100
                    </div>
                    <div className="mt-4">
                      <Progress
                        value={auditData.siteHealth.score}
                        className="h-3 w-64"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>0</span>
                        <span>25</span>
                        <span>50</span>
                        <span>75</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          label: "Pages Scanned",
                          value: auditData.siteHealth.crawledPages,
                          icon: FileText,
                        },
                        {
                          label: "Total Issues",
                          value: totalIssues,
                          icon: AlertCircle,
                        },
                        {
                          label: "Scan Time",
                          value: formatTime(auditData.scanTime),
                          icon: Timer,
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className={
                            theme === "dark"
                              ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                              : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={
                                theme === "dark"
                                  ? "p-2 rounded-lg bg-gray-700/50"
                                  : "p-2 rounded-lg bg-gray-100"
                              }
                            >
                              <stat.icon className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-white">
                                {stat.value}
                              </div>
                              <div
                                className={
                                  theme === "dark"
                                    ? "text-sm text-gray-400"
                                    : "text-sm text-gray-600"
                                }
                              >
                                {stat.label}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card
              className={
                theme === "dark"
                  ? "bg-gray-900/50 border-gray-800"
                  : "bg-white border-gray-200"
              }
            >
              <CardHeader>
                <CardTitle
                  className={theme === "dark" ? "text-white" : "text-gray-900"}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Category Performance
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setChartType("bar")}
                        className={chartType === "bar" ? "bg-blue-500/20" : ""}
                      >
                        <BarChartIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setChartType("pie")}
                        className={chartType === "pie" ? "bg-blue-500/20" : ""}
                      >
                        <PieChartIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setChartType("radar")}
                        className={
                          chartType === "radar" ? "bg-blue-500/20" : ""
                        }
                      >
                        <Target className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "bar" ? (
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" domain={[0, 100]} />
                        <RechartsTooltip
                          formatter={(value: number) => [`${value}%`, "Score"]}
                          labelFormatter={(label) => `Category: ${label}`}
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            borderColor: "#374151",
                          }}
                        />
                        <Bar dataKey="score" name="Score" radius={[4, 4, 0, 0]}>
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : chartType === "pie" ? (
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, score }) => `${name}: ${score}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="score"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value: number) => [`${value}%`, "Score"]}
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            borderColor: "#374151",
                          }}
                        />
                      </PieChart>
                    ) : (
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={categoryData}
                      >
                        <PolarGrid stroke="#374151" />
                        <PolarAngleAxis dataKey="name" stroke="#9ca3af" />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          stroke="#9ca3af"
                        />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                        />
                        <RechartsTooltip
                          formatter={(value: number) => [`${value}%`, "Score"]}
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            borderColor: "#374151",
                          }}
                        />
                      </RadarChart>
                    )}
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                  {categoryData.map((category) => (
                    <div
                      key={category.name}
                      className={
                        theme === "dark"
                          ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                          : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">
                          {category.name}
                        </span>
                        <Badge
                          className={
                            category.score >= 80
                              ? "bg-green-500"
                              : category.score >= 60
                                ? "bg-yellow-500"
                                : category.score >= 40
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                          }
                        >
                          {Math.round(category.score)}%
                        </Badge>
                      </div>
                      <Progress value={category.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Issues Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card
                className={
                  theme === "dark"
                    ? "bg-gray-900/50 border-gray-800"
                    : "bg-white border-gray-200"
                }
              >
                <CardHeader>
                  <CardTitle
                    className={
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      Top Issues Found
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={auditData.topIssues.slice(0, 8)}
                        layout="vertical"
                        margin={{ left: 100, right: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#374151"
                          horizontal={false}
                        />
                        <XAxis type="number" stroke="#9ca3af" />
                        <YAxis
                          type="category"
                          dataKey="title"
                          stroke="#9ca3af"
                          width={90}
                          tickFormatter={(value) =>
                            value.length > 20
                              ? value.substring(0, 20) + "..."
                              : value
                          }
                        />
                        <RechartsTooltip
                          formatter={(value: number) => [
                            `${value} issues`,
                            "Count",
                          ]}
                          labelFormatter={(label) => `Issue: ${label}`}
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            borderColor: "#374151",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          name="Issue Count"
                          radius={[0, 4, 4, 0]}
                        >
                          {auditData.topIssues
                            .slice(0, 8)
                            .map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  entry.type === "error"
                                    ? "#ef4444"
                                    : entry.type === "warning"
                                      ? "#f59e0b"
                                      : "#3b82f6"
                                }
                              />
                            ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Errors ({auditData.siteHealth.errors})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span>Warnings ({auditData.siteHealth.warnings})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Notices ({auditData.siteHealth.notices})</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={
                  theme === "dark"
                    ? "bg-gray-900/50 border-gray-800"
                    : "bg-white border-gray-200"
                }
              >
                <CardHeader>
                  <CardTitle
                    className={
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }
                  >
                    <div className="flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5 text-blue-400" />
                      Issue Distribution
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
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
                          innerRadius={40}
                          paddingAngle={2}
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
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            borderColor: "#374151",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {[
                      {
                        label: "Errors",
                        value: auditData.siteHealth.errors,
                        color: "red",
                      },
                      {
                        label: "Warnings",
                        value: auditData.siteHealth.warnings,
                        color: "yellow",
                      },
                      {
                        label: "Notices",
                        value: auditData.siteHealth.notices,
                        color: "blue",
                      },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div
                          className={`text-3xl font-bold text-${stat.color}-400 mb-1`}
                        >
                          {stat.value}
                        </div>
                        <div
                          className={
                            theme === "dark"
                              ? "text-sm text-gray-400"
                              : "text-sm text-gray-600"
                          }
                        >
                          {stat.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round((stat.value / totalIssues) * 100)}% of
                          total
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "issues":
        return (
          <div className="space-y-6">
            {/* Filters */}
            <Card
              className={
                theme === "dark"
                  ? "bg-gray-900/50 border-gray-800"
                  : "bg-white border-gray-200"
              }
            >
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className={
                      theme === "dark"
                        ? "text-sm text-gray-400"
                        : "text-sm text-gray-600"
                    }
                  >
                    Filter by severity:
                  </span>
                  <div className="flex items-center gap-2">
                    {["error", "warning", "notice"].map((severity) => (
                      <Button
                        key={severity}
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSeverityFilter(severity)}
                        className={`
                          ${filterSeverity.includes(severity) ? "opacity-100" : "opacity-50"}
                          ${
                            severity === "error"
                              ? "border-red-500 text-red-500 hover:bg-red-500/10"
                              : severity === "warning"
                                ? "border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                                : "border-blue-500 text-blue-500 hover:bg-blue-500/10"
                          }
                        `}
                      >
                        {severity === "error" && (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {severity === "warning" && (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {severity === "notice" && (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                        {severity === "error" &&
                          ` (${auditData.siteHealth.errors})`}
                        {severity === "warning" &&
                          ` (${auditData.siteHealth.warnings})`}
                        {severity === "notice" &&
                          ` (${auditData.siteHealth.notices})`}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Errors */}
            {filterSeverity.includes("error") &&
              auditData.siteHealth.errors > 0 && (
                <Card className="bg-gradient-to-br from-red-900/20 to-red-950/20 border-red-800/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertOctagon className="h-5 w-5 text-red-400" />
                      Critical Errors ({auditData.siteHealth.errors})
                      <Badge variant="destructive" className="ml-2">
                        High Priority
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(auditData.errors)
                      .filter(([_, issue]) => issue.count > 0)
                      .map(([key, issue]) => (
                        <div
                          key={key}
                          className="bg-red-500/10 rounded-lg p-4 border border-red-500/30"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getSeverityIcon(issue.severity)}
                                <h4 className="font-semibold text-white">
                                  {issue.type}
                                </h4>
                                <Badge variant="destructive">
                                  {issue.count} issues
                                </Badge>
                              </div>
                              {issue.affectedPages.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm text-gray-300 mb-2">
                                    Affected Pages ({issue.affectedPages.length}
                                    ):
                                  </p>
                                  <div className="max-h-48 overflow-y-auto bg-black/20 p-3 rounded-md">
                                    {issue.affectedPages
                                      .slice(0, 5)
                                      .map((page, idx) => (
                                        <div
                                          key={idx}
                                          className="text-xs text-gray-400 mb-1"
                                        >
                                          <div className="flex items-center gap-2">
                                            <Globe className="h-3 w-3" />
                                            <span className="truncate">
                                              {page.url}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    {issue.affectedPages.length > 5 && (
                                      <p className="text-xs text-gray-500 italic mt-2">
                                        ... and {issue.affectedPages.length - 5}{" "}
                                        more pages
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

            {/* Warnings */}
            {filterSeverity.includes("warning") &&
              auditData.siteHealth.warnings > 0 && (
                <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-950/20 border-yellow-800/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      Warnings ({auditData.siteHealth.warnings})
                      <Badge className="bg-yellow-500 ml-2">
                        Medium Priority
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(auditData.warnings)
                      .filter(([_, issue]) => issue.count > 0)
                      .map(([key, issue]) => (
                        <div
                          key={key}
                          className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getSeverityIcon(issue.severity)}
                                <h4 className="font-semibold text-white">
                                  {issue.type}
                                </h4>
                                <Badge className="bg-yellow-500">
                                  {issue.count} issues
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

            {/* Notices */}
            {filterSeverity.includes("notice") &&
              auditData.siteHealth.notices > 0 && (
                <Card className="bg-gradient-to-br from-blue-900/20 to-blue-950/20 border-blue-800/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-400" />
                      Notices ({auditData.siteHealth.notices})
                      <Badge className="bg-blue-500 ml-2">Low Priority</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(auditData.notices)
                      .filter(([_, issue]) => issue.count > 0)
                      .map(([key, issue]) => (
                        <div
                          key={key}
                          className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getSeverityIcon(issue.severity)}
                                <h4 className="font-semibold text-white">
                                  {issue.type}
                                </h4>
                                <Badge className="bg-blue-500">
                                  {issue.count} issues
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}
          </div>
        );

      case "technical":
        return (
          <div className="space-y-6">
            {/* Performance */}
            <Card
              className={
                theme === "dark"
                  ? "bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-800"
                  : "bg-white border-gray-200"
              }
            >
              <CardHeader>
                <CardTitle
                  className={theme === "dark" ? "text-white" : "text-gray-900"}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Performance Analysis
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                        : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                    }
                  >
                    <div
                      className={
                        theme === "dark"
                          ? "text-sm text-gray-400 mb-1"
                          : "text-sm text-gray-600 mb-1"
                      }
                    >
                      Load Time
                    </div>
                    <div className="text-2xl font-semibold text-white">
                      {auditData.technical?.performance?.loadTime
                        ? `${auditData.technical.performance.loadTime.toFixed(0)}ms`
                        : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {auditData.technical?.performance?.loadTime < 1000
                        ? "⚡ Excellent"
                        : auditData.technical?.performance?.loadTime < 3000
                          ? "✅ Good"
                          : "⚠️ Needs Improvement"}
                    </div>
                  </div>
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                        : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                    }
                  >
                    <div
                      className={
                        theme === "dark"
                          ? "text-sm text-gray-400 mb-1"
                          : "text-sm text-gray-600 mb-1"
                      }
                    >
                      Page Size
                    </div>
                    <div className="text-2xl font-semibold text-white">
                      {auditData.technical?.performance?.pageSize
                        ? `${(auditData.technical.performance.pageSize / 1024 / 1024).toFixed(2)} MB`
                        : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {auditData.technical?.performance?.requests || "N/A"}{" "}
                      requests
                    </div>
                  </div>
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                        : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                    }
                  >
                    <div
                      className={
                        theme === "dark"
                          ? "text-sm text-gray-400 mb-1"
                          : "text-sm text-gray-600 mb-1"
                      }
                    >
                      Time to First Byte
                    </div>
                    <div className="text-2xl font-semibold text-white">
                      {auditData.technical?.performance?.timeToFirstByte
                        ? `${auditData.technical.performance.timeToFirstByte.toFixed(0)}ms`
                        : "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Server response time
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Optimization */}
            <Card
              className={
                theme === "dark"
                  ? "bg-gray-900/50 border-gray-800"
                  : "bg-white border-gray-200"
              }
            >
              <CardHeader>
                <CardTitle
                  className={theme === "dark" ? "text-white" : "text-gray-900"}
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-blue-400" />
                    Mobile Optimization
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                        : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                    }
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
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
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                        : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                    }
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
                        Viewport Tag
                      </span>
                      <Badge
                        variant={
                          auditData.technical?.mobile?.viewportTag
                            ? "default"
                            : "secondary"
                        }
                      >
                        {auditData.technical?.mobile?.viewportTag
                          ? "Present"
                          : "Missing"}
                      </Badge>
                    </div>
                  </div>
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                        : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                    }
                  >
                    <div
                      className={
                        theme === "dark"
                          ? "text-sm text-gray-400 mb-1"
                          : "text-sm text-gray-600 mb-1"
                      }
                    >
                      Tap Targets
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {auditData.technical?.mobile?.tapTargets || 0}
                    </div>
                  </div>
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                        : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                    }
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
                        Responsive
                      </span>
                      <Badge
                        variant={
                          auditData.technical?.mobile?.responsiveViewport
                            ? "default"
                            : "secondary"
                        }
                      >
                        {auditData.technical?.mobile?.responsiveViewport
                          ? "Yes"
                          : "No"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="bg-gradient-to-br from-green-900/20 to-emerald-950/20 border-green-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-400" />
                  Security Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                        : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                    }
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
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
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                        : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                    }
                  >
                    <div
                      className={
                        theme === "dark"
                          ? "text-sm text-gray-400 mb-1"
                          : "text-sm text-gray-600 mb-1"
                      }
                    >
                      Security Score
                    </div>
                    <div className="text-2xl font-semibold text-white">
                      {auditData.technical?.security?.securityScore || 0}/100
                    </div>
                  </div>
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                        : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                    }
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
                        HSTS
                      </span>
                      <Badge
                        variant={
                          auditData.technical?.security?.hsts?.present
                            ? "default"
                            : "secondary"
                        }
                      >
                        {auditData.technical?.security?.hsts?.present
                          ? "Enabled"
                          : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                        : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                    }
                  >
                    <div
                      className={
                        theme === "dark"
                          ? "text-sm text-gray-400 mb-1"
                          : "text-sm text-gray-600 mb-1"
                      }
                    >
                      Vulnerabilities
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {auditData.technical?.security?.vulnerabilities?.length ||
                        0}{" "}
                      found
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DNS Analysis */}
            <Card
              className={
                theme === "dark"
                  ? "bg-gray-900/50 border-gray-800"
                  : "bg-white border-gray-200"
              }
            >
              <CardHeader>
                <CardTitle
                  className={theme === "dark" ? "text-white" : "text-gray-900"}
                >
                  <div className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-purple-400" />
                    DNS Analysis
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                        : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                    }
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
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
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                        : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                    }
                  >
                    <div
                      className={
                        theme === "dark"
                          ? "text-sm text-gray-400 mb-1"
                          : "text-sm text-gray-600 mb-1"
                      }
                    >
                      A Records
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {auditData.technical?.dns?.aRecords?.length || 0}
                    </div>
                  </div>
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                        : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                    }
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
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
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                        : "bg-gray-50 rounded-lg p-4 border border-gray-200"
                    }
                  >
                    <div
                      className={
                        theme === "dark"
                          ? "text-sm text-gray-400 mb-1"
                          : "text-sm text-gray-600 mb-1"
                      }
                    >
                      MX Records
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {auditData.technical?.dns?.mxRecords?.length || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "ai":
        return (
          <div className="space-y-6">
            {/* Priority Actions */}
            {auditData.ai.priorityActions &&
              auditData.ai.priorityActions.length > 0 && (
                <Card className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border-purple-800/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-purple-400" />
                      Priority Actions
                      <Badge className="bg-purple-500 ml-2">
                        AI Recommended
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {auditData.ai.priorityActions
                      .sort((a, b) => b.priority - a.priority)
                      .map((action, idx) => (
                        <div
                          key={idx}
                          className="bg-purple-900/10 rounded-lg p-4 border border-purple-800/30"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-medium mb-1">
                                  {action.action}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    Impact:{" "}
                                    <span
                                      className={
                                        action.impact === "high"
                                          ? "text-red-400"
                                          : action.impact === "medium"
                                            ? "text-yellow-400"
                                            : "text-green-400"
                                      }
                                    >
                                      {action.impact}
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Activity className="h-3 w-3" />
                                    Effort:{" "}
                                    <span
                                      className={
                                        action.effort === "high"
                                          ? "text-red-400"
                                          : action.effort === "medium"
                                            ? "text-yellow-400"
                                            : "text-green-400"
                                      }
                                    >
                                      {action.effort}
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    Priority:{" "}
                                    <span className="text-purple-400">
                                      {action.priority}/100
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
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
                              Priority {action.priority}
                            </Badge>
                          </div>
                          <Progress value={action.priority} className="h-2" />
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

            {/* Recommendations */}
            {auditData.ai.recommendations &&
              auditData.ai.recommendations.length > 0 && (
                <Card className="bg-gradient-to-br from-blue-900/20 to-blue-950/20 border-blue-800/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-400" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {auditData.ai.recommendations.map((rec, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-4 bg-blue-900/10 rounded-lg border border-blue-800/30"
                        >
                          <div className="bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </div>
                          <span className="text-gray-300 leading-relaxed">
                            {rec}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Content Optimization */}
            {auditData.ai.contentOptimization && (
              <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-950/20 border-emerald-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-400" />
                    Content Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-emerald-900/10 rounded-lg border border-emerald-800/30">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {auditData.ai.contentOptimization}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Competitive Analysis */}
            {auditData.ai.competitiveAnalysis && (
              <Card className="bg-gradient-to-br from-orange-900/20 to-orange-950/20 border-orange-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-400" />
                    Competitive Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-orange-900/10 rounded-lg border border-orange-800/30">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {auditData.ai.competitiveAnalysis}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "performance":
        return (
          <div className="space-y-6">
            <Card
              className={
                theme === "dark"
                  ? "bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-800"
                  : "bg-white border-gray-200"
              }
            >
              <CardHeader>
                <CardTitle
                  className={theme === "dark" ? "text-white" : "text-gray-900"}
                >
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-green-400" />
                    Performance Metrics
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
                        : "bg-gray-50 rounded-xl p-6 border border-gray-200"
                    }
                  >
                    <div
                      className={
                        theme === "dark"
                          ? "text-sm text-gray-400 mb-2 flex items-center gap-2"
                          : "text-sm text-gray-600 mb-2 flex items-center gap-2"
                      }
                    >
                      <Zap className="h-4 w-4" />
                      Load Time
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {auditData.summary.performance.loadTime}ms
                    </div>
                    <div
                      className={
                        theme === "dark"
                          ? "text-sm text-gray-400"
                          : "text-sm text-gray-600"
                      }
                    >
                      {auditData.summary.performance.loadTime < 1000
                        ? "⚡ Excellent performance"
                        : auditData.summary.performance.loadTime < 3000
                          ? "✅ Good performance"
                          : "⚠️ Needs improvement"}
                    </div>
                    <Progress
                      value={Math.min(
                        100,
                        100 - auditData.summary.performance.loadTime / 100,
                      )}
                      className="h-2 mt-4"
                    />
                  </div>

                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
                        : "bg-gray-50 rounded-xl p-6 border border-gray-200"
                    }
                  >
                    <div
                      className={
                        theme === "dark"
                          ? "text-sm text-gray-400 mb-2 flex items-center gap-2"
                          : "text-sm text-gray-600 mb-2 flex items-center gap-2"
                      }
                    >
                      <Database className="h-4 w-4" />
                      Page Size
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {formatNumber(auditData.summary.performance.pageSize)}
                    </div>
                    <div
                      className={
                        theme === "dark"
                          ? "text-sm text-gray-400"
                          : "text-sm text-gray-600"
                      }
                    >
                      {auditData.summary.performance.requests} requests
                    </div>
                    <Progress
                      value={Math.min(
                        100,
                        100 - auditData.summary.performance.pageSize / 10000,
                      )}
                      className="h-2 mt-4"
                    />
                  </div>

                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
                        : "bg-gray-50 rounded-xl p-6 border border-gray-200"
                    }
                  >
                    <div
                      className={
                        theme === "dark"
                          ? "text-sm text-gray-400 mb-2 flex items-center gap-2"
                          : "text-sm text-gray-600 mb-2 flex items-center gap-2"
                      }
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Security Score
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {auditData.summary.security.securityScore}/100
                    </div>
                    <div
                      className={
                        theme === "dark"
                          ? "text-sm text-gray-400"
                          : "text-sm text-gray-600"
                      }
                    >
                      {auditData.summary.security.hasSSL
                        ? "SSL: ✅ Active"
                        : "SSL: ❌ Missing"}
                    </div>
                    <Progress
                      value={auditData.summary.security.securityScore}
                      className="h-2 mt-4"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
                        : "bg-gray-50 rounded-xl p-6 border border-gray-200"
                    }
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
                        Mobile Friendly
                      </div>
                      <Badge
                        variant={
                          auditData.summary.mobile.friendly
                            ? "default"
                            : "destructive"
                        }
                      >
                        {auditData.summary.mobile.friendly ? "✅ Yes" : "❌ No"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={
                            theme === "dark"
                              ? "text-sm text-gray-400"
                              : "text-sm text-gray-600"
                          }
                        >
                          Viewport Tag
                        </span>
                        <span
                          className={
                            auditData.summary.mobile.hasViewport
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {auditData.summary.mobile.hasViewport ? "✅" : "❌"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      theme === "dark"
                        ? "bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
                        : "bg-gray-50 rounded-xl p-6 border border-gray-200"
                    }
                  >
                    <div
                      className={
                        theme === "dark"
                          ? "text-sm text-gray-400 mb-4"
                          : "text-sm text-gray-600 mb-4"
                      }
                    >
                      Issues Breakdown
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-white">Critical Errors</span>
                        </div>
                        <div className="text-2xl font-bold text-red-400">
                          {auditData.siteHealth.errors}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-white">Warnings</span>
                        </div>
                        <div className="text-2xl font-bold text-yellow-400">
                          {auditData.siteHealth.warnings}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-white">Notices</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-400">
                          {auditData.siteHealth.notices}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "details":
        return (
          <div className="space-y-6">
            <Card
              className={
                theme === "dark"
                  ? "bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-800"
                  : "bg-white border-gray-200"
              }
            >
              <CardHeader>
                <CardTitle
                  className={theme === "dark" ? "text-white" : "text-gray-900"}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Audit Details
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Scan Information */}
                <div
                  className={
                    theme === "dark"
                      ? "bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
                      : "bg-gray-50 rounded-xl p-6 border border-gray-200"
                  }
                >
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Scan className="h-4 w-4" />
                    Scan Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
                        Audit ID
                      </div>
                      <div className="text-white text-sm font-mono break-all">
                        {auditData.auditId}
                      </div>
                    </div>
                    <div>
                      <div
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
                        Scan Date
                      </div>
                      <div className="text-white">
                        {new Date(auditData.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
                        Scan Type
                      </div>
                      <div className="text-white capitalize">
                        {auditData.scanType}
                      </div>
                    </div>
                    <div>
                      <div
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
                        Scan Duration
                      </div>
                      <div className="text-white">
                        {formatTime(auditData.scanTime)}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
                        Website URL
                      </div>
                      <div className="text-white break-all">
                        {auditData.url}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Crawl Statistics */}
                <div
                  className={
                    theme === "dark"
                      ? "bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
                      : "bg-gray-50 rounded-xl p-6 border border-gray-200"
                  }
                >
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Crawl Statistics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {auditData.siteHealth.crawledPages}
                      </div>
                      <div
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
                        Pages Scanned
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-400">
                        {auditData.siteHealth.errors}
                      </div>
                      <div
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
                        Critical Errors
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400">
                        {auditData.siteHealth.warnings}
                      </div>
                      <div
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
                        Warnings
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">
                        {auditData.siteHealth.notices}
                      </div>
                      <div
                        className={
                          theme === "dark"
                            ? "text-sm text-gray-400"
                            : "text-sm text-gray-600"
                        }
                      >
                        Notices
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div
        className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"} p-4 md:p-6 transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2 md:space-y-4"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
              <div className="relative">
                <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-blue-400" />
                <PieChartIcon className="absolute -top-1 -right-1 h-4 w-4 md:h-6 md:w-6 text-purple-400" />
              </div>
              <h1
                className={`text-3xl md:text-5xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                Qualifai SEO Audit
              </h1>
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 text-sm md:text-base">
                Professional Site Scanner
              </Badge>
            </div>
            <p
              className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-sm md:text-base max-w-2xl mx-auto`}
            >
              Comprehensive SEO analysis with AI-powered insights, technical
              audits, and competitive benchmarking
            </p>
          </motion.div>

          {/* Top Bar with Theme Toggle and Export */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className={`${theme === "dark" ? "border-gray-700 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-100"}`}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <span
                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                {theme === "dark" ? "Dark" : "Light"} Mode
              </span>
            </div>

            {auditData && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={downloadJSON}
                  className={`${theme === "dark" ? "border-gray-700 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-100"}`}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button
                  onClick={generatePDF}
                  disabled={exportingPdf}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {exportingPdf ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <File className="h-4 w-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Main Scan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              className={`${theme === "dark" ? "bg-gradient-to-br from-gray-900 to-black border-gray-800" : "bg-white border-gray-200"} shadow-2xl`}
            >
              <CardContent className="p-4 md:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* URL Input */}
                  <div className="space-y-2">
                    <label
                      className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}
                    >
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
                        className={`pl-10 ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500" : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"} h-12 text-base focus:ring-2`}
                        disabled={loading}
                      />
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      {url && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(url)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
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
                    <label
                      className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}
                    >
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
                                : theme === "dark"
                                  ? "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                                  : "border-gray-300 bg-gray-50 hover:border-gray-400"
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
                              <span
                                className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                              >
                                {option.label}
                              </span>
                            </div>
                            <p
                              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-2`}
                            >
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
                        <Progress
                          value={progress}
                          className="h-2 bg-gray-800"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Estimated time: {estimatedTime}</span>
                          <span>
                            {scannedPages > 0 &&
                              `Pages scanned: ${scannedPages}`}
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
              {/* Report Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    SEO Audit Report
                  </h2>
                  <p
                    className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Generated on{" "}
                    {new Date(auditData.timestamp).toLocaleDateString()} •{" "}
                    {auditData.scanType.charAt(0).toUpperCase() +
                      auditData.scanType.slice(1)}{" "}
                    Scan
                  </p>
                </div>
                <Badge
                  className={
                    auditData.siteHealth.score >= 80
                      ? "bg-green-500"
                      : auditData.siteHealth.score >= 60
                        ? "bg-yellow-500"
                        : auditData.siteHealth.score >= 40
                          ? "bg-orange-500"
                          : "bg-red-500"
                  }
                >
                  Overall Score: {auditData.siteHealth.score}/100
                </Badge>
              </div>

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
                    label: "Total Issues",
                    value: totalIssues,
                    icon: AlertCircle,
                    color: "red",
                    description: `${auditData.siteHealth.errors} errors, ${auditData.siteHealth.warnings} warnings, ${auditData.siteHealth.notices} notices`,
                  },
                  {
                    label: "Health Score",
                    value: `${auditData.siteHealth.score}/100`,
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
                    <Card
                      className={
                        theme === "dark"
                          ? "bg-gray-900 border-gray-800"
                          : "bg-white border-gray-200"
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              stat.color === "blue"
                                ? theme === "dark"
                                  ? "bg-blue-500/10"
                                  : "bg-blue-50"
                                : stat.color === "red"
                                  ? theme === "dark"
                                    ? "bg-red-500/10"
                                    : "bg-red-50"
                                  : stat.color === "green"
                                    ? theme === "dark"
                                      ? "bg-green-500/10"
                                      : "bg-green-50"
                                    : theme === "dark"
                                      ? "bg-purple-500/10"
                                      : "bg-purple-50"
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
                            <div
                              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                            >
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
              <div
                className={
                  theme === "dark"
                    ? "bg-gray-900 rounded-lg p-1"
                    : "bg-gray-100 rounded-lg p-1"
                }
              >
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: "overview", label: "Overview", icon: BarChart3 },
                    { id: "issues", label: "Issues", icon: AlertCircle },
                    { id: "technical", label: "Technical", icon: Cpu },
                    { id: "ai", label: "AI Insights", icon: Bot },
                    { id: "performance", label: "Performance", icon: Gauge },
                    { id: "details", label: "Details", icon: FileText },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 md:flex-none ${activeTab === tab.id ? "bg-blue-600 text-white" : theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div ref={reportRef}>{renderTabContent()}</div>

              {/* Export Section */}
              <Card
                className={
                  theme === "dark"
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-gray-200"
                }
              >
                <CardHeader>
                  <CardTitle
                    className={
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }
                  >
                    Export Report
                  </CardTitle>
                  <h2
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Download your SEO audit report in multiple formats
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={generatePDF}
                      disabled={exportingPdf}
                      className="h-24 flex-col bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      <File className="h-8 w-8 mb-2" />
                      <span className="font-semibold">PDF Report</span>
                      <span className="text-sm opacity-90">
                        Complete analysis
                      </span>
                    </Button>
                    <Button
                      onClick={downloadJSON}
                      className="h-24 flex-col bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    >
                      <Code className="h-8 w-8 mb-2" />
                      <span className="font-semibold">JSON Data</span>
                      <span className="text-sm opacity-90">Raw audit data</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.print()}
                      className="h-24 flex-col border-2"
                    >
                      <Printer className="h-8 w-8 mb-2" />
                      <span className="font-semibold">Print Report</span>
                      <span className="text-sm opacity-90">
                        Printable version
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
