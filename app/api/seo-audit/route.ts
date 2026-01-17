import { NextRequest, NextResponse } from "next/server";
import { EnhancedSiteCrawler } from "./crawler";
import { getEnhancedAIInsights } from "./ai";
import {
  analyzeCrawlability,
  analyzeMobile,
  analyzeInternational,
  analyzePerformance,
  analyzeSecurity,
  analyzeDNS,
} from "./analyzers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, scanType = "limited" } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return NextResponse.json(
          { error: "Invalid protocol. Use http:// or https://" },
          { status: 400 },
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    console.log(`🚀 Starting ${scanType} scan for: ${url}`);

    const maxPages =
      scanType === "single" ? 1 : scanType === "limited" ? 20 : 100;

    const crawler = new EnhancedSiteCrawler(url, maxPages);
    const crawlStartTime = Date.now();

    const [
      auditResult,
      crawlability,
      mobile,
      international,
      performance,
      security,
      dnsAnalysis,
    ] = await Promise.all([
      crawler.crawl(),
      analyzeCrawlability(url),
      analyzeMobile(url),
      analyzeInternational(url),
      analyzePerformance(url),
      analyzeSecurity(url),
      analyzeDNS(parsedUrl.hostname),
    ]);

    const scanTime = Date.now() - crawlStartTime;

    auditResult.technicalDetails = {
      crawlability,
      mobile,
      international,
      performance,
      security,
      dns: dnsAnalysis,
    };

    console.log("🤖 Getting AI insights...");
    const aiInsights = await getEnhancedAIInsights(url, auditResult);
    auditResult.aiInsights = aiInsights;

    console.log(`✅ Scan completed in ${scanTime}ms`);

    const response = {
      url,
      auditId: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      scanType,
      scanTime,
      siteHealth: auditResult.siteHealth,
      topIssues: auditResult.topIssues,
      errors: auditResult.errors,
      warnings: auditResult.warnings,
      notices: auditResult.notices,
      technical: auditResult.technicalDetails,
      ai: auditResult.aiInsights,
      summary: {
        totalPages: auditResult.siteHealth.crawledPages,
        totalIssues:
          auditResult.siteHealth.errors +
          auditResult.siteHealth.warnings +
          auditResult.siteHealth.notices,
        healthScore: auditResult.siteHealth.score,
        performance: {
          loadTime: performance.loadTime,
          pageSize: performance.pageSize,
          requests: performance.requests,
        },
        mobile: {
          friendly: mobile.mobileFriendly,
          hasViewport: mobile.viewportTag,
        },
        security: {
          hasSSL: security.ssl.valid,
          securityScore: security.securityScore,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("❌ SEO Audit Error:", error);
    return NextResponse.json(
      {
        error: "Failed to perform SEO audit",
        details: error.message,
        suggestion:
          "Please check the URL and try again. Make sure the website is accessible.",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    name: "Ultra-Enhanced SEO Audit API",
    version: "4.0",
    description: "World-class SEO audit with 200+ features",
    features: [
      "Real-time web crawling (up to 100 pages)",
      "Duplicate content detection with similarity analysis",
      "Broken link detection (internal & external)",
      "Page depth analysis with crawl path tracking",
      "Orphaned page detection",
      "Redirect chain detection and analysis",
      "Text-to-HTML ratio analysis",
      "Image optimization check (alt text, dimensions, formats)",
      "Video and iframe detection",
      "Meta tag comprehensive analysis (all types)",
      "Open Graph and Twitter Card validation",
      "Schema.org structured data extraction",
      "Heading hierarchy validation (H1-H6)",
      "Content quality metrics (word count, readability)",
      "Performance metrics (Core Web Vitals simulation)",
      "Mobile-friendliness analysis",
      "Security audit (SSL, headers, vulnerabilities)",
      "International SEO (hreflang validation)",
      "DNS analysis with CDN detection",
      "Link relationship analysis (nofollow, sponsored, etc.)",
      "Social media link detection",
      "Contact information extraction",
      "Breadcrumb analysis",
      "Code block detection",
      "Form and input analysis",
      "Internal linking structure analysis",
      "Anchor text optimization analysis",
      "Canonical URL validation",
      "Robots meta tag analysis",
      "Language and charset detection",
      "Response code tracking",
      "Content type analysis",
      "Page load time monitoring",
      "Script and stylesheet enumeration",
      "Font loading analysis",
      "AI-powered recommendations (Gemini 2.0 & Claude Sonnet 4)",
      "Priority action planning with impact/effort matrix",
      "Competitive analysis insights",
      "Content optimization strategies",
      "Technical improvement roadmap",
    ],
    endpoints: {
      POST: "/api/seo-audit",
      parameters: {
        url: "string (required)",
        scanType: "single | limited | full (default: limited)",
      },
    },
    scanTypes: {
      single: "1 page - Quick analysis",
      limited: "20 pages - Standard audit",
      full: "100 pages - Comprehensive audit",
    },
    issueCategories: {
      errors: [
        "Duplicate title tags",
        "Broken internal links",
        "4XX status codes",
        "Duplicate meta descriptions",
        "Broken images",
        "Missing titles",
        "Duplicate content",
        "Redirect chains",
      ],
      warnings: [
        "Low text-HTML ratio",
        "Long titles",
        "Broken external links",
        "Low word count",
        "HTTP links on HTTPS pages",
        "Missing H1",
        "Short meta descriptions",
        "Too many links",
        "Slow page speed",
      ],
      notices: [
        "Orphaned pages",
        "Deep pages (>3 clicks)",
        "Links with no anchor",
        "Single internal link",
        "Permanent redirects",
        "Multiple H1 tags",
      ],
    },
    aiProviders: [
      "Google Gemini 2.0 Flash (Primary)",
      "Anthropic Claude Sonnet 4 (Fallback)",
    ],
    responseFormat: {
      url: "string",
      auditId: "string",
      timestamp: "ISO 8601 datetime",
      scanType: "string",
      scanTime: "number (milliseconds)",
      siteHealth: "Health metrics object",
      topIssues: "Array of top issues",
      errors: "Categorized error objects",
      warnings: "Categorized warning objects",
      notices: "Categorized notice objects",
      technical: "Technical analysis details",
      ai: "AI-generated insights and recommendations",
      summary: "Quick overview metrics",
    },
  });
}
