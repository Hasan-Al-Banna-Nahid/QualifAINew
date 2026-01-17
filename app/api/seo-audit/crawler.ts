import * as cheerio from "cheerio";
import axios from "axios";
import {
  ComprehensiveAuditResult,
  SemrushStyleIssue,
} from "@/app/api/seo-audit/types";

export class EnhancedSiteCrawler {
  private visitedUrls = new Set<string>();
  private urlDepth = new Map<string, number>();
  private urlTitles = new Map<string, string>();
  private urlMetaDesc = new Map<string, string>();
  private urlMetaKeywords = new Map<string, string>();
  private urlContent = new Map<string, string>();
  private urlH1 = new Map<string, string[]>();
  private urlH2 = new Map<string, string[]>();
  private urlH3 = new Map<string, string[]>();
  private urlCanonical = new Map<string, string>();
  private urlOpenGraph = new Map<string, Record<string, string>>();
  private urlTwitterCard = new Map<string, Record<string, string>>();
  private urlSchemaOrg = new Map<string, any[]>();
  private redirectChains = new Map<string, string[]>();
  private pageLoadTimes = new Map<string, number>();
  private internalLinks = new Map<string, string[]>();
  private externalLinks = new Map<string, string[]>();
  private brokenLinks = new Set<string>();
  private images = new Map<
    string,
    Array<{ src: string; alt: string; width?: string; height?: string }>
  >();
  private videos = new Map<string, string[]>();
  private iframes = new Map<string, string[]>();
  private scripts = new Map<string, string[]>();
  private stylesheets = new Map<string, string[]>();
  private fonts = new Map<string, string[]>();
  private responseCodes = new Map<string, number>();
  private contentTypes = new Map<string, string>();
  private pageWordCounts = new Map<string, number>();
  private pageSentenceCounts = new Map<string, number>();
  private pageParagraphCounts = new Map<string, number>();
  private pageListCounts = new Map<string, number>();
  private pageTableCounts = new Map<string, number>();
  private pageFormCounts = new Map<string, number>();
  private pageButtonCounts = new Map<string, number>();
  private pageInputCounts = new Map<string, number>();
  private urlLang = new Map<string, string>();
  private urlCharset = new Map<string, string>();
  private urlViewport = new Map<string, string>();
  private urlRobotsMeta = new Map<string, string>();
  private urlRefresh = new Map<string, string>();
  private urlBase = new Map<string, string>();
  private linkRelations = new Map<string, Record<string, string[]>>();
  private anchorTexts = new Map<string, string[]>();
  private imageFormats = new Map<string, Record<string, number>>();
  private codeBlocks = new Map<string, number>();
  private mediaQueries = new Map<string, boolean>();
  private structuredData = new Map<string, any[]>();
  private breadcrumbs = new Map<string, string[]>();
  private socialLinks = new Map<string, string[]>();
  private emailAddresses = new Map<string, string[]>();
  private phoneNumbers = new Map<string, string[]>();
  private dates = new Map<string, string[]>();
  private prices = new Map<string, string[]>();
  private addresses = new Map<string, string[]>();

  private allIssues: ComprehensiveAuditResult["errors"] &
    ComprehensiveAuditResult["warnings"] &
    ComprehensiveAuditResult["notices"] = {
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
    await this.crawlPage(this.baseUrl, 0);

    this.detectDuplicateTitles();
    this.detectDuplicateMetaDescriptions();
    this.detectDuplicateContent();
    this.detectOrphanedPages();

    return this.generateReport();
  }

  private async crawlPage(url: string, depth: number): Promise<void> {
    if (this.visitedUrls.has(url) || this.visitedUrls.size >= this.maxPages)
      return;

    this.visitedUrls.add(url);
    this.urlDepth.set(url, depth);

    try {
      const startTime = Date.now();
      const response = await axios.get(url, {
        timeout: 15000,
        maxRedirects: 5,
        validateStatus: (status) => status < 500,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOAuditBot/1.0)" },
      });

      const loadTime = Date.now() - startTime;
      this.pageLoadTimes.set(url, loadTime);
      this.responseCodes.set(url, response.status);
      this.contentTypes.set(url, response.headers["content-type"] || "");

      if ((response.request as any)._redirectable?._redirectCount > 0) {
        const chain = (response.request as any)._redirectable?._redirects || [];
        this.redirectChains.set(url, chain);
        if (chain.length > 1) {
          this.allIssues.redirectChains.affectedPages.push({
            url,
            details: `Redirect chain: ${chain.join(" → ")}`,
            discovered: new Date().toISOString(),
          });
        }
      }

      if (response.status >= 400 && response.status < 500) {
        this.allIssues.status4xx.affectedPages.push({
          url,
          details: `HTTP ${response.status} Error`,
          discovered: new Date().toISOString(),
        });
        return;
      }

      if (loadTime > 3000) {
        this.allIssues.slowPageSpeed.affectedPages.push({
          url,
          details: `Load time: ${loadTime}ms`,
          discovered: new Date().toISOString(),
        });
      }

      const $ = cheerio.load(response.data);
      await this.analyzePage(url, $ as cheerio.CheerioAPI, depth);
    } catch (error: any) {
      this.brokenLinks.add(url);
      this.allIssues.status4xx.affectedPages.push({
        url,
        details: error.message || "Request failed",
        discovered: new Date().toISOString(),
      });
    }
  }

  private async analyzePage(
    url: string,
    $: cheerio.CheerioAPI,
    depth: number,
  ): Promise<void> {
    const urlObj = new URL(url);
    const baseDomain = `${urlObj.protocol}//${urlObj.hostname}`;

    // 1. TITLE ANALYSIS
    const title = $("title").text().trim();
    if (!title) {
      this.allIssues.missingTitles.affectedPages.push({
        url,
        details: "No title tag",
        discovered: new Date().toISOString(),
      });
    } else {
      this.urlTitles.set(url, title);
      if (title.length > 60) {
        this.allIssues.longTitles.affectedPages.push({
          url,
          details: `Title: ${title.length} chars (optimal: 50-60)`,
          discovered: new Date().toISOString(),
        });
      }
      if (title.length < 30) {
        this.allIssues.longTitles.affectedPages.push({
          url,
          details: `Title too short: ${title.length} chars`,
          discovered: new Date().toISOString(),
        });
      }
    }

    // 2. META TAGS ANALYSIS
    const metaDesc =
      $('meta[name="description"]').attr("content")?.trim() || "";
    const metaKeywords =
      $('meta[name="keywords"]').attr("content")?.trim() || "";
    const metaRobots = $('meta[name="robots"]').attr("content")?.trim() || "";
    const metaViewport =
      $('meta[name="viewport"]').attr("content")?.trim() || "";
    const metaAuthor = $('meta[name="author"]').attr("content")?.trim() || "";
    const metaRefresh =
      $('meta[http-equiv="refresh"]').attr("content")?.trim() || "";

    if (metaDesc) {
      this.urlMetaDesc.set(url, metaDesc);
      if (metaDesc.length < 70) {
        this.allIssues.shortMetaDescriptions.affectedPages.push({
          url,
          details: `Meta description: ${metaDesc.length} chars (optimal: 150-160)`,
          discovered: new Date().toISOString(),
        });
      }
      if (metaDesc.length > 160) {
        this.allIssues.shortMetaDescriptions.affectedPages.push({
          url,
          details: `Meta description too long: ${metaDesc.length} chars`,
          discovered: new Date().toISOString(),
        });
      }
    }

    this.urlMetaKeywords.set(url, metaKeywords);
    this.urlRobotsMeta.set(url, metaRobots);
    this.urlViewport.set(url, metaViewport);
    this.urlRefresh.set(url, metaRefresh);

    // 3. OPEN GRAPH & TWITTER CARDS
    const ogData: Record<string, string> = {};
    $('meta[property^="og:"]').each((_, el) => {
      const prop = $(el).attr("property")?.replace("og:", "") || "";
      const content = $(el).attr("content") || "";
      if (prop && content) ogData[prop] = content;
    });
    this.urlOpenGraph.set(url, ogData);

    const twitterData: Record<string, string> = {};
    $('meta[name^="twitter:"]').each((_, el) => {
      const name = $(el).attr("name")?.replace("twitter:", "") || "";
      const content = $(el).attr("content") || "";
      if (name && content) twitterData[name] = content;
    });
    this.urlTwitterCard.set(url, twitterData);

    // 4. HEADINGS ANALYSIS
    const h1Tags: string[] = [];
    const h2Tags: string[] = [];
    const h3Tags: string[] = [];

    $("h1").each((_, el) => h1Tags.push($(el).text().trim()));
    $("h2").each((_, el) => h2Tags.push($(el).text().trim()));
    $("h3").each((_, el) => h3Tags.push($(el).text().trim()));

    this.urlH1.set(url, h1Tags);
    this.urlH2.set(url, h2Tags);
    this.urlH3.set(url, h3Tags);

    if (h1Tags.length === 0) {
      this.allIssues.missingH1.affectedPages.push({
        url,
        details: "No H1 tag found",
        discovered: new Date().toISOString(),
      });
    } else if (h1Tags.length > 1) {
      this.allIssues.multipleH1Tags.affectedPages.push({
        url,
        details: `${h1Tags.length} H1 tags (optimal: 1)`,
        discovered: new Date().toISOString(),
      });
    }

    // Check heading hierarchy
    const allHeadings: Array<{ level: number; text: string }> = [];
    $("h1,h2,h3,h4,h5,h6").each((_, el) => {
      const tagName = (el as any).tagName;
      const level = parseInt(tagName.replace("h", ""));
      allHeadings.push({ level, text: $(el).text().trim() });
    });

    for (let i = 1; i < allHeadings.length; i++) {
      if (allHeadings[i].level > allHeadings[i - 1].level + 1) {
        this.allIssues.missingH1.affectedPages.push({
          url,
          details: `Heading hierarchy skipped from H${allHeadings[i - 1].level} to H${allHeadings[i].level}`,
          discovered: new Date().toISOString(),
        });
        break;
      }
    }

    // 5. CANONICAL & BASE
    const canonical = $('link[rel="canonical"]').attr("href") || "";
    const base = $("base").attr("href") || "";
    this.urlCanonical.set(url, canonical);
    this.urlBase.set(url, base);

    // 6. LANGUAGE & CHARSET
    const htmlLang = $("html").attr("lang") || "";
    const charset =
      $("meta[charset]").attr("charset") ||
      $('meta[http-equiv="Content-Type"]')
        .attr("content")
        ?.match(/charset=([^;]+)/)?.[1] ||
      "";
    this.urlLang.set(url, htmlLang);
    this.urlCharset.set(url, charset);

    // 7. STRUCTURED DATA (Schema.org)
    const schemas: any[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || "{}");
        schemas.push(json);
      } catch (e) {}
    });
    this.urlSchemaOrg.set(url, schemas);

    // 8. CONTENT ANALYSIS
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const sentences = bodyText
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 10);
    const paragraphs = $("p").length;
    const lists = $("ul, ol").length;
    const tables = $("table").length;
    const forms = $("form").length;
    const buttons = $(
      "button, input[type='submit'], input[type='button']",
    ).length;
    const inputs = $("input, textarea, select").length;

    const wordCount = bodyText.split(/\s+/).filter((w) => w.length > 0).length;

    this.urlContent.set(url, bodyText.substring(0, 1000));
    this.pageWordCounts.set(url, wordCount);
    this.pageSentenceCounts.set(url, sentences.length);
    this.pageParagraphCounts.set(url, paragraphs);
    this.pageListCounts.set(url, lists);
    this.pageTableCounts.set(url, tables);
    this.pageFormCounts.set(url, forms);
    this.pageButtonCounts.set(url, buttons);
    this.pageInputCounts.set(url, inputs);

    if (wordCount < 300) {
      this.allIssues.lowWordCount.affectedPages.push({
        url,
        details: `Word count: ${wordCount} (optimal: 300+)`,
        discovered: new Date().toISOString(),
      });
    }

    // 9. TEXT-TO-HTML RATIO
    const htmlSize = $.html().length;
    const textRatio = (bodyText.length / htmlSize) * 100;
    if (textRatio < 10) {
      this.allIssues.lowTextHtmlRatio.affectedPages.push({
        url,
        details: `Text/HTML ratio: ${textRatio.toFixed(2)}% (optimal: >10%)`,
        discovered: new Date().toISOString(),
      });
    }

    // 10. READABILITY METRICS
    const avgWordsPerSentence = wordCount / Math.max(sentences.length, 1);
    const avgSentencesPerParagraph = sentences.length / Math.max(paragraphs, 1);

    if (avgWordsPerSentence > 25) {
      this.allIssues.lowWordCount.affectedPages.push({
        url,
        details: `Long sentences: ${avgWordsPerSentence.toFixed(1)} words/sentence (optimal: <20)`,
        discovered: new Date().toISOString(),
      });
    }

    // 11. IMAGE ANALYSIS
    const images: Array<{
      src: string;
      alt: string;
      width?: string;
      height?: string;
    }> = [];
    let missingAltCount = 0;
    const imgFormats: Record<string, number> = {
      jpg: 0,
      png: 0,
      gif: 0,
      svg: 0,
      webp: 0,
      avif: 0,
    };

    $("img").each((_, el) => {
      const src = $(el).attr("src") || "";
      const alt = $(el).attr("alt") || "";
      const width = $(el).attr("width");
      const height = $(el).attr("height");

      if (src) {
        images.push({ src, alt, width, height });
        if (!alt) missingAltCount++;

        const ext = src.split(".").pop()?.toLowerCase().split("?")[0];
        if (ext && imgFormats.hasOwnProperty(ext)) imgFormats[ext]++;

        if (!width || !height) {
          this.allIssues.brokenImages.affectedPages.push({
            url,
            details: `Image missing dimensions: ${src.substring(0, 50)}`,
            discovered: new Date().toISOString(),
          });
        }
      }
    });

    this.images.set(url, images);
    this.imageFormats.set(url, imgFormats);

    if (missingAltCount > 0) {
      this.allIssues.brokenImages.affectedPages.push({
        url,
        details: `${missingAltCount} images missing alt text`,
        discovered: new Date().toISOString(),
      });
    }

    // 12. VIDEO & IFRAME ANALYSIS
    const videos: string[] = [];
    $("video, iframe[src*='youtube'], iframe[src*='vimeo']").each((_, el) => {
      videos.push($(el).attr("src") || $(el).find("source").attr("src") || "");
    });
    this.videos.set(url, videos.filter(Boolean));

    const iframes: string[] = [];
    $("iframe").each((_, el) => iframes.push($(el).attr("src") || ""));
    this.iframes.set(url, iframes.filter(Boolean));

    // 13. SCRIPT & STYLESHEET ANALYSIS
    const scripts: string[] = [];
    $("script[src]").each((_, el) => scripts.push($(el).attr("src") || ""));
    this.scripts.set(url, scripts.filter(Boolean));

    const stylesheets: string[] = [];
    $('link[rel="stylesheet"]').each((_, el) =>
      stylesheets.push($(el).attr("href") || ""),
    );
    this.stylesheets.set(url, stylesheets.filter(Boolean));

    const fonts: string[] = [];
    $('link[rel="preload"][as="font"], link[href*="font"]').each((_, el) => {
      fonts.push($(el).attr("href") || "");
    });
    this.fonts.set(url, fonts.filter(Boolean));

    // 14. LINK ANALYSIS
    const internalLinks: string[] = [];
    const externalLinks: string[] = [];
    const anchors: string[] = [];
    let noAnchorCount = 0;

    const linkRels: Record<string, string[]> = {
      nofollow: [],
      sponsored: [],
      ugc: [],
      alternate: [],
      prev: [],
      next: [],
    };

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      const text = $(el).text().trim();
      const rel = $(el).attr("rel") || "";

      if (!text) noAnchorCount++;
      else anchors.push(text);

      if (rel) {
        Object.keys(linkRels).forEach((r) => {
          if (rel.includes(r)) linkRels[r].push(href);
        });
      }

      try {
        let fullUrl = href;
        if (href.startsWith("/")) fullUrl = baseDomain + href;
        else if (!href.startsWith("http")) fullUrl = new URL(href, url).href;

        const linkUrl = new URL(fullUrl);
        if (linkUrl.hostname === urlObj.hostname) {
          internalLinks.push(fullUrl);
        } else {
          externalLinks.push(fullUrl);
        }

        if (url.startsWith("https://") && fullUrl.startsWith("http://")) {
          this.allIssues.httpToHttpsLinks.affectedPages.push({
            url,
            details: `Insecure link: ${fullUrl.substring(0, 50)}`,
            discovered: new Date().toISOString(),
          });
        }
      } catch (e) {}
    });

    this.internalLinks.set(url, internalLinks);
    this.externalLinks.set(url, externalLinks);
    this.anchorTexts.set(url, anchors);
    this.linkRelations.set(url, linkRels);

    const totalLinks = internalLinks.length + externalLinks.length;
    if (totalLinks > 100) {
      this.allIssues.tooManyLinks.affectedPages.push({
        url,
        details: `${totalLinks} links (optimal: <100)`,
        discovered: new Date().toISOString(),
      });
    }

    if (noAnchorCount > 0) {
      this.allIssues.linksWithNoAnchor.affectedPages.push({
        url,
        details: `${noAnchorCount} links without anchor text`,
        discovered: new Date().toISOString(),
      });
    }

    if (internalLinks.length === 1) {
      this.allIssues.singleInternalLink.affectedPages.push({
        url,
        details: "Only 1 internal link",
        discovered: new Date().toISOString(),
      });
    }

    // 15. SOCIAL MEDIA LINKS
    const socialLinks: string[] = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      if (
        /(facebook|twitter|instagram|linkedin|youtube|tiktok|pinterest)\.com/i.test(
          href,
        )
      ) {
        socialLinks.push(href);
      }
    });
    this.socialLinks.set(url, socialLinks);

    // 16. CONTACT INFO EXTRACTION
    const emails: string[] = [];
    const phones: string[] = [];

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex =
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

    const emailMatches = bodyText.match(emailRegex);
    const phoneMatches = bodyText.match(phoneRegex);

    if (emailMatches) emails.push(...emailMatches);
    if (phoneMatches) phones.push(...phoneMatches);

    this.emailAddresses.set(url, [...new Set(emails)]);
    this.phoneNumbers.set(url, [...new Set(phones)]);

    // 17. BREADCRUMB ANALYSIS
    const breadcrumbs: string[] = [];
    $(
      '[itemtype*="BreadcrumbList"] [itemprop="name"], .breadcrumb a, nav[aria-label="breadcrumb"] a',
    ).each((_, el) => {
      breadcrumbs.push($(el).text().trim());
    });
    this.breadcrumbs.set(url, breadcrumbs);

    // 18. CODE BLOCKS
    const codeBlockCount = $("pre, code").length;
    this.codeBlocks.set(url, codeBlockCount);

    // 19. DEPTH ANALYSIS
    if (depth > 3) {
      this.allIssues.deepPages.affectedPages.push({
        url,
        details: `Depth: ${depth} clicks from homepage`,
        discovered: new Date().toISOString(),
      });
    }

    // 20. CRAWL CHILD PAGES
    const uniqueLinks = [...new Set(internalLinks)]
      .filter((link) => !link.includes("#"))
      .filter((link) => !this.isNonHtmlFile(link))
      .slice(0, 15);

    for (const childUrl of uniqueLinks) {
      if (this.visitedUrls.size < this.maxPages) {
        await this.crawlPage(childUrl, depth + 1);
      }
    }
  }

  private detectDuplicateTitles(): void {
    const titleMap = new Map<string, string[]>();
    this.urlTitles.forEach((title, url) => {
      if (!titleMap.has(title)) titleMap.set(title, []);
      titleMap.get(title)!.push(url);
    });
    titleMap.forEach((urls, title) => {
      if (urls.length > 1) {
        urls.forEach((url) => {
          this.allIssues.duplicateTitles.affectedPages.push({
            url,
            details: `Duplicate: "${title}" (on ${urls.length} pages)`,
            discovered: new Date().toISOString(),
          });
        });
      }
    });
  }

  private detectDuplicateMetaDescriptions(): void {
    const descMap = new Map<string, string[]>();
    this.urlMetaDesc.forEach((desc, url) => {
      if (!descMap.has(desc)) descMap.set(desc, []);
      descMap.get(desc)!.push(url);
    });
    descMap.forEach((urls) => {
      if (urls.length > 1) {
        urls.forEach((url) => {
          this.allIssues.duplicateMetaDescriptions.affectedPages.push({
            url,
            details: `Duplicate (on ${urls.length} pages)`,
            discovered: new Date().toISOString(),
          });
        });
      }
    });
  }

  private detectDuplicateContent(): void {
    const contentMap = new Map<string, string[]>();
    this.urlContent.forEach((content, url) => {
      const signature = content.substring(0, 300);
      if (!contentMap.has(signature)) contentMap.set(signature, []);
      contentMap.get(signature)!.push(url);
    });
    contentMap.forEach((urls) => {
      if (urls.length > 1) {
        urls.forEach((url) => {
          this.allIssues.duplicateContent.affectedPages.push({
            url,
            details: `Similar content (${urls.length} pages)`,
            discovered: new Date().toISOString(),
          });
        });
      }
    });
  }

  private detectOrphanedPages(): void {
    const linkedPages = new Set<string>();
    this.internalLinks.forEach((links) =>
      links.forEach((link) => linkedPages.add(link)),
    );
    this.visitedUrls.forEach((url) => {
      if (!linkedPages.has(url) && url !== this.baseUrl) {
        this.allIssues.orphanedPages.affectedPages.push({
          url,
          details: "No incoming internal links",
          discovered: new Date().toISOString(),
        });
      }
    });
  }

  private isNonHtmlFile(url: string): boolean {
    const exts = [
      ".pdf",
      ".jpg",
      ".png",
      ".gif",
      ".svg",
      ".css",
      ".js",
      ".xml",
      ".json",
      ".zip",
      ".mp4",
      ".mp3",
    ];
    return exts.some((ext) => url.toLowerCase().includes(ext));
  }

  private generateReport(): ComprehensiveAuditResult {
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

    const healthScore = Math.max(
      0,
      100 - errorCount * 10 - warningCount * 2 - noticeCount * 0.5,
    );

    const topIssues = Object.values(this.allIssues)
      .filter((i) => i.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 15)
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
      technicalDetails: {} as any,
      aiInsights: {} as any,
    };
  }
}
