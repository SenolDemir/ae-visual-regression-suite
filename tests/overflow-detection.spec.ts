// tests/visual/layout/overflow-detection.spec.ts
import { test, expect } from "@playwright/test";

test("no horizontal overflow on any element", async ({ page }) => {
  await page.goto("https://www.automationexercise.com/");
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
