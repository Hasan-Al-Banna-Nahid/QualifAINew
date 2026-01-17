"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Upload,
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Shield,
  Smartphone,
  Zap,
  Globe,
  Image as ImageIcon,
  Link,
  BarChart3,
  PieChart,
  Activity,
  Brain,
  Clock,
  Cpu,
  Database,
  Layers,
  FileCode,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Star,
  Target,
  Users,
  BarChart,
  LineChart,
  ScatterChart,
  Thermometer,
  Gauge,
  Network,
  Server,
  Wifi,
  WifiOff,
  Lock,
  Unlock,
  Smartphone as Mobile,
  Monitor,
  Cloud,
  CloudRain,
  Activity as ActivityIcon,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart as RechartsScatterChart,
  Scatter,
  ComposedChart,
} from "recharts";

const SEOAuditDashboard = () => {
  const [url, setUrl] = useState("");
  const [scanType, setScanType] = useState("limited");
  const [inputMethod, setInputMethod] = useState("url");
  const [file, setFile] = useState<File | null>(null);
  const [customInstructions, setCustomInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showFeatures, setShowFeatures] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    overview: true,
    issues: true,
    ai: true,
    technical: false,
    screenshots: false,
    ml: false,
  });
  const [selectedTab, setSelectedTab] = useState("overview");
  const [viewScreenshot, setViewScreenshot] = useState<string | null>(null);

  useEffect(() => {
    if (results?.screenshots) {
      const firstScreenshot = Object.keys(results.screenshots)[0];
      setViewScreenshot(firstScreenshot);
    }
  }, [results]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("url", url);
      formData.append("scanType", scanType);
      formData.append("inputMethod", inputMethod);
      formData.append("captureScreenshots", "true");
      formData.append("mlAnalysis", "true");
      formData.append("generatePDF", "false");
      formData.append("generateCSV", "false");

      if (file) formData.append("file", file);
      if (customInstructions)
        formData.append("customInstructions", customInstructions);

      const response = await fetch("/api/seo-audit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Audit failed:", error);
      alert("Failed to run audit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Prepare data for charts
  const getHealthScoreData = () => {
    if (!results?.siteHealth) return [];
    return [
      {
        name: "Score",
        value: results.siteHealth.score || 0,
        max: 100,
        fill: "#4f46e5",
      },
      {
        name: "Remaining",
        value: 100 - (results.siteHealth.score || 0),
        max: 100,
        fill: "#e5e7eb",
      },
    ];
  };

  const getIssueDistributionData = () => {
    if (!results?.siteHealth) return [];
    return [
      {
        name: "Errors",
        value: results.siteHealth.errors || 0,
        color: "#ef4444",
      },
      {
        name: "Warnings",
        value: results.siteHealth.warnings || 0,
        color: "#f59e0b",
      },
      {
        name: "Notices",
        value: results.siteHealth.notices || 0,
        color: "#3b82f6",
      },
    ];
  };

  const getTopIssuesChartData = () => {
    if (!results?.topIssues) return [];
    return results.topIssues.slice(0, 10).map((issue: any, idx: number) => ({
      name:
        issue.title?.substring(0, 20) +
          (issue.title?.length > 20 ? "..." : "") || `Issue ${idx + 1}`,
      count: issue.count || 0,
      percentage: issue.percentage || 0,
      severity: issue.type || "unknown",
      fill:
        issue.type === "error"
          ? "#ef4444"
          : issue.type === "warning"
            ? "#f59e0b"
            : "#3b82f6",
    }));
  };

  const getPerformanceData = () => {
    if (!results?.technical?.performance) return [];
    return [
      {
        metric: "Load Time",
        value: results.technical.performance.loadTime || 0,
        optimal: 1000,
      },
      {
        metric: "Page Size",
        value: (results.technical.performance.pageSize || 0) / 1024,
        optimal: 500,
      }, // KB
      {
        metric: "Requests",
        value: results.technical.performance.requests || 0,
        optimal: 50,
      },
    ];
  };

  const getSecurityScoreData = () => {
    if (!results?.technical?.security) return [];
    const score = results.technical.security.securityScore || 0;
    return [
      {
        name: "Score",
        value: score,
        max: 100,
        fill: score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444",
      },
      { name: "Remaining", value: 100 - score, max: 100, fill: "#e5e7eb" },
    ];
  };

  const getMLPredictionData = () => {
    if (!results?.mlAnalysis) return [];
    return [
      { name: "Current", value: results.siteHealth?.score || 50 },
      {
        name: "Predicted",
        value:
          100 - (results.mlAnalysis.ranking_prediction?.predicted_rank || 50),
      },
    ];
  };

  const getFeatureCategoriesData = () => {
    if (!results?.features?.categories) return [];
    return Object.entries(results.features.categories).map(([name, value]) => ({
      name: name,
      value: Number(value),
    }));
  };

  const downloadReport = (type: "pdf" | "csv") => {
    if (!results) return;

    const data = type === "pdf" ? results.pdfReport : results.csvExport;
    if (!data) {
      alert(`${type.toUpperCase()} report is not available`);
      return;
    }

    const link = document.createElement("a");
    link.href = data;
    link.download = `seo-audit-${results.auditId}.${type}`;
    link.click();
  };

  const features = {
    "Core SEO": [
      "Title Tags",
      "Meta Descriptions",
      "Headings",
      "Canonical URLs",
      "Robots Meta",
    ],
    Content: [
      "Word Count",
      "Readability",
      "Keyword Density",
      "Duplicate Detection",
      "Quality Score",
    ],
    Technical: [
      "Site Speed",
      "Core Web Vitals",
      "Structured Data",
      "XML Sitemaps",
      "Crawlability",
    ],
    Security: [
      "SSL/TLS",
      "HTTPS",
      "Security Headers",
      "Vulnerability Scan",
      "Mixed Content",
    ],
    Mobile: [
      "Viewport",
      "Responsive Design",
      "Touch Targets",
      "Mobile Speed",
      "AMP/PWA",
    ],
    Performance: [
      "Load Time",
      "Page Size",
      "Requests",
      "Compression",
      "Caching",
    ],
    Links: [
      "Internal Links",
      "External Links",
      "Broken Links",
      "Anchor Text",
      "Link Depth",
    ],
    Images: [
      "Alt Text",
      "Dimensions",
      "Format",
      "Lazy Loading",
      "Optimization",
    ],
    Accessibility: [
      "ARIA",
      "Color Contrast",
      "Keyboard Nav",
      "Screen Reader",
      "WCAG",
    ],
    International: [
      "Hreflang",
      "Language Tags",
      "Geo-Targeting",
      "Multi-language",
    ],
    Social: ["Open Graph", "Twitter Cards", "Social Links", "Share Buttons"],
    Analytics: ["GA", "GTM", "Tracking", "Conversion", "Events"],
    "E-commerce": ["Product Schema", "Pricing", "Reviews", "Availability"],
    "ML Analysis": [
      "Ranking Prediction",
      "Traffic Forecast",
      "Issue Priority",
      "Anomaly Detection",
    ],
    Reporting: ["PDF Export", "CSV Export", "Visual Charts", "Screenshots"],
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={18} /> },
    { id: "issues", label: "Issues", icon: <AlertCircle size={18} /> },
    { id: "technical", label: "Technical", icon: <Cpu size={18} /> },
    { id: "ai", label: "AI Insights", icon: <Brain size={18} /> },
    { id: "ml", label: "ML Analysis", icon: <ActivityIcon size={18} /> },
    { id: "screenshots", label: "Screenshots", icon: <ImageIcon size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-8xl mx-auto">
        {/* Header with QualifAI Branding */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl shadow-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <div className="bg-white p-2 rounded-lg">
                  <Brain className="text-blue-600" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                    QualifAI SEO Audit
                  </h1>
                  <p className="text-blue-200 text-sm md:text-base">
                    Intelligent SEO Analysis & Optimization Platform
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowFeatures(!showFeatures)}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Layers size={18} />
                {showFeatures ? "Hide" : "Show"} Features
              </button>

              {results && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  New Audit
                </button>
              )}
            </div>
          </div>

          {/* Input Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-wrap gap-4 border-b border-white/20">
                {["url", "file", "instruction"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setInputMethod(method)}
                    className={`px-4 py-2 font-medium transition-all flex items-center gap-2 ${
                      inputMethod === method
                        ? "text-white border-b-2 border-blue-400"
                        : "text-blue-200 hover:text-white"
                    }`}
                  >
                    {method === "url" && <Search size={18} />}
                    {method === "file" && <Upload size={18} />}
                    {method === "instruction" && <FileText size={18} />}
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Scan Depth
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { value: "single", label: "1 Page", desc: "Quick" },
                      { value: "limited", label: "20 Pages", desc: "Standard" },
                      { value: "full", label: "100 Pages", desc: "Deep" },
                      { value: "custom", label: "200+", desc: "Enterprise" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setScanType(type.value)}
                        className={`p-3 rounded-lg border transition-all ${
                          scanType === type.value
                            ? "border-blue-400 bg-blue-500/20 text-white"
                            : "border-white/20 bg-white/5 text-blue-200 hover:bg-white/10"
                        }`}
                      >
                        <div className="font-bold">{type.label}</div>
                        <div className="text-xs opacity-75">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Activity className="animate-spin" size={20} />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Brain size={20} />
                    <span>Start SEO Audit</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Features Popup */}
        {showFeatures && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-6xl max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      QualifAI Features
                    </h2>
                    <p className="text-gray-600">
                      500+ Comprehensive SEO Analysis Features
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFeatures(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle size={32} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(features).map(([category, items]) => (
                    <div
                      key={category}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
                    >
                      <h3 className="font-bold text-lg mb-3 text-blue-700 flex items-center gap-2">
                        <div className="p-1 bg-blue-100 rounded">
                          <CheckCircle2 size={16} className="text-blue-600" />
                        </div>
                        {category}
                      </h3>
                      <ul className="space-y-2">
                        {items.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-center text-sm text-gray-700"
                          >
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Dashboard */}
        {results && (
          <div className="space-y-6">
            {/* Tabs Navigation */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      selectedTab === tab.id
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Tab */}
            {selectedTab === "overview" && (
              <div className="space-y-6">
                {/* Executive Summary */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <BarChart3 className="text-blue-600" />
                      Executive Summary
                    </h2>
                    <div className="text-sm text-gray-500">
                      Audit ID: {results.auditId}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Health Score Gauge */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-gray-900">
                          Health Score
                        </h3>
                        <Shield
                          className={`${
                            (results.siteHealth?.score || 0) >= 80
                              ? "text-green-500"
                              : (results.siteHealth?.score || 0) >= 60
                                ? "text-yellow-500"
                                : "text-red-500"
                          }`}
                        />
                      </div>
                      <div className="relative h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={getHealthScoreData()}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {getHealthScoreData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                          </RechartsPieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-4xl font-bold text-gray-900">
                            {results.siteHealth?.score || 0}
                          </div>
                          <div className="text-gray-600">/100</div>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            (results.siteHealth?.score || 0) >= 80
                              ? "bg-green-100 text-green-800"
                              : (results.siteHealth?.score || 0) >= 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {(results.siteHealth?.score || 0) >= 80
                            ? "Excellent"
                            : (results.siteHealth?.score || 0) >= 60
                              ? "Needs Improvement"
                              : "Poor"}
                        </div>
                      </div>
                    </div>

                    {/* Issue Distribution */}
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl">
                      <h3 className="font-bold text-lg text-gray-900 mb-4">
                        Issue Distribution
                      </h3>
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart data={getIssueDistributionData()}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e5e7eb"
                            />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                              {getIssueDistributionData().map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ),
                              )}
                            </Bar>
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {results.siteHealth?.errors || 0}
                          </div>
                          <div className="text-sm text-gray-600">Errors</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {results.siteHealth?.warnings || 0}
                          </div>
                          <div className="text-sm text-gray-600">Warnings</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {results.siteHealth?.notices || 0}
                          </div>
                          <div className="text-sm text-gray-600">Notices</div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl">
                      <h3 className="font-bold text-lg text-gray-900 mb-4">
                        Performance Metrics
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Load Time
                            </span>
                            <span className="text-sm font-bold">
                              {results.technical?.performance?.loadTime || 0}ms
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                (results.technical?.performance?.loadTime ||
                                  0) < 1000
                                  ? "bg-green-500"
                                  : (results.technical?.performance?.loadTime ||
                                        0) < 3000
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{
                                width: `${Math.min(100, (results.technical?.performance?.loadTime || 0) / 50)}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Page Size
                            </span>
                            <span className="text-sm font-bold">
                              {(
                                (results.technical?.performance?.pageSize ||
                                  0) / 1024
                              ).toFixed(2)}{" "}
                              KB
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                (results.technical?.performance?.pageSize ||
                                  0) < 200000
                                  ? "bg-green-500"
                                  : (results.technical?.performance?.pageSize ||
                                        0) < 500000
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{
                                width: `${Math.min(100, (results.technical?.performance?.pageSize || 0) / 5000000)}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Security Score
                            </span>
                            <span className="text-sm font-bold">
                              {results.technical?.security?.securityScore || 0}
                              /100
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                (results.technical?.security?.securityScore ||
                                  0) >= 80
                                  ? "bg-green-500"
                                  : (results.technical?.security
                                        ?.securityScore || 0) >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{
                                width: `${results.technical?.security?.securityScore || 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scan Details */}
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="text-blue-600" size={20} />
                        <div className="text-sm text-gray-600">
                          Pages Scanned
                        </div>
                      </div>
                      <div className="text-2xl font-bold">
                        {results.summary?.totalPages || 0}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="text-blue-600" size={20} />
                        <div className="text-sm text-gray-600">Scan Time</div>
                      </div>
                      <div className="text-2xl font-bold">
                        {(results.scanTime / 1000).toFixed(2)}s
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Database className="text-blue-600" size={20} />
                        <div className="text-sm text-gray-600">
                          Total Issues
                        </div>
                      </div>
                      <div className="text-2xl font-bold">
                        {results.summary?.totalIssues || 0}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Smartphone className="text-blue-600" size={20} />
                        <div className="text-sm text-gray-600">
                          Mobile Friendly
                        </div>
                      </div>
                      <div className="text-2xl font-bold">
                        {results.technical?.mobile?.friendly ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Issues Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <AlertCircle className="text-red-600" />
                    Top Issues
                  </h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={getTopIssuesChartData()}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip
                          formatter={(value, name) => {
                            if (name === "count")
                              return [`${value} pages`, "Affected Pages"];
                            if (name === "percentage")
                              return [`${value}%`, "Affected Percentage"];
                            return value;
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="count"
                          name="Affected Pages"
                          radius={[0, 4, 4, 0]}
                        >
                          {getTopIssuesChartData().map(
                            (entry: any, index: any) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ),
                          )}
                        </Bar>
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Issues Tab */}
            {selectedTab === "issues" && (
              <div className="space-y-6">
                {/* Error Details */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <AlertCircle className="text-red-600" />
                    Error Details ({results.siteHealth?.errors || 0})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(results.errors || {}).map(
                      ([key, value]: [string, any]) =>
                        value?.count > 0 && (
                          <div
                            key={key}
                            className="bg-red-50 border border-red-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium text-red-800">
                                {value.type}
                              </div>
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                {value.count}
                              </span>
                            </div>
                            <div className="text-sm text-red-600">
                              Affects {value.count} pages
                            </div>
                          </div>
                        ),
                    )}
                  </div>
                </div>

                {/* Warning Details */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <AlertCircle className="text-yellow-600" />
                    Warning Details ({results.siteHealth?.warnings || 0})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(results.warnings || {}).map(
                      ([key, value]: [string, any]) =>
                        value?.count > 0 && (
                          <div
                            key={key}
                            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium text-yellow-800">
                                {value.type}
                              </div>
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                {value.count}
                              </span>
                            </div>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Technical Tab */}
            {selectedTab === "technical" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Performance Analysis */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Zap className="text-yellow-600" />
                      Performance Analysis
                    </h3>
                    <div className="space-y-4">
                      {getPerformanceData().map((item, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              {item.metric}
                            </span>
                            <span className="text-sm font-bold">
                              {item.metric === "Page Size"
                                ? `${item.value.toFixed(2)} KB`
                                : item.value}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                item.value <= item.optimal
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${Math.min(100, (item.value / item.optimal) * 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Analysis */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="text-green-600" />
                      Security Analysis
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            SSL Certificate
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              results.technical?.security?.ssl?.valid
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {results.technical?.security?.ssl?.valid
                              ? "Valid"
                              : "Invalid"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            HSTS
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              results.technical?.security?.hsts?.valid
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {results.technical?.security?.hsts?.valid
                              ? "Enabled"
                              : "Disabled"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Security Headers
                          </span>
                          <span className="text-sm font-bold">
                            {
                              Object.keys(
                                results.technical?.security?.headers || {},
                              ).length
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Analysis */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Smartphone className="text-blue-600" />
                    Mobile Analysis
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.technical?.mobile?.friendly ? "Yes" : "No"}
                      </div>
                      <div className="text-sm text-gray-600">
                        Mobile Friendly
                      </div>
                    </div>

                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.technical?.mobile?.tapTargets || 0}
                      </div>
                      <div className="text-sm text-gray-600">Tap Targets</div>
                    </div>

                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.technical?.mobile?.viewportTag ? "Yes" : "No"}
                      </div>
                      <div className="text-sm text-gray-600">Viewport Tag</div>
                    </div>

                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.technical?.mobile?.smallTextCount || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Small Text Issues
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Insights Tab */}
            {selectedTab === "ai" && results.ai && (
              <div className="space-y-6">
                {/* AI Recommendations */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Brain className="text-purple-600" />
                    AI Recommendations
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.ai.recommendations
                      ?.slice(0, 12)
                      .map((rec: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-1 bg-purple-100 rounded mt-0.5">
                              <CheckCircle2
                                size={16}
                                className="text-purple-600"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {rec}
                              </div>
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  Priority {idx + 1}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Priority Actions */}
                {results.ai.priorityActions &&
                  results.ai.priorityActions.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Priority Actions
                      </h3>
                      <div className="space-y-3">
                        {results.ai.priorityActions.map(
                          (action: any, idx: number) => (
                            <div
                              key={idx}
                              className="p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-medium text-gray-900">
                                  {action.action}
                                </div>
                                <div className="flex gap-2">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                      action.impact === "high"
                                        ? "bg-red-100 text-red-800"
                                        : action.impact === "medium"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    Impact: {action.impact}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                      action.effort === "high"
                                        ? "bg-red-100 text-red-800"
                                        : action.effort === "medium"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    Effort: {action.effort}
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <div className="text-sm text-gray-600">
                                  Priority Score: {action.priority}/100
                                </div>
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="h-2 rounded-full bg-blue-500"
                                    style={{ width: `${action.priority}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* ML Analysis Tab */}
            {selectedTab === "ml" && results.mlAnalysis && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Ranking Prediction */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="text-green-600" />
                      Ranking Prediction
                    </h3>
                    <div className="text-center py-8">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        #
                        {results.mlAnalysis.ranking_prediction
                          ?.predicted_rank || 50}
                      </div>
                      <div className="text-gray-600">
                        Predicted Search Ranking
                      </div>
                      <div className="mt-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          Confidence:{" "}
                          {(
                            (results.mlAnalysis.ranking_prediction
                              ?.confidence || 0) * 100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Traffic Forecast */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BarChart className="text-blue-600" />
                      Traffic Forecast
                    </h3>
                    <div className="text-center py-8">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        +
                        {results.mlAnalysis.traffic_forecast
                          ?.predicted_increase || "15%"}
                      </div>
                      <div className="text-gray-600">
                        Predicted Traffic Increase
                      </div>
                      <div className="mt-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          Timeframe:{" "}
                          {results.mlAnalysis.traffic_forecast?.timeframe ||
                            "3 months"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Quality Score */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Content Quality Analysis
                  </h3>
                  <div className="flex items-center justify-center">
                    <div className="relative w-64 h-64">
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-6xl font-bold text-gray-900">
                          {results.mlAnalysis.content_quality_score
                            ?.overall_score || 65}
                        </div>
                        <div className="text-gray-600">/100</div>
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                              (results.mlAnalysis.content_quality_score
                                ?.overall_score || 0) >= 80
                                ? "bg-green-100 text-green-800"
                                : (results.mlAnalysis.content_quality_score
                                      ?.overall_score || 0) >= 60
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            Grade:{" "}
                            {results.mlAnalysis.content_quality_score?.grade ||
                              "C"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Screenshots Tab */}
            {selectedTab === "screenshots" && results.screenshots && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <ImageIcon className="text-blue-600" />
                    Page Screenshots
                  </h2>

                  {/* Screenshot Thumbnails */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {Object.entries(results.screenshots).map(
                      ([url, src]: [string, any]) => (
                        <button
                          key={url}
                          onClick={() => setViewScreenshot(url)}
                          className={`group relative overflow-hidden rounded-lg border-2 transition-all ${
                            viewScreenshot === url
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="aspect-video bg-gray-100 relative">
                            {src ? (
                              <img
                                src={src}
                                alt={`Screenshot of ${url}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <ImageIcon
                                  className="text-gray-400"
                                  size={32}
                                />
                              </div>
                            )}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <div className="text-xs text-white truncate">
                              {url}
                            </div>
                          </div>
                        </button>
                      ),
                    )}
                  </div>

                  {/* Full Screen Screenshot Viewer */}
                  {viewScreenshot && results.screenshots[viewScreenshot] && (
                    <div className="bg-gray-900 rounded-xl overflow-hidden">
                      <div className="p-4 bg-gray-800 flex justify-between items-center">
                        <div className="text-white font-medium truncate">
                          {viewScreenshot}
                        </div>
                        <button
                          onClick={() => setViewScreenshot(null)}
                          className="text-gray-400 hover:text-white"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                      <div className="p-4 flex justify-center">
                        <img
                          src={results.screenshots[viewScreenshot]}
                          alt={`Full screenshot of ${viewScreenshot}`}
                          className="max-w-full h-auto rounded-lg shadow-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Download Reports */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Export Reports
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => downloadReport("csv")}
                  className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-3"
                >
                  <Download size={20} />
                  Download CSV Report
                </button>
                <button
                  onClick={() => downloadReport("pdf")}
                  disabled={!results.pdfReport}
                  className={`p-4 rounded-lg font-bold flex items-center justify-center gap-3 transition-all ${
                    results.pdfReport
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Download size={20} />
                  Download PDF Report {!results.pdfReport && "(Unavailable)"}
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Note:</strong> PDF reports are temporarily disabled
                  due to technical constraints. Please use CSV export for
                  detailed analysis results.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for Refresh icon
const RefreshCw = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M3 22v-6h6" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
);

export default SEOAuditDashboard;
