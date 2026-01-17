// app/api/seo-audit/file-parser.ts
import { parse } from "csv-parse/sync";
import { FileUploadConfig } from "./types";

export class FileParser {
  /**
   * Parse uploaded file and extract URLs or instructions
   */
  static async parseFile(
    fileContent: string,
    fileType: "pdf" | "csv" | "txt" | "json",
  ): Promise<FileUploadConfig> {
    switch (fileType) {
      case "csv":
        return this.parseCSV(fileContent);
      case "json":
        return this.parseJSON(fileContent);
      case "txt":
        return this.parseTXT(fileContent);
      case "pdf":
        return this.parsePDFText(fileContent);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  /**
   * Parse CSV file - expects columns: url, priority, custom_check
   */
  private static parseCSV(content: string): FileUploadConfig {
    try {
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      const urls: string[] = [];
      let instructions = "";

      for (const record of records) {
        // Extract URLs from 'url' column
        if ((record as unknown as any).url) {
          urls.push((record as unknown as any).url);
        }

        // Extract custom instructions if provided
        if (
          (record as unknown as any).custom_check ||
          (record as unknown as any).instructions
        ) {
          instructions += `${(record as unknown as any).custom_check || (record as unknown as any).instructions}\n`;
        }
      }

      return {
        type: "csv",
        urls: urls.filter(Boolean),
        instructions: instructions.trim() || undefined,
      };
    } catch (error) {
      throw new Error(`CSV parsing failed: ${(error as Error).message}`);
    }
  }

  /**
   * Parse JSON file - expects { urls: [], instructions: "" }
   */
  private static parseJSON(content: string): FileUploadConfig {
    try {
      const data = JSON.parse(content);

      if (!data.urls && !data.url && !data.instructions) {
        throw new Error(
          "JSON must contain 'urls' array or 'instructions' string",
        );
      }

      const urls: string[] = [];

      // Handle single URL
      if (data.url) {
        urls.push(data.url);
      }

      // Handle multiple URLs
      if (Array.isArray(data.urls)) {
        urls.push(...data.urls);
      }

      return {
        type: "json",
        urls: urls.filter(Boolean),
        instructions: data.instructions || undefined,
      };
    } catch (error) {
      throw new Error(`JSON parsing failed: ${(error as Error).message}`);
    }
  }

  /**
   * Parse TXT file - each line is either a URL or instruction
   */
  private static parseTXT(content: string): FileUploadConfig {
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const urls: string[] = [];
    const instructionLines: string[] = [];

    const urlRegex = /^https?:\/\//i;

    for (const line of lines) {
      if (urlRegex.test(line)) {
        urls.push(line);
      } else if (line.startsWith("#") || line.startsWith("//")) {
        // Skip comments
        continue;
      } else {
        instructionLines.push(line);
      }
    }

    return {
      type: "txt",
      urls: urls.filter(Boolean),
      instructions: instructionLines.join("\n").trim() || undefined,
    };
  }

  /**
   * Parse PDF text content (already extracted as text)
   */
  private static parsePDFText(content: string): FileUploadConfig {
    // Extract URLs using regex
    const urlRegex = /https?:\/\/[^\s]+/gi;
    const matches = content.match(urlRegex) || [];
    const urls = [...new Set(matches)]; // Remove duplicates

    // Rest is treated as instructions
    const instructions = content.replace(urlRegex, "").trim();

    return {
      type: "pdf",
      urls: urls.filter(Boolean),
      instructions: instructions || undefined,
    };
  }

  /**
   * Validate URLs extracted from file
   */
  static validateUrls(urls: string[]): { valid: string[]; invalid: string[] } {
    const valid: string[] = [];
    const invalid: string[] = [];

    for (const url of urls) {
      try {
        const parsed = new URL(url);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          valid.push(url);
        } else {
          invalid.push(url);
        }
      } catch {
        invalid.push(url);
      }
    }

    return { valid, invalid };
  }

  /**
   * Parse custom instructions into structured format
   */
  static parseCustomInstructions(instructions: string): {
    selectors?: string[];
    checks?: string[];
    rules?: string[];
  } {
    const lines = instructions
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const selectors: string[] = [];
    const checks: string[] = [];
    const rules: string[] = [];

    for (const line of lines) {
      // Detect CSS selectors
      if (
        line.match(/^[.#][a-zA-Z0-9_-]+/) ||
        line.includes("[") ||
        line.match(/^[a-z]+$/)
      ) {
        selectors.push(line);
      }
      // Detect check instructions (contains keywords)
      else if (line.match(/check|verify|ensure|must|should/i)) {
        checks.push(line);
      }
      // Everything else is a rule
      else {
        rules.push(line);
      }
    }

    return {
      selectors: selectors.length > 0 ? selectors : undefined,
      checks: checks.length > 0 ? checks : undefined,
      rules: rules.length > 0 ? rules : undefined,
    };
  }
}

/**
 * Example CSV format:
 *
 * url,priority,custom_check
 * https://example.com,high,Check for product schema
 * https://example.com/about,medium,Verify team photos have alt text
 * https://example.com/blog,low,
 */

/**
 * Example JSON format:
 *
 * {
 *   "urls": [
 *     "https://example.com",
 *     "https://example.com/about"
 *   ],
 *   "instructions": "Check all images for alt text. Verify schema markup on product pages."
 * }
 */

/**
 * Example TXT format:
 *
 * https://example.com
 * https://example.com/about
 * https://example.com/products
 *
 * # Custom Instructions:
 * Check for mobile responsiveness
 * Verify all forms have proper labels
 * Ensure SSL is configured
 */
