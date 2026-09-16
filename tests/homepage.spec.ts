import { test, expect } from "../fixtures/visual.fixtures";

test.describe("Homepage visual regression tests", () => {
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
      maxDiffPixelRatio: 0.05,
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
