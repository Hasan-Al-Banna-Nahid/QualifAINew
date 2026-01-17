// auditDataGenerator.ts
export type CheckStatus = "pass" | "warning" | "fail";
export type CheckCategory = "Technical" | "On-Page" | "Performance" | "Content";
export type CheckImportance = "critical" | "high" | "medium" | "low";

export interface AuditCheck {
  id: number;
  name: string;
  category: CheckCategory;
  status: CheckStatus;
  importance: CheckImportance;
  score: number;
  issue?: string | null;
  recommendation?: string | null;
}

export interface AuditData {
  url: string;
  timestamp: string;
  overallScore: number;
  checks: AuditCheck[];
  summary: {
    passes: number;
    warnings: number;
    errors: number;
    crawledPages: number;
  };
  categoryScores: {
    Technical: number;
    "On-Page": number;
    Performance: number;
    Content: number;
  };
  traffic?: {
    organic: number;
    keywords: number;
    backlinks: number;
    domains: number;
  };
}

// Main function to generate dummy audit data
export function generateAuditData(url: string): AuditData {
  const checks: AuditCheck[] = [];

  const sampleChecks: Omit<AuditCheck, "id" | "score">[] = [
    {
      name: "HTTPS",
      category: "Technical",
      status: "pass",
      importance: "critical",
    },
    {
      name: "HSTS Header",
      category: "Technical",
      status: "fail",
      importance: "high",
      issue: "Missing HSTS header",
    },
    {
      name: "Title Tag",
      category: "On-Page",
      status: "pass",
      importance: "critical",
    },
    {
      name: "Meta Description",
      category: "On-Page",
      status: "fail",
      importance: "high",
      issue: "Missing meta description",
    },
    {
      name: "Page Load Time",
      category: "Performance",
      status: "warning",
      importance: "high",
      issue: "3.5s > 3s",
    },
    {
      name: "Content Quality",
      category: "Content",
      status: "pass",
      importance: "critical",
    },
  ];

  sampleChecks.forEach((check, index) => {
    checks.push({
      id: index + 1,
      score:
        check.status === "pass" ? 100 : check.status === "warning" ? 50 : 0,
      recommendation: check.issue ? "Fix the issue" : null,
      ...check,
    });
  });

  const totalScore = Math.round(
    checks.reduce((sum, c) => sum + c.score, 0) / checks.length
  );

  const categoryScores = {
    Technical: Math.round(
      checks
        .filter((c) => c.category === "Technical")
        .reduce((s, c) => s + c.score, 0) /
        checks.filter((c) => c.category === "Technical").length
    ),
    "On-Page": Math.round(
      checks
        .filter((c) => c.category === "On-Page")
        .reduce((s, c) => s + c.score, 0) /
        checks.filter((c) => c.category === "On-Page").length
    ),
    Performance: Math.round(
      checks
        .filter((c) => c.category === "Performance")
        .reduce((s, c) => s + c.score, 0) /
        checks.filter((c) => c.category === "Performance").length
    ),
    Content: Math.round(
      checks
        .filter((c) => c.category === "Content")
        .reduce((s, c) => s + c.score, 0) /
        checks.filter((c) => c.category === "Content").length
    ),
  };

  const summary = {
    passes: checks.filter((c) => c.status === "pass").length,
    warnings: checks.filter((c) => c.status === "warning").length,
    errors: checks.filter((c) => c.status === "fail").length,
    crawledPages: 10,
  };

  return {
    url,
    timestamp: new Date().toISOString(),
    overallScore: totalScore,
    checks,
    summary,
    categoryScores,
    traffic: {
      organic: 12345,
      keywords: 234,
      backlinks: 345,
      domains: 12,
    },
  };
}
