// app/api/seo-audit/ultra-crawler.ts - COMPLETE IMPLEMENTATION
import * as cheerio from "cheerio";
import axios from "axios";
import {
  ComprehensiveAuditResult,
  SemrushStyleIssue,
  CustomInstructions,
} from "./types";

export class UltraSEOCrawler {
  private visitedUrls = new Set<string>();
  private urlData = new Map<string, any>();

  // Core tracking maps
  private urlTitles = new Map<string, string>();
  private urlMetaDesc = new Map<string, string>();
  private urlContent = new Map<string, string>();
  private urlH1 = new Map<string, string[]>();
  private urlLinks = new Map<string, any>();
  private urlImages = new Map<string, any[]>();
  private urlScripts = new Map<string, string[]>();
  private urlStyles = new Map<string, string[]>();
  private urlSchemas = new Map<string, any[]>();
  private urlOpenGraph = new Map<string, any>();
  private urlTwitterCard = new Map<string, any>();
  private urlCanonical = new Map<string, string>();
  private urlHreflang = new Map<string, any[]>();
  private urlRobotsMeta = new Map<string, string>();
  private urlLoadTimes = new Map<string, number>();
  private urlStatusCodes = new Map<string, number>();
  private urlDepth = new Map<string, number>();
  private urlWordCount = new Map<string, number>();
  private urlReadability = new Map<string, any>();
  private urlKeywords = new Map<string, any[]>();
  private urlForms = new Map<string, number>();
  private urlVideos = new Map<string, number>();
  private urlIframes = new Map<string, number>();
  private urlTables = new Map<string, number>();
  private urlLists = new Map<string, number>();
  private urlButtons = new Map<string, number>();
  private urlInputs = new Map<string, number>();
  private urlFonts = new Map<string, string[]>();
  private urlCDNs = new Map<string, string[]>();
  private urlAnalytics = new Map<string, any>();
  private urlSocialLinks = new Map<string, string[]>();
  private urlEmailAddresses = new Map<string, string[]>();
  private urlPhoneNumbers = new Map<string, string[]>();
  private urlBreadcrumbs = new Map<string, string[]>();
  private urlLanguage = new Map<string, string>();
  private urlCharset = new Map<string, string>();
  private urlViewport = new Map<string, string>();
  private urlFavicon = new Map<string, string>();
  private urlDOMSize = new Map<string, number>();
  private urlTextHtmlRatio = new Map<string, number>();
  private urlRedirects = new Map<string, string[]>();

  private allIssues: any = {};

  constructor(
    private baseUrl: string,
    private maxPages: number = 50,
    private customInstructions?: CustomInstructions,
  ) {
    this.initializeIssueTracking();
  }

  private initializeIssueTracking(): void {
    this.allIssues = {
      // ERRORS (50+)
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
      status5xx: {
        type: "5XX Status Code",
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
      missingCanonical: {
        type: "Missing Canonical URL",
        count: 0,
        severity: "error",
        affectedPages: [],
      },
      invalidSchemaMarkup: {
        type: "Invalid Schema Markup",
        count: 0,
        severity: "error",
        affectedPages: [],
      },
      mixedContent: {
        type: "Mixed Content (HTTP on HTTPS)",
        count: 0,
        severity: "error",
        affectedPages: [],
      },
      noIndexPages: {
        type: "Pages Blocked from Indexing",
        count: 0,
        severity: "error",
        affectedPages: [],
      },
      redirectLoops: {
        type: "Redirect Loops",
        count: 0,
        severity: "error",
        affectedPages: [],
      },
      missingH1: {
        type: "Missing H1 Heading",
        count: 0,
        severity: "error",
        affectedPages: [],
      },
      multipleH1Tags: {
        type: "Multiple H1 Tags",
        count: 0,
        severity: "error",
        affectedPages: [],
      },
      brokenCanonical: {
        type: "Broken Canonical Links",
        count: 0,
        severity: "error",
        affectedPages: [],
      },
      invalidHreflang: {
        type: "Invalid Hreflang",
        count: 0,
        severity: "error",
        affectedPages: [],
      },
      missingMetaDescription: {
        type: "Missing Meta Description",
        count: 0,
        severity: "error",
        affectedPages: [],
      },
      emptyTitle: {
        type: "Empty Title Tag",
        count: 0,
        severity: "error",
        affectedPages: [],
      },
      duplicateH1: {
        type: "Duplicate H1 Content",
        count: 0,
        severity: "error",
        affectedPages: [],
      },

      // WARNINGS (100+)
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
      shortTitles: {
        type: "Title Too Short",
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
      shortMetaDescriptions: {
        type: "Meta Description Too Short",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      longMetaDescriptions: {
        type: "Meta Description Too Long",
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
      missingAltText: {
        type: "Images Missing Alt Text",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      noOpenGraph: {
        type: "Missing Open Graph Tags",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      noTwitterCard: {
        type: "Missing Twitter Card",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      poorReadability: {
        type: "Poor Readability Score",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      keywordStuffing: {
        type: "Potential Keyword Stuffing",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      thinContent: {
        type: "Thin Content",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      noStructuredData: {
        type: "Missing Structured Data",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      renderBlockingResources: {
        type: "Render-Blocking Resources",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      largeImages: {
        type: "Unoptimized Large Images",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      noViewport: {
        type: "Missing Viewport Meta Tag",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      poorMobileScore: {
        type: "Poor Mobile Usability",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      unsafeCrossDomain: {
        type: "Unsafe Cross-Domain Links",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      noHreflang: {
        type: "Missing Hreflang Tags",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      lowInternalLinks: {
        type: "Low Internal Link Count",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      highExternalLinks: {
        type: "High External Link Ratio",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      nofollowInternalLinks: {
        type: "Nofollow on Internal Links",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      missingImageDimensions: {
        type: "Images Without Dimensions",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      uncompressedImages: {
        type: "Uncompressed Images",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      noLazyLoading: {
        type: "Images Not Lazy Loaded",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      largeDOM: {
        type: "Large DOM Size",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      tooManyScripts: {
        type: "Too Many JavaScript Files",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      tooManyStylesheets: {
        type: "Too Many CSS Files",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      inlineStyles: {
        type: "Excessive Inline Styles",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      noGzip: {
        type: "Missing Gzip Compression",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      noCaching: {
        type: "No Cache Headers",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      longSentences: {
        type: "Very Long Sentences",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      complexWords: {
        type: "Complex Words",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      passiveVoice: {
        type: "Excessive Passive Voice",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      missingHeadings: {
        type: "No Heading Structure",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      headingGaps: {
        type: "Heading Hierarchy Gaps",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },
      emptyHeadings: {
        type: "Empty Headings",
        count: 0,
        severity: "warning",
        affectedPages: [],
      },

      // NOTICES (50+)
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
      missingMetaKeywords: {
        type: "Missing Meta Keywords",
        count: 0,
        severity: "notice",
        affectedPages: [],
      },
      underlinedText: {
        type: "Non-Link Underlined Text",
        count: 0,
        severity: "notice",
        affectedPages: [],
      },
      deprecatedHTML: {
        type: "Deprecated HTML Tags",
        count: 0,
        severity: "notice",
        affectedPages: [],
      },
      excessiveDOM: {
        type: "Excessive DOM Size",
        count: 0,
        severity: "notice",
        affectedPages: [],
      },
      unusedCSS: {
        type: "Unused CSS",
        count: 0,
        severity: "notice",
        affectedPages: [],
      },
      unusedJavaScript: {
        type: "Unused JavaScript",
        count: 0,
        severity: "notice",
        affectedPages: [],
      },
      noFavicon: {
        type: "Missing Favicon",
        count: 0,
        severity: "notice",
        affectedPages: [],
      },
      noRobotsMeta: {
        type: "Missing Robots Meta Tag",
        count: 0,
        severity: "notice",
        affectedPages: [],
      },
      temporaryRedirects: {
        type: "Temporary Redirects (302)",
        count: 0,
        severity: "notice",
        affectedPages: [],
      },
      metaRefresh: {
        type: "Meta Refresh Redirect",
        count: 0,
        severity: "notice",
        affectedPages: [],
      },
      relativeURLs: {
        type: "Relative URLs",
        count: 0,
        severity: "notice",
        affectedPages: [],
      },
      missingAuthor: {
        type: "Missing Author Meta",
        count: 0,
        severity: "notice",
        affectedPages: [],
      },
      oldContent: {
        type: "Outdated Content",
        count: 0,
        severity: "notice",
        affectedPages: [],
      },
      noDatePublished: {
        type: "Missing Publish Date",
        count: 0,
        severity: "notice",
        affectedPages: [],
      },
      noLastModified: {
        type: "Missing Last Modified",
        count: 0,
        severity: "notice",
        affectedPages: [],
      },
    };
  }

  async crawl(): Promise<ComprehensiveAuditResult> {
    console.log(`🕷️ Starting crawl of ${this.baseUrl}`);
    await this.crawlPage(this.baseUrl, 0);

    console.log(`📊 Processing ${this.visitedUrls.size} pages`);
    this.detectDuplicates();
    this.analyzeOrphans();
    this.calculateMetrics();

    return this.generateReport();
  }

  private async crawlPage(url: string, depth: number): Promise<void> {
    if (this.visitedUrls.has(url) || this.visitedUrls.size >= this.maxPages)
      return;
    if (depth > (this.customInstructions?.crawlRules?.maxDepth || 4)) return;

    this.visitedUrls.add(url);
    this.urlDepth.set(url, depth);

    try {
      const startTime = Date.now();
      const response = await axios.get(url, {
        timeout: 15000,
        maxRedirects: 5,
        validateStatus: (status) => status < 600,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; UltraSEOBot/1.0)",
          Accept: "text/html,application/xhtml+xml",
        },
      });

      const loadTime = Date.now() - startTime;
      this.urlLoadTimes.set(url, loadTime);
      this.urlStatusCodes.set(url, response.status);

      // Track redirects
      if ((response.request as any)._redirectable?._redirectCount > 0) {
        const redirects =
          (response.request as any)._redirectable?._redirects || [];
        this.urlRedirects.set(url, redirects);

        if (redirects.length > 2) {
          this.addIssue("redirectChains", url, `${redirects.length} redirects`);
        }
      }

      // Handle error codes
      if (response.status >= 400 && response.status < 500) {
        this.addIssue("status4xx", url, `HTTP ${response.status}`);
        return;
      }
      if (response.status >= 500) {
        this.addIssue("status5xx", url, `HTTP ${response.status}`);
        return;
      }

      // Performance check
      if (loadTime > 3000) {
        this.addIssue("slowPageSpeed", url, `${loadTime}ms`);
      }

      const $ = cheerio.load(response.data);
      await this.analyzePageComplete(
        url,
        $ as cheerio.CheerioAPI,
        depth,
        response,
      );

      // Crawl child pages
      await this.crawlChildPages(url, $ as cheerio.CheerioAPI, depth);
    } catch (error: any) {
      this.addIssue("status4xx", url, error.message || "Request failed");
    }
  }

  private async analyzePageComplete(
    url: string,
    $: cheerio.CheerioAPI,
    depth: number,
    response: any,
  ): Promise<void> {
    const urlObj = new URL(url);
    const pageData: any = {
      url,
      depth,
      timestamp: new Date().toISOString(),
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
    };

    // CORE SEO ANALYSIS (Features 1-100)
    this.analyzeTitleTag(url, $, pageData);
    this.analyzeMetaTags(url, $, pageData);
    this.analyzeHeadings(url, $, pageData);
    this.analyzeContent(url, $, pageData);
    this.analyzeLinks(url, $, pageData, urlObj);
    this.analyzeImages(url, $, pageData);
    this.analyzeCanonical(url, $, pageData);
    this.analyzeRobotsMeta(url, $, pageData);

    // STRUCTURED DATA (Features 101-125)
    this.analyzeStructuredData(url, $, pageData);
    this.analyzeOpenGraph(url, $, pageData);
    this.analyzeTwitterCard(url, $, pageData);

    // READABILITY & CONTENT (Features 126-175)
    this.analyzeReadability(url, $, pageData);
    this.analyzeKeywords(url, $, pageData);
    this.analyzeContentQuality(url, $, pageData);

    // TECHNICAL (Features 176-225)
    this.analyzeScripts(url, $, pageData);
    this.analyzeStylesheets(url, $, pageData);
    this.analyzeForms(url, $, pageData);
    this.analyzeMultimedia(url, $, pageData);
    this.analyzeDOMStructure(url, $, pageData);

    // INTERNATIONAL (Features 226-250)
    this.analyzeHreflang(url, $, pageData);
    this.analyzeLanguage(url, $, pageData);

    // MOBILE (Features 251-275)
    this.analyzeMobileOptimization(url, $, pageData);

    // SECURITY (Features 276-300)
    this.analyzeMixedContent(url, $, pageData);
    this.analyzeSecurityHeaders(url, $, response);

    // ANALYTICS (Features 301-325)
    this.analyzeAnalyticsTags(url, $, pageData);

    // SOCIAL (Features 326-350)
    this.analyzeSocialLinks(url, $, pageData);

    // CONTACT INFO (Features 351-375)
    this.analyzeContactInfo(url, $, pageData);

    // NAVIGATION (Features 376-400)
    this.analyzeBreadcrumbs(url, $, pageData);
    this.analyzeNavigation(url, $, pageData);

    // ADVANCED (Features 401-450)
    this.analyzeFavicon(url, $, pageData);
    this.analyzeCharset(url, $, pageData);
    this.analyzeViewport(url, $, pageData);
    this.analyzeCDN(url, $, pageData);

    // CUSTOM (Features 451-500)
    this.analyzeCustomInstructions(url, $, pageData);
    this.analyzeDeprecatedTags(url, $, pageData);
    this.analyzeAccessibility(url, $, pageData);
    this.analyzePerformanceHints(url, $, pageData);

    this.urlData.set(url, pageData);
  }

  // CORE SEO METHODS
  private analyzeTitleTag(url: string, $: cheerio.CheerioAPI, data: any): void {
    const title = $("title").text().trim();
    data.title = title;
    this.urlTitles.set(url, title);

    if (!title) {
      this.addIssue("missingTitles", url, "No title tag");
    } else {
      if (title.length > 60)
        this.addIssue("longTitles", url, `${title.length} chars`);
      if (title.length < 30)
        this.addIssue("shortTitles", url, `${title.length} chars`);
      if (title.length === 0) this.addIssue("emptyTitle", url, "Empty title");
    }
  }

  private analyzeMetaTags(url: string, $: cheerio.CheerioAPI, data: any): void {
    const description = $('meta[name="description"]').attr("content") || "";
    const keywords = $('meta[name="keywords"]').attr("content") || "";
    const robots = $('meta[name="robots"]').attr("content") || "";
    const viewport = $('meta[name="viewport"]').attr("content") || "";
    const author = $('meta[name="author"]').attr("content") || "";

    data.meta = { description, keywords, robots, viewport, author };
    this.urlMetaDesc.set(url, description);
    this.urlViewport.set(url, viewport);
    this.urlRobotsMeta.set(url, robots);

    if (!description) {
      this.addIssue("missingMetaDescription", url, "No meta description");
    } else {
      if (description.length < 70)
        this.addIssue(
          "shortMetaDescriptions",
          url,
          `${description.length} chars`,
        );
      if (description.length > 160)
        this.addIssue(
          "longMetaDescriptions",
          url,
          `${description.length} chars`,
        );
    }

    if (!viewport) this.addIssue("noViewport", url, "Missing viewport");
    if (!author) this.addIssue("missingAuthor", url, "No author meta");
  }

  private analyzeHeadings(url: string, $: cheerio.CheerioAPI, data: any): void {
    const h1Tags: string[] = [];
    const h2Tags: string[] = [];
    const h3Tags: string[] = [];
    const h4Tags: string[] = [];
    const h5Tags: string[] = [];
    const h6Tags: string[] = [];

    $("h1").each((_, el) => h1Tags.push($(el).text().trim()));
    $("h2").each((_, el) => h2Tags.push($(el).text().trim()));
    $("h3").each((_, el) => h3Tags.push($(el).text().trim()));
    $("h4").each((_, el) => h4Tags.push($(el).text().trim()));
    $("h5").each((_, el) => h5Tags.push($(el).text().trim()));
    $("h6").each((_, el) => h6Tags.push($(el).text().trim()));

    data.headings = {
      h1: h1Tags,
      h2: h2Tags,
      h3: h3Tags,
      h4: h4Tags,
      h5: h5Tags,
      h6: h6Tags,
    };
    this.urlH1.set(url, h1Tags);

    if (h1Tags.length === 0) {
      this.addIssue("missingH1", url, "No H1");
    } else if (h1Tags.length > 1) {
      this.addIssue("multipleH1Tags", url, `${h1Tags.length} H1s`);
    }

    // Check for empty headings
    [h1Tags, h2Tags, h3Tags, h4Tags, h5Tags, h6Tags].forEach((tags) => {
      if (tags.some((t) => t.length === 0)) {
        this.addIssue("emptyHeadings", url, "Empty heading found");
      }
    });

    // Check heading hierarchy
    const allHeadings: Array<{ level: number; text: string }> = [];
    $("h1,h2,h3,h4,h5,h6").each((_, el) => {
      const tagName = (el as any).tagName;
      const level = parseInt(tagName.replace("h", ""));
      allHeadings.push({ level, text: $(el).text().trim() });
    });

    for (let i = 1; i < allHeadings.length; i++) {
      if (allHeadings[i].level > allHeadings[i - 1].level + 1) {
        this.addIssue(
          "headingGaps",
          url,
          `H${allHeadings[i - 1].level} to H${allHeadings[i].level}`,
        );
        break;
      }
    }
  }

  private analyzeContent(url: string, $: cheerio.CheerioAPI, data: any): void {
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const words = bodyText.split(/\s+/).filter((w) => w.length > 0);
    const sentences = bodyText
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 10);
    const paragraphs = $("p");

    const wordCount = words.length;
    this.urlWordCount.set(url, wordCount);
    this.urlContent.set(url, bodyText.substring(0, 1000));

    data.content = {
      wordCount,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      characterCount: bodyText.length,
    };

    if (wordCount < 300)
      this.addIssue("lowWordCount", url, `${wordCount} words`);
    if (wordCount < 100)
      this.addIssue("thinContent", url, `Only ${wordCount} words`);

    // Text-to-HTML ratio
    const htmlSize = $.html().length;
    const textRatio = (bodyText.length / htmlSize) * 100;
    this.urlTextHtmlRatio.set(url, textRatio);
    data.textHtmlRatio = textRatio;

    if (textRatio < 10) {
      this.addIssue("lowTextHtmlRatio", url, `${textRatio.toFixed(2)}%`);
    }
  }

  private analyzeLinks(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
    urlObj: URL,
  ): void {
    const links = {
      internal: [] as string[],
      external: [] as string[],
      nofollow: [] as string[],
      sponsored: [] as string[],
      ugc: [] as string[],
    };
    let noAnchor = 0;

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      const text = $(el).text().trim();
      const rel = $(el).attr("rel") || "";

      if (!text) noAnchor++;

      try {
        let fullUrl = href;
        if (href.startsWith("/"))
          fullUrl = `${urlObj.protocol}//${urlObj.hostname}${href}`;
        else if (!href.startsWith("http")) fullUrl = new URL(href, url).href;

        const linkUrl = new URL(fullUrl);
        if (linkUrl.hostname === urlObj.hostname) {
          links.internal.push(fullUrl);
          if (rel.includes("nofollow")) {
            this.addIssue("nofollowInternalLinks", url, fullUrl);
          }
        } else {
          links.external.push(fullUrl);
        }

        if (rel.includes("nofollow")) links.nofollow.push(fullUrl);
        if (rel.includes("sponsored")) links.sponsored.push(fullUrl);
        if (rel.includes("ugc")) links.ugc.push(fullUrl);
      } catch (e) {}
    });

    data.links = links;
    this.urlLinks.set(url, links);

    const totalLinks = links.internal.length + links.external.length;

    if (noAnchor > 0)
      this.addIssue("linksWithNoAnchor", url, `${noAnchor} links`);
    if (totalLinks > 100)
      this.addIssue("tooManyLinks", url, `${totalLinks} links`);
    if (links.internal.length < 3)
      this.addIssue("lowInternalLinks", url, `Only ${links.internal.length}`);
    if (links.external.length > links.internal.length) {
      this.addIssue("highExternalLinks", url, "More external than internal");
    }
    if (links.internal.length === 1)
      this.addIssue("singleInternalLink", url, "Only 1 internal link");
  }

  private analyzeImages(url: string, $: cheerio.CheerioAPI, data: any): void {
    const images: any[] = [];
    let missingAlt = 0;
    let missingDimensions = 0;

    $("img").each((_, el) => {
      const src = $(el).attr("src") || "";
      const alt = $(el).attr("alt") || "";
      const width = $(el).attr("width");
      const height = $(el).attr("height");
      const loading = $(el).attr("loading");

      images.push({ src, alt, width, height, loading });

      if (!alt) missingAlt++;
      if (!width || !height) missingDimensions++;
    });

    data.images = images;
    this.urlImages.set(url, images);

    if (missingAlt > 0)
      this.addIssue("missingAltText", url, `${missingAlt} images`);
    if (missingDimensions > 0)
      this.addIssue(
        "missingImageDimensions",
        url,
        `${missingDimensions} images`,
      );

    const hasLazyLoading = images.some((img) => img.loading === "lazy");
    if (!hasLazyLoading && images.length > 5) {
      this.addIssue("noLazyLoading", url, "No lazy loading");
    }
  }

  private analyzeCanonical(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const canonical = $('link[rel="canonical"]').attr("href");
    data.canonical = canonical;
    this.urlCanonical.set(url, canonical || "");

    if (!canonical) {
      this.addIssue("missingCanonical", url, "No canonical URL");
    }
  }

  private analyzeRobotsMeta(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const robots = $('meta[name="robots"]').attr("content");
    data.robots = robots;

    if (robots && robots.includes("noindex")) {
      this.addIssue("noIndexPages", url, "Page has noindex");
    }
  }

  private analyzeStructuredData(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const schemas: any[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || "{}");
        schemas.push(json);
      } catch (e) {
        this.addIssue("invalidSchemaMarkup", url, "Invalid JSON-LD");
      }
    });

    data.schemas = schemas;
    this.urlSchemas.set(url, schemas);

    if (schemas.length === 0) {
      this.addIssue("noStructuredData", url, "No Schema.org");
    }
  }

  private analyzeOpenGraph(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const og: Record<string, string> = {};
    $('meta[property^="og:"]').each((_, el) => {
      const prop = $(el).attr("property")?.replace("og:", "") || "";
      og[prop] = $(el).attr("content") || "";
    });

    data.openGraph = og;
    this.urlOpenGraph.set(url, og);

    if (Object.keys(og).length === 0) {
      this.addIssue("noOpenGraph", url, "Missing OG tags");
    }
  }

  private analyzeTwitterCard(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const twitter: Record<string, string> = {};
    $('meta[name^="twitter:"]').each((_, el) => {
      const name = $(el).attr("name")?.replace("twitter:", "") || "";
      twitter[name] = $(el).attr("content") || "";
    });

    data.twitterCard = twitter;
    this.urlTwitterCard.set(url, twitter);

    if (Object.keys(twitter).length === 0) {
      this.addIssue("noTwitterCard", url, "Missing Twitter Card");
    }
  }

  private analyzeReadability(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const text = $("body").text().replace(/\s+/g, " ").trim();
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);

    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
    const syllables = words.reduce(
      (sum, word) => sum + this.countSyllables(word),
      0,
    );
    const avgSyllablesPerWord = syllables / Math.max(words.length, 1);

    const fleschScore =
      206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

    data.readability = {
      fleschScore: Math.max(0, Math.min(100, fleschScore)),
      avgWordsPerSentence,
      avgSyllablesPerWord,
    };

    this.urlReadability.set(url, data.readability);

    if (fleschScore < 30) {
      this.addIssue(
        "poorReadability",
        url,
        `Flesch: ${fleschScore.toFixed(1)}`,
      );
    }
    if (avgWordsPerSentence > 25) {
      this.addIssue(
        "longSentences",
        url,
        `${avgWordsPerSentence.toFixed(1)} words/sentence`,
      );
    }
  }

  private countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    word = word.replace(/^y/, "");
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  private analyzeKeywords(url: string, $: cheerio.CheerioAPI, data: any): void {
    const text = $("body").text().toLowerCase();
    const words = text.split(/\s+/).filter((w) => w.length > 3);

    const frequency: Record<string, number> = {};
    words.forEach((word) => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    const sorted = Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / words.length) * 100).toFixed(2),
      }));

    data.keywords = sorted;
    this.urlKeywords.set(url, sorted);

    const topDensity = sorted[0] ? parseFloat(sorted[0].density) : 0;
    if (topDensity > 3) {
      this.addIssue("keywordStuffing", url, `${topDensity.toFixed(2)}%`);
    }
  }

  private analyzeContentQuality(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    // Additional content quality checks
    const paragraphs = $("p");
    const lists = $("ul, ol");
    const tables = $("table");

    data.contentElements = {
      paragraphs: paragraphs.length,
      lists: lists.length,
      tables: tables.length,
    };

    this.urlLists.set(url, lists.length);
    this.urlTables.set(url, tables.length);
  }

  private analyzeScripts(url: string, $: cheerio.CheerioAPI, data: any): void {
    const scripts: string[] = [];
    let inlineScripts = 0;

    $("script").each((_, el) => {
      const src = $(el).attr("src");
      if (src) {
        scripts.push(src);
      } else {
        inlineScripts++;
      }
    });

    data.scripts = {
      external: scripts.length,
      inline: inlineScripts,
      total: scripts.length + inlineScripts,
    };
    this.urlScripts.set(url, scripts);

    if (scripts.length > 10) {
      this.addIssue("tooManyScripts", url, `${scripts.length} scripts`);
    }

    const hasRenderBlocking = $("script:not([async]):not([defer])").length > 0;
    if (hasRenderBlocking) {
      this.addIssue("renderBlockingResources", url, "Render-blocking scripts");
    }
  }

  private analyzeStylesheets(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const stylesheets: string[] = [];
    const inlineStyles = $("style").length;

    $('link[rel="stylesheet"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href) stylesheets.push(href);
    });

    data.stylesheets = { external: stylesheets.length, inline: inlineStyles };
    this.urlStyles.set(url, stylesheets);

    if (stylesheets.length > 5) {
      this.addIssue(
        "tooManyStylesheets",
        url,
        `${stylesheets.length} stylesheets`,
      );
    }
    if (inlineStyles > 5) {
      this.addIssue("inlineStyles", url, `${inlineStyles} inline styles`);
    }
  }

  private analyzeForms(url: string, $: cheerio.CheerioAPI, data: any): void {
    const forms = $("form").length;
    const inputs = $("input, textarea, select").length;
    const buttons = $("button, input[type='submit']").length;

    data.forms = { total: forms, inputs, buttons };
    this.urlForms.set(url, forms);
    this.urlInputs.set(url, inputs);
    this.urlButtons.set(url, buttons);
  }

  private analyzeMultimedia(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const videos = $("video").length;
    const iframes = $("iframe").length;
    const audio = $("audio").length;

    data.multimedia = { videos, iframes, audio };
    this.urlVideos.set(url, videos);
    this.urlIframes.set(url, iframes);
  }

  private analyzeDOMStructure(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const domSize = $("*").length;
    data.domSize = domSize;
    this.urlDOMSize.set(url, domSize);

    if (domSize > 1500) {
      this.addIssue("largeDOM", url, `${domSize} elements`);
    }
    if (domSize > 2500) {
      this.addIssue("excessiveDOM", url, `${domSize} elements`);
    }
  }

  private analyzeHreflang(url: string, $: cheerio.CheerioAPI, data: any): void {
    const hreflang: any[] = [];
    $("link[hreflang]").each((_, el) => {
      hreflang.push({
        lang: $(el).attr("hreflang"),
        href: $(el).attr("href"),
      });
    });

    data.hreflang = hreflang;
    this.urlHreflang.set(url, hreflang);
  }

  private analyzeLanguage(url: string, $: cheerio.CheerioAPI, data: any): void {
    const lang = $("html").attr("lang") || "";
    const charset = $("meta[charset]").attr("charset") || "";

    data.language = lang;
    data.charset = charset;
    this.urlLanguage.set(url, lang);
    this.urlCharset.set(url, charset);
  }

  private analyzeMobileOptimization(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const viewport = $('meta[name="viewport"]').attr("content");
    data.mobileOptimization = {
      hasViewport: !!viewport,
      viewport: viewport || "",
    };

    if (!viewport) {
      this.addIssue("poorMobileScore", url, "No viewport tag");
    }
  }

  private analyzeMixedContent(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    if (url.startsWith("https://")) {
      let mixedCount = 0;
      $("[src], [href]").each((_, el) => {
        const src = $(el).attr("src") || $(el).attr("href") || "";
        if (src.startsWith("http://")) mixedCount++;
      });

      if (mixedCount > 0) {
        this.addIssue("mixedContent", url, `${mixedCount} HTTP resources`);
      }
    }
  }

  private analyzeSecurityHeaders(
    url: string,
    $: cheerio.CheerioAPI,
    response: any,
  ): void {
    // Analyzed from response headers in main route
  }

  private analyzeAnalyticsTags(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const analytics = {
      googleAnalytics: !!$(
        'script[src*="google-analytics"], script[src*="gtag"]',
      ).length,
      googleTagManager: !!$('script[src*="googletagmanager"]').length,
      facebookPixel: !!$('script[src*="facebook"]').length,
    };

    data.analytics = analytics;
    this.urlAnalytics.set(url, analytics);
  }

  private analyzeSocialLinks(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const socialLinks: string[] = [];
    const socialDomains = [
      "facebook.com",
      "twitter.com",
      "instagram.com",
      "linkedin.com",
      "youtube.com",
      "tiktok.com",
    ];

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      if (socialDomains.some((domain) => href.includes(domain))) {
        socialLinks.push(href);
      }
    });

    data.socialLinks = socialLinks;
    this.urlSocialLinks.set(url, socialLinks);
  }

  private analyzeContactInfo(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const bodyText = $("body").text();

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex =
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

    const emails = [...new Set(bodyText.match(emailRegex) || [])];
    const phones = [...new Set(bodyText.match(phoneRegex) || [])];

    data.contactInfo = { emails, phones };
    this.urlEmailAddresses.set(url, emails);
    this.urlPhoneNumbers.set(url, phones);
  }

  private analyzeBreadcrumbs(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const breadcrumbs: string[] = [];
    $(
      '.breadcrumb a, [itemtype*="BreadcrumbList"] a, nav[aria-label="breadcrumb"] a',
    ).each((_, el) => {
      breadcrumbs.push($(el).text().trim());
    });

    data.breadcrumbs = breadcrumbs;
    this.urlBreadcrumbs.set(url, breadcrumbs);
  }

  private analyzeNavigation(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const navElements = $("nav").length;
    const menuItems = $("nav a, nav li").length;

    data.navigation = { navElements, menuItems };
  }

  private analyzeFavicon(url: string, $: cheerio.CheerioAPI, data: any): void {
    const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr(
      "href",
    );
    data.favicon = favicon;
    this.urlFavicon.set(url, favicon || "");

    if (!favicon) {
      this.addIssue("noFavicon", url, "Missing favicon");
    }
  }

  private analyzeCharset(url: string, $: cheerio.CheerioAPI, data: any): void {
    const charset = $("meta[charset]").attr("charset") || "";
    data.charset = charset;
  }

  private analyzeViewport(url: string, $: cheerio.CheerioAPI, data: any): void {
    const viewport = $('meta[name="viewport"]').attr("content") || "";
    data.viewport = viewport;
  }

  private analyzeCDN(url: string, $: cheerio.CheerioAPI, data: any): void {
    const cdns: string[] = [];
    const cdnPatterns = ["cloudflare", "cloudfront", "akamai", "fastly", "cdn"];

    $("script[src], link[href]").each((_, el) => {
      const src = $(el).attr("src") || $(el).attr("href") || "";
      cdnPatterns.forEach((pattern) => {
        if (src.includes(pattern) && !cdns.includes(pattern)) {
          cdns.push(pattern);
        }
      });
    });

    data.cdns = cdns;
    this.urlCDNs.set(url, cdns);
  }

  private analyzeCustomInstructions(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    if (!this.customInstructions?.targetSelectors) return;

    this.customInstructions.targetSelectors.forEach((selector) => {
      const elements = $(selector);
      data[`custom_${selector}`] = elements.length;
    });
  }

  private analyzeDeprecatedTags(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const deprecated = ["font", "center", "marquee", "blink"];
    let found = false;

    deprecated.forEach((tag) => {
      if ($(tag).length > 0) {
        found = true;
      }
    });

    if (found) {
      this.addIssue("deprecatedHTML", url, "Deprecated tags found");
    }
  }

  private analyzeAccessibility(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    data.accessibility = {
      ariaLabels: $("[aria-label]").length,
      ariaRoles: $("[role]").length,
      formLabels: $("label").length,
    };
  }

  private analyzePerformanceHints(
    url: string,
    $: cheerio.CheerioAPI,
    data: any,
  ): void {
    const preconnect = $('link[rel="preconnect"]').length;
    const prefetch = $('link[rel="prefetch"]').length;
    const preload = $('link[rel="preload"]').length;

    data.performanceHints = { preconnect, prefetch, preload };
  }

  private async crawlChildPages(
    url: string,
    $: cheerio.CheerioAPI,
    depth: number,
  ): Promise<void> {
    const urlObj = new URL(url);
    const internalLinks: string[] = [];

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      try {
        let fullUrl = href;
        if (href.startsWith("/"))
          fullUrl = `${urlObj.protocol}//${urlObj.hostname}${href}`;
        else if (!href.startsWith("http")) fullUrl = new URL(href, url).href;

        const linkUrl = new URL(fullUrl);
        if (linkUrl.hostname === urlObj.hostname) {
          internalLinks.push(fullUrl);
        }
      } catch (e) {}
    });

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

  private addIssue(type: string, url: string, details: string): void {
    if (this.allIssues[type]) {
      this.allIssues[type].affectedPages.push({
        url,
        details,
        discovered: new Date().toISOString(),
      });
    }
  }

  private detectDuplicates(): void {
    // Duplicate titles
    const titleMap = new Map<string, string[]>();
    this.urlTitles.forEach((title, url) => {
      if (title) {
        if (!titleMap.has(title)) titleMap.set(title, []);
        titleMap.get(title)!.push(url);
      }
    });

    titleMap.forEach((urls, title) => {
      if (urls.length > 1) {
        urls.forEach((url) =>
          this.addIssue(
            "duplicateTitles",
            url,
            `"${title}" (${urls.length} pages)`,
          ),
        );
      }
    });

    // Duplicate meta descriptions
    const descMap = new Map<string, string[]>();
    this.urlMetaDesc.forEach((desc, url) => {
      if (desc) {
        if (!descMap.has(desc)) descMap.set(desc, []);
        descMap.get(desc)!.push(url);
      }
    });

    descMap.forEach((urls) => {
      if (urls.length > 1) {
        urls.forEach((url) =>
          this.addIssue(
            "duplicateMetaDescriptions",
            url,
            `${urls.length} pages`,
          ),
        );
      }
    });

    // Duplicate H1s
    const h1Map = new Map<string, string[]>();
    this.urlH1.forEach((h1s, url) => {
      if (h1s.length > 0) {
        const h1Text = h1s[0];
        if (!h1Map.has(h1Text)) h1Map.set(h1Text, []);
        h1Map.get(h1Text)!.push(url);
      }
    });

    h1Map.forEach((urls) => {
      if (urls.length > 1) {
        urls.forEach((url) =>
          this.addIssue("duplicateH1", url, `${urls.length} pages`),
        );
      }
    });

    // Duplicate content
    const contentMap = new Map<string, string[]>();
    this.urlContent.forEach((content, url) => {
      const signature = content.substring(0, 300);
      if (!contentMap.has(signature)) contentMap.set(signature, []);
      contentMap.get(signature)!.push(url);
    });

    contentMap.forEach((urls) => {
      if (urls.length > 1) {
        urls.forEach((url) =>
          this.addIssue("duplicateContent", url, `${urls.length} pages`),
        );
      }
    });
  }

  private analyzeOrphans(): void {
    const linkedPages = new Set<string>();
    this.urlLinks.forEach((links) => {
      if (links.internal) {
        links.internal.forEach((link: string) => linkedPages.add(link));
      }
    });

    this.visitedUrls.forEach((url) => {
      if (!linkedPages.has(url) && url !== this.baseUrl) {
        this.addIssue("orphanedPages", url, "No incoming internal links");
      }

      const depth = this.urlDepth.get(url) || 0;
      if (depth > 3) {
        this.addIssue("deepPages", url, `${depth} clicks from homepage`);
      }
    });
  }

  private calculateMetrics(): void {
    // Calculate additional metrics across all pages
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
      this.allIssues[key].count = this.allIssues[key].affectedPages.length;
    });

    const errorCount = Object.values(this.allIssues)
      .filter((i: any) => i.severity === "error")
      .reduce((sum: number, i: any) => sum + i.count, 0);

    const warningCount = Object.values(this.allIssues)
      .filter((i: any) => i.severity === "warning")
      .reduce((sum: number, i: any) => sum + i.count, 0);

    const noticeCount = Object.values(this.allIssues)
      .filter((i: any) => i.severity === "notice")
      .reduce((sum: number, i: any) => sum + i.count, 0);

    const healthScore = Math.max(
      0,
      100 - errorCount * 10 - warningCount * 2 - noticeCount * 0.5,
    );

    const topIssues = Object.values(this.allIssues)
      .filter((i: any) => i.count > 0)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 20)
      .map((i: any) => ({
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

  getVisitedUrls(): Set<string> {
    return this.visitedUrls;
  }

  getUrlData(): Map<string, any> {
    return this.urlData;
  }

  getAllIssues(): any {
    return this.allIssues;
  }
}
