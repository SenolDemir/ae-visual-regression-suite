import { test, expect } from "@playwright/test";


test("homepage comparison test", async ({ page }) => {

      await page.goto("https://www.automationexercise.com/");
      expect(await page.title()).toBe("Automation Exercise");
      expect(await page.screenshot()).toMatchSnapshot("homepage.png");


});