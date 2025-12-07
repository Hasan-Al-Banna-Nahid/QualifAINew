// app/(main)/lib/services/apify.service.ts

export interface ApifyWebsiteContentInput {
    startUrls: Array<{ url: string }>;
    crawlerType?: 'playwright:firefox' | 'playwright:chrome' | 'cheerio';
    maxCrawlDepth?: number;
    maxCrawlPages?: number;
    readableTextCharThreshold?: number;
    removeCookieWarnings?: boolean;
    clickElementsCssSelector?: string;
    htmlTransformer?: 'readableTextIfPossible' | 'readableText' | 'extractus' | 'defuddle' | 'none';
    saveHtml?: boolean;
    saveMarkdown?: boolean;
    saveFiles?: boolean;
    maxResults?: number;
}

export interface ApifyWebsiteContentResult {
    url: string;
    crawl: {
        loadedUrl: string;
        httpStatusCode: number;
        loadedTime: string;
    };
    metadata: {
        canonicalUrl?: string;
        title?: string;
        description?: string;
        author?: string;
        keywords?: string;
        languageCode?: string;
        openGraph?: Array<{ property: string; content: string }>;
        jsonLd?: any[];
    };
    text?: string;
    markdown?: string;
    html?: string;
    screenshotUrl?: string;
}

export interface SEOAnalysisData {
    url: string;
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    openGraph?: Array<{ property: string; content: string }>;
    jsonLd?: any[];
    content: {
        text?: string;
        markdown?: string;
        html?: string;
        wordCount: number;
        headings: {
            h1: number;
            h2: number;
            h3: number;
            h4: number;
            h5: number;
            h6: number;
        };
    };
    images: {
        total: number;
        withAlt: number;
        withoutAlt: number;
    };
    links: {
        internal: number;
        external: number;
    };
    performance: {
        httpStatusCode: number;
        loadedTime: string;
    };
    issues: Array<{
        type: 'critical' | 'warning' | 'info';
        category: string;
        message: string;
    }>;
    score: number;
}

class ApifyService {
    private apiToken: string;
    private baseUrl = 'https://api.apify.com/v2';
    private actorId = 'aYG0l9s7dbB7j3gbS'; // Website Content Crawler

    constructor() {
        this.apiToken = process.env.APIFY_API_TOKEN || '';
        if (!this.apiToken) {
            console.warn('APIFY_API_TOKEN not found in environment variables');
        }
    }

    /**
     * Run the Website Content Crawler actor
     */
    async crawlWebsite(
        input: ApifyWebsiteContentInput
    ): Promise<ApifyWebsiteContentResult[]> {
        if (!this.apiToken) {
            throw new Error('Apify API token is not configured');
        }

        try {
            // Start the actor run
            const runResponse = await fetch(
                `${this.baseUrl}/acts/${this.actorId}/runs?token=${this.apiToken}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(input),
                }
            );

            if (!runResponse.ok) {
                const errorText = await runResponse.text();
                throw new Error(
                    `Failed to start Apify actor: ${runResponse.status} - ${errorText}`
                );
            }

            const runData = await runResponse.json();
            const runId = runData.data.id;

            // Wait for the run to complete
            const results = await this.waitForRunCompletion(runId);
            return results;
        } catch (error) {
            console.error('Error crawling website with Apify:', error);
            throw error;
        }
    }

    /**
     * Wait for actor run to complete and fetch results
     */
    private async waitForRunCompletion(
        runId: string,
        maxWaitTime = 120000 // 2 minutes
    ): Promise<ApifyWebsiteContentResult[]> {
        const startTime = Date.now();
        const pollInterval = 2000; // 2 seconds

        while (Date.now() - startTime < maxWaitTime) {
            // Check run status
            const statusResponse = await fetch(
                `${this.baseUrl}/actor-runs/${runId}?token=${this.apiToken}`
            );

            if (!statusResponse.ok) {
                throw new Error(`Failed to check run status: ${statusResponse.status}`);
            }

            const statusData = await statusResponse.json();
            const status = statusData.data.status;

            if (status === 'SUCCEEDED') {
                // Fetch results
                return await this.fetchRunResults(runId);
            } else if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
                throw new Error(`Actor run ${status.toLowerCase()}`);
            }

            // Wait before polling again
            await new Promise((resolve) => setTimeout(resolve, pollInterval));
        }

        throw new Error('Actor run timed out');
    }

    /**
     * Fetch results from completed run
     */
    private async fetchRunResults(
        runId: string
    ): Promise<ApifyWebsiteContentResult[]> {
        const resultsResponse = await fetch(
            `${this.baseUrl}/actor-runs/${runId}/dataset/items?token=${this.apiToken}`
        );

        if (!resultsResponse.ok) {
            throw new Error(`Failed to fetch results: ${resultsResponse.status}`);
        }

        const results = await resultsResponse.json();
        return results;
    }

    /**
     * Analyze website for SEO performance
     */
    async analyzeSEO(url: string): Promise<SEOAnalysisData> {
        try {
            // Configure crawler input for SEO analysis
            const input: ApifyWebsiteContentInput = {
                startUrls: [{ url }],
                crawlerType: 'playwright:firefox',
                maxCrawlDepth: 0, // Only crawl the main page
                maxCrawlPages: 1,
                readableTextCharThreshold: 100,
                removeCookieWarnings: true,
                htmlTransformer: 'readableText', // Valid options: readableTextIfPossible, readableText, extractus, defuddle, none
                saveHtml: true,
                saveMarkdown: true,
                saveFiles: false,
                maxResults: 1,
            };

            // Crawl the website
            const results = await this.crawlWebsite(input);

            if (!results || results.length === 0) {
                throw new Error('No results returned from Apify crawler');
            }

            const pageData = results[0];

            // Analyze the content for SEO
            return this.performSEOAnalysis(pageData);
        } catch (error) {
            console.error('Error analyzing SEO with Apify:', error);
            throw error;
        }
    }

    /**
     * Perform SEO analysis on crawled data
     */
    private performSEOAnalysis(
        data: ApifyWebsiteContentResult
    ): SEOAnalysisData {
        const issues: SEOAnalysisData['issues'] = [];
        let score = 100;

        // Analyze metadata
        const title = data.metadata?.title;
        const description = data.metadata?.description;
        const keywords = data.metadata?.keywords;
        const canonicalUrl = data.metadata?.canonicalUrl;

        // Check title
        if (!title) {
            issues.push({
                type: 'critical',
                category: 'Meta Tags',
                message: 'Missing page title',
            });
            score -= 15;
        } else if (title.length < 30 || title.length > 60) {
            issues.push({
                type: 'warning',
                category: 'Meta Tags',
                message: `Title length (${title.length}) should be between 30-60 characters`,
            });
            score -= 5;
        }

        // Check description
        if (!description) {
            issues.push({
                type: 'critical',
                category: 'Meta Tags',
                message: 'Missing meta description',
            });
            score -= 15;
        } else if (description.length < 120 || description.length > 160) {
            issues.push({
                type: 'warning',
                category: 'Meta Tags',
                message: `Meta description length (${description.length}) should be between 120-160 characters`,
            });
            score -= 5;
        }

        // Check canonical URL
        if (!canonicalUrl) {
            issues.push({
                type: 'warning',
                category: 'Meta Tags',
                message: 'Missing canonical URL',
            });
            score -= 5;
        }

        // Analyze content
        const text = data.text || '';
        const markdown = data.markdown || '';
        const html = data.html || '';
        const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;

        // Check content length
        if (wordCount < 300) {
            issues.push({
                type: 'warning',
                category: 'Content',
                message: `Content is too short (${wordCount} words). Aim for at least 300 words.`,
            });
            score -= 10;
        }

        // Analyze headings
        const headings = this.analyzeHeadings(html);

        if (headings.h1 === 0) {
            issues.push({
                type: 'critical',
                category: 'Content Structure',
                message: 'Missing H1 heading',
            });
            score -= 15;
        } else if (headings.h1 > 1) {
            issues.push({
                type: 'warning',
                category: 'Content Structure',
                message: `Multiple H1 headings found (${headings.h1}). Should have only one.`,
            });
            score -= 5;
        }

        // Analyze images
        const images = this.analyzeImages(html);

        if (images.withoutAlt > 0) {
            issues.push({
                type: 'warning',
                category: 'Accessibility',
                message: `${images.withoutAlt} images missing alt text`,
            });
            score -= Math.min(10, images.withoutAlt * 2);
        }

        // Analyze links
        const links = this.analyzeLinks(html);

        // Check Open Graph
        if (!data.metadata?.openGraph || data.metadata.openGraph.length === 0) {
            issues.push({
                type: 'info',
                category: 'Social Media',
                message: 'Missing Open Graph tags for social media sharing',
            });
            score -= 3;
        }

        // Check structured data
        if (!data.metadata?.jsonLd || data.metadata.jsonLd.length === 0) {
            issues.push({
                type: 'info',
                category: 'Structured Data',
                message: 'Missing JSON-LD structured data',
            });
            score -= 3;
        }

        // Check HTTP status
        if (data.crawl.httpStatusCode !== 200) {
            issues.push({
                type: 'critical',
                category: 'Performance',
                message: `HTTP status code ${data.crawl.httpStatusCode}`,
            });
            score -= 20;
        }

        return {
            url: data.url,
            title,
            description,
            keywords,
            canonicalUrl,
            openGraph: data.metadata?.openGraph,
            jsonLd: data.metadata?.jsonLd,
            content: {
                text,
                markdown,
                html,
                wordCount,
                headings,
            },
            images,
            links,
            performance: {
                httpStatusCode: data.crawl.httpStatusCode,
                loadedTime: data.crawl.loadedTime,
            },
            issues,
            score: Math.max(0, Math.min(100, score)),
        };
    }

    /**
     * Analyze heading structure in HTML
     */
    private analyzeHeadings(html: string): SEOAnalysisData['content']['headings'] {
        return {
            h1: (html.match(/<h1/gi) || []).length,
            h2: (html.match(/<h2/gi) || []).length,
            h3: (html.match(/<h3/gi) || []).length,
            h4: (html.match(/<h4/gi) || []).length,
            h5: (html.match(/<h5/gi) || []).length,
            h6: (html.match(/<h6/gi) || []).length,
        };
    }

    /**
     * Analyze images in HTML
     */
    private analyzeImages(html: string): SEOAnalysisData['images'] {
        const imgTags = html.match(/<img[^>]*>/gi) || [];
        const total = imgTags.length;
        const withAlt = imgTags.filter((tag) => /alt\s*=/i.test(tag)).length;

        return {
            total,
            withAlt,
            withoutAlt: total - withAlt,
        };
    }

    /**
     * Analyze links in HTML
     */
    private analyzeLinks(html: string): SEOAnalysisData['links'] {
        const linkTags = html.match(/<a[^>]*href\s*=\s*["'][^"']*["'][^>]*>/gi) || [];

        let internal = 0;
        let external = 0;

        linkTags.forEach((tag) => {
            const hrefMatch = tag.match(/href\s*=\s*["']([^"']*)["']/i);
            if (hrefMatch) {
                const href = hrefMatch[1];
                if (href.startsWith('http://') || href.startsWith('https://')) {
                    external++;
                } else if (href.startsWith('/') || href.startsWith('#') || !href.includes('://')) {
                    internal++;
                }
            }
        });

        return { internal, external };
    }



    /**
     * Calculate keyword density
     */
    calculateKeywordDensity(text: string, keyword: string): number {
        if (!text || !keyword) return 0;
        const normalizedText = text.toLowerCase();
        const normalizedKeyword = keyword.toLowerCase();
        const matches = normalizedText.split(normalizedKeyword).length - 1;
        const totalWords = text.split(/\s+/).length;
        return totalWords > 0 ? (matches / totalWords) * 100 : 0;
    }

    /**
     * Analyze website for WordPress specific metrics
     */
    async analyzeWordPress(url: string): Promise<WordPressAnalysisData> {
        try {
            // Configure crawler input
            const input: ApifyWebsiteContentInput = {
                startUrls: [{ url }],
                crawlerType: 'playwright:firefox',
                maxCrawlDepth: 0,
                maxCrawlPages: 1,
                readableTextCharThreshold: 100,
                removeCookieWarnings: true,
                htmlTransformer: 'none', // We need raw HTML for WP detection
                saveHtml: true,
                saveMarkdown: false,
                saveFiles: false,
                maxResults: 1,
            };

            // Crawl the website
            const results = await this.crawlWebsite(input);

            if (!results || results.length === 0) {
                throw new Error('No results returned from Apify crawler');
            }

            const pageData = results[0];
            return this.performWordPressAnalysis(pageData);
        } catch (error) {
            console.error('Error analyzing WordPress with Apify:', error);
            throw error;
        }
    }

    private performWordPressAnalysis(data: ApifyWebsiteContentResult): WordPressAnalysisData {
        const html = data.html || '';
        const issues: WordPressAnalysisData['issues'] = [];
        let score = 100;

        // 1. Detect WordPress
        const isWordPress = /wp-content|wp-includes/i.test(html) || /<meta name="generator" content="WordPress/i.test(html);

        if (!isWordPress) {
            return {
                url: data.url,
                isWordPress: false,
                version: null,
                theme: null,
                plugins: [],
                performance: {
                    httpStatusCode: data.crawl.httpStatusCode,
                    loadedTime: data.crawl.loadedTime,
                },
                security: {
                    https: data.url.startsWith('https'),
                },
                issues: [{
                    type: 'critical',
                    category: 'Platform',
                    message: 'This does not appear to be a WordPress website',
                }],
                score: 0,
            };
        }

        // 2. Detect Version
        const versionMatch = html.match(/<meta name="generator" content="WordPress ([0-9.]+)"/i);
        const version = versionMatch ? versionMatch[1] : null;

        if (version) {
            issues.push({
                type: 'warning',
                category: 'Security',
                message: `WordPress version ${version} is exposed in meta tags`,
            });
            score -= 5;
        } else {
            issues.push({
                type: 'info',
                category: 'Security',
                message: 'WordPress version is hidden (Good practice)',
            });
        }

        // 3. Detect Theme
        const themeMatch = html.match(/wp-content\/themes\/([a-z0-9-]+)\//i);
        const theme = themeMatch ? themeMatch[1] : 'unknown';

        // 4. Detect Plugins
        const pluginMatches = html.matchAll(/wp-content\/plugins\/([a-z0-9-]+)\//gi);
        const plugins = [...new Set(Array.from(pluginMatches, m => m[1]))];

        // 5. Security Checks
        const https = data.url.startsWith('https');
        if (!https) {
            issues.push({
                type: 'critical',
                category: 'Security',
                message: 'Website is not using HTTPS',
            });
            score -= 20;
        }

        // Check for exposed paths
        if (html.includes('wp-config.php')) {
            issues.push({
                type: 'critical',
                category: 'Security',
                message: 'Potential exposure of wp-config.php',
            });
            score -= 30;
        }

        // 6. Performance Checks
        // loadedTime is in ISO format, we can't easily use it for scoring without parsing, 
        // but let's assume if the crawl was successful it's okay-ish. 
        // Real performance metrics would require Lighthouse integration.

        return {
            url: data.url,
            isWordPress: true,
            version,
            theme,
            plugins,
            performance: {
                httpStatusCode: data.crawl.httpStatusCode,
                loadedTime: data.crawl.loadedTime,
            },
            security: {
                https,
            },
            issues,
            score: Math.max(0, Math.min(100, score)),
        };
    }
}



export interface WordPressAnalysisData {
    url: string;
    isWordPress: boolean;
    version: string | null;
    theme: string | null;
    plugins: string[];
    performance: {
        httpStatusCode: number;
        loadedTime: string;
    };
    security: {
        https: boolean;
    };
    issues: Array<{
        type: 'critical' | 'warning' | 'info';
        category: string;
        message: string;
    }>;
    score: number;
}

export const apifyService = new ApifyService();
