import { test, expect } from "../fixtures/index";
import { chromium, firefox, webkit } from "playwright";

/**
 * This test demonstrates cross-browser testing using Playwright.
 * Classically used function toHaveScreenShot() is not used here,
 * instead page.screenshot() is used to capture screenshots for each browser.
 * The reason is we are using different browsers
 * and we want to capture screenshots for each browser separately.
 *
 * What the test actually handles per browser
 * - Font rendering
 * - this is browser-agnostic functional check
 * - ensures scrolled-off content is captured,
 * where layout differences between engines are most visible
 */

// there is 2 test in same purpose,
// first is using for loop to launch each browser and capture screenshot
// second is using test fixture to launch each browser and capture screenshot
// both tests are doing the same thing, but second one is more elegant and readable
// to run the second test, you need to run the test with --project=chromium, --project=firefox, --project=webkit
// script --> npx playwright test cross.browser.spec.ts --grep "cross-browsertest 2"
test("home page cross-browsertest 1", async () => {
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

test("home page cross-browsertest 2", async ({ page, browserName }) => {
  await page.goto("https://www.automationexercise.com/");
  expect(await page.title()).toBe("Automation Exercise");

  // Dismiss GDPR consent overlay if present before asserting layout
  const consentButton = page.getByRole("button", { name: "Consent" });
  if (await consentButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await consentButton.click();
    await expect(consentButton).not.toBeVisible();
  }

  await page.waitForFunction(() => document.fonts.ready);
  await page.screenshot({ path: `screenshots/homepage-${browserName}.png`, fullPage: true });
});

