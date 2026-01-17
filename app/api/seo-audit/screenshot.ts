// app/api/seo-audit/screenshot-service.ts
export class ScreenshotService {
  private apiKey: string;
  private baseUrl = "https://screenshotapi.net/api/v1/screenshot";

  constructor() {
    this.apiKey = process.env.SCREENSHOTAPI_KEY || "";
    if (!this.apiKey) {
      console.warn(
        "SCREENSHOTAPI_KEY not set. Screenshots will be placeholders.",
      );
    }
  }

  async captureMultiple(urls: string[]): Promise<Record<string, string>> {
    const screenshots: Record<string, string> = {};
    const limitedUrls = urls.slice(0, 5); // Limit to 5 URLs due to API limits

    for (const url of limitedUrls) {
      try {
        screenshots[url] = await this.captureWithScreenshotAPI(url);
      } catch (error) {
        console.warn(`Failed to capture ${url}:`, error);
        screenshots[url] = this.generatePlaceholder(url);
      }
    }

    return screenshots;
  }

  private async captureWithScreenshotAPI(url: string): Promise<string> {
    if (!this.apiKey) {
      return this.generatePlaceholder(url);
    }

    const params = new URLSearchParams({
      url,
      token: this.apiKey,
      width: "1280",
      height: "720",
      output: "image",
      ttl: "0",
      fresh: "true",
    });

    const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "image/*",
      },
      // timeout: 30000,
    });

    if (!response.ok) {
      throw new Error(`Screenshot API error: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const contentType = response.headers.get("content-type") || "image/png";

    return `data:${contentType};base64,${base64}`;
  }

  private generatePlaceholder(url: string): string {
    try {
      const domain = new URL(url).hostname;
      const svg = `
        <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#4f46e5" />
              <stop offset="100%" stop-color="#7c3aed" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#gradient)" />
          <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="48" text-anchor="middle" fill="white" font-weight="bold">
            ${domain}
          </text>
          <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#e0e7ff">
            QualifAI SEO Audit
          </text>
          <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#c7d2fe">
            Screenshot preview
          </text>
        </svg>
      `;
      return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
    } catch {
      return (
        "data:image/svg+xml;base64," +
        Buffer.from(
          `
        <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#1e40af" />
          <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="white">SEO Audit Preview</text>
        </svg>
      `,
        ).toString("base64")
      );
    }
  }
}
