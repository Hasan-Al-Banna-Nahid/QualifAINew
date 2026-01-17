import { SemrushStyleIssue } from "@/app/api/seo-audit/types";

interface AIProvider {
  name: string;
  analyze(prompt: string): Promise<string>;
}

class GeminiFlashProvider implements AIProvider {
  name = "Gemini 2.0 Flash";

  async analyze(prompt: string): Promise<string> {
    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    if (!GOOGLE_API_KEY) {
      throw new Error("Google API key not configured");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 3000,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
}

class ClaudeProvider implements AIProvider {
  name = "Claude Sonnet 4";

  async analyze(prompt: string): Promise<string> {
    const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      throw new Error("OpenRouter API key not configured");
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "anthropic/claude-sonnet-4-20250514",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 3000,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

export async function getEnhancedAIInsights(
  url: string,
  auditResult: ComprehensiveAuditResult,
): Promise<ComprehensiveAuditResult["aiInsights"]> {
  const prompt = `You are an expert SEO consultant analyzing a website audit.

WEBSITE: ${url}

SITE HEALTH:
- Overall Score: ${auditResult.siteHealth.score}/100
- Pages Crawled: ${auditResult.siteHealth.crawledPages}
- Errors: ${auditResult.siteHealth.errors}
- Warnings: ${auditResult.siteHealth.warnings}
- Notices: ${auditResult.siteHealth.notices}

TOP ISSUES:
${auditResult.topIssues.map((i) => `- ${i.title}: ${i.count} pages (${i.percentage.toFixed(1)}%)`).join("\n")}

CRITICAL ERRORS:
${Object.entries(auditResult.errors)
  .filter(([_, v]) => v.count > 0)
  .map(([k, v]) => `- ${v.type}: ${v.count} issues`)
  .join("\n")}

WARNINGS:
${Object.entries(auditResult.warnings)
  .filter(([_, v]) => v.count > 0)
  .map(([k, v]) => `- ${v.type}: ${v.count} issues`)
  .join("\n")}

Provide expert analysis in JSON format:
{
  "recommendations": [
    "Top 8 specific, actionable recommendations with clear steps"
  ],
  "competitiveAnalysis": "How this site compares to industry standards and best practices",
  "contentOptimization": "Specific content strategy improvements needed",
  "technicalImprovements": [
    "Critical technical fixes with implementation details"
  ],
  "priorityActions": [
    {
      "action": "Specific action to take",
      "impact": "high|medium|low",
      "effort": "high|medium|low",
      "priority": 1-100
    }
  ]
}

Focus on:
1. Quick wins (high impact, low effort)
2. Critical issues affecting SEO performance
3. User experience improvements
4. Technical optimizations
5. Content quality enhancements`;

  const providers: AIProvider[] = [
    new GeminiFlashProvider(),
    new ClaudeProvider(),
  ];

  for (const provider of providers) {
    try {
      console.log(`Attempting AI analysis with ${provider.name}...`);
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

      console.log(`Successfully analyzed with ${provider.name}`);
      return {
        recommendations: parsed.recommendations || [],
        competitiveAnalysis: parsed.competitiveAnalysis || "",
        contentOptimization: parsed.contentOptimization || "",
        technicalImprovements: parsed.technicalImprovements || [],
        priorityActions: parsed.priorityActions || [],
      };
    } catch (error) {
      console.error(`${provider.name} failed:`, error);
      continue;
    }
  }

  // Fallback recommendations
  return {
    recommendations: [
      "Fix all broken internal links to improve site navigation and SEO",
      "Add unique title tags to all pages (50-60 characters each)",
      "Implement unique meta descriptions for better click-through rates",
      "Optimize images with descriptive alt text for accessibility",
      "Improve page load speed to under 3 seconds",
      "Fix duplicate content issues across multiple pages",
      "Ensure proper heading hierarchy (single H1 per page)",
      "Reduce page depth for important content (max 3 clicks)",
    ],
    competitiveAnalysis:
      "Site shows typical SEO issues. With focused improvements on technical SEO and content quality, rankings can improve significantly.",
    contentOptimization:
      "Focus on unique, valuable content for each page. Ensure adequate word count (300+ words) and proper keyword optimization.",
    technicalImprovements: [
      "Implement HTTPS across all pages",
      "Fix all 404 errors and broken links",
      "Optimize text-to-HTML ratio (target >10%)",
      "Add structured data markup (Schema.org)",
      "Improve internal linking structure",
    ],
    priorityActions: [
      {
        action: "Fix all 4XX errors and broken links",
        impact: "high",
        effort: "medium",
        priority: 95,
      },
      {
        action: "Add unique title tags and meta descriptions",
        impact: "high",
        effort: "medium",
        priority: 90,
      },
      {
        action: "Optimize page load speed",
        impact: "high",
        effort: "high",
        priority: 85,
      },
      {
        action: "Fix duplicate content issues",
        impact: "high",
        effort: "medium",
        priority: 80,
      },
      {
        action: "Add alt text to all images",
        impact: "medium",
        effort: "low",
        priority: 75,
      },
    ],
  };
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
