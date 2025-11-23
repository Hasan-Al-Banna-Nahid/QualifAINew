// services/ai.service.ts
export interface AIPrompt {
  model:
    | "gpt-4"
    | "gpt-5"
    | "claude-2"
    | "gemini-pro"
    | "gemini-flash"
    | "llama-2"
    | "nanobanana";
  messages: Array<{
    role: "user" | "system" | "assistant";
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
}

export interface AIAnalysisResponse {
  analysis: {
    sentiment: "positive" | "negative" | "neutral";
    priority: "low" | "medium" | "high" | "critical";
    recommendations: string[];
    riskAssessment: string;
    predictedGrowth: number;
    marketPositioning?: string;
    competitiveAdvantages?: string[];
    scalability?: string;
    strategicValue?: string;
    shortTermActions?: string[];
    mediumTermInitiatives?: string[];
    longTermStrategy?: string[];
  };
  reasoning: string;
  confidence: number;
}

export interface ClientData {
  company: string;
  industry: string;
  serviceType: string;
  serviceTier: "basic" | "standard" | "premium" | "enterprise";
  monthlyRetainer: number;
  projectDescription: string;
  projectGoals: string[];
  technologies: string[];
  status?: "active" | "inactive" | "pending";
  contractDuration?: number; // months
  teamSize?: number;
  previousSuccessRate?: number; // percentage
}

class AIService {
  private apiKey: string;
  private baseURL = "https://openrouter.ai/api/v1";

  constructor(apiKey?: string) {
    // Use provided API key or try to get from environment
    this.apiKey =
      apiKey ||
      process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
      process.env.OPENROUTER_API_KEY ||
      "";

    if (!this.apiKey) {
      console.warn(
        "OPENROUTER_API_KEY is not set. AI analysis will use fallback mode."
      );
      // Don't throw error, just use fallback analysis
    }
  }

  // Check if API key is available
  private isApiAvailable(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  // O(1) model selection with updated models
  private getModelConfig(model: string) {
    const models: Record<
      string,
      { name: string; maxTokens: number; costPer1k: number }
    > = {
      "gpt-4": { name: "openai/gpt-4", maxTokens: 8192, costPer1k: 0.06 },
      "gpt-5": { name: "openai/gpt-5", maxTokens: 16384, costPer1k: 0.15 },
      "claude-2": {
        name: "anthropic/claude-2",
        maxTokens: 4096,
        costPer1k: 0.08,
      },
      "gemini-pro": {
        name: "google/gemini-pro",
        maxTokens: 4096,
        costPer1k: 0.035,
      },
      "gemini-flash": {
        name: "google/gemini-flash",
        maxTokens: 8192,
        costPer1k: 0.018,
      },
      "llama-2": {
        name: "meta-llama/llama-2-70b-chat",
        maxTokens: 4096,
        costPer1k: 0.02,
      },
      nanobanana: {
        name: "nano-b/nanobanana",
        maxTokens: 2048,
        costPer1k: 0.001,
      },
    };
    return models[model] || models["gpt-4"];
  }

  // O(1) prompt templates with safe array access
  private getAnalysisPrompt(clientData: any): string {
    // Add safe access with fallbacks
    const projectGoals = clientData.projectGoals || ["Not specified"];
    const technologies = clientData.technologies || ["Not specified"];
    const serviceTier = clientData.serviceTier || "standard";
    const monthlyRetainer = clientData.monthlyRetainer || 0;
    const contractDuration = clientData.contractDuration || 12;
    const teamSize = clientData.teamSize || "Not specified";
    const previousSuccessRate =
      clientData.previousSuccessRate || "Not available";
    const industry = clientData.industry || "Not specified";
    const projectDescription = clientData.projectDescription || "Not specified";

    return `
    Analyze this client data and provide a comprehensive business analysis:

    CLIENT DATA:
    - Company: ${clientData.company}
    - Industry: ${industry}
    - Service: ${clientData.serviceType} (${serviceTier})
    - Monthly Retainer: $${monthlyRetainer}
    - Contract Duration: ${contractDuration} months
    - Team Size: ${teamSize}
    - Previous Success Rate: ${previousSuccessRate}%
    - Project: ${projectDescription}
    - Goals: ${projectGoals.join(", ")}
    - Technologies: ${technologies.join(", ")}

    Please analyze and return JSON with:
    1. sentiment: "positive", "negative", or "neutral" based on project viability
    2. priority: "low", "medium", "high", or "critical" based on business impact
    3. recommendations: array of 3-5 actionable recommendations
    4. riskAssessment: brief risk analysis (1-2 sentences)
    5. predictedGrowth: estimated growth percentage (0-100)

    Return only valid JSON, no other text.
    `;
  }

  // Main analysis function with enhanced capabilities
  async AIClientAnalysis(
    clientData: ClientData,
    options: {
      model?:
        | "gpt-4"
        | "gpt-5"
        | "claude-2"
        | "gemini-pro"
        | "gemini-flash"
        | "llama-2"
        | "nanobanana";
      detailed?: boolean;
      includeComparative?: boolean;
      budgetOptimized?: boolean;
    } = {}
  ): Promise<AIAnalysisResponse> {
    const {
      model = "gpt-4",
      detailed = false,
      includeComparative = false,
      budgetOptimized = false,
    } = options;

    // If no API key, return fallback analysis immediately
    if (!this.isApiAvailable()) {
      console.warn("No API key available, using fallback analysis");
      return this.getEnhancedFallbackAnalysis(clientData, detailed);
    }

    // Auto-select budget-optimized model if requested
    const finalModel = budgetOptimized ? this.getBudgetOptimizedModel() : model;

    try {
      // Enhanced prompt for more detailed analysis when requested
      const enhancedPrompt = detailed
        ? this.getDetailedAnalysisPrompt(clientData, includeComparative)
        : this.getAnalysisPrompt(clientData);

      const modelConfig = this.getModelConfig(finalModel);

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://yourdomain.com",
          "X-Title": "Client Management AI",
        },
        body: JSON.stringify({
          model: modelConfig.name,
          messages: [
            {
              role: "system",
              content: detailed
                ? "You are a senior business analyst AI. Provide comprehensive, detailed analysis with strategic insights and comparative context when available. Focus on actionable business intelligence."
                : "You are a business analyst AI. Analyze client data and provide structured JSON responses with business insights. Be concise and practical.",
            },
            {
              role: "user",
              content: enhancedPrompt,
            },
          ],
          max_tokens: detailed
            ? Math.min(modelConfig.maxTokens * 1.2, 12000)
            : modelConfig.maxTokens,
          temperature: detailed ? 0.2 : 0.3,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Invalid response format from AI API");
      }

      const analysis = JSON.parse(data.choices[0].message.content);

      // Calculate dynamic confidence based on response quality and model
      const confidence = this.calculateConfidence(analysis, data, finalModel);

      return {
        analysis,
        reasoning:
          data.choices[0].message.reasoning ||
          this.extractReasoningFromContent(data.choices[0].message.content) ||
          "Analysis completed successfully",
        confidence,
      };
    } catch (error) {
      console.error("AIClientAnalysis failed:", error);
      // Enhanced fallback with more context
      return this.getEnhancedFallbackAnalysis(clientData, detailed);
    }
  }

  // Budget optimization for model selection
  private getBudgetOptimizedModel(): "gemini-flash" | "nanobanana" | "llama-2" {
    const models = ["gemini-flash", "nanobanana", "llama-2"] as const;
    return models[Math.floor(Math.random() * models.length)];
  }

  private getDetailedAnalysisPrompt(
    clientData: ClientData,
    includeComparative: boolean
  ): string {
    const basePrompt = this.getAnalysisPrompt(clientData);

    if (!includeComparative) {
      return `${basePrompt}

      ADDITIONAL DETAILED ANALYSIS:
      Provide comprehensive analysis including:
      - Market positioning and competitive landscape
      - Financial viability and ROI projections
      - Technical stack assessment
      - Risk mitigation strategies
      - Strategic growth recommendations
      `;
    }

    return `
    ${basePrompt}

    COMPREHENSIVE BUSINESS INTELLIGENCE ANALYSIS:

    1. MARKET POSITIONING & COMPETITIVE ANALYSIS:
       - Industry standing and competitive landscape assessment
       - Unique value propositions and differentiation factors
       - Market share potential and expansion opportunities

    2. FINANCIAL VIABILITY & ROI ANALYSIS:
       - Return on investment projections and break-even analysis
       - Cost structure optimization opportunities
       - Revenue growth projections and financial sustainability
       - Budget allocation efficiency

    3. TECHNICAL ASSESSMENT & SCALABILITY:
       - Technology stack suitability and modernization needs
       - Scalability considerations and infrastructure requirements
       - Integration capabilities with existing systems
       - Technical debt assessment

    4. RISK ASSESSMENT & MITIGATION STRATEGIES:
       - Key risk factors (market, technical, operational, financial)
       - Comprehensive mitigation strategies
       - Compliance and regulatory considerations
       - Dependency and vendor risk analysis

    5. STRATEGIC RECOMMENDATIONS & ROADMAP:
       - Short-term actions (0-3 months): Quick wins and immediate improvements
       - Medium-term initiatives (3-12 months): Strategic projects and optimizations
       - Long-term strategic moves (1+ years): Transformational initiatives

    6. PERFORMANCE METRICS & SUCCESS INDICATORS:
       - Key performance indicators (KPIs) to track
       - Success measurement framework
       - Benchmarking against industry standards

    Return comprehensive JSON analysis with all above sections.
    `;
  }

  private calculateConfidence(
    analysis: any,
    responseData: any,
    model: string
  ): number {
    let confidence = 0.8; // Base confidence

    // Model-specific confidence adjustments
    const modelConfidence: Record<string, number> = {
      "gpt-5": 0.95,
      "gpt-4": 0.9,
      "claude-2": 0.88,
      "gemini-pro": 0.85,
      "gemini-flash": 0.82,
      "llama-2": 0.8,
      nanobanana: 0.75,
    };

    confidence = modelConfidence[model] || confidence;

    // Adjust confidence based on analysis completeness
    if (analysis.sentiment && analysis.priority && analysis.recommendations) {
      confidence += 0.05;
    }

    if (analysis.recommendations?.length >= 3) {
      confidence += 0.03;
    }

    if (analysis.riskAssessment && analysis.riskAssessment.length > 20) {
      confidence += 0.02;
    }

    // Additional points for detailed analysis
    if (analysis.marketPositioning || analysis.competitiveAdvantages) {
      confidence += 0.05;
    }

    // Cap at 0.98 to maintain realism
    return Math.min(confidence, 0.98);
  }

  private extractReasoningFromContent(content: string): string {
    try {
      const parsed = JSON.parse(content);
      if (parsed.reasoning) {
        return parsed.reasoning;
      }
      // Extract first 200 characters as reasoning fallback
      return JSON.stringify(parsed).substring(0, 200) + "...";
    } catch {
      return content.substring(0, 200) + "...";
    }
  }

  private getEnhancedFallbackAnalysis(
    clientData: ClientData,
    detailed: boolean
  ): AIAnalysisResponse {
    const tierScore = { basic: 1, standard: 2, premium: 3, enterprise: 4 };
    const score = tierScore[clientData.serviceTier] || 1;

    // Calculate dynamic growth based on multiple factors
    const growthFactor =
      score * 15 +
      (clientData.contractDuration || 12) * 0.5 +
      (clientData.previousSuccessRate || 50) * 0.1;

    const baseAnalysis = {
      sentiment: score >= 3 ? "positive" : score >= 2 ? "neutral" : "negative",
      priority:
        score >= 4
          ? "critical"
          : score >= 3
          ? "high"
          : score >= 2
          ? "medium"
          : "low",
      recommendations: [
        "Establish clear communication and reporting protocols",
        "Define and track key performance indicators",
        "Schedule regular strategic review meetings",
        "Monitor market trends and competitive landscape",
      ],
      riskAssessment:
        "Moderate risk profile with identified growth opportunities. Regular monitoring recommended.",
      predictedGrowth: Math.min(Math.max(growthFactor, 5), 85),
    };

    if (detailed) {
      return {
        analysis: {
          ...baseAnalysis,
          marketPositioning: `Established player in ${clientData.industry} industry`,
          competitiveAdvantages: [
            "Stable service offering",
            "Reasonable market positioning",
            "Growth potential",
          ],
          scalability:
            "Moderate scalability with proper infrastructure investments",
          strategicValue:
            "Medium to long-term partnership value with growth potential",
          shortTermActions: [
            "Establish clear communication protocols",
            "Define success metrics and KPIs",
            "Conduct initial risk assessment workshop",
          ],
          mediumTermInitiatives: [
            "Explore service expansion opportunities",
            "Optimize operational efficiency",
            "Develop client-specific success metrics",
          ],
          longTermStrategy: [
            "Develop strategic partnership framework",
            "Plan for scalable growth initiatives",
            "Establish industry thought leadership",
          ],
        },
        reasoning:
          "Enhanced fallback analysis generated due to AI service unavailability. Based on tier scoring and industry patterns.",
        confidence: 0.65,
      };
    }

    return {
      analysis: baseAnalysis,
      reasoning: "Fallback analysis generated due to AI service unavailability",
      confidence: 0.55,
    };
  }

  // Batch analysis for multiple clients
  async analyzeMultipleClients(
    clients: ClientData[],
    options: {
      model?:
        | "gpt-4"
        | "gpt-5"
        | "claude-2"
        | "gemini-pro"
        | "gemini-flash"
        | "llama-2"
        | "nanobanana";
      concurrent?: boolean;
      budgetOptimized?: boolean;
    } = {}
  ): Promise<{ [company: string]: AIAnalysisResponse }> {
    const {
      model = "gpt-4",
      concurrent = true,
      budgetOptimized = false,
    } = options;

    const analyses: { [company: string]: AIAnalysisResponse } = {};

    // If no API key, return fallback for all clients
    if (!this.isApiAvailable()) {
      clients.forEach((client) => {
        analyses[client.company] = this.getEnhancedFallbackAnalysis(
          client,
          false
        );
      });
      return analyses;
    }

    if (concurrent) {
      // Process clients in parallel with rate limiting consideration
      const analysisPromises = clients.map(async (client) => {
        try {
          const analysis = await this.AIClientAnalysis(client, {
            model,
            budgetOptimized,
          });
          analyses[client.company] = analysis;
        } catch (error) {
          console.error(`Analysis failed for ${client.company}:`, error);
          analyses[client.company] = this.getEnhancedFallbackAnalysis(
            client,
            false
          );
        }
      });

      await Promise.all(analysisPromises);
    } else {
      // Sequential processing for rate limit compliance
      for (const client of clients) {
        try {
          const analysis = await this.AIClientAnalysis(client, {
            model,
            budgetOptimized,
          });
          analyses[client.company] = analysis;
          // Add delay between requests to respect rate limits
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Analysis failed for ${client.company}:`, error);
          analyses[client.company] = this.getEnhancedFallbackAnalysis(
            client,
            false
          );
        }
      }
    }

    return analyses;
  }

  // Model comparison utility
  async compareModels(
    clientData: ClientData,
    models: (
      | "gpt-4"
      | "gpt-5"
      | "claude-2"
      | "gemini-pro"
      | "gemini-flash"
      | "llama-2"
      | "nanobanana"
    )[] = ["gpt-5", "gemini-flash", "nanobanana"]
  ): Promise<{ [model: string]: AIAnalysisResponse }> {
    const comparisons: { [model: string]: AIAnalysisResponse } = {};

    // If no API key, return fallback for all models
    if (!this.isApiAvailable()) {
      models.forEach((model) => {
        comparisons[model] = this.getEnhancedFallbackAnalysis(
          clientData,
          false
        );
      });
      return comparisons;
    }

    for (const model of models) {
      try {
        const analysis = await this.AIClientAnalysis(clientData, { model });
        comparisons[model] = analysis;
      } catch (error) {
        console.error(`Model comparison failed for ${model}:`, error);
        comparisons[model] = this.getEnhancedFallbackAnalysis(
          clientData,
          false
        );
      }
    }

    return comparisons;
  }

  // Original analyzeClient method for backward compatibility
  async analyzeClient(
    clientData: any,
    model: string = "gpt-4"
  ): Promise<AIAnalysisResponse> {
    return this.AIClientAnalysis(clientData, { model: model as any });
  }

  // Generate client insights for dashboard
  async generateClientInsights(clients: any[], model: string = "gpt-4") {
    // If no API key, return fallback insights
    if (!this.isApiAvailable()) {
      return this.getFallbackInsights(clients);
    }

    const prompt = `
    Analyze these ${clients.length} clients and provide business insights:

    CLIENTS SUMMARY:
    ${clients
      .map(
        (client) =>
          `- ${client.company}: ${client.serviceType} (${client.status}), $${client.monthlyRetainer}/month, ${client.industry}`
      )
      .join("\n")}

    Provide insights on:
    1. Revenue distribution and trends
    2. Service type popularity and profitability
    3. Risk areas and mitigation opportunities
    4. Growth opportunities and strategic recommendations
    5. Industry concentration analysis

    Return as JSON with detailed analysis.
    `;

    return this.analyzeWithPrompt(prompt, model);
  }

  private async analyzeWithPrompt(prompt: string, model: string) {
    const modelConfig = this.getModelConfig(model);

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://yourdomain.com",
        "X-Title": "Client Management AI",
      },
      body: JSON.stringify({
        model: modelConfig.name,
        messages: [
          {
            role: "system",
            content:
              "You are a business intelligence analyst. Provide comprehensive insights and actionable recommendations based on client data analysis.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: modelConfig.maxTokens,
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  private getFallbackInsights(clients: any[]) {
    const totalRevenue = clients.reduce(
      (sum, client) => sum + (client.monthlyRetainer || 0),
      0
    );
    const industries = [...new Set(clients.map((client) => client.industry))];

    return {
      summary: {
        totalClients: clients.length,
        totalMonthlyRevenue: totalRevenue,
        averageRetainer: totalRevenue / clients.length,
        industries: industries,
      },
      insights: [
        "Consider diversifying service offerings to increase revenue",
        "Focus on retaining high-value clients in premium tiers",
        "Explore expansion opportunities in underrepresented industries",
      ],
      recommendations: [
        "Implement client success tracking metrics",
        "Develop industry-specific service packages",
        "Create tiered pricing strategies for different client sizes",
      ],
    };
  }
}

// Create instance with environment variable
export const aiService = new AIService(
  process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
);

// Utility function for quick analysis
export async function AIClientAnalysis(
  clientData: ClientData,
  options?: {
    model?:
      | "gpt-4"
      | "gpt-5"
      | "claude-2"
      | "gemini-pro"
      | "gemini-flash"
      | "llama-2"
      | "nanobanana";
    detailed?: boolean;
    includeComparative?: boolean;
    budgetOptimized?: boolean;
  }
): Promise<AIAnalysisResponse> {
  return aiService.AIClientAnalysis(clientData, options);
}
