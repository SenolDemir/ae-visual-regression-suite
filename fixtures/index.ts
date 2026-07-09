import { expect } from "@playwright/test";
import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { SignupPage } from "../pages/SignupPage";
import { AccountSetupPage } from "../pages/AccountSetupPage";
import { LoginPage } from "../pages/LoginPage";
// import { ProductPage } from "../pages/ProductPage";
// import { ProductDetailPage } from "../pages/ProductDetailPage";

type Fixtures = {
  signupPage: SignupPage;
  loginPage: LoginPage;
  homePage: HomePage;
  accountSetupPage: AccountSetupPage;
};

export const test = base.extend<Fixtures>({
  // implementing custom fixtures

  signupPage: async ({ page }, use) => {
    const signupPage = new SignupPage(page);
    await use(signupPage);
  },

  accountSetupPage: async ({ page }, use) => {
    const accountSetupPage = new AccountSetupPage(page);
    await use(accountSetupPage);
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
