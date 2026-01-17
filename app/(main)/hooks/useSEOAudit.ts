// hooks/useSEOAudit.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// Types (import or define here)
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

// API Functions
async function auditSinglePage(url: string): Promise<SEOAuditResult> {
  const response = await fetch("/api/seo-audit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      apiKey: process.env.NEXT_PUBLIC_SEO_AUDIT_API_KEY || "dev-key",
    }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Failed to audit page");
  }

  return response.json();
}

async function crawlFullSite(
  baseUrl: string,
  options: {
    maxPages?: number;
    maxDepth?: number;
    onProgress?: (progress: CrawlProgress) => void;
  } = {}
): Promise<MultiPageAuditResult> {
  const { maxPages = 50, maxDepth = 3, onProgress } = options;

  const response = await fetch("/api/seo-audit/crawl-site", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: baseUrl,
      apiKey: process.env.NEXT_PUBLIC_SEO_AUDIT_API_KEY || "dev-key",
      maxPages,
      maxDepth,
    }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || "Failed to crawl site");
  }

  // Handle streaming response for progress updates
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let result: MultiPageAuditResult | null = null;

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(Boolean);

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === "progress" && onProgress) {
              onProgress(data.progress);
            } else if (data.type === "complete") {
              result = data.result;
            }
          } catch (e) {
            console.error("Error parsing SSE data:", e);
          }
        }
      }
    }
  }

  if (!result) {
    throw new Error("No result received from crawl");
  }

  return result;
}

// Hook for single page audit
export function useSinglePageAudit() {
  return useMutation({
    mutationFn: auditSinglePage,
    onSuccess: (data) => {
      console.log("SEO Audit completed:", data);
    },
    onError: (error: Error) => {
      console.error("SEO Audit failed:", error);
    },
  });
}

// Hook for full site crawl with progress tracking
export function useFullSiteCrawl() {
  const [progress, setProgress] = useState<CrawlProgress>({
    current: 0,
    total: 0,
    currentUrl: "",
    percentage: 0,
  });

  const mutation = useMutation({
    mutationFn: async ({
      url,
      maxPages,
      maxDepth,
    }: {
      url: string;
      maxPages?: number;
      maxDepth?: number;
    }) => {
      return crawlFullSite(url, {
        maxPages,
        maxDepth,
        onProgress: setProgress,
      });
    },
    onSuccess: () => {
      setProgress({
        current: 0,
        total: 0,
        currentUrl: "",
        percentage: 0,
      });
    },
    onError: (error: Error) => {
      console.error("Full site crawl failed:", error);
    },
  });

  return {
    ...mutation,
    progress,
  };
}

// Hook to get cached audit results
export function useCachedAudit(url: string | null) {
  return useQuery({
    queryKey: ["seo-audit", url],
    queryFn: () => auditSinglePage(url!),
    enabled: !!url,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook for batch auditing multiple URLs
export function useBatchAudit() {
  const queryClient = useQueryClient();
  const [batchProgress, setBatchProgress] = useState<{
    completed: number;
    total: number;
    failed: number;
  }>({
    completed: 0,
    total: 0,
    failed: 0,
  });

  const mutation = useMutation({
    mutationFn: async (urls: string[]) => {
      setBatchProgress({ completed: 0, total: urls.length, failed: 0 });
      const results: SEOAuditResult[] = [];
      let failed = 0;

      for (let i = 0; i < urls.length; i++) {
        try {
          const result = await auditSinglePage(urls[i]);
          results.push(result);

          // Cache individual results
          queryClient.setQueryData(["seo-audit", urls[i]], result);
        } catch (error) {
          console.error(`Failed to audit ${urls[i]}:`, error);
          failed++;
        }

        setBatchProgress({
          completed: i + 1,
          total: urls.length,
          failed,
        });
      }

      return results;
    },
    onError: (error: Error) => {
      console.error("Batch audit failed:", error);
    },
  });

  return {
    ...mutation,
    batchProgress,
  };
}

// Helper function to find common issues across pages
function findCommonIssues(results: SEOAuditResult[]) {
  const issueMap = new Map<string, number>();

  results.forEach((result) => {
    [...result.errors, ...result.warnings].forEach((issue) => {
      issueMap.set(issue, (issueMap.get(issue) || 0) + 1);
    });
  });

  return Array.from(issueMap.entries())
    .filter(([_, count]) => count >= results.length * 0.5) // Issues in 50%+ of pages
    .map(([issue, count]) => ({
      issue,
      count,
      percentage: (count / results.length) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}

// Hook for comparing multiple pages
export function useComparePages() {
  return useMutation({
    mutationFn: async (urls: string[]) => {
      const results = await Promise.all(
        urls.map((url) => auditSinglePage(url))
      );

      // Calculate comparison metrics
      const comparison = {
        pages: results,
        averageScore:
          results.reduce((sum, r) => sum + r.score, 0) / results.length,
        bestPerforming: results.reduce((best, current) =>
          current.score > best.score ? current : best
        ),
        worstPerforming: results.reduce((worst, current) =>
          current.score < worst.score ? current : worst
        ),
        commonIssues: findCommonIssues(results),
      };

      return comparison;
    },
    onError: (error: Error) => {
      console.error("Compare pages failed:", error);
    },
  });
}

// Hook for scheduled/recurring audits
export function useScheduledAudit(url: string, interval: number = 3600000) {
  return useQuery({
    queryKey: ["seo-audit-scheduled", url],
    queryFn: () => auditSinglePage(url),
    enabled: !!url,
    refetchInterval: interval, // Default: 1 hour
    refetchIntervalInBackground: false,
  });
}
