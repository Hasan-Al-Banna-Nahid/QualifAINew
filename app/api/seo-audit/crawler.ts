import * as cheerio from "cheerio";
import axios from "axios";
import { ComprehensiveAuditResult } from "@/app/api/seo-audit/types";

export class EnhancedSiteCrawler {
  private visitedUrls = new Set<string>();
  private urlDepth = new Map<string, number>();
  private urlTitles = new Map<string, string>();
  private urlMetaDesc = new Map<string, string>();
  private urlContent = new Map<string, string>();
  private redirectChains = new Map<string, string[]>();
  private pageLoadTimes = new Map<string, number>();
  private internalLinks = new Map<string, string[]>();
  private externalLinks = new Map<string, string[]>();
  private brokenLinks = new Set<string>();
  private images = new Map<string, Array<{ src: string; alt: string }>>();

  private allIssues: ComprehensiveAuditResult["errors"] &
    ComprehensiveAuditResult["warnings"] &
    ComprehensiveAuditResult["notices"] = {
    // Errors
    duplicateTitles: {
      type: "Duplicate Title Tags",
      count: 0,
      severity: "error",
      affectedPages: [],
    },
    brokenInternalLinks: {
      type: "Broken Internal Links",
      count: 0,
      severity: "error",
      affectedPages: [],
    },
    status4xx: {
      type: "4XX Status Code",
      count: 0,
      severity: "error",
      affectedPages: [],
    },
    duplicateMetaDescriptions: {
      type: "Duplicate Meta Descriptions",
      count: 0,
      severity: "error",
      affectedPages: [],
    },
    brokenImages: {
      type: "Broken Images",
      count: 0,
      severity: "error",
      affectedPages: [],
    },
    missingTitles: {
      type: "Missing Title Tags",
      count: 0,
      severity: "error",
      affectedPages: [],
    },
    duplicateContent: {
      type: "Duplicate Content",
      count: 0,
      severity: "error",
      affectedPages: [],
    },
    redirectChains: {
      type: "Redirect Chains",
      count: 0,
      severity: "error",
      affectedPages: [],
    },

    // Warnings
    lowTextHtmlRatio: {
      type: "Low Text-HTML Ratio",
      count: 0,
      severity: "warning",
      affectedPages: [],
    },
    longTitles: {
      type: "Title Too Long",
      count: 0,
      severity: "warning",
      affectedPages: [],
    },
    brokenExternalLinks: {
      type: "Broken External Links",
      count: 0,
      severity: "warning",
      affectedPages: [],
    },
    lowWordCount: {
      type: "Low Word Count",
      count: 0,
      severity: "warning",
      affectedPages: [],
    },
    httpToHttpsLinks: {
      type: "HTTP Links on HTTPS Pages",
      count: 0,
      severity: "warning",
      affectedPages: [],
    },
    missingH1: {
      type: "Missing H1 Heading",
      count: 0,
      severity: "warning",
      affectedPages: [],
    },
    shortMetaDescriptions: {
      type: "Meta Description Too Short",
      count: 0,
      severity: "warning",
      affectedPages: [],
    },
    tooManyLinks: {
      type: "Too Many Links",
      count: 0,
      severity: "warning",
      affectedPages: [],
    },
    slowPageSpeed: {
      type: "Slow Page Load",
      count: 0,
      severity: "warning",
      affectedPages: [],
    },

    // Notices
    orphanedPages: {
      type: "Orphaned Pages",
      count: 0,
      severity: "notice",
      affectedPages: [],
    },
    deepPages: {
      type: "Pages Deeper Than 3 Clicks",
      count: 0,
      severity: "notice",
      affectedPages: [],
    },
    linksWithNoAnchor: {
      type: "Links With No Anchor Text",
      count: 0,
      severity: "notice",
      affectedPages: [],
    },
    singleInternalLink: {
      type: "Pages With Single Internal Link",
      count: 0,
      severity: "notice",
      affectedPages: [],
    },
    permanentRedirects: {
      type: "Permanent Redirects (301)",
      count: 0,
      severity: "notice",
      affectedPages: [],
    },
    multipleH1Tags: {
      type: "Multiple H1 Tags",
      count: 0,
      severity: "notice",
      affectedPages: [],
    },
  };

  constructor(
    private baseUrl: string,
    private maxPages: number = 50,
  ) {}

  async crawl(): Promise<ComprehensiveAuditResult> {
    const startUrl = this.baseUrl;
    await this.crawlPage(startUrl, 0);

    // Post-processing: Find duplicates and patterns
    this.detectDuplicateTitles();
    this.detectDuplicateMetaDescriptions();
    this.detectDuplicateContent();
    this.detectOrphanedPages();

    return this.generateReport();
  }

  private async crawlPage(url: string, depth: number): Promise<void> {
    if (this.visitedUrls.has(url) || this.visitedUrls.size >= this.maxPages) {
      return;
    }

    this.visitedUrls.add(url);
    this.urlDepth.set(url, depth);

    try {
      const startTime = Date.now();
      const response = await axios.get(url, {
        timeout: 10000,
        maxRedirects: 5,
        validateStatus: (status) => status < 500,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; SEOAuditBot/1.0)",
        },
      });

      const loadTime = Date.now() - startTime;
      this.pageLoadTimes.set(url, loadTime);

      // Track redirects
      if (response.request._redirectable?._redirectCount > 0) {
        const chain = response.request._redirectable._redirects || [];
        this.redirectChains.set(url, chain);

        if (chain.length > 1) {
          this.allIssues.redirectChains.affectedPages.push({
            url,
            details: `Redirect chain: ${chain.join(" → ")}`,
            discovered: new Date().toISOString(),
          });
        }
      }

      // Handle status codes
      if (response.status >= 400 && response.status < 500) {
        this.allIssues.status4xx.affectedPages.push({
          url,
          details: `HTTP ${response.status} Error`,
          discovered: new Date().toISOString(),
        });
        return;
      }

      // Check page load speed
      if (loadTime > 3000) {
        this.allIssues.slowPageSpeed.affectedPages.push({
          url,
          details: `Page load time: ${loadTime}ms`,
          discovered: new Date().toISOString(),
        });
      }

      const $ = cheerio.load(response.data);
      await this.analyzePage(url, $ as cheerio.CheerioAPI, depth);
    } catch (error: any) {
      if (error.code === "ENOTFOUND" || error.response?.status === 404) {
        this.brokenLinks.add(url);
        this.allIssues.status4xx.affectedPages.push({
          url,
          details: "Page not found or DNS error",
          discovered: new Date().toISOString(),
        });
      }
    }
  }

  private async analyzePage(
    url: string,
    $: cheerio.CheerioAPI,
    depth: number,
  ): Promise<void> {
    const urlObj = new URL(url);
    const baseDomain = `${urlObj.protocol}//${urlObj.hostname}`;

    // 1. TITLE TAG ANALYSIS
    const title = $("title").text().trim();
    if (!title) {
      this.allIssues.missingTitles.affectedPages.push({
        url,
        details: "No title tag found",
        discovered: new Date().toISOString(),
      });
    } else {
      this.urlTitles.set(url, title);

      if (title.length > 60) {
        this.allIssues.longTitles.affectedPages.push({
          url,
          details: `Title length: ${title.length} characters (recommended: 50-60)`,
          discovered: new Date().toISOString(),
        });
      }
    }

    // 2. META DESCRIPTION ANALYSIS
    const metaDesc =
      $('meta[name="description"]').attr("content")?.trim() || "";
    if (metaDesc) {
      this.urlMetaDesc.set(url, metaDesc);

      if (metaDesc.length < 50) {
        this.allIssues.shortMetaDescriptions.affectedPages.push({
          url,
          details: `Meta description length: ${metaDesc.length} characters (recommended: 150-160)`,
          discovered: new Date().toISOString(),
        });
      }
    }

    // 3. HEADING ANALYSIS
    const h1Tags = $("h1");
    if (h1Tags.length === 0) {
      this.allIssues.missingH1.affectedPages.push({
        url,
        details: "No H1 heading found",
        discovered: new Date().toISOString(),
      });
    } else if (h1Tags.length > 1) {
      this.allIssues.multipleH1Tags.affectedPages.push({
        url,
        details: `${h1Tags.length} H1 tags found (recommended: 1)`,
        discovered: new Date().toISOString(),
      });
    }

    // 4. CONTENT ANALYSIS
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount = bodyText.split(" ").filter((w) => w.length > 0).length;

    this.urlContent.set(url, bodyText.substring(0, 500)); // Store first 500 chars for duplicate detection

    if (wordCount < 200) {
      this.allIssues.lowWordCount.affectedPages.push({
        url,
        details: `Word count: ${wordCount} (recommended: 300+)`,
        discovered: new Date().toISOString(),
      });
    }

    // 5. TEXT-TO-HTML RATIO
    const htmlSize = $.html().length;
    const textRatio = (bodyText.length / htmlSize) * 100;

    if (textRatio < 10) {
      this.allIssues.lowTextHtmlRatio.affectedPages.push({
        url,
        details: `Text-to-HTML ratio: ${textRatio.toFixed(2)}% (recommended: >10%)`,
        discovered: new Date().toISOString(),
      });
    }

    // 6. IMAGE ANALYSIS
    const images: Array<{ src: string; alt: string }> = [];
    $("img").each((i, elem) => {
      const src = $(elem).attr("src");
      const alt = $(elem).attr("alt") || "";

      if (src) {
        images.push({ src, alt });

        // Check for missing alt text
        if (!alt) {
          // We'll aggregate this later
        }

        // Check if image is accessible (for broken images)
        if (src.startsWith("http")) {
          // Note: We skip actual HTTP checks for performance
        }
      }
    });
    this.images.set(url, images);

    // 7. LINK ANALYSIS
    const internalLinks: string[] = [];
    const externalLinks: string[] = [];
    let linksWithoutAnchor = 0;

    $("a[href]").each((i, elem) => {
      const href = $(elem).attr("href");
      const text = $(elem).text().trim();

      if (!href) return;

      if (!text || text.length === 0) {
        linksWithoutAnchor++;
      }

      try {
        let fullUrl = href;

        if (href.startsWith("/")) {
          fullUrl = baseDomain + href;
        } else if (!href.startsWith("http")) {
          fullUrl = new URL(href, url).href;
        }

        const linkUrl = new URL(fullUrl);

        if (linkUrl.hostname === urlObj.hostname) {
          internalLinks.push(fullUrl);
        } else {
          externalLinks.push(fullUrl);
        }

        // Check for HTTP links on HTTPS pages
        if (url.startsWith("https://") && fullUrl.startsWith("http://")) {
          this.allIssues.httpToHttpsLinks.affectedPages.push({
            url,
            details: `HTTP link found: ${fullUrl.substring(0, 50)}...`,
            discovered: new Date().toISOString(),
          });
        }
      } catch (e) {
        // Invalid URL
      }
    });

    this.internalLinks.set(url, internalLinks);
    this.externalLinks.set(url, externalLinks);

    const totalLinks = internalLinks.length + externalLinks.length;

    if (totalLinks > 100) {
      this.allIssues.tooManyLinks.affectedPages.push({
        url,
        details: `${totalLinks} links found (recommended: <100)`,
        discovered: new Date().toISOString(),
      });
    }

    if (linksWithoutAnchor > 0) {
      this.allIssues.linksWithNoAnchor.affectedPages.push({
        url,
        details: `${linksWithoutAnchor} links without anchor text`,
        discovered: new Date().toISOString(),
      });
    }

    if (internalLinks.length === 1) {
      this.allIssues.singleInternalLink.affectedPages.push({
        url,
        details: "Only one internal link found",
        discovered: new Date().toISOString(),
      });
    }

    // 8. DEPTH ANALYSIS
    if (depth > 3) {
      this.allIssues.deepPages.affectedPages.push({
        url,
        details: `Page depth: ${depth} clicks from homepage`,
        discovered: new Date().toISOString(),
      });
    }

    // 9. CRAWL CHILD PAGES
    const uniqueInternalLinks = [...new Set(internalLinks)]
      .filter((link) => !link.includes("#"))
      .filter((link) => !this.isNonHtmlFile(link))
      .slice(0, 10); // Limit children per page

    for (const childUrl of uniqueInternalLinks) {
      if (this.visitedUrls.size < this.maxPages) {
        await this.crawlPage(childUrl, depth + 1);
      }
    }
  }

  private detectDuplicateTitles(): void {
    const titleMap = new Map<string, string[]>();

    this.urlTitles.forEach((title, url) => {
      if (!titleMap.has(title)) {
        titleMap.set(title, []);
      }
      titleMap.get(title)!.push(url);
    });

    titleMap.forEach((urls, title) => {
      if (urls.length > 1) {
        urls.forEach((url) => {
          this.allIssues.duplicateTitles.affectedPages.push({
            url,
            details: `Duplicate title: "${title}" (found on ${urls.length} pages)`,
            discovered: new Date().toISOString(),
          });
        });
      }
    });
  }

  private detectDuplicateMetaDescriptions(): void {
    const descMap = new Map<string, string[]>();

    this.urlMetaDesc.forEach((desc, url) => {
      if (!descMap.has(desc)) {
        descMap.set(desc, []);
      }
      descMap.get(desc)!.push(url);
    });

    descMap.forEach((urls, desc) => {
      if (urls.length > 1) {
        urls.forEach((url) => {
          this.allIssues.duplicateMetaDescriptions.affectedPages.push({
            url,
            details: `Duplicate meta description (found on ${urls.length} pages)`,
            discovered: new Date().toISOString(),
          });
        });
      }
    });
  }

  private detectDuplicateContent(): void {
    const contentMap = new Map<string, string[]>();

    this.urlContent.forEach((content, url) => {
      const signature = content.substring(0, 200); // First 200 chars as signature

      if (!contentMap.has(signature)) {
        contentMap.set(signature, []);
      }
      contentMap.get(signature)!.push(url);
    });

    contentMap.forEach((urls, signature) => {
      if (urls.length > 1) {
        urls.forEach((url) => {
          this.allIssues.duplicateContent.affectedPages.push({
            url,
            details: `Similar content detected (${urls.length} pages)`,
            discovered: new Date().toISOString(),
          });
        });
      }
    });
  }

  private detectOrphanedPages(): void {
    const linkedPages = new Set<string>();

    this.internalLinks.forEach((links) => {
      links.forEach((link) => linkedPages.add(link));
    });

    this.visitedUrls.forEach((url) => {
      if (!linkedPages.has(url) && url !== this.baseUrl) {
        this.allIssues.orphanedPages.affectedPages.push({
          url,
          details: "Page has no incoming internal links",
          discovered: new Date().toISOString(),
        });
      }
    });
  }

  private isNonHtmlFile(url: string): boolean {
    const extensions = [
      ".pdf",
      ".jpg",
      ".png",
      ".gif",
      ".svg",
      ".css",
      ".js",
      ".xml",
      ".json",
    ];
    return extensions.some((ext) => url.toLowerCase().includes(ext));
  }

  private generateReport(): ComprehensiveAuditResult {
    // Calculate counts
    Object.keys(this.allIssues).forEach((key) => {
      const issue = this.allIssues[key as keyof typeof this.allIssues];
      issue.count = issue.affectedPages.length;
    });

    const errorCount = Object.values(this.allIssues)
      .filter((i) => i.severity === "error")
      .reduce((sum, i) => sum + i.count, 0);

    const warningCount = Object.values(this.allIssues)
      .filter((i) => i.severity === "warning")
      .reduce((sum, i) => sum + i.count, 0);

    const noticeCount = Object.values(this.allIssues)
      .filter((i) => i.severity === "notice")
      .reduce((sum, i) => sum + i.count, 0);

    const totalIssues = errorCount + warningCount + noticeCount;
    const healthScore = Math.max(
      0,
      100 - errorCount * 10 - warningCount * 2 - noticeCount * 0.5,
    );

    // Top issues
    const topIssues = Object.values(this.allIssues)
      .filter((i) => i.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((i) => ({
        title: i.type,
        count: i.count,
        percentage: (i.count / this.visitedUrls.size) * 100,
        type: i.severity,
      }));

    return {
      siteHealth: {
        score: Math.round(healthScore),
        crawledPages: this.visitedUrls.size,
        errors: errorCount,
        warnings: warningCount,
        notices: noticeCount,
      },
      topIssues,
      errors: {
        duplicateTitles: this.allIssues.duplicateTitles,
        brokenInternalLinks: this.allIssues.brokenInternalLinks,
        status4xx: this.allIssues.status4xx,
        duplicateMetaDescriptions: this.allIssues.duplicateMetaDescriptions,
        brokenImages: this.allIssues.brokenImages,
        missingTitles: this.allIssues.missingTitles,
        duplicateContent: this.allIssues.duplicateContent,
        redirectChains: this.allIssues.redirectChains,
      },
      warnings: {
        lowTextHtmlRatio: this.allIssues.lowTextHtmlRatio,
        longTitles: this.allIssues.longTitles,
        brokenExternalLinks: this.allIssues.brokenExternalLinks,
        lowWordCount: this.allIssues.lowWordCount,
        httpToHttpsLinks: this.allIssues.httpToHttpsLinks,
        missingH1: this.allIssues.missingH1,
        shortMetaDescriptions: this.allIssues.shortMetaDescriptions,
        tooManyLinks: this.allIssues.tooManyLinks,
        slowPageSpeed: this.allIssues.slowPageSpeed,
      },
      notices: {
        orphanedPages: this.allIssues.orphanedPages,
        deepPages: this.allIssues.deepPages,
        linksWithNoAnchor: this.allIssues.linksWithNoAnchor,
        singleInternalLink: this.allIssues.singleInternalLink,
        permanentRedirects: this.allIssues.permanentRedirects,
        multipleH1Tags: this.allIssues.multipleH1Tags,
      },
      technicalDetails: {} as any, // Will be populated by analyzers
      aiInsights: {} as any, // Will be populated by AI
    };
  }
}
