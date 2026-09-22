import { test, expect } from "../fixtures/visual.fixtures";
/**
 * Visual regression tests for the homepage.
 * These tests verify the appearance of the homepage under different conditions:
 * - strict pixel-by-pixel comparison
 * - comparison with a maximum allowed difference in pixels
 * - comparison with a threshold for image differences
 * - element-specific comparison
 * - full-page comparison
 * - advanced options including masking dynamic elements and disabling animations
 *
 * The goal is to ensure visual consistency and catch any unintended layout or styling changes.
 */


test.describe("Homepage visual regression", () => {

  test("homepage comparison test 1", async ({ page, homePage }) => {
    // matches the screenshot pixel by pixel, each pixel should match exactly.
    await expect(page).toHaveScreenshot("homepage-strict.png", {});
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
