import { test, expect } from "../fixtures/index";

/**
 ** toHaveScreenshot() — purpose-built for visual/screenshot testing
 * it has as screenshot-specific options built in:
 * maxDiffPixels,
 * threshold,
 * mask,
 * animations: 'disabled',
 * fullPage,
 * clip,
 * stylePath
 *
 ** toMatchSnapshot() - generic snapshot assertion
 * Works with any serializable data: buffers, strings, JSON — not just images
 * If used for images, you have to pass a Buffer yourself (e.g. from page.screenshot())
 * rather than getting Playwright's built-in comparison pipeline.
 */

test.describe("Homepage visual regression tests", () => {

test.beforeEach(async ({ page }) => {
  await page.route(/doubleclick|googlesyndication|googletagservices|adsystem|adnxs/, (route) => route.abort());

  await page.goto("https://www.automationexercise.com/", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveTitle("Automation Exercise");

  const consentButton = page.getByRole("button", { name: "Consent" });
  const appeared = await consentButton
    .waitFor({ state: "visible", timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  if (appeared) {
    await consentButton.click();
    await expect(consentButton).not.toBeVisible();
  }
});

  test("homepage comparison test 1", async ({ page, homePage }) => {
    // matches the screenshot pixel by pixel, each pixel should match exactly.
    await expect(page).toHaveScreenshot("homepage-strict.png", {
      mask: [homePage.heroBannerImage, homePage.testCasesLink, homePage.apiListLink],
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
    });
  });

test("homepage comparison test 2", async ({ page, homePage }) => {
  await expect(page).toHaveScreenshot("homepage-maxdiffpixels.png", {
    mask: [homePage.heroBannerImage, homePage.testCasesLink, homePage.apiListLink, homePage.heroHeading, homePage.heroSubheading],
    maxDiffPixelRatio: 0.05,
    timeout: 10_000,
  });
});

  test("homepage comparison test 3", async ({ page }) => {
    // threshold is tolerance of image differences.
    // threshold: 0.5 => the maximum allowed pixel difference ratio is 0.5.
    await expect(page).toHaveScreenshot("homepage-threshold.png", {
      threshold: 0.5,
    });
  });

  test("homepage element comparison test", async ({ page, homePage }) => {
    const logo = homePage.logo;
    await expect(logo).toHaveScreenshot("homepage-logo.png");
  });

  test("test for entire web page", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("homepage-full.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.2,
      animations: "disabled", // disable animations for the screenshot comparison
      timeout: 15_000,
    });
  });

  test("home page with advanced options", async ({ page, homePage }) => {
    await expect(page).toHaveScreenshot("homepage-advanced.png", {
      maxDiffPixels: 100, // allow maximum 100 pixel differences.
      threshold: 0.5, // 20% difference threshold (%20 fark esigi)
      mask: [
        // hide dynamic elements from the screenshot comparison
        homePage.testCasesLink,
        homePage.apiListLink,
      ],
      animations: "disabled", // disable animations for the screenshot comparison
    });
  });
});
