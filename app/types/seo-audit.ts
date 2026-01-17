// types/seo-audit.ts
export interface SEOAuditResult {
  url: string;
  timestamp: string;
  performance: {
    loadTime: number;
    pageSize: number;
    requestCount: number;
  };
  seo: {
    title: string | null;
    titleLength: number;
    metaDescription: string | null;
    metaDescriptionLength: number;
    h1Tags: string[];
    h2Tags: string[];
    canonicalUrl: string | null;
    robotsMeta: string | null;
    ogTags: Record<string, string>;
    twitterTags: Record<string, string>;
    structuredData: any[];
  };
  links: {
    internal: string[];
    external: string[];
    broken: string[];
    total: number;
    internalCount: number;
    externalCount: number;
    brokenCount: number;
  };
  images: {
    total: number;
    withoutAlt: number;
    broken: string[];
    list: Array<{ src: string; alt: string | null }>;
  };
  duplicates: {
    titles: string[];
    metaDescriptions: string[];
    h1s: string[];
  };
  errors: string[];
  warnings: string[];
  notices: string[];
  dns: {
    records: Record<string, any>;
    loadBalancing: boolean;
    ipAddresses: string[];
  };
  security: {
    https: boolean;
    hsts: boolean;
    securityHeaders: Record<string, string>;
  };
  mobile: {
    viewport: boolean;
    responsive: boolean;
  };
  score: number;
}

export interface MultiPageAuditResult {
  domain: string;
  totalPages: number;
  completedPages: number;
  status: "pending" | "crawling" | "completed" | "failed";
  pages: SEOAuditResult[];
  aggregatedScore: number;
  aggregatedIssues: {
    errors: number;
    warnings: number;
    notices: number;
  };
  startedAt: string;
  completedAt?: string;
}

export interface CrawlProgress {
  current: number;
  total: number;
  currentUrl: string;
  percentage: number;
}

export interface EnhancedSEOAuditResult extends SEOAuditResult {
  technical: {
    crawlability: {
      robotsTxt: boolean;
      sitemap: boolean;
      sitemapUrls: number;
      blockedByRobots: boolean;
    };
    indexing: {
      noindexTags: number;
      nofollowLinks: number;
      canonicalChain: string[];
      pagination: boolean;
    };
    architecture: {
      urlStructure: "flat" | "hierarchical";
      depth: number;
      orphanPages: number;
      redirectChain: boolean;
    };
    performance: {
      serverResponse: number;
      timeToFirstByte: number;
      firstContentfulPaint: number;
      largestContentfulPaint: number;
      cumulativeLayoutShift: number;
      totalBlockingTime: number;
    };
  };
  content: {
    quality: {
      readabilityScore: number;
      fleschReadingEase: number;
      keywordDensity: Record<string, number>;
      textToHtmlRatio: number;
      duplicateContent: boolean;
    };
    structure: {
      paragraphCount: number;
      sentenceCount: number;
      averageSentenceLength: number;
      subheadingsDistribution: number[];
      bulletPoints: number;
    };
  };
  onPage: {
    keywordUsage: {
      primaryKeyword: string;
      keywordInTitle: boolean;
      keywordInH1: boolean;
      keywordInMeta: boolean;
      keywordInUrl: boolean;
      keywordInFirst100: boolean;
    };
    semanticAnalysis: {
      relatedTerms: string[];
      topicClusters: string[];
      LSIKeywords: string[];
    };
  };
  ux: {
    coreWebVitals: {
      lcpScore: "good" | "needs-improvement" | "poor";
      fidScore: "good" | "needs-improvement" | "poor";
      clsScore: "good" | "needs-improvement" | "poor";
    };
    accessibility: {
      ariaLabels: number;
      contrastRatio: number;
      tabIndex: number;
      screenReaderCompatible: boolean;
    };
  };
  competitive: {
    backlinkProfile: {
      referringDomains: number;
      totalBacklinks: number;
      dofollowNofollowRatio: number;
      anchorTextDistribution: Record<string, number>;
    };
    socialSignals: {
      facebookShares: number;
      twitterShares: number;
      linkedinShares: number;
      pinterestPins: number;
    };
  };
}
