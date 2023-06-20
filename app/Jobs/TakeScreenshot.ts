import type { JobHandlerContract, Job } from "@ioc:Setten/Queue";
import Drive from "@ioc:Adonis/Core/Drive";
import Screenshot from "App/Models/Screenshot";
import { randomUUID } from "node:crypto";
import puppeteer, { Browser } from "puppeteer";

export type TakeScreenshotPayload = {
  screenshotId: number;
};
export default class TakeScreenshot implements JobHandlerContract {
  private browser: Browser;

  constructor(public job: Job) {
    this.job = job;
  }

  /**
   * Base Entry point
   */
  public async handle(payload: TakeScreenshotPayload) {
    const screenshot = await Screenshot.findOrFail(payload.screenshotId);
    screenshot.status = "processing";
    await screenshot.save();

    const uuid = randomUUID();
    const path = `screenshots/${uuid}.jpeg`;

    const buffer = await this.screenshot(screenshot.url);
    await Drive.put(path, buffer);

    screenshot.image = uuid;
    screenshot.status = "done";
    await screenshot.save();
  }

  private async getBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ headless: "new" });
    }
    return this.browser;
  }

  public async screenshot(url) {
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: "networkidle0" });
    const buffer = await page.screenshot({
      type: "jpeg",
    });
    await page.close();
    return buffer;
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  public async failed() {
    const screenshot = await Screenshot.findOrFail(this.job.data.screenshotId);
    screenshot.status = "failed";
    await screenshot.save();
  }
}
