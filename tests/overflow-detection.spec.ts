
import { test, expect } from "@playwright/test";

/*
 * Test to detect horizontal overflow on any element of the page.
 * This helps in identifying layout issues where elements extend beyond the viewport width.
 */

test("no horizontal overflow on any element", async ({ page }) => {
  await page.goto("/");
  expect(await page.title()).toBe("Automation Exercise");

  const overflowingElements = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const offenders: string[] = [];
    document.querySelectorAll("*").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 1) {
        offenders.push(el.tagName + (el.className ? "." + el.className : ""));
      }
    });
    return offenders;
  });

  expect(overflowingElements, `Overflowing elements: ${overflowingElements.join(", ")}`).toEqual([]);
});
