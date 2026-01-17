import PDFDocument from "pdfkit";
import { parse } from "json2csv";
import fs from "fs";
import path from "path";

export class ReportGenerator {
  async generatePDF(auditData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Create PDF without embedded fonts to avoid file system errors
        const doc = new PDFDocument({
          size: "A4",
          margin: 50,
          bufferPages: true, // Buffer pages to avoid font issues
        });

        const chunks: Buffer[] = [];

        doc.on("data", (chunk: any) => chunks.push(chunk));
        doc.on("end", () => {
          try {
            const pdfBuffer = Buffer.concat(chunks);
            const base64 = pdfBuffer.toString("base64");
            resolve(`data:application/pdf;base64,${base64}`);
          } catch (error) {
            console.error("PDF encoding error:", error);
            reject(error);
          }
        });

        doc.on("error", (error) => {
          console.error("PDF generation error:", error);
          reject(error);
        });

        // Add simple content to avoid font issues
        this.addSimpleReport(doc, auditData);

        // Finalize PDF
        doc.end();
      } catch (error) {
        console.error("PDF creation error:", error);
        // Return a fallback or error message
        reject(error);
      }
    });
  }

  private addSimpleReport(doc: any, auditData: any): void {
    try {
      // Title
      doc.fontSize(24).text("SEO Audit Report", { align: "center" });
      doc.moveDown();

      doc
        .fontSize(12)
        .text(`Generated: ${new Date().toLocaleString()}`, { align: "center" });
      if (auditData.auditId) {
        doc.text(`Audit ID: ${auditData.auditId}`, { align: "center" });
      }
      doc.moveDown(2);

      // URL
      if (auditData.url) {
        doc.fontSize(14).text(`URL: ${auditData.url}`);
        doc.moveDown();
      }

      // Health Score
      const healthScore = auditData?.siteHealth?.score || 0;
      doc.fontSize(16).text(`Health Score: ${healthScore}/100`);
      doc.moveDown();

      // Summary
      if (auditData.summary) {
        doc.fontSize(14).text("Summary:");
        doc.fontSize(12);
        doc.text(`• Pages Scanned: ${auditData.summary.totalPages || 0}`);
        doc.text(`• Total Issues: ${auditData.summary.totalIssues || 0}`);
        doc.text(
          `• Load Time: ${auditData.summary.performance?.loadTime || "N/A"}ms`,
        );
        doc.moveDown();
      }

      // Top Issues
      if (auditData.topIssues && auditData.topIssues.length > 0) {
        doc.addPage();
        doc.fontSize(18).text("Top Issues");
        doc.moveDown();

        auditData.topIssues
          .slice(0, 10)
          .forEach((issue: any, index: number) => {
            doc
              .fontSize(12)
              .text(`${index + 1}. ${issue.title || "Unknown Issue"}`);
            doc
              .fontSize(10)
              .text(
                `   Count: ${issue.count || 0} pages (${(issue.percentage || 0).toFixed(1)}%)`,
              );
            doc.moveDown(0.5);
          });
      }

      // Add page numbers
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(i);
        doc
          .fontSize(10)
          .text(`Page ${i + 1} of ${range.count}`, 50, doc.page.height - 50, {
            align: "center",
          });
      }
    } catch (error) {
      console.error("Error adding content to PDF:", error);
      // Add error message
      doc
        .fontSize(12)
        .text("Error generating full report. Basic information included.");
    }
  }

  async generateCSV(auditData: any): Promise<string> {
    try {
      const csvData: any[] = [];

      // Add summary
      csvData.push({
        Category: "Summary",
        Metric: "Health Score",
        Value: auditData?.siteHealth?.score || 0,
      });

      csvData.push({
        Category: "Summary",
        Metric: "Total Pages",
        Value: auditData?.summary?.totalPages || 0,
      });

      // Add top issues
      if (auditData.topIssues && auditData.topIssues.length > 0) {
        auditData.topIssues.forEach((issue: any, index: number) => {
          csvData.push({
            Category: "Issue",
            Type: issue.title || `Issue ${index + 1}`,
            Count: issue.count || 0,
            Percentage: (issue.percentage || 0).toFixed(2),
            Severity: issue.type || "unknown",
          });
        });
      }

      // Add AI recommendations if available
      if (auditData.ai?.recommendations) {
        auditData.ai.recommendations
          .slice(0, 10)
          .forEach((rec: string, index: number) => {
            csvData.push({
              Category: "Recommendation",
              Priority: index + 1,
              Action: rec,
            });
          });
      }

      try {
        const csv = parse(csvData, {
          fields: [
            "Category",
            "Metric",
            "Type",
            "Count",
            "Percentage",
            "Severity",
            "Priority",
            "Action",
            "Value",
          ],
        });
        return `data:text/csv;base64,${Buffer.from(csv).toString("base64")}`;
      } catch (error) {
        console.error("CSV parsing error:", error);
        // Fallback to simple CSV
        const simpleCSV = csvData
          .map((row) =>
            Object.values(row)
              .map((val) => `"${val}"`)
              .join(","),
          )
          .join("\n");

        const headers = Object.keys(csvData[0] || {}).join(",");
        return `data:text/csv;base64,${Buffer.from(`${headers}\n${simpleCSV}`).toString("base64")}`;
      }
    } catch (error) {
      console.error("CSV generation error:", error);
      throw new Error(`CSV generation failed: ${error}`);
    }
  }
}
