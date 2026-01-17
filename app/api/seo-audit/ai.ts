import { ComprehensiveAuditResult } from "@/app/api/seo-audit/types";

interface AIProvider {
  name: string;
  analyze(prompt: string): Promise<string>;
}

class ClaudeProvider implements AIProvider {
  name = "GPT";

  async analyze(prompt: string): Promise<string> {
    const OPENROUTER_API_KEY =
      process.env.OPENROUTER_API_KEY ||
      process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      console.error("OpenRouter API key not configured");
      throw new Error("OpenRouter API key not configured");
    }

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://your-domain.com", // Required by OpenRouter
            "X-Title": "SEO Audit Tool", // Optional but recommended
          },
          body: JSON.stringify({
            model: "openai/gpt-4", // Use a working model
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 4000,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API Error:", response.status, errorText);
        throw new Error(
          `OpenRouter API error: ${response.status} - ${errorText}`,
        );
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "No response from AI";
    } catch (error) {
      console.error("AI analysis failed:", error);
      throw error;
    }
  }
}

export async function getEnhancedAIInsights(
  url: string,
  auditResult: ComprehensiveAuditResult,
): Promise<ComprehensiveAuditResult["aiInsights"]> {
  const errorSummary = Object.entries(auditResult.errors)
    .filter(([_, v]) => v.count > 0)
    .map(([k, v]) => `- ${v.type}: ${v.count} issues`)
    .join("\n");

  const warningSummary = Object.entries(auditResult.warnings)
    .filter(([_, v]) => v.count > 0)
    .map(([k, v]) => `- ${v.type}: ${v.count} issues`)
    .join("\n");

  const prompt = `You are an expert SEO consultant analyzing a comprehensive website audit.

WEBSITE: ${url}

SITE HEALTH:
- Overall Score: ${auditResult.siteHealth.score}/100
- Pages Crawled: ${auditResult.siteHealth.crawledPages}
- Errors: ${auditResult.siteHealth.errors}
- Warnings: ${auditResult.siteHealth.warnings}
- Notices: ${auditResult.siteHealth.notices}

TOP ISSUES:
${auditResult.topIssues
  .slice(0, 10)
  .map((i) => `- ${i.title}: ${i.count} pages (${i.percentage.toFixed(1)}%)`)
  .join("\n")}

CRITICAL ERRORS:
${errorSummary || "None"}

WARNINGS:
${warningSummary || "None"}

Provide expert analysis in JSON format:
{
  "recommendations": [
    "Top 10-12 specific, actionable recommendations with clear implementation steps"
  ],
  "competitiveAnalysis": "Detailed analysis comparing this site to industry standards, SEO best practices, and competitive benchmarks. Include insights on what competitors are likely doing better.",
  "contentOptimization": "Comprehensive content strategy improvements needed, including keyword optimization, content gaps, content quality enhancements, and user intent alignment.",
  "technicalImprovements": [
    "Critical technical fixes with detailed implementation steps, expected impact, and priority level"
  ],
  "priorityActions": [
    {
      "action": "Specific action to take with implementation details",
      "impact": "high|medium|low",
      "effort": "high|medium|low",
      "priority": 1-100
    }
  ]
}

Focus on:
1. Quick wins (high impact, low effort) - identify at least 3
2. Critical issues affecting SEO performance and rankings
3. User experience improvements that impact engagement metrics
4. Technical optimizations for crawlability and indexation
5. Content quality enhancements for better rankings
6. Mobile optimization priorities
7. Page speed improvements with measurable impact
8. Internal linking strategy improvements
9. Schema markup opportunities
10. Security and trust signal improvements

Be specific, actionable, and provide context for each recommendation.`;

  const providers: AIProvider[] = [new ClaudeProvider()];

  for (const provider of providers) {
    try {
      console.log(`🤖 Attempting AI analysis with ${provider.name}...`);
      const response = await provider.analyze(prompt);

      const cleanedResponse = response
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      let parsed: any;
      try {
        parsed = JSON.parse(cleanedResponse);
      } catch {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not parse JSON");
        }
      }

      console.log(`✅ Successfully analyzed with ${provider.name}`);
      return {
        recommendations: parsed.recommendations || [],
        competitiveAnalysis: parsed.competitiveAnalysis || "",
        contentOptimization: parsed.contentOptimization || "",
        technicalImprovements: parsed.technicalImprovements || [],
        priorityActions: parsed.priorityActions || [],
      };
    } catch (error) {
      console.error(`❌ ${provider.name} failed:`, error);
      continue;
    }
  }

  // Enhanced fallback recommendations
  return {
    recommendations: [
      "Fix all broken internal links to improve site navigation and SEO - Use crawler reports to identify and update/redirect broken URLs",
      "Add unique title tags to all pages (50-60 characters each) - Include primary keyword near the beginning",
      "Implement unique meta descriptions for better CTR (150-160 characters) - Write compelling copy that encourages clicks",
      "Optimize all images with descriptive alt text for accessibility and SEO - Use keywords naturally where relevant",
      "Improve page load speed to under 2 seconds - Compress images, minify CSS/JS, leverage browser caching",
      "Fix duplicate content issues across pages - Use canonical tags or consolidate similar pages",
      "Ensure proper heading hierarchy with single H1 per page - Structure content logically for users and search engines",
      "Reduce page depth for important content (max 3 clicks from homepage) - Flatten site architecture",
      "Implement HTTPS across all pages if not already done - Essential for security and SEO",
      "Add structured data (Schema.org) markup for rich snippets - Implement Article, Product, or Organization schemas",
      "Optimize internal linking structure - Link to important pages from homepage and relevant content",
      "Create XML sitemap and submit to search engines - Ensure all important pages are discoverable",
    ],
    competitiveAnalysis: `The site shows ${auditResult.siteHealth.errors} critical errors and ${auditResult.siteHealth.warnings} warnings that are impacting SEO performance. With a health score of ${auditResult.siteHealth.score}/100, there's significant room for improvement. Industry leaders typically maintain scores above 90 with minimal errors. By addressing the identified issues systematically, rankings can improve by 20-40% within 3-6 months. Focus first on technical SEO foundations (errors and warnings), then move to content optimization.`,
    contentOptimization: `Focus on creating unique, valuable content for each page with minimum 300 words for standard pages and 1000+ for pillar content. Ensure proper keyword optimization without stuffing - use primary keywords in title, H1, first 100 words, and naturally throughout. Address search intent by analyzing top-ranking pages for target keywords. Add multimedia elements (images, videos) to increase engagement. Improve readability with shorter paragraphs, bullet points, and subheadings. Update old content regularly to maintain freshness.`,
    technicalImprovements: [
      "Implement HTTPS site-wide with HSTS headers (max-age=31536000) - Critical for security and SEO trust signals",
      "Fix all 4XX errors and broken links - Use 301 redirects for moved content, update internal links",
      "Optimize text-to-HTML ratio to >15% - Remove unnecessary code, consolidate CSS/JS files",
      "Add structured data markup (Schema.org) - Start with Organization, WebSite, and BreadcrumbList schemas",
      "Improve internal linking structure - Create topic clusters with pillar pages linking to related content",
      "Enable Gzip/Brotli compression - Reduce HTML/CSS/JS file sizes by 70-80%",
      "Optimize Core Web Vitals - Target LCP <2.5s, FID <100ms, CLS <0.1",
      "Implement lazy loading for images and videos - Reduce initial page load time",
      "Add proper canonical tags to all pages - Prevent duplicate content issues",
      "Configure XML sitemap with priority and changefreq - Help search engines understand site structure",
    ],
    priorityActions: [
      {
        action:
          "Fix all 4XX errors and broken links - Audit site, create 301 redirects, update internal links",
        impact: "high",
        effort: "medium",
        priority: 98,
      },
      {
        action:
          "Add unique title tags and meta descriptions to all pages - Use primary keywords, compelling copy",
        impact: "high",
        effort: "medium",
        priority: 95,
      },
      {
        action:
          "Optimize page load speed - Compress images, minify code, enable caching, use CDN",
        impact: "high",
        effort: "high",
        priority: 92,
      },
      {
        action:
          "Fix duplicate content issues - Implement canonical tags, consolidate or noindex duplicate pages",
        impact: "high",
        effort: "medium",
        priority: 88,
      },
      {
        action:
          "Add alt text to all images - Use descriptive, keyword-rich text naturally",
        impact: "medium",
        effort: "low",
        priority: 85,
      },
      {
        action:
          "Implement structured data markup - Start with Organization and Article schemas",
        impact: "medium",
        effort: "medium",
        priority: 80,
      },
      {
        action:
          "Fix heading hierarchy - Ensure single H1, proper H2-H6 structure on all pages",
        impact: "medium",
        effort: "low",
        priority: 75,
      },
      {
        action:
          "Improve mobile responsiveness - Add viewport meta tag, test on multiple devices",
        impact: "high",
        effort: "medium",
        priority: 90,
      },
      {
        action:
          "Optimize internal linking - Create topic clusters, add contextual links",
        impact: "medium",
        effort: "medium",
        priority: 70,
      },
      {
        action:
          "Reduce page depth - Flatten site architecture, link to deep pages from homepage",
        impact: "medium",
        effort: "low",
        priority: 65,
      },
    ],
  };
}
