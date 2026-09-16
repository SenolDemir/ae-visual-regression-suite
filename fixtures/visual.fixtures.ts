import { expect } from "@playwright/test";
import { test as base } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { LoginPage } from "../pages/login.page";
// import { ProductPage } from "../pages/ProductPage";
// import { ProductDetailPage } from "../pages/ProductDetailPage";

type Fixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
};

export const test = base.extend<Fixtures>({
  // implementing custom fixtures
  // Override built-in `page`: block ads, navigate, dismiss consent —
  // every test that uses `page` (directly or via a POM fixture) gets this for free.
  page: async ({ page }, use) => {
    await page.route(/doubleclick|googlesyndication|googletagservices|adsystem|adnxs/, (route) => route.abort());
    await page.goto(process.env.BASE_URL || "https://www.automationexercise.com", { waitUntil: "domcontentloaded" });
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

    await page.waitForFunction(() => document.fonts.ready);

    await use(page);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  // productPage: async ({ page }, use) => {
  //   const productPage = new ProductPage(page);
  //   await use(productPage);
  // },
  // productDetailPage: async ({ page }, use) => {
  //   const productDetailPage = new ProductDetailPage(page);
  //   await use(productDetailPage);
  // },
});

export { expect } from "@playwright/test";
