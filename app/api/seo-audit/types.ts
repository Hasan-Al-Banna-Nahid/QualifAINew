// app/api/seo-audit/types.ts
export const runtime = "nodejs";

export type SEOCheckStatus = "pass" | "fail" | "warning";
export type SEOSeverity = "critical" | "high" | "medium" | "low" | "warning";
export type ScanType = "single" | "limited" | "full" | "custom";
export type InputMethod = "url" | "file" | "instruction";

// File Upload Types
export interface FileUploadConfig {
  type: "pdf" | "csv" | "txt" | "json";
  urls?: string[];
  instructions?: string;
}

// Custom Instructions
export interface CustomInstructions {
  targetSelectors?: string[];
  ignoreSelectors?: string[];
  customChecks?: CustomCheck[];
  crawlRules?: CrawlRules;
  dataExtraction?: DataExtractionRule[];
}

export interface CustomCheck {
  name: string;
  selector: string;
  validation: "exists" | "not-exists" | "count" | "contains" | "regex";
  expected?: any;
  severity: SEOSeverity;
}

export interface CrawlRules {
  maxDepth?: number;
  includePatterns?: string[];
  excludePatterns?: string[];
  followExternalLinks?: boolean;
  respectRobotsTxt?: boolean;
}

export interface DataExtractionRule {
  name: string;
  selector: string;
  attribute?: string;
  transform?: "text" | "html" | "href" | "src";
}

// Page Analysis Results
export interface PageAnalysis {
  url: string;
  depth: number;
  loadTime: number;
  statusCode: number;
  contentType: string;
  pageSize: number;
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  readabilityScore: number;
  fleschScore: number;
  gunningFogIndex: number;
  automatedReadabilityIndex: number;
  colemanLiauIndex: number;
  smogIndex: number;
  spacheReadability: number;
}

// Content Quality Metrics
export interface ContentQualityMetrics {
  uniquenessScore: number;
  keywordDensity: Record<string, number>;
  topKeywords: Array<{ word: string; count: number; density: number }>;
  lsiKeywords: string[];
  contentFreshness: Date | null;
  lastModified: Date | null;
  publishDate: Date | null;
  authorCredibility: number;
  expertiseScore: number;
  trustScore: number;
  grammarIssues: number;
  spellingErrors: number;
  passiveVoicePercentage: number;
  avgSentenceLength: number;
  avgWordLength: number;
  complexWords: number;
  uniqueWords: number;
  stopWords: number;
}

// Advanced SEO Metrics
export interface AdvancedSEOMetrics {
  titleOptimization: number;
  descriptionOptimization: number;
  headingOptimization: number;
  contentOptimization: number;
  technicalOptimization: number;
  mobileOptimization: number;
  speedOptimization: number;
  securityOptimization: number;
  accessibilityScore: number;
  userExperienceScore: number;
  onPageScore: number;
  offPageScore: number;
  technicalScore: number;
}

// Link Analysis
export interface LinkAnalysis {
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  nofollowLinks: number;
  sponsoredLinks: number;
  ugcLinks: number;
  brokenLinks: number;
  redirectedLinks: number;
  linkDensity: number;
  internalLinkDepth: number;
  orphanedPages: string[];
  linkVelocity: number;
  anchorTextDiversity: number;
  linkQualityScore: number;
}

// Image Analysis
export interface ImageAnalysis {
  totalImages: number;
  imagesWithAlt: number;
  imagesWithoutAlt: number;
  imagesWithTitle: number;
  avgImageSize: number;
  totalImageSize: number;
  lazyLoadedImages: number;
  responsiveImages: number;
  optimizedFormats: number;
  imageFormats: Record<string, number>;
  brokenImages: number;
  imagesWithDimensions: number;
  imageCompressionScore: number;
}

// Video & Media Analysis
export interface MediaAnalysis {
  totalVideos: number;
  embeddedVideos: number;
  nativeVideos: number;
  videoProviders: Record<string, number>;
  totalAudio: number;
  iframes: number;
  svgElements: number;
  canvasElements: number;
  mediaQueries: string[];
}

// JavaScript Analysis
export interface JavaScriptAnalysis {
  totalScripts: number;
  inlineScripts: number;
  externalScripts: number;
  asyncScripts: number;
  deferScripts: number;
  moduleScripts: number;
  scriptSources: string[];
  thirdPartyScripts: number;
  analyticsScripts: string[];
  adScripts: string[];
  socialScripts: string[];
  totalScriptSize: number;
}

// CSS Analysis
export interface CSSAnalysis {
  totalStylesheets: number;
  inlineStyles: number;
  externalStylesheets: number;
  totalCSSSize: number;
  unusedCSS: number;
  criticalCSS: boolean;
  cssFrameworks: string[];
  mediaQueries: number;
  animations: number;
  transitions: number;
}

// Performance Metrics
export interface PerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  speedIndex: number;
  domContentLoaded: number;
  loadComplete: number;
  resourceLoadTime: Record<string, number>;
  criticalPathLength: number;
  renderBlockingResources: number;
}

// Structured Data
export interface StructuredDataAnalysis {
  schemas: any[];
  schemaTypes: string[];
  validSchemas: number;
  invalidSchemas: number;
  breadcrumbs: boolean;
  productSchema: boolean;
  articleSchema: boolean;
  organizationSchema: boolean;
  personSchema: boolean;
  reviewSchema: boolean;
  faqSchema: boolean;
  eventSchema: boolean;
  recipeSchema: boolean;
  videoSchema: boolean;
}

// Social Media
export interface SocialMediaAnalysis {
  openGraph: Record<string, string>;
  twitterCard: Record<string, string>;
  facebookPixel: boolean;
  googleAnalytics: boolean;
  googleTagManager: boolean;
  linkedInInsight: boolean;
  pinterestTag: boolean;
  snapchatPixel: boolean;
  tiktokPixel: boolean;
  socialLinks: Record<string, string[]>;
}

// Security Analysis
export interface SecurityAnalysis {
  ssl: SSLInfo;
  securityHeaders: Record<string, string>;
  contentSecurityPolicy: string[];
  hsts: HSTSInfo;
  cors: CORSInfo;
  xFrameOptions: string;
  xssProtection: string;
  contentTypeOptions: string;
  referrerPolicy: string;
  permissionsPolicy: string;
  securityScore: number;
  vulnerabilities: Vulnerability[];
  mixedContent: number;
  insecureRequests: number;
}

export interface SSLInfo {
  valid: boolean;
  issuer: string;
  expires: string;
  protocol: string;
  cipher: string;
  grade?: string;
  daysUntilExpiry?: number;
  certificateChain?: string[];
}

export interface HSTSInfo {
  present: boolean;
  maxAge: number;
  includeSubDomains: boolean;
  preload: boolean;
  valid: boolean;
}

export interface CORSInfo {
  enabled: boolean;
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
}

export interface Vulnerability {
  type: string;
  severity: SEOSeverity;
  description: string;
  recommendation: string;
}

// Accessibility Analysis
export interface AccessibilityAnalysis {
  score: number;
  ariaLabels: number;
  ariaRoles: number;
  altTextCoverage: number;
  formLabels: number;
  headingStructure: number;
  colorContrast: number;
  keyboardNavigation: boolean;
  skipLinks: boolean;
  languageAttribute: boolean;
  validHTML: boolean;
  wcagLevel: "A" | "AA" | "AAA" | "None";
  issues: AccessibilityIssue[];
}

export interface AccessibilityIssue {
  type: string;
  severity: SEOSeverity;
  element: string;
  recommendation: string;
}

// Mobile Analysis
export interface MobileAnalysis {
  mobileFriendly: boolean;
  viewportConfigured: boolean;
  textSize: number;
  tapTargets: number;
  contentWidth: boolean;
  interactiveElements: number;
  mobilePageSpeed: number;
  amp: boolean;
  pwa: boolean;
  serviceWorker: boolean;
  manifest: boolean;
  touchIcons: number;
}

// International SEO
export interface InternationalSEO {
  hreflang: Array<{ lang: string; href: string }>;
  languages: string[];
  regions: string[];
  alternatePages: number;
  canonicalImplementation: boolean;
  geoTargeting: string[];
  currencyDetection: string[];
  dateFormats: string[];
}

// Technical SEO
export interface TechnicalSEO {
  robotsTxt: RobotsTxtAnalysis;
  sitemap: SitemapAnalysis;
  canonical: CanonicalAnalysis;
  redirects: RedirectAnalysis;
  pagination: PaginationAnalysis;
  schemaMarkup: StructuredDataAnalysis;
  crawlability: CrawlabilityAnalysis;
  indexability: IndexabilityAnalysis;
}

export interface RobotsTxtAnalysis {
  exists: boolean;
  valid: boolean;
  sitemaps: string[];
  disallowedPaths: string[];
  crawlDelay: number | null;
  userAgents: string[];
}

export interface SitemapAnalysis {
  exists: boolean;
  valid: boolean;
  urls: number;
  images: number;
  videos: number;
  lastModified: Date | null;
  compressed: boolean;
  sitemapIndex: boolean;
}

export interface CanonicalAnalysis {
  canonical: string | null;
  selfReferencing: boolean;
  multipleCanonicals: boolean;
  canonicalChain: boolean;
  httpToHttps: boolean;
}

export interface RedirectAnalysis {
  redirectChains: number;
  permanentRedirects: number;
  temporaryRedirects: number;
  metaRefresh: number;
  jsRedirects: number;
  redirectLoops: number;
}

export interface PaginationAnalysis {
  hasPagination: boolean;
  prevLink: string | null;
  nextLink: string | null;
  canonicalPagination: boolean;
  relPrevNext: boolean;
}

export interface CrawlabilityAnalysis {
  crawlable: boolean;
  blockedByRobots: boolean;
  noindexTag: boolean;
  nofollow: boolean;
  xRobotsTag: string | null;
  javascriptRequired: boolean;
}

export interface IndexabilityAnalysis {
  indexable: boolean;
  reasons: string[];
  metaRobots: string | null;
  xRobotsTag: string | null;
  canonical: string | null;
}

// Competition Analysis
export interface CompetitionAnalysis {
  domainAuthority: number;
  pageAuthority: number;
  trustFlow: number;
  citationFlow: number;
  organicKeywords: number;
  organicTraffic: number;
  backlinks: number;
  referringDomains: number;
  competitorGap: number;
}

// Keyword Analysis
export interface KeywordAnalysis {
  primaryKeyword: string | null;
  secondaryKeywords: string[];
  keywordDensity: Record<string, number>;
  keywordInTitle: boolean;
  keywordInH1: boolean;
  keywordInURL: boolean;
  keywordInMeta: boolean;
  keywordProminence: number;
  lsiKeywords: string[];
  semanticKeywords: string[];
}

// User Experience Metrics
export interface UserExperienceMetrics {
  navigationClarity: number;
  contentReadability: number;
  visualHierarchy: number;
  whitespaceUsage: number;
  fontReadability: number;
  colorScheme: number;
  responsiveness: number;
  interactivity: number;
  errorHandling: number;
  feedbackMechanisms: number;
}

// E-commerce Specific
export interface EcommerceAnalysis {
  products: number;
  productSchemas: number;
  priceDisplay: boolean;
  availabilityInfo: boolean;
  reviewSchema: boolean;
  aggregateRating: boolean;
  shippingInfo: boolean;
  returnPolicy: boolean;
  secureCheckout: boolean;
  paymentMethods: string[];
}

// Core Types from Original
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

export interface SecurityAnalysisResult {
  ssl: SSLInfo;
  headers: Record<string, string>;
  vulnerabilities: string[];
  csp: { present: boolean; directives: string[] };
  hsts: HSTSInfo;
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

export interface AIInsights {
  recommendations: string[];
  competitiveAnalysis: string;
  contentOptimization: string;
  technicalImprovements?: string[];
  impactEstimate?: string;
  priorityScore?: number;
}

export interface TechnicalReport {
  crawlability: CrawlabilityResult;
  performance: PerformanceAnalysisResult;
  security: SecurityAnalysisResult;
  mobile: MobileAnalysisResult;
  international: InternationalAnalysisResult;
  dns: DNSAnalysisResult;
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
    score: number;
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
    crawlability: CrawlabilityResult;
    mobile: MobileAnalysisResult;
    international: InternationalAnalysisResult;
    performance: PerformanceAnalysisResult;
    security: SecurityAnalysisResult;
    dns: DNSAnalysisResult;
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
