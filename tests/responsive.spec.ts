
import { test, expect } from "../fixtures/index";

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

for (const vp of viewports) {
  test(`homepage layout @ ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("https://www.automationexercise.com/");
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
