// app/api/seo-audit/types.ts
export const runtime = "nodejs";

// ============= Core Types =============
export type SEOCheckStatus = "pass" | "fail" | "warning";
export type SEOSeverity = "critical" | "high" | "medium" | "low" | "warning";
export type ScanType = "single" | "limited" | "full";

// ============= Issue Interfaces =============
export interface PageIssue {
  page: string;
  issue?: string;
  severity: SEOSeverity;
  recommendation: string;
  title?: string;
  length?: number;
  count?: number;
  images?: string[];
  links?: string[];
  ratio?: string;
  loadTime?: number;
  size?: number;
}

export interface RealIssues {
  missingH1: PageIssue[];
  duplicateTitles: PageIssue[];
  brokenLinks: PageIssue[];
  missingAltText: PageIssue[];
  lowTextRatio: PageIssue[];
  longTitles: PageIssue[];
  missingMetaDesc: PageIssue[];
  slowPages: PageIssue[];
  duplicateContent: PageIssue[];
  redirectChains: PageIssue[];
  insecureResources: PageIssue[];
}

// ============= SEO Check Interfaces =============
export interface SEOCheck {
  id: string;
  name: string;
  status: SEOCheckStatus;
  severity: SEOSeverity;
  description: string;
  recommendation: string;
  details?: any;
}

export interface SEOCheckResult {
  category: string;
  checks: SEOCheck[];
}

// ============= Analysis Result Interfaces =============
export interface CrawlabilityResult {
  robotsTxtPresent: boolean;
  robotsTxtContent: string | null;
  sitemapDetected: boolean;
  sitemapUrls: string[];
  crawlDelay: string | null;
  disallowedPaths: string[];
}

export interface MobileAnalysisResult {
  viewportTag: boolean;
  responsiveViewport: boolean;
  tapTargets: number;
  adequateTapTargets: boolean;
  smallTextCount: number;
  hasSmallTextIssues: boolean;
  mobileFriendly: boolean;
}

export interface InternationalAnalysisResult {
  hreflangTags: boolean;
  hreflangCount: number;
  hreflangValues: Array<{ lang: string; href: string }>;
  languageAttribute: string;
  canonicalUrl: string | null;
  properImplementation: boolean;
  hasSelfReference: boolean;
  hasXDefault: boolean;
}

export interface PerformanceAnalysisResult {
  pageSize: number;
  loadTime: number;
  requests: number;
  timeToFirstByte: number;
  contentType: string;
  encoding: string;
  renderBlockingCSS: number;
  renderBlockingJS: number;
  hasRenderBlocking: boolean;
  pageSpeedInsights: { mobile: number; desktop: number };
  coreWebVitals: { lcp: number; fid: number; cls: number };
  performanceScore: string;
}

export interface SSLInfo {
  valid: boolean;
  issuer: string;
  expires: string;
  protocol: string;
  cipher: string;
  grade?: string;
}

export interface SecurityAnalysisResult {
  ssl: SSLInfo;
  headers: Record<string, string>;
  vulnerabilities: string[];
  csp: {
    present: boolean;
    directives: string[];
  };
  hsts: {
    present: boolean;
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
    valid: boolean;
  };
  xssProtection: boolean;
  clickjackingProtection: boolean;
  mimeSniffingProtection: boolean;
  referrerPolicy: string;
  permissionsPolicy: string;
  securityScore: number;
}

export interface DNSAnalysisResult {
  aRecords: string[];
  aaaaRecords: string[];
  mxRecords: any[];
  txtRecords: string[];
  nsRecords: string[];
  cnameRecords: string[];
  hasDNSSEC: boolean;
  loadBalancing: boolean;
  cdnDetected: string[];
}

// ============= AI Analysis Interface =============
export interface AIInsights {
  recommendations: string[];
  competitiveAnalysis: string;
  contentOptimization: string;
  technicalImprovements?: string[];
  impactEstimate?: string;
  priorityScore?: number;
}

// ============= Technical Report Interface =============
export interface TechnicalReport {
  crawlability: CrawlabilityResult;
  performance: PerformanceAnalysisResult;
  security: SecurityAnalysisResult;
  mobile: MobileAnalysisResult;
  international: InternationalAnalysisResult;
  dns: DNSAnalysisResult;
}

// ============= Final Audit Result Interface =============
export interface AuditResult {
  seoScore: number;
  healthScore: number;
  criticalIssues: number;
  warnings: number;
  notices: number;
  categories: SEOCheckResult[];
  aiInsights: AIInsights;
  technicalReport: TechnicalReport;
  realIssues: RealIssues | null;
  summary: {
    crawledPages: number;
    issuesFound: number;
    errors: number;
    warnings: number;
    passes: number;
  };
  categoryScores: {
    Technical: number;
    "On-Page": number;
    Performance: number;
    Content: number;
  };
  traffic: {
    organic: number;
    keywords: number;
    backlinks: number;
    domains: number;
  };
  crawlInfo: {
    pagesScanned: number;
    scanType: string;
    scanTime: number;
    totalLinks: number;
    uniquePages: number;
  };
}

// ============= Crawl Result Interface =============
export interface CrawlResult {
  issues: RealIssues;
  pagesScanned: number;
  totalLinks: number;
  uniquePages: number;
}

// ============= API Request Interface =============
export interface SEOAuditRequest {
  url: string;
  scanType?: ScanType;
}

// ============= API Response Interface =============
export interface SEOAuditResponse {
  url: string;
  overallScore: number;
  healthScore: number;
  checks: any[];
  summary: AuditResult["summary"];
  categoryScores: AuditResult["categoryScores"];
  traffic: AuditResult["traffic"];
  realIssues: RealIssues;
  technicalReport: TechnicalReport;
  aiInsights: AIInsights;
  crawlInfo: AuditResult["crawlInfo"];
  timestamp: string;
  auditId: string;
}

// ============= Helper Types =============
export interface PageAnalysisResult {
  links: string[];
}

export interface ErrorResponse {
  error: string;
  details?: string;
  suggestion?: string;
}
export interface SemrushStyleIssue {
  type: string;
  count: number;
  severity: "error" | "warning" | "notice";
  affectedPages: Array<{
    url: string;
    details: string;
    discovered: string;
  }>;
}

export interface ComprehensiveAuditResult {
  siteHealth: {
    score: number; // 0-100
    crawledPages: number;
    errors: number;
    warnings: number;
    notices: number;
  };

  topIssues: Array<{
    title: string;
    count: number;
    percentage: number;
    type: "error" | "warning" | "notice";
  }>;

  // All issues categorized like Semrush
  errors: {
    duplicateTitles: SemrushStyleIssue;
    brokenInternalLinks: SemrushStyleIssue;
    status4xx: SemrushStyleIssue;
    duplicateMetaDescriptions: SemrushStyleIssue;
    brokenImages: SemrushStyleIssue;
    missingTitles: SemrushStyleIssue;
    duplicateContent: SemrushStyleIssue;
    redirectChains: SemrushStyleIssue;
  };

  warnings: {
    lowTextHtmlRatio: SemrushStyleIssue;
    longTitles: SemrushStyleIssue;
    brokenExternalLinks: SemrushStyleIssue;
    lowWordCount: SemrushStyleIssue;
    httpToHttpsLinks: SemrushStyleIssue;
    missingH1: SemrushStyleIssue;
    shortMetaDescriptions: SemrushStyleIssue;
    tooManyLinks: SemrushStyleIssue;
    slowPageSpeed: SemrushStyleIssue;
  };

  notices: {
    orphanedPages: SemrushStyleIssue;
    deepPages: SemrushStyleIssue;
    linksWithNoAnchor: SemrushStyleIssue;
    singleInternalLink: SemrushStyleIssue;
    permanentRedirects: SemrushStyleIssue;
    multipleH1Tags: SemrushStyleIssue;
  };

  technicalDetails: {
    crawlability: any;
    mobile: any;
    international: any;
    performance: any;
    security: any;
    dns: any;
  };

  aiInsights: {
    recommendations: string[];
    competitiveAnalysis: string;
    contentOptimization: string;
    technicalImprovements: string[];
    priorityActions: Array<{
      action: string;
      impact: "high" | "medium" | "low";
      effort: "high" | "medium" | "low";
      priority: number;
    }>;
  };
}
