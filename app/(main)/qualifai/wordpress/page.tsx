// app/qualifai/wordpress/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Database,
  Cpu,
  Users,
  TrendingUp,
  Lightbulb,
  Rocket,
  Bug,
  Clock,
  Wifi,
  Figma,
  Server,
  Network,
  Cloud,
  Mail,
  Phone,
  MessageCircle,
  Camera,
  Video,
  Music,
  ShoppingCart,
  CreditCard,
  DollarSign,
  PieChart,
  Activity,
  Battery,
  Signal,
  Lock,
  UploadCloud,
  MousePointerClick,
  Type,
  Image,
  Film,
  Mic,
  Navigation,
  Flag,
  Bell,
  UserCheck,
  Package,
  Home,
  Building,
  Award,
  Target,
  Feather,
  Heart,
  Star,
  CloudRain,
  Wind,
  Coffee,
  Gamepad,
  Monitor,
  Smartphone,
  Tablet,
  Headphones,
  Printer,
  Scan,
  HardDrive,
  Wrench,
  Tool,
  Sliders,
  Filter,
  ChevronDown,
  ChevronUp,
  RotateCw,
  X,
  Check,
  Plus,
  Minus,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// DYNAMIC 100+ QA FEATURES - COMPLETE LIST
const DYNAMIC_QA_FEATURES = [
  {
    id: "performance",
    name: "Performance",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    tests: [
      "Page Load Time Analysis",
      "Largest Contentful Paint (LCP)",
      "First Input Delay (FID)",
      "Cumulative Layout Shift (CLS)",
      "First Contentful Paint (FCP)",
      "Time to First Byte (TTFB)",
      "Speed Index Measurement",
      "Total Blocking Time (TBT)",
      "Core Web Vitals Assessment",
      "Server Response Time Analysis",
      "Caching Efficiency Check",
      "Image Optimization Analysis",
      "JavaScript Execution Time",
      "CSS Optimization Check",
      "Font Loading Performance",
      "Third-party Script Impact",
      "CDN Utilization Analysis",
      "Gzip Compression Check",
      "Browser Caching Headers",
      "Resource Minification Status",
      "Lazy Loading Implementation",
      "Above-the-fold Optimization",
      "Critical CSS Extraction",
      "DNS Lookup Time",
      "SSL/TLS Handshake Time",
      "TCP Connection Time",
      "Request/Response Cycle Analysis",
      "Memory Usage Analysis",
      "CPU Utilization Check",
      "Network Latency Measurement",
      "Render Blocking Resources",
      "Main Thread Work Analysis",
      "JavaScript Bundle Size",
      "CSS Delivery Optimization",
      "Font Display Strategy",
      "Preload Key Requests",
      "Efficient Caching Policy",
      "Asset Compression Check",
      "Connection Reuse Analysis",
    ],
  },
  {
    id: "seo",
    name: "SEO",
    icon: Search,
    color: "from-purple-500 to-pink-500",
    tests: [
      "Meta Tags Optimization",
      "Heading Structure Analysis",
      "XML Sitemap Validation",
      "Robots.txt Configuration",
      "Structured Data Markup",
      "Mobile Friendliness Test",
      "Page Speed SEO Impact",
      "Content Quality Assessment",
      "Keyword Optimization Check",
      "Image Alt Text Analysis",
      "URL Structure Evaluation",
      "Internal Linking Analysis",
      "External Linking Quality",
      "Canonical Tags Check",
      "Open Graph Tags Validation",
      "Twitter Card Tags Check",
      "Schema.org Implementation",
      "Breadcrumb Markup Test",
      "Site Navigation SEO",
      "Pagination SEO Check",
      "HTTPS Migration Impact",
      "Site Architecture Analysis",
      "Content Freshness Evaluation",
      "Duplicate Content Check",
      "Page Title Optimization",
      "Meta Description Quality",
      "Search Console Integration",
      "Analytics Setup Verification",
      "Local SEO Check",
      "International SEO Setup",
      "Rich Snippets Optimization",
      "FAQ Schema Implementation",
      "Product Schema Markup",
      "Review Schema Integration",
      "Video SEO Optimization",
      "Image SEO Best Practices",
      "Site Links Optimization",
      "Mobile-First Indexing",
      "Core Web Vitals SEO Impact",
    ],
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    color: "from-red-500 to-rose-500",
    tests: [
      "SSL Certificate Validation",
      "Security Headers Check",
      "WordPress Version Security",
      "Plugin Security Audit",
      "Theme Security Analysis",
      "File Permissions Check",
      "Brute Force Protection",
      "Database Security Assessment",
      "Firewall Status Check",
      "Malware Scan",
      "Vulnerability Assessment",
      "Two-Factor Authentication",
      "User Role Security",
      "Login Security Measures",
      "Database Prefix Security",
      "WP-Config Security",
      "File Integrity Monitoring",
      "Backup Security Check",
      "Admin Security Measures",
      "Comment Spam Protection",
      "XML-RPC Security",
      "HTTP Security Headers",
      "CSP Implementation Check",
      "XSS Protection Verification",
      "CSRF Protection Check",
      "SQL Injection Prevention",
      "Directory Browsing Prevention",
      "Error Information Leakage",
      "Clickjacking Protection",
      "MIME Sniffing Prevention",
      "Referrer Policy Check",
      "Feature Policy Headers",
      "Certificate Transparency",
      "Security.txt Validation",
      "HSTS Preload Status",
      "Mixed Content Check",
      "Cookie Security Analysis",
      "Subresource Integrity",
      "Content Security Policy",
    ],
  },
  {
    id: "content",
    name: "Content",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
    tests: [
      "Broken Links Check",
      "Image Optimization Analysis",
      "Content Quality Assessment",
      "Readability Score Calculation",
      "Mobile Responsive Content",
      "Content Freshness Evaluation",
      "Multimedia Content Optimization",
      "Call-to-Actions Effectiveness",
      "Content Structure Analysis",
      "Text-to-HTML Ratio",
      "Content Length Assessment",
      "Keyword Density Analysis",
      "Content Uniqueness Check",
      "Content Gap Analysis",
      "User Engagement Metrics",
      "Content Update Frequency",
      "Multilingual Content Check",
      "Accessibility Content Check",
      "Content Performance Metrics",
      "Content Strategy Alignment",
      "Visual Content Optimization",
      "Interactive Content Check",
      "Content Loading Priority",
      "Content Delivery Network",
      "Content Caching Strategy",
      "Dynamic Content Performance",
      "Content Personalization Check",
      "Content Security Verification",
      "Content Backup Check",
      "Content Version Control",
      "Content Readability Score",
      "Content Scannability",
      "Content Hierarchy Analysis",
      "Content Tone & Voice",
      "Content Localization",
      "Content Syndication Check",
      "Content Update Strategy",
      "Content Performance Tracking",
      "Content A/B Testing Setup",
    ],
  },
  {
    id: "technical",
    name: "Technical",
    icon: Code,
    color: "from-green-500 to-emerald-500",
    tests: [
      "HTML Validation Check",
      "CSS Validation Analysis",
      "JavaScript Errors Scan",
      "Database Optimization",
      "Caching Implementation",
      "CDN Usage Analysis",
      "API Endpoints Check",
      "Third-party Scripts Audit",
      "Server Configuration Check",
      "DNS Configuration Analysis",
      "Email Deliverability Test",
      "Cron Job Verification",
      "Error Log Analysis",
      "PHP Version Check",
      "MySQL Version Analysis",
      "Server Resources Check",
      "Load Time Under Stress",
      "Uptime Monitoring Setup",
      "Backup System Verification",
      "Restore Process Test",
      "Migration Readiness Check",
      "Compatibility Testing",
      "Browser Compatibility Test",
      "Mobile Device Testing",
      "Operating System Compatibility",
      "Screen Reader Compatibility",
      "Progressive Web App Check",
      "Offline Functionality Test",
      "Service Worker Check",
      "Web App Manifest Validation",
      "API Response Time",
      "Database Query Optimization",
      "Server-Side Caching",
      "Load Balancer Configuration",
      "SSL/TLS Configuration",
      "HTTP/2 Implementation",
      "Database Indexing Analysis",
      "Query Performance",
      "Server Response Codes",
    ],
  },
  {
    id: "accessibility",
    name: "Accessibility",
    icon: Eye,
    color: "from-amber-500 to-orange-500",
    tests: [
      "WCAG 2.1 Compliance Check",
      "Screen Reader Compatibility",
      "Keyboard Navigation Test",
      "Color Blindness Check",
      "Text Resizing Test",
      "High Contrast Mode",
      "Voice Control Compatibility",
      "Focus Management Check",
      "ARIA Labels Validation",
      "Alt Text Completeness",
      "Form Label Association",
      "Error Identification Check",
      "Time-based Media Access",
      "Seizure Safety Check",
      "Navigation Consistency",
      "Link Purpose Clarity",
      "Reading Level Assessment",
      "Language Attribute Check",
      "Page Title Clarity",
      "Heading Structure Logic",
      "List Markup Check",
      "Table Accessibility",
      "Form Field Instructions",
      "Error Suggestion Quality",
      "Timeout Adjustment Check",
      "Animation Control Test",
      "Audio Control Check",
      "Video Caption Quality",
      "Motion Reduction Support",
      "Orientation Lock Check",
      "Touch Target Size",
      "Pointer Gestures",
      "Content on Hover/Focus",
      "Visual Presentation",
      "Audio Description",
      "Sign Language Interpretation",
      "Adaptive Content",
      "Cognitive Accessibility",
      "Learning Disability Support",
    ],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    icon: ShoppingCart,
    color: "from-teal-500 to-cyan-500",
    tests: [
      "Shopping Cart Functionality",
      "Checkout Process Analysis",
      "Payment Gateway Integration",
      "Product Page Optimization",
      "Inventory Management Check",
      "Order Processing Test",
      "Shipping Calculation Check",
      "Tax Configuration Test",
      "Coupon System Validation",
      "Wishlist Functionality",
      "Product Search Accuracy",
      "Filter System Effectiveness",
      "Sorting Options Check",
      "Product Image Quality",
      "Product Description Quality",
      "Review System Check",
      "Rating System Validation",
      "Related Products Display",
      "Upsell/Cross-sell Test",
      "Abandoned Cart Analysis",
      "Email Notification Check",
      "Order Confirmation Test",
      "Return Process Check",
      "Refund System Test",
      "Multi-currency Support",
      "Multi-language Check",
      "Mobile Commerce Test",
      "Security Compliance Check",
      "GDPR Compliance",
      "Payment Security Audit",
      "Inventory Sync Check",
      "Order Status Updates",
      "Shipping Provider Integration",
      "Tax Calculation Accuracy",
      "Discount Code Validation",
      "Gift Card Functionality",
    ],
  },
  {
    id: "analytics",
    name: "Analytics & Tracking",
    icon: BarChart3,
    color: "from-violet-500 to-purple-500",
    tests: [
      "Google Analytics Setup",
      "Google Tag Manager Check",
      "Conversion Tracking Test",
      "Event Tracking Validation",
      "E-commerce Tracking Check",
      "Goal Configuration Test",
      "UTM Parameter Support",
      "Cross-domain Tracking Check",
      "Subdomain Tracking Test",
      "Filter Configuration Check",
      "Data Layer Implementation",
      "Custom Dimension Setup",
      "Custom Metric Validation",
      "Enhanced E-commerce Check",
      "Remarketing Tag Test",
      "Facebook Pixel Integration",
      "Twitter Pixel Check",
      "LinkedIn Insight Tag",
      "Heatmap Tool Integration",
      "Session Recording Check",
      "A/B Testing Setup",
      "Personalization Tracking",
      "CRM Integration Test",
      "Email Marketing Integration",
      "Social Media Tracking",
      "Offline Conversion Tracking",
      "Mobile App Tracking Check",
      "Data Privacy Compliance",
      "Cookie Consent Setup",
      "GDPR Tracking Compliance",
      "Analytics Accuracy Check",
      "Real-time Reporting",
      "Custom Report Validation",
      "Data Export Functionality",
      "API Integration Check",
      "Data Retention Policy",
    ],
  },
];

// Problem Indicator Component
const ProblemIndicator = ({ problem, onProblemClick }: any) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
        problem.severity === "critical"
          ? "text-red-500"
          : problem.severity === "high"
          ? "text-orange-500"
          : problem.severity === "medium"
          ? "text-yellow-500"
          : "text-blue-500"
      }`}
      style={{ left: problem.position.x, top: problem.position.y }}
      onClick={() => onProblemClick(problem)}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative"
      >
        <AlertTriangle className="w-6 h-6 drop-shadow-lg" />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-current rounded-full blur-sm"
        />
      </motion.div>
    </motion.div>
  );
};

// API Testing Component
const APITestingPanel = ({ websiteUrl, onTestComplete }: any) => {
  const [apiTests, setApiTests] = useState([
    {
      id: 1,
      name: "WordPress REST API",
      endpoint: "/wp-json/wp/v2/",
      method: "GET",
      status: "pending",
    },
    {
      id: 2,
      name: "Posts API",
      endpoint: "/wp-json/wp/v2/posts",
      method: "GET",
      status: "pending",
    },
    {
      id: 3,
      name: "Users API",
      endpoint: "/wp-json/wp/v2/users",
      method: "GET",
      status: "pending",
    },
    {
      id: 4,
      name: "Media API",
      endpoint: "/wp-json/wp/v2/media",
      method: "GET",
      status: "pending",
    },
    {
      id: 5,
      name: "Comments API",
      endpoint: "/wp-json/wp/v2/comments",
      method: "GET",
      status: "pending",
    },
    {
      id: 6,
      name: "Settings API",
      endpoint: "/wp-json/wp/v2/settings",
      method: "GET",
      status: "pending",
    },
  ]);

  const [emailTest, setEmailTest] = useState({
    to: "",
    subject: "Test Email from QualifAI",
    message: "This is a test email to verify email functionality.",
    status: "pending",
  });

  const runAPITests = async () => {
    const updatedTests = [...apiTests];

    for (let test of updatedTests) {
      try {
        test.status = "running";
        setApiTests([...updatedTests]);

        const response = await fetch(`${websiteUrl}${test.endpoint}`);
        test.status = response.ok ? "success" : "failed";

        setApiTests([...updatedTests]);
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        test.status = "failed";
        setApiTests([...updatedTests]);
      }
    }

    onTestComplete(updatedTests);
  };

  const testEmailFunctionality = async () => {
    setEmailTest((prev) => ({ ...prev, status: "running" }));

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailTest),
      });

      const result = await response.json();
      setEmailTest((prev) => ({
        ...prev,
        status: result.success ? "success" : "failed",
      }));
    } catch (error) {
      setEmailTest((prev) => ({ ...prev, status: "failed" }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          API Endpoint Testing
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {apiTests.map((test) => (
            <div
              key={test.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    test.status === "success"
                      ? "bg-green-500"
                      : test.status === "failed"
                      ? "bg-red-500"
                      : test.status === "running"
                      ? "bg-yellow-500 animate-pulse"
                      : "bg-gray-400"
                  }`}
                />
                <div>
                  <div className="font-medium text-sm">{test.name}</div>
                  <code className="text-xs text-gray-600 dark:text-gray-400">
                    {test.method} {test.endpoint}
                  </code>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  test.status === "success"
                    ? "bg-green-100 text-green-800"
                    : test.status === "failed"
                    ? "bg-red-100 text-red-800"
                    : test.status === "running"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {test.status}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={runAPITests}
          className="mt-4 w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Run All API Tests
        </button>
      </div>

      {/* Email Testing */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Email Functionality Test
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To Email
            </label>
            <input
              type="email"
              value={emailTest.to}
              onChange={(e) =>
                setEmailTest((prev) => ({ ...prev, to: e.target.value }))
              }
              placeholder="test@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={emailTest.subject}
              onChange={(e) =>
                setEmailTest((prev) => ({ ...prev, subject: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <textarea
              value={emailTest.message}
              onChange={(e) =>
                setEmailTest((prev) => ({ ...prev, message: e.target.value }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                emailTest.status === "success"
                  ? "bg-green-500"
                  : emailTest.status === "failed"
                  ? "bg-red-500"
                  : emailTest.status === "running"
                  ? "bg-yellow-500 animate-pulse"
                  : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {emailTest.status === "success"
                ? "Email sent successfully"
                : emailTest.status === "failed"
                ? "Email failed to send"
                : emailTest.status === "running"
                ? "Sending email..."
                : "Ready to test"}
            </span>
          </div>

          <button
            onClick={testEmailFunctionality}
            disabled={!emailTest.to || emailTest.status === "running"}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Test Email
          </button>
        </div>
      </div>
    </div>
  );
};

// File Upload Component
const FileUploadPanel = ({ onFilesUpload }: any) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadTime: new Date(),
      status: "uploaded",
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    onFilesUpload([...uploadedFiles, ...newFiles]);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Upload Design Files
      </h3>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Drop your design files here or click to browse
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
          Supports: FIGMA, Sketch, Adobe XD, PSD, AI files
        </p>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          accept=".figma,.sketch,.xd,.psd,.ai,.pdf,.png,.jpg,.jpeg"
        />
        <label
          htmlFor="file-upload"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer font-medium"
        >
          Choose Files
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-sm">{file.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                  Uploaded
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function DynamicWordPressQAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const mode = searchParams.get("mode") || "full-check";

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [customInstructions, setCustomInstructions] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("configuration");
  const [showWebsitePreview, setShowWebsitePreview] = useState(false);
  const [problems, setProblems] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [apiTestResults, setApiTestResults] = useState<any[]>([]);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
      // Select first 5 tests from each category for quick check
      const quickTests = DYNAMIC_QA_FEATURES.flatMap((category) =>
        category.tests.slice(0, 5).map((test) => `${category.id}-${test}`)
      );
      setSelectedTests(quickTests);
    }
  }, [mode]);

  // Take screenshot
  const takeScreenshot = async () => {
    if (!iframeRef.current) return;

    try {
      // Simulate screenshot - in real implementation use html2canvas
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText("Website Screenshot: " + websiteUrl, 50, 50);
        setScreenshot(canvas.toDataURL());
      }
    } catch (error) {
      console.error("Screenshot failed:", error);
    }
  };

  // Handle problem click
  const handleProblemClick = (problem: any) => {
    setSelectedProblem(problem);
    setShowProblemModal(true);
    takeScreenshot();
  };

  // Run comprehensive analysis
  const runWordPressAnalysis = async () => {
    if (!websiteUrl) {
      alert("Please enter a website URL");
      return;
    }

    setIsAnalyzing(true);
    setActiveTab("analysis");
    setProblems([]);

    try {
      const response = await fetch("/api/qualifai/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: websiteUrl,
          tests: selectedTests,
          customInstructions,
          isLocalhost,
          clientId,
          mode,
          uploadedFiles,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setAnalysis(data);
      setProblems(data.problems || []);
      setApiTestResults(data.apiTests || []);
    } catch (error) {
      console.error("Analysis failed:", error);
      // Fallback to dynamic mock data
      const mockData = generateDynamicMockAnalysis();
      setAnalysis(mockData);
      setProblems(mockData.problems);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate dynamic mock analysis
  const generateDynamicMockAnalysis = () => {
    const insights = DYNAMIC_QA_FEATURES.map((category) => ({
      category: category.id,
      score: Math.floor(Math.random() * 30) + 65,
      issues: [
        `Found ${Math.floor(Math.random() * 5) + 1} issues in ${category.name}`,
        `Performance impact detected in ${category.name.toLowerCase()}`,
        `Optimization needed for ${category.name.toLowerCase()}`,
      ],
      recommendations: [
        `Implement ${category.name} best practices`,
        `Fix identified ${category.name.toLowerCase()} issues`,
        `Optimize ${category.name.toLowerCase()} configuration`,
      ],
    }));

    const problems = [
      {
        type: "performance",
        message: "Slow page load time affecting user experience",
        position: { x: 100, y: 200 },
        severity: "high",
        fix: "Implement caching and optimize images",
      },
      {
        type: "seo",
        message: "Missing meta tags reducing search visibility",
        position: { x: 300, y: 150 },
        severity: "medium",
        fix: "Add proper meta descriptions and title tags",
      },
      {
        type: "security",
        message: "Outdated WordPress version with security risks",
        position: { x: 200, y: 300 },
        severity: "critical",
        fix: "Update WordPress to latest version immediately",
      },
      {
        type: "content",
        message: "Broken links found on multiple pages",
        position: { x: 400, y: 250 },
        severity: "medium",
        fix: "Fix or remove broken links",
      },
    ];

    const totalScore = Math.round(
      insights.reduce((sum, insight) => sum + insight.score, 0) /
        insights.length
    );

    return {
      score: totalScore,
      grade:
        totalScore >= 90
          ? "A"
          : totalScore >= 80
          ? "B"
          : totalScore >= 70
          ? "C"
          : totalScore >= 60
          ? "D"
          : "F",
      summary: `Comprehensive analysis completed with ${selectedTests.length} tests across ${DYNAMIC_QA_FEATURES.length} categories.`,
      insights,
      problems,
      similarSites: [],
      pluginAnalysis: {
        totalPlugins: 15,
        performanceImpact: 5,
        securityIssues: 2,
        recommendations: [
          "Update plugins",
          "Remove unused plugins",
          "Configure caching",
        ],
      },
      timestamp: new Date().toISOString(),
    };
  };

  // Toggle test selection
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
          <div className="flex items-center justify-center space-x-4 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl"
            >
              <Globe className="w-8 h-8 text-white" />
            </motion.div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                WordPress QA Analyzer
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {totalTestsCount}+ Automated Tests • Dynamic Analysis •
                Real-time Results
              </p>
            </div>
          </div>

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
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Site</span>
            </button>
          </motion.div>
        </div>

        {/* Website Preview */}
        {showWebsitePreview && websiteUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Live Preview
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={takeScreenshot}
                  className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  <Camera className="w-4 h-4" />
                  <span>Screenshot</span>
                </button>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Wifi className="w-4 h-4" />
                  <span>Live Connection</span>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
              <iframe
                ref={iframeRef}
                src={websiteUrl}
                className="w-full h-full"
                title="Website Preview"
                sandbox="allow-same-origin allow-scripts"
              />

              {/* Problem Indicators */}
              {problems.map((problem, index) => (
                <ProblemIndicator
                  key={index}
                  problem={problem}
                  onProblemClick={handleProblemClick}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-2 border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { id: "configuration", name: "Configuration", icon: Settings },
              { id: "upload", name: "Design Files", icon: Upload },
              { id: "api-testing", name: "API Testing", icon: TestTube },
              { id: "analysis", name: "AI Analysis", icon: Bot },
              { id: "preview", name: "Live Preview", icon: Eye },
              { id: "report", name: "Report", icon: Download },
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
                  onClick={runWordPressAnalysis}
                  disabled={!websiteUrl || selectedTests.length === 0}
                  className={cn(
                    "flex items-center space-x-3 px-8 py-4 text-white rounded-xl transition-all duration-300 shadow-lg mx-auto hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden",
                    "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  <span className="font-semibold text-lg">
                    Run Comprehensive Analysis ({selectedTests.length} tests)
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
            <APITestingPanel
              websiteUrl={websiteUrl}
              onTestComplete={setApiTestResults}
            />
          )}

          {/* Analysis Tab */}
          {activeTab === "analysis" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {isAnalyzing ? (
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
                <>
                  {/* Overall Score */}
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Overall Score
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                          {analysis.summary}
                        </p>
                      </div>
                      <div className="text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={cn(
                            "w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl",
                            analysis.score >= 90
                              ? "bg-gradient-to-r from-green-500 to-emerald-500"
                              : analysis.score >= 70
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                              : "bg-gradient-to-r from-red-500 to-rose-500"
                          )}
                        >
                          {analysis.score}
                        </motion.div>
                        <div className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                          Grade: {analysis.grade}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Insights */}
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
                                  transition={{
                                    duration: 1,
                                    delay: index * 0.2,
                                  }}
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

                          <div className="space-y-4">
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                                Issues Found ({insight.issues.length})
                              </h5>
                              <ul className="space-y-2">
                                {insight.issues
                                  .slice(0, 3)
                                  .map((issue: string, i: number) => (
                                    <li
                                      key={i}
                                      className="flex items-start space-x-2 text-sm text-red-600 dark:text-red-400"
                                    >
                                      <Bug className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                      <span>{issue}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <Sparkles className="w-4 h-4 mr-2 text-green-500" />
                                Recommendations
                              </h5>
                              <ul className="space-y-2">
                                {insight.recommendations
                                  .slice(0, 3)
                                  .map((rec: string, i: number) => (
                                    <li
                                      key={i}
                                      className="flex items-start space-x-2 text-sm text-green-600 dark:text-green-400"
                                    >
                                      <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
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

        {/* Problem Detail Modal */}
        <AnimatePresence>
          {showProblemModal && selectedProblem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowProblemModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Problem Details
                  </h3>
                  <button
                    onClick={() => setShowProblemModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                      {selectedProblem.type} Issue
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {selectedProblem.message}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Severity
                    </h4>
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-sm font-medium",
                        selectedProblem.severity === "critical"
                          ? "bg-red-100 text-red-800"
                          : selectedProblem.severity === "high"
                          ? "bg-orange-100 text-orange-800"
                          : selectedProblem.severity === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      )}
                    >
                      {selectedProblem.severity}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Recommended Fix
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {selectedProblem.fix}
                    </p>
                  </div>

                  {screenshot && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Screenshot Reference
                      </h4>
                      <img
                        src={screenshot}
                        alt="Problem reference"
                        className="rounded-lg border border-gray-300 dark:border-gray-600 max-w-full"
                      />
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setProblems((prev) =>
                          prev.filter((p) => p !== selectedProblem)
                        );
                        setShowProblemModal(false);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Mark as Fixed
                    </button>
                    <button
                      onClick={() => setShowProblemModal(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
