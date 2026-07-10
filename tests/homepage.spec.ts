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
    await page.goto("https://www.automationexercise.com/");
    expect(await page.title()).toBe("Automation Exercise");
  });

  test("homepage comparison test 1", async ({ page }) => {
    // matches the screenshot pixel by pixel, each pixel should match exactly.
    await expect(page).toHaveScreenshot("homepage.png");
  });

  test("homepage comparison test 2", async ({ page }) => {
    // maxDiffPixels: 100 => the maximum pixel difference can be 100.
    await expect(page).toHaveScreenshot("homepage.png", { maxDiffPixels: 100 });
  });

  test("homepage comparison test 3", async ({ page }) => {
    // threshold is tolerance of image differences.
    // threshold: 0.5 => the maximum allowed pixel difference ratio is 0.5.
    await expect(page).toHaveScreenshot("homepage.png", {
      threshold: 0.5,
    });
  });

  test("homepage element comparison test", async ({ page, homePage }) => {
    // it is failed for the first time since there is no baseline image
    // it will create a baseline image for the first time and then compare with it
    const logo = homePage.logo;
    await expect(logo).toHaveScreenshot("homepage-logo.png");
  });

  test("test for entire web page", async ({ page }) => {
    await expect(page).toHaveScreenshot("homepage-full.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.2, 
      animations: "disabled", // disable animations for the screenshot comparison
    });
  });

  test("home page with advanced options", async ({ page, homePage }) => {
    await expect(page).toHaveScreenshot("homepage.png", {
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
