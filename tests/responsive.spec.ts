import { test, expect } from "../fixtures/visual.fixtures";

/**
 * Responsive layout tests for the homepage.
 * These tests verify the appearance and layout of the homepage across different viewport sizes:
 * - mobile
 * - tablet
 * - desktop
 *
 * The goal is to ensure the homepage layout adapts correctly 
 * to various screen sizes and resolutions.
 */

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

for (const vp of viewports) {
  test(`homepage layout @ ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");
    expect(await page.title()).toBe("Automation Exercise");

    // Dismiss GDPR consent overlay if present before asserting layout
    const consentButton = page.getByRole("button", { name: "Consent" });
    if (await consentButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await consentButton.click();
      await expect(consentButton).not.toBeVisible();
    }

    await page.waitForFunction(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`homepage-${vp.name}.png`);
  });
}
