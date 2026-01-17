// app/api/seo-audit/screenshot.ts
import puppeteer, { Browser, Page } from "puppeteer";
import os from "os";

export class ScreenshotCapture {
  private browser: Browser | null = null;

  // Get Chrome executable path based on OS
  private getChromePath(): string {
    // Check for custom path from environment
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      return process.env.PUPPETEER_EXECUTABLE_PATH;
    }

    const platform = os.platform();

    switch (platform) {
      case "win32":
        // Windows paths
        return (
          [
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
            `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
          ].find((path) => require("fs").existsSync(path)) || "chrome.exe"
        );

      case "darwin":
        // macOS paths
        return (
          [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
          ].find((path) => require("fs").existsSync(path)) ||
          "google-chrome-stable"
        );

      case "linux":
        // Linux paths
        return (
          [
            "/usr/bin/google-chrome-stable",
            "/usr/bin/google-chrome",
            "/usr/bin/chromium-browser",
            "/usr/bin/chromium",
            "/snap/bin/chromium",
          ].find((path) => require("fs").existsSync(path)) ||
          "google-chrome-stable"
        );

      default:
        return "google-chrome-stable";
    }
  }

  async initialize(): Promise<void> {
    if (this.browser) {
      return;
    }

    try {
      const chromePath = this.getChromePath();
      console.log(`Using Chrome path: ${chromePath}`);

      this.browser = await puppeteer.launch({
        executablePath: chromePath,
        // headless: "new", // Use new headless mode
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-software-rasterizer",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
          "--disable-default-apps",
          "--disable-extensions",
          "--mute-audio",
          "--no-first-run",
          "--no-zygote",
          "--single-process", // Can help with memory issues
        ],
        ignoreDefaultArgs: ["--disable-extensions"],
        timeout: 30000,
      });

      console.log("Chrome browser initialized successfully");
    } catch (error: any) {
      console.error("Failed to initialize Chrome:", error.message);
      throw new Error(`Chrome initialization failed: ${error.message}`);
    }
  }

  async captureMultiple(urls: string[]): Promise<Record<string, string>> {
    const screenshots: Record<string, string> = {};

    try {
      await this.initialize();
      console.log(`Attempting to capture ${urls.length} screenshots`);

      // Limit to 3 screenshots to avoid timeouts
      const limitedUrls = urls.slice(0, 3);

      for (const url of limitedUrls) {
        try {
          console.log(`Capturing screenshot for: ${url}`);
          const screenshot = await this.capturePage(url);
          screenshots[url] = screenshot;
          console.log(`✅ Successfully captured: ${url}`);
        } catch (error: any) {
          console.error(`❌ Screenshot failed for ${url}:`, error.message);
          screenshots[url] = this.generatePlaceholder(url);
        }
      }
    } catch (error: any) {
      console.error(
        "❌ Browser initialization failed, using placeholders:",
        error.message,
      );
      // Generate placeholders for all URLs
      urls.slice(0, 3).forEach((url) => {
        screenshots[url] = this.generatePlaceholder(url);
      });
    } finally {
      await this.cleanup();
    }

    return screenshots;
  }

  async capturePage(url: string): Promise<string> {
    let page: Page | null = null;

    try {
      if (!this.browser) {
        throw new Error("Browser not initialized");
      }

      page = await this.browser.newPage();

      // Set realistic viewport
      await page.setViewport({
        width: 1280,
        height: 800,
        deviceScaleFactor: 1,
      });

      // Set user agent
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      );

      // Navigate with better error handling
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });

      // Wait for network to be mostly idle
      await page.waitForNetworkIdle({ timeout: 5000 }).catch(() => {
        console.log("Network idle timeout, continuing...");
      });

      // Wait for page to stabilize
      const delay = (ms: number): Promise<void> =>
        new Promise((resolve) => setTimeout(resolve, ms));

      await delay(1000);

      // Take screenshot (full page can be heavy, so use viewport size)
      const screenshot = await page.screenshot({
        encoding: "base64",
        type: "jpeg",
        quality: 80,
        fullPage: false, // Use false to reduce size
      });

      return `data:image/jpeg;base64,${screenshot}`;
    } catch (error: any) {
      console.error(`Failed to capture ${url}:`, error.message);
      throw error;
    } finally {
      if (page) {
        await page.close().catch(() => {});
      }
    }
  }

  async captureElement(url: string, selector: string): Promise<string> {
    let page: Page | null = null;

    try {
      if (!this.browser) {
        await this.initialize();
      }
      if (!this.browser) throw new Error("Browser not initialized");

      page = await this.browser!.newPage();
      await page.goto(url, { waitUntil: "networkidle2" });
      const element = await page.$(selector);

      if (!element) {
        throw new Error(`Element ${selector} not found`);
      }

      const screenshot = await element.screenshot({ encoding: "base64" });
      return `data:image/png;base64,${screenshot}`;
    } catch (error: any) {
      console.error(`Failed to capture element ${selector}:`, error.message);
      throw error;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async captureAboveFold(url: string): Promise<string> {
    let page: Page | null = null;

    try {
      if (!this.browser) {
        await this.initialize();
      }
      if (!this.browser) throw new Error("Browser not initialized");

      page = await this.browser!.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(url, { waitUntil: "networkidle2" });

      const screenshot = await page.screenshot({
        encoding: "base64",
        type: "jpeg",
        quality: 80,
      });

      return `data:image/jpeg;base64,${screenshot}`;
    } catch (error: any) {
      console.error(`Failed to capture above fold for ${url}:`, error.message);
      throw error;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async captureMobile(url: string): Promise<string> {
    let page: Page | null = null;

    try {
      if (!this.browser) {
        await this.initialize();
      }
      if (!this.browser) throw new Error("Browser not initialized");

      page = await this.browser!.newPage();
      await page.setViewport({
        width: 375,
        height: 667,
        isMobile: true,
        deviceScaleFactor: 2,
      });
      await page.setUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
      );
      await page.goto(url, { waitUntil: "networkidle2" });

      const screenshot = await page.screenshot({
        encoding: "base64",
        type: "jpeg",
        quality: 80,
      });

      return `data:image/jpeg;base64,${screenshot}`;
    } catch (error: any) {
      console.error(`Failed to capture mobile view for ${url}:`, error.message);
      throw error;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async captureWithHighlight(
    url: string,
    selectors: string[],
  ): Promise<string> {
    let page: Page | null = null;

    try {
      if (!this.browser) {
        await this.initialize();
      }
      if (!this.browser) throw new Error("Browser not initialized");

      page = await this.browser!.newPage();
      await page.goto(url, { waitUntil: "networkidle2" });

      // Inject CSS to highlight elements
      await page.addStyleTag({
        content: `
          .seo-highlight {
            outline: 3px solid #ef4444 !important;
            background-color: rgba(239, 68, 68, 0.1) !important;
            box-shadow: 0 0 0 1px #ef4444 !important;
          }
        `,
      });

      // Add highlight class to selectors
      for (const selector of selectors) {
        await page.evaluate((sel: string) => {
          const elements = document.querySelectorAll(sel);
          elements.forEach((el) => el.classList.add("seo-highlight"));
        }, selector);
      }

      const screenshot = await page.screenshot({
        encoding: "base64",
        type: "jpeg",
        quality: 80,
      });

      return `data:image/jpeg;base64,${screenshot}`;
    } catch (error: any) {
      console.error(
        `Failed to capture with highlights for ${url}:`,
        error.message,
      );
      throw error;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  private generatePlaceholder(url: string): string {
    try {
      const domain = new URL(url).hostname;
      const svg = `
        <svg width="1280" height="800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#4f46e5"/>
              <stop offset="100%" stop-color="#7c3aed"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)"/>
          <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="36" 
                text-anchor="middle" fill="white" font-weight="bold">
            ${domain}
          </text>
          <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="20" 
                text-anchor="middle" fill="#e0e7ff">
            Screenshot Unavailable
          </text>
          <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="16" 
                text-anchor="middle" fill="#c7d2fe">
            Chrome browser not detected on server
          </text>
        </svg>
      `;
      return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
    } catch {
      return (
        "data:image/svg+xml;base64," +
        Buffer.from(
          `
        <svg width="1280" height="800" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#1e40af"/>
          <text x="50%" y="50%" font-family="Arial" font-size="24" 
                text-anchor="middle" fill="white">
            SEO Audit Preview
          </text>
        </svg>
      `,
        ).toString("base64")
      );
    }
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      try {
        await this.browser.close();
      } catch (error: any) {
        console.error("Error closing browser:", error.message);
      }
      this.browser = null;
    }
  }
}
