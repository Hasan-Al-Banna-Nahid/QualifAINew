interface AuditData {
  url: string;
  timestamp: string;
  overallScore: number;
  summary: any;
  categoryScores: any;
  checks: any[];
  realIssues?: any;
  dns?: any;
  security?: any;
  performance?: any;
  traffic?: any;
}

export function generatePDFReport(auditData: AuditData): string {
  const date = new Date(auditData.timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const criticalIssues = auditData.checks.filter(
    (c) => c.status === "fail" && c.importance === "critical"
  );
  const highIssues = auditData.checks.filter(
    (c) => c.status === "fail" && c.importance === "high"
  );
  const warnings = auditData.checks.filter((c) => c.status === "warning");

  let report = `
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║                    QUALIFAI SEO AUDIT REPORT                       ║
║                   Professional SEO Analysis                        ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUDIT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Website URL:        ${auditData.url}
Audit Date:         ${date}
Overall SEO Score:  ${auditData.overallScore}/100

Status:             ${
    auditData.overallScore >= 80
      ? "✓ EXCELLENT"
      : auditData.overallScore >= 60
      ? "⚠ GOOD"
      : "✗ NEEDS IMPROVEMENT"
  }

Pages Crawled:      ${auditData.summary.crawledPages}
Total Checks:       ${auditData.checks.length}

Issues Found:
  ✓ Passed:         ${auditData.summary.passes}
  ⚠ Warnings:       ${auditData.summary.warnings}
  ✗ Errors:         ${auditData.summary.errors}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY SCORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Technical SEO:      ${auditData.categoryScores.Technical}/100 ${getScoreBar(
    auditData.categoryScores.Technical
  )}
On-Page SEO:        ${auditData.categoryScores["On-Page"]}/100 ${getScoreBar(
    auditData.categoryScores["On-Page"]
  )}
Performance:        ${auditData.categoryScores.Performance}/100 ${getScoreBar(
    auditData.categoryScores.Performance
  )}
Content Quality:    ${auditData.categoryScores.Content}/100 ${getScoreBar(
    auditData.categoryScores.Content
  )}

`;

  // Real Issues Section
  if (auditData.realIssues) {
    report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL ISSUES DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    // Missing H1
    if (auditData.realIssues.missingH1?.length > 0) {
      report += `\n[CRITICAL] H1 HEADING ISSUES\n`;
      report += `${"─".repeat(70)}\n`;
      auditData.realIssues.missingH1.forEach((issue: any) => {
        report += `Issue:          ${issue.issue}\n`;
        report += `Recommendation: ${issue.recommendation}\n\n`;
      });
    }

    // Long Titles
    if (auditData.realIssues.longTitles?.length > 0) {
      report += `\n[WARNING] TITLE TAG TOO LONG\n`;
      report += `${"─".repeat(70)}\n`;
      auditData.realIssues.longTitles.forEach((issue: any) => {
        report += `Title:  "${issue.title}"\n`;
        report += `Length: ${issue.length} characters (recommended: 50-60)\n`;
        report += `Fix:    ${issue.recommendation}\n\n`;
      });
    }

    // Missing Meta Description
    if (auditData.realIssues.missingMetaDesc?.length > 0) {
      report += `\n[HIGH] MISSING META DESCRIPTION\n`;
      report += `${"─".repeat(70)}\n`;
      auditData.realIssues.missingMetaDesc.forEach((issue: any) => {
        report += `Issue:          ${issue.issue}\n`;
        report += `Recommendation: ${issue.recommendation}\n\n`;
      });
    }

    // Missing Alt Text
    if (auditData.realIssues.missingAltText?.length > 0) {
      report += `\n[HIGH] IMAGES WITHOUT ALT TEXT\n`;
      report += `${"─".repeat(70)}\n`;
      auditData.realIssues.missingAltText.forEach((issue: any) => {
        report += `Total Images: ${issue.count}\n`;
        report += `Fix: ${issue.recommendation}\n\n`;
        report += `Sample Images:\n`;
        issue.images.slice(0, 5).forEach((img: string, i: number) => {
          report += `  ${i + 1}. ${img}\n`;
        });
        if (issue.count > 5) {
          report += `  ... and ${issue.count - 5} more\n`;
        }
        report += `\n`;
      });
    }

    // Broken Links
    if (auditData.realIssues.brokenLinks?.length > 0) {
      report += `\n[HIGH] BROKEN LINKS DETECTED\n`;
      report += `${"─".repeat(70)}\n`;
      auditData.realIssues.brokenLinks.forEach((issue: any) => {
        report += `Total Broken: ${issue.count}\n`;
        report += `Fix: ${issue.recommendation}\n\n`;
        report += `Broken URLs:\n`;
        issue.links.forEach((link: string, i: number) => {
          report += `  ${i + 1}. ${link}\n`;
        });
        report += `\n`;
      });
    }

    // Low Text Ratio
    if (auditData.realIssues.lowTextRatio?.length > 0) {
      report += `\n[WARNING] LOW TEXT-TO-HTML RATIO\n`;
      report += `${"─".repeat(70)}\n`;
      auditData.realIssues.lowTextRatio.forEach((issue: any) => {
        report += `Current Ratio:  ${issue.ratio}%\n`;
        report += `Recommendation: ${issue.recommendation}\n\n`;
      });
    }
  }

  // Critical Issues
  report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL ISSUES (${criticalIssues.length})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  if (criticalIssues.length === 0) {
    report += `\n✓ No critical issues found!\n`;
  } else {
    criticalIssues.forEach((check, i) => {
      report += `\n${i + 1}. ${check.name} [${check.category}]\n`;
      report += `   ${check.description}\n`;
      if (check.issue) {
        report += `   Problem: ${check.issue}\n`;
      }
      report += `   Recommendation: ${check.recommendation}\n`;
    });
  }

  // High Priority Issues
  report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HIGH PRIORITY ISSUES (${highIssues.length})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  if (highIssues.length === 0) {
    report += `\n✓ No high priority issues found!\n`;
  } else {
    highIssues.forEach((check, i) => {
      report += `\n${i + 1}. ${check.name} [${check.category}]\n`;
      report += `   ${check.description}\n`;
      if (check.issue) {
        report += `   Problem: ${check.issue}\n`;
      }
      report += `   Recommendation: ${check.recommendation}\n`;
    });
  }

  // Warnings
  report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WARNINGS (${warnings.length})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  if (warnings.length === 0) {
    report += `\n✓ No warnings!\n`;
  } else {
    warnings.slice(0, 10).forEach((check, i) => {
      report += `\n${i + 1}. ${check.name} [${check.category}]\n`;
      if (check.issue) {
        report += `   ${check.issue}\n`;
      }
      report += `   ${check.recommendation}\n`;
    });
    if (warnings.length > 10) {
      report += `\n... and ${warnings.length - 10} more warnings\n`;
    }
  }

  // Technical Details
  if (auditData.performance) {
    report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERFORMANCE METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Page Load Time:           ${auditData.performance.loadTime}ms
Page Size:                ${(auditData.performance.pageSize / 1024).toFixed(
      2
    )} KB
Total HTTP Requests:      ${auditData.performance.requests}

Core Web Vitals:
  LCP (Largest Contentful Paint):  ${auditData.performance.coreWebVitals.lcp.toFixed(
    0
  )}ms
  FID (First Input Delay):          ${auditData.performance.coreWebVitals.fid.toFixed(
    0
  )}ms
  CLS (Cumulative Layout Shift):    ${auditData.performance.coreWebVitals.cls.toFixed(
    3
  )}

PageSpeed Insights:
  Mobile Score:   ${auditData.performance.pageSpeedInsights.mobile}/100
  Desktop Score:  ${auditData.performance.pageSpeedInsights.desktop}/100
`;
  }

  // Security
  if (auditData.security) {
    report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECURITY ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SSL Certificate:          ${
      auditData.security.ssl.valid ? "✓ Valid" : "✗ Invalid"
    }
HTTPS:                    ${auditData.security.ssl.protocol}
HSTS Header:              ${
      auditData.security.hsts.present ? "✓ Present" : "✗ Missing"
    }
Content Security Policy:  ${
      auditData.security.csp.present ? "✓ Implemented" : "✗ Not Implemented"
    }
XSS Protection:           ${
      auditData.security.xssProtection ? "✓ Enabled" : "✗ Disabled"
    }
Clickjacking Protection:  ${
      auditData.security.clickjackingProtection ? "✓ Enabled" : "✗ Disabled"
    }
MIME Sniffing Protection: ${
      auditData.security.mimeSniffingProtection ? "✓ Enabled" : "✗ Disabled"
    }
`;
  }

  // Traffic Estimation
  if (auditData.traffic) {
    report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRAFFIC ESTIMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Organic Traffic:
  Monthly Visits:         ${auditData.traffic.organic.monthly.toLocaleString()}
  Ranking Keywords:       ${auditData.traffic.organic.keywords.toLocaleString()}

Backlink Profile:
  Total Backlinks:        ${auditData.traffic.backlinks.total.toLocaleString()}
  Referring Domains:      ${auditData.traffic.backlinks.domains.toLocaleString()}
  Quality Score:          ${auditData.traffic.backlinks.quality}

Domain Authority:         ${auditData.traffic.authority.domain.toFixed(0)}/100
Page Authority:           ${auditData.traffic.authority.page.toFixed(0)}/100
`;
  }

  // Recommendations
  report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTION PLAN & RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMMEDIATE ACTIONS (Critical Priority):
`;

  criticalIssues.slice(0, 5).forEach((check, i) => {
    report += `\n  ${i + 1}. ${check.name}\n`;
    report += `     ${check.recommendation}\n`;
  });

  report += `\nSHORT-TERM IMPROVEMENTS (High Priority):
`;

  highIssues.slice(0, 5).forEach((check, i) => {
    report += `\n  ${i + 1}. ${check.name}\n`;
    report += `     ${check.recommendation}\n`;
  });

  report += `\nLONG-TERM OPTIMIZATIONS:
`;

  warnings.slice(0, 5).forEach((check, i) => {
    report += `\n  ${i + 1}. ${check.name}\n`;
    report += `     ${check.recommendation}\n`;
  });

  report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Address all CRITICAL issues immediately
2. Fix HIGH priority items within 1-2 weeks
3. Gradually improve WARNING items
4. Re-run this audit monthly to track progress
5. Monitor your rankings and traffic improvements

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report Generated by: Qualifai SEO Audit Tool
Date: ${date}
Total Checks Performed: ${auditData.checks.length}

For support or questions, visit: https://qualifai.com/support

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  return report;
}

function getScoreBar(score: number): string {
  const filled = Math.floor(score / 10);
  const empty = 10 - filled;
  return "[" + "█".repeat(filled) + "░".repeat(empty) + "]";
}
