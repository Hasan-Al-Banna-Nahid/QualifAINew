// app/api/seo-audit/screenshot.ts
import puppeteer from "puppeteer";

export class ScreenshotCapture {
  private browser: any = null;

  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });
    }
  }

  async captureMultiple(urls: string[]): Promise<Record<string, string>> {
    await this.initialize();
    const screenshots: Record<string, string> = {};

    for (const url of urls) {
      try {
        const screenshot = await this.capturePage(url);
        screenshots[url] = screenshot;
      } catch (error) {
        console.error(`Screenshot failed for ${url}:`, error);
        screenshots[url] = "";
      }
    }

    await this.cleanup();
    return screenshots;
  }

  async capturePage(url: string): Promise<string> {
    await this.initialize();
    const page = await this.browser.newPage();

    try {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Wait for content to load - FIXED
      await new Promise((resolve: any) => setTimeout(resolve, 2000));

      // Capture full page screenshot
      const screenshot = await page.screenshot({
        fullPage: true,
        encoding: "base64",
        type: "png",
      });

      return `data:image/png;base64,${screenshot}`;
    } catch (error) {
      console.error(`Screenshot capture failed for ${url}:`, error);
      throw error;
    } finally {
      await page.close();
    }
  }

  async captureElement(url: string, selector: string): Promise<string> {
    await this.initialize();
    const page = await this.browser.newPage();

    try {
      await page.goto(url, { waitUntil: "networkidle2" });
      const element = await page.$(selector);

      if (!element) {
        throw new Error(`Element ${selector} not found`);
      }

      const screenshot = await element.screenshot({ encoding: "base64" });
      return `data:image/png;base64,${screenshot}`;
    } finally {
      await page.close();
    }
  }

  async captureAboveFold(url: string): Promise<string> {
    await this.initialize();
    const page = await this.browser.newPage();

    try {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(url, { waitUntil: "networkidle2" });

      const screenshot = await page.screenshot({
        clip: { x: 0, y: 0, width: 1920, height: 1080 },
        encoding: "base64",
      });

      return `data:image/png;base64,${screenshot}`;
    } finally {
      await page.close();
    }
  }

  async captureMobile(url: string): Promise<string> {
    await this.initialize();
    const page = await this.browser.newPage();

    try {
      await page.setViewport({ width: 375, height: 667, isMobile: true });
      await page.setUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
      );
      await page.goto(url, { waitUntil: "networkidle2" });

      const screenshot = await page.screenshot({
        fullPage: true,
        encoding: "base64",
      });

      return `data:image/png;base64,${screenshot}`;
    } finally {
      await page.close();
    }
  }

  async captureWithHighlight(
    url: string,
    selectors: string[],
  ): Promise<string> {
    await this.initialize();
    const page = await this.browser.newPage();

    try {
      await page.goto(url, { waitUntil: "networkidle2" });

      // Inject CSS to highlight elements
      await page.addStyleTag({
        content: `
          .seo-highlight {
            outline: 3px solid red !important;
            background-color: rgba(255, 0, 0, 0.1) !important;
          }
        `,
      });

      // Add highlight class to selectors
      for (const selector of selectors) {
        await page.evaluate((sel: any) => {
          const elements = document.querySelectorAll(sel);
          elements.forEach((el) => el.classList.add("seo-highlight"));
        }, selector);
      }

      const screenshot = await page.screenshot({
        fullPage: true,
        encoding: "base64",
      });

      return `data:image/png;base64,${screenshot}`;
    } finally {
      await page.close();
    }
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
