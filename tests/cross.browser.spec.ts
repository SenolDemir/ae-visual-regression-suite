import { test, expect } from "../fixtures/index";
import { chromium, firefox, webkit } from "playwright";


/**
 * This test demonstrates cross-browser testing using Playwright.
 * Classically used function toHaveScreenShot() is not used here,
 * instead page.screenshot() is used to capture screenshots for each browser.
 * The reason is we are using different browsers 
 * and we want to capture screenshots for each browser separately.
 */

test("home page cross-browsertest", async ({ page, browserName }) => {
  const engines = { chromium, firefox, webkit };

  for (const [name, engine] of Object.entries(engines)) {
    const browser = await engine.launch();
    const page = await browser.newPage();

    await page.goto("https://www.automationexercise.com/");
    expect(await page.title()).toBe("Automation Exercise");

    // Dismiss GDPR consent overlay if present before asserting layout
    const consentButton = page.getByRole("button", { name: "Consent" });
    if (await consentButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await consentButton.click();
      await expect(consentButton).not.toBeVisible();
    }

    await page.waitForFunction(() => document.fonts.ready);

    await page.screenshot({ path: `screenshots/homepage-${name}.png`, fullPage: true });
    await browser.close();
  }
});
