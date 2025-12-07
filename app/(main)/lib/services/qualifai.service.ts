// services/qualifai.service.ts
import { aiService } from "./ai.service";

export interface QARequirement {
  id: string;
  type:
  | "visual"
  | "functional"
  | "content"
  | "technical"
  | "seo"
  | "performance"
  | "word_count"
  | "keywords"
  | "schema"
  | "meta_tags";
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  expected: any;
  actual?: any;
  status: "pending" | "pass" | "fail" | "warning";
}

export interface QAResult {
  requirement: QARequirement;
  status: "pass" | "fail" | "warning";
  evidence: any;
  recommendations: string[];
  confidence: number;
}

export interface QARun {
  id: string;
  projectId: string;
  serviceType: string;
  requirements: QARequirement[];
  results: QAResult[];
  status: "running" | "completed" | "failed";
  startedAt: Date;
  completedAt?: Date;
}

class QualifAIService {
  // Parse SOW and extract requirements
  async parseSOW(
    sowText: string,
    serviceType: string
  ): Promise<QARequirement[]> {
    const prompt = `
    Analyze this Statement of Work (SOW) for a ${serviceType} project and extract testable requirements.

    SOW CONTENT:
    ${sowText}

    Extract requirements in the following JSON format:
    {
      "requirements": [
        {
          "type": "visual|functional|content|technical|seo|performance",
          "description": "Specific, testable requirement",
          "priority": "critical|high|medium|low",
          "expected": { /* expected outcome or specification */ }
        }
      ]
    }

    Focus on requirements that can be automatically tested or verified.
    `;

    const analysis = await aiService.analyzeWithPrompt(prompt, "gpt-4");
    return analysis.requirements || [];
  }

  // Run WordPress QA
  async runWordPressQA(
    url: string,
    requirements: QARequirement[]
  ): Promise<QAResult[]> {
    const results: QAResult[] = [];

    for (const requirement of requirements) {
      try {
        let result: QAResult;

        switch (requirement.type) {
          case "visual":
            result = await this.runVisualQA(url, requirement);
            break;
          case "functional":
            result = await this.runFunctionalQA(url, requirement);
            break;
          case "content":
            result = await this.runContentQA(url, requirement);
            break;
          case "seo":
            result = await this.runSEOQA(url, requirement);
            break;
          case "performance":
            result = await this.runPerformanceQA(url, requirement);
            break;
          default:
            result = await this.runGeneralQA(url, requirement);
        }

        results.push(result);
      } catch (error) {
        console.error(
          `QA failed for requirement: ${requirement.description}`,
          error
        );
        results.push({
          requirement,
          status: "fail",
          evidence: { error: error.message },
          recommendations: ["Check requirement specification and try again"],
          confidence: 0,
        });
      }
    }

    return results;
  }

  private async runVisualQA(
    url: string,
    requirement: QARequirement
  ): Promise<QAResult> {
    // Implement visual QA using screenshots and AI vision
    const prompt = `
    Analyze this website screenshot and check if it meets the requirement.

    REQUIREMENT: ${requirement.description}
    EXPECTED: ${JSON.stringify(requirement.expected)}

    Provide analysis in JSON format:
    {
      "status": "pass|fail|warning",
      "evidence": { /* what was found */ },
      "recommendations": [/* improvement suggestions */],
      "confidence": 0.95
    }
    `;

    // This would integrate with screenshot services and vision AI
    const analysis = await aiService.analyzeWithPrompt(prompt, "gpt-4-vision");
    return {
      requirement,
      ...analysis,
    };
  }

  private async runContentQA(
    url: string,
    requirement: QARequirement
  ): Promise<QAResult> {
    // Implement content analysis
    const prompt = `
    Analyze the content of this website and check if it meets the requirement.

    URL: ${url}
    REQUIREMENT: ${requirement.description}
    EXPECTED: ${JSON.stringify(requirement.expected)}

    Focus on: word count, content quality, tone, structure, and specific elements mentioned.

    Provide analysis in JSON format.
    `;

    const analysis = await aiService.analyzeWithPrompt(prompt, "gpt-4");
    return {
      requirement,
      ...analysis,
    };
  }

  private async runFunctionalQA(
    url: string,
    requirement: QARequirement
  ): Promise<QAResult> {
    const prompt = `
    Test the functional requirement for this website.

    URL: ${url}
    REQUIREMENT: ${requirement.description}
    EXPECTED: ${JSON.stringify(requirement.expected)}

    Analyze if the functionality works as expected.
    Provide analysis in JSON format:
    {
      "status": "pass|fail|warning",
      "evidence": { /* what was tested */ },
      "recommendations": [/* improvement suggestions */],
      "confidence": 0.95
    }
    `;

    const analysis = await aiService.analyzeWithPrompt(prompt, "gpt-4");
    return {
      requirement,
      ...analysis,
    };
  }

  private async runSEOQA(
    url: string,
    requirement: QARequirement
  ): Promise<QAResult> {
    const prompt = `
    Analyze the SEO aspects of this website.

    URL: ${url}
    REQUIREMENT: ${requirement.description}
    EXPECTED: ${JSON.stringify(requirement.expected)}

    Check for: meta tags, title tags, headings structure, alt text, sitemap, robots.txt, etc.
    Provide analysis in JSON format:
    {
      "status": "pass|fail|warning",
      "evidence": { /* SEO elements found */ },
      "recommendations": [/* SEO improvement suggestions */],
      "confidence": 0.95
    }
    `;

    const analysis = await aiService.analyzeWithPrompt(prompt, "gpt-4");
    return {
      requirement,
      ...analysis,
    };
  }

  private async runPerformanceQA(
    url: string,
    requirement: QARequirement
  ): Promise<QAResult> {
    const prompt = `
    Analyze the performance of this website.

    URL: ${url}
    REQUIREMENT: ${requirement.description}
    EXPECTED: ${JSON.stringify(requirement.expected)}

    Check for: page load time, resource sizes, optimization opportunities.
    Provide analysis in JSON format:
    {
      "status": "pass|fail|warning",
      "evidence": { /* performance metrics */ },
      "recommendations": [/* performance improvement suggestions */],
      "confidence": 0.95
    }
    `;

    const analysis = await aiService.analyzeWithPrompt(prompt, "gpt-4");
    return {
      requirement,
      ...analysis,
    };
  }

  private async runGeneralQA(
    url: string,
    requirement: QARequirement
  ): Promise<QAResult> {
    const prompt = `
    Perform a general quality check for this website.

    URL: ${url}
    REQUIREMENT: ${requirement.description}
    EXPECTED: ${JSON.stringify(requirement.expected)}

    Provide analysis in JSON format:
    {
      "status": "pass|fail|warning",
      "evidence": { /* findings */ },
      "recommendations": [/* suggestions */],
      "confidence": 0.95
    }
    `;

    const analysis = await aiService.analyzeWithPrompt(prompt, "gpt-4");
    return {
      requirement,
      ...analysis,
    };
  }

  // Run SEO QA as a standalone service
  async runSEOAudit(
    url: string,
    requirements: QARequirement[]
  ): Promise<QAResult[]> {
    try {
      // Use Apify service for real SEO analysis
      const response = await fetch('/api/qualifai/seo-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze SEO');
      }

      const { success, data: seoAnalysis } = await response.json();

      if (!success || !seoAnalysis) {
        throw new Error('SEO analysis failed');
      }

      // Convert SEO analysis to QA results format
      const results: QAResult[] = [];

      // 1. Validate Specific Requirements from Scope
      if (requirements && requirements.length > 0) {
        requirements.forEach((req) => {
          let status: 'pass' | 'fail' | 'warning' = 'pass';
          let evidence: any = {};
          let recommendations: string[] = [];

          switch (req.type) {
            case 'word_count':
              const actualWordCount = seoAnalysis.content.wordCount;
              const requiredWordCount = req.expected?.count || 300;
              if (actualWordCount < requiredWordCount) {
                status = 'fail';
                recommendations.push(`Increase content length to at least ${requiredWordCount} words (current: ${actualWordCount})`);
              }
              evidence = { actual: actualWordCount, required: requiredWordCount };
              break;

            case 'keywords':
              const keyword = req.expected?.keyword;
              if (keyword) {
                // Simple check in text content
                const textContent = seoAnalysis.content.text.toLowerCase();
                const keywordPresent = textContent.includes(keyword.toLowerCase());

                if (!keywordPresent) {
                  status = 'fail';
                  recommendations.push(`Add required keyword "${keyword}" to the content`);
                }
                evidence = { keyword, present: keywordPresent };
              }
              break;

            case 'schema':
              const schemaType = req.expected?.schemaType;
              if (schemaType) {
                const jsonLd = seoAnalysis.jsonLd || [];
                const hasSchema = jsonLd.some((schema: any) =>
                  schema['@type'] === schemaType || schema['@type']?.includes(schemaType)
                );

                if (!hasSchema) {
                  status = 'fail';
                  recommendations.push(`Implement "${schemaType}" schema markup`);
                }
                evidence = { schemaType, present: hasSchema, foundSchemas: jsonLd.map((s: any) => s['@type']) };
              }
              break;

            case 'meta_tags':
              if (req.expected?.tag === 'title') {
                const title = seoAnalysis.title;
                if (!title) {
                  status = 'fail';
                  recommendations.push('Add a page title');
                } else if (req.expected.minLength && title.length < req.expected.minLength) {
                  status = 'warning';
                  recommendations.push(`Title is too short (min: ${req.expected.minLength})`);
                }
                evidence = { tag: 'title', value: title, length: title?.length };
              } else if (req.expected?.tag === 'description') {
                const desc = seoAnalysis.description;
                if (!desc) {
                  status = 'fail';
                  recommendations.push('Add a meta description');
                }
                evidence = { tag: 'description', value: desc, length: desc?.length };
              }
              break;
          }

          results.push({
            requirement: req,
            status,
            evidence: { ...evidence, seoAnalysis }, // Include full analysis for context
            recommendations,
            confidence: 0.95,
          });
        });
      }

      // 2. Add Overall SEO Health Check (if no specific requirements or as general audit)
      // Always include the overall score as a summary result
      results.push({
        requirement: {
          id: 'seo-overall',
          type: 'seo',
          description: 'Overall SEO Performance Score',
          priority: 'critical',
          expected: { score: 80 },
          status: seoAnalysis.score >= 80 ? 'pass' : seoAnalysis.score >= 60 ? 'warning' : 'fail',
        },
        status: seoAnalysis.score >= 80 ? 'pass' : seoAnalysis.score >= 60 ? 'warning' : 'fail',
        evidence: {
          score: seoAnalysis.score,
          url: seoAnalysis.url,
          seoAnalysis,
        },
        recommendations: seoAnalysis.issues?.map((issue: any) => issue.message) || [],
        confidence: 0.95,
      });

      // 3. Add Specific Issues Found by Apify as additional results
      if (seoAnalysis.issues && seoAnalysis.issues.length > 0) {
        seoAnalysis.issues.forEach((issue: any, index: number) => {
          // Only add if not covered by specific requirements to avoid duplicates?
          // For now, add them as "Detected Issues"
          results.push({
            requirement: {
              id: `seo-issue-${index}`,
              type: 'seo',
              description: `[Auto-Detected] ${issue.category}: ${issue.message}`,
              priority: issue.type === 'critical' ? 'critical' : issue.type === 'warning' ? 'high' : 'medium',
              expected: {},
              status: 'fail',
            },
            status: 'fail',
            evidence: { issue },
            recommendations: [issue.message],
            confidence: 0.9,
          });
        });
      }

      return results;
    } catch (error) {
      console.error('SEO Audit failed:', error);

      // Return a single failed result
      return [{
        requirement: {
          id: 'seo-error',
          type: 'seo',
          description: 'SEO Analysis',
          priority: 'critical',
          expected: {},
          status: 'fail',
        },
        status: 'fail',
        evidence: { error: error instanceof Error ? error.message : 'Unknown error' },
        recommendations: ['Check URL accessibility and try again'],
        confidence: 0,
      }];
    }
  }

  /**
   * Run WordPress Audit
   */
  async runWordPressAudit(url: string, requirements: QARequirement[]): Promise<QAResult[]> {
    try {
      const response = await fetch('/api/qualifai/wordpress-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error(`WordPress analysis failed: ${response.statusText}`);
      }

      const wpAnalysis = await response.json();
      const results: QAResult[] = [];

      // 1. Check if it is WordPress
      results.push({
        requirement: {
          id: 'wp-detection',
          type: 'technical',
          priority: 'critical',
          description: 'Verify WordPress Platform',
          expected: { isWordPress: true },
          status: wpAnalysis.isWordPress ? 'pass' : 'fail'
        },
        status: wpAnalysis.isWordPress ? 'pass' : 'fail',
        evidence: { isWordPress: wpAnalysis.isWordPress, wpAnalysis }, // Attach full analysis here
        recommendations: wpAnalysis.isWordPress ? [] : ['Ensure the site is built with WordPress'],
        confidence: 1.0
      });

      if (wpAnalysis.isWordPress) {
        // Version Check
        results.push({
          requirement: {
            id: 'wp-version',
            type: 'technical',
            priority: 'medium',
            description: 'WordPress Version Check',
            expected: { hidden: true },
            status: wpAnalysis.version ? 'warning' : 'pass'
          },
          status: wpAnalysis.version ? 'warning' : 'pass',
          evidence: { version: wpAnalysis.version },
          recommendations: wpAnalysis.version ? ['Hide WordPress version to improve security'] : [],
          confidence: 0.9
        });

        // HTTPS Check
        results.push({
          requirement: {
            id: 'wp-https',
            type: 'technical',
            priority: 'critical',
            description: 'HTTPS Security',
            expected: { https: true },
            status: wpAnalysis.security.https ? 'pass' : 'fail'
          },
          status: wpAnalysis.security.https ? 'pass' : 'fail',
          evidence: { https: wpAnalysis.security.https },
          recommendations: wpAnalysis.security.https ? [] : ['Enable HTTPS for the website'],
          confidence: 1.0
        });

        // Add issues found
        if (wpAnalysis.issues && wpAnalysis.issues.length > 0) {
          wpAnalysis.issues.forEach((issue: any, index: number) => {
            results.push({
              requirement: {
                id: `wp-issue-${index}`,
                type: 'technical',
                description: `[Auto-Detected] ${issue.category}: ${issue.message}`,
                priority: issue.type === 'critical' ? 'critical' : issue.type === 'warning' ? 'high' : 'medium',
                expected: {},
                status: 'fail',
              },
              status: 'fail',
              evidence: { issue },
              recommendations: [issue.message],
              confidence: 0.9,
            });
          });
        }
      }

      return results;

    } catch (error) {
      console.error('WordPress Audit failed:', error);
      return [{
        requirement: {
          id: 'wp-error',
          type: 'technical',
          description: 'WordPress Analysis',
          priority: 'critical',
          expected: {},
          status: 'fail',
        },
        status: 'fail',
        evidence: { error: error instanceof Error ? error.message : 'Unknown error' },
        recommendations: ['Check URL accessibility and try again'],
        confidence: 0,
      }];
    }
  }

  // Run PPC QA
  async runPPCAudit(
    credentials: any,
    requirements: QARequirement[]
  ): Promise<QAResult[]> {
    const results: QAResult[] = [];

    for (const requirement of requirements) {
      try {
        const prompt = `
        Analyze PPC campaign performance.

        REQUIREMENT: ${requirement.description}
        EXPECTED: ${JSON.stringify(requirement.expected)}

        Check campaign metrics, ad quality, targeting, budget utilization.
        Provide analysis in JSON format.
        `;

        const analysis = await aiService.analyzeWithPrompt(prompt, "gpt-4");
        results.push({
          requirement,
          ...analysis,
        });
      } catch (error) {
        console.error(
          `PPC QA failed for requirement: ${requirement.description}`,
          error
        );
        results.push({
          requirement,
          status: "fail",
          evidence: { error: error.message },
          recommendations: ["Check requirement specification and try again"],
          confidence: 0,
        });
      }
    }

    return results;
  }

  // Run Content QA
  async runContentAudit(
    credentials: any,
    requirements: QARequirement[]
  ): Promise<QAResult[]> {
    const results: QAResult[] = [];

    for (const requirement of requirements) {
      try {
        const prompt = `
        Analyze content quality.

        REQUIREMENT: ${requirement.description}
        EXPECTED: ${JSON.stringify(requirement.expected)}

        Check content quality, grammar, tone, structure, SEO optimization.
        Provide analysis in JSON format.
        `;

        const analysis = await aiService.analyzeWithPrompt(prompt, "gpt-4");
        results.push({
          requirement,
          ...analysis,
        });
      } catch (error) {
        console.error(
          `Content QA failed for requirement: ${requirement.description}`,
          error
        );
        results.push({
          requirement,
          status: "fail",
          evidence: { error: error.message },
          recommendations: ["Check requirement specification and try again"],
          confidence: 0,
        });
      }
    }

    return results;
  }

  // Similar methods for other QA types...
}

export const qualifAIService = new QualifAIService();
