import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { ComprehensiveAuditResult } from "./types";

export class MLAnalyzer {
  private pythonPath: string;
  private scriptPath: string;

  constructor() {
    // Try multiple python paths
    this.pythonPath =
      process.env.PYTHON_PATH || process.platform === "win32"
        ? "python"
        : "python3";

    // Try multiple possible script locations
    const possiblePaths = [
      path.join(process.cwd(), "scripts", "ml_analysis.py"),
      path.join(process.cwd(), "python", "ml_analysis.py"),
      path.join(__dirname, "python", "ml_analysis.py"),
      path.join(
        process.cwd(),
        "app",
        "api",
        "seo-audit",
        "python",
        "ml_analysis.py",
      ),
    ];

    // Find the first existing path
    this.scriptPath =
      possiblePaths.find((p) => fs.existsSync(p)) || possiblePaths[0];

    console.log(`ML Analyzer: Python path: ${this.pythonPath}`);
    console.log(`ML Analyzer: Script path: ${this.scriptPath}`);

    // Check if script exists
    if (!fs.existsSync(this.scriptPath)) {
      console.warn(
        `ML Analyzer: Python script not found at ${this.scriptPath}`,
      );
      console.warn("ML Analyzer: Will use fallback analysis");
    }
  }

  async analyze(auditData: ComprehensiveAuditResult): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const inputData = JSON.stringify({
          siteHealth: auditData.siteHealth,
          topIssues: auditData.topIssues,
          errors: this.countIssues(auditData.errors),
          warnings: this.countIssues(auditData.warnings),
          notices: this.countIssues(auditData.notices),
          timestamp: new Date().toISOString(),
        });

        // If script doesn't exist, return fallback analysis
        if (!fs.existsSync(this.scriptPath)) {
          console.log("ML Analyzer: Using fallback analysis");
          resolve(this.getFallbackAnalysis(auditData));
          return;
        }

        const python = spawn(this.pythonPath, [this.scriptPath, inputData]);

        let outputData = "";
        let errorData = "";

        python.stdout.on("data", (data) => {
          outputData += data.toString();
        });

        python.stderr.on("data", (data) => {
          errorData += data.toString();
        });

        python.on("close", (code) => {
          if (code !== 0) {
            console.error("Python ML Error:", errorData);
            // Use fallback instead of rejecting
            console.log("ML Analyzer: Using fallback due to Python error");
            resolve(this.getFallbackAnalysis(auditData));
            return;
          }

          try {
            const result = JSON.parse(outputData);
            console.log("ML Analyzer: Successfully analyzed with Python");
            resolve(result);
          } catch (error) {
            console.error("ML Analyzer: Failed to parse Python output:", error);
            resolve(this.getFallbackAnalysis(auditData));
          }
        });

        // Handle spawn errors
        python.on("error", (error) => {
          console.error("ML Analyzer: Python process error:", error.message);
          resolve(this.getFallbackAnalysis(auditData));
        });
      } catch (error) {
        console.error("ML Analyzer: General error:", error);
        resolve(this.getFallbackAnalysis(auditData));
      }
    });
  }

  private countIssues(issues: any): Record<string, number> {
    const counts: Record<string, number> = {};
    Object.entries(issues).forEach(([key, value]: [string, any]) => {
      counts[key] = value.count || 0;
    });
    return counts;
  }

  private getFallbackAnalysis(auditData: ComprehensiveAuditResult): any {
    const healthScore = auditData.siteHealth.score;
    const errors = auditData.siteHealth.errors;
    const warnings = auditData.siteHealth.warnings;

    return {
      status: "fallback",
      timestamp: new Date().toISOString(),
      ranking_prediction: {
        predicted_rank: Math.max(1, 100 - healthScore),
        confidence: Math.min(0.9, healthScore / 100),
        factors: ["health_score", "error_count"],
        explanation: "Based on simplified analysis",
      },
      content_quality_score: {
        overall_score: Math.max(30, healthScore),
        grade: healthScore >= 80 ? "B" : healthScore >= 60 ? "C" : "D",
        factors: ["basic_analysis"],
        improvement_areas: ["Fix critical issues first"],
      },
      traffic_forecast: {
        predicted_increase: `${Math.min(30, (100 - healthScore) / 2)}%`,
        timeframe: "3-6 months",
        confidence: 0.5,
        assumptions: ["Basic improvements implemented"],
      },
      priority_recommendations: [
        {
          issue: errors > 0 ? "Critical Errors" : "Site Optimization",
          priority: errors > 0 ? "high" : "medium",
          estimated_impact: `${Math.min(30, errors * 2)}% improvement`,
          description:
            errors > 0
              ? `Fix ${errors} critical errors`
              : "Improve overall SEO",
        },
      ],
      ml_models_used: ["Fallback analysis"],
      data_summary: {
        total_pages_analyzed: auditData.siteHealth.crawledPages,
        total_issues: errors + warnings,
        health_score: healthScore,
        scan_completeness: "complete",
      },
    };
  }
}
