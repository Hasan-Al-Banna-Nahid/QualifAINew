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

    // Determine max pages based on scan type
    const maxPages =
      scanType === "single" ? 1 : scanType === "limited" ? 20 : 100;

    // Run enhanced crawler
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

    // Add technical details
    auditResult.technicalDetails = {
      crawlability,
      mobile,
      international,
      performance,
      security,
      dns: dnsAnalysis,
    };

    // Get AI insights
    console.log("🤖 Getting AI insights...");
    const aiInsights = await getEnhancedAIInsights(url, auditResult);
    auditResult.aiInsights = aiInsights;

    console.log(`✅ Scan completed in ${scanTime}ms`);

    // Format response
    const response = {
      url,
      auditId: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      scanType,
      scanTime,

      // Main results
      siteHealth: auditResult.siteHealth,
      topIssues: auditResult.topIssues,

      // Categorized issues
      errors: auditResult.errors,
      warnings: auditResult.warnings,
      notices: auditResult.notices,

      // Technical analysis
      technical: auditResult.technicalDetails,

      // AI insights
      ai: auditResult.aiInsights,

      // Summary for quick overview
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
    name: "Enhanced SEO Audit API",
    version: "3.0",
    description: "Semrush-style comprehensive SEO audit with AI insights",
    features: [
      "Real-time web crawling (up to 100 pages)",
      "Duplicate content detection",
      "Broken link detection (internal & external)",
      "Page depth analysis",
      "Orphaned page detection",
      "Redirect chain detection",
      "Text-to-HTML ratio analysis",
      "Image optimization check",
      "Meta tag analysis",
      "Performance metrics",
      "Mobile-friendliness",
      "Security audit (SSL, headers, vulnerabilities)",
      "International SEO (hreflang)",
      "DNS analysis",
      "AI-powered recommendations (Gemini 2.0 & Claude)",
    ],
    endpoints: {
      POST: "/api/seo-audit",
      parameters: {
        url: "string (required)",
        scanType: "single | limited | full (default: limited)",
      },
    },
    scanTypes: {
      single: "1 page",
      limited: "20 pages",
      full: "100 pages",
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
  });
}
