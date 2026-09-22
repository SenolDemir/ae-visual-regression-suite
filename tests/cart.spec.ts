import { test, expect } from "../fixtures/visual.fixtures";

/**
 * Visual regression tests for the shopping cart page.
 * These tests verify the appearance of the cart in different states:
 * - empty cart
 * - cart with a single item
 * - cart with multiple items
 * 
 * The goal is to ensure visual consistency and catch any unintended layout or styling changes.
 */

test.describe("Cart Visual Regression", () => {

      test("empty cart state", async ({ page }) => {
        await page.goto("/view_cart");
        await expect(page).toHaveScreenshot("cart-empty.png");
      });

      test("cart with one item", async ({ page }) => {
        await page.goto("/product_details/1");
        await page.getByRole("button", { name: "Add to cart" }).click();
        await page.getByRole("link", { name: "View Cart" }).click();
        await expect(page).toHaveScreenshot("cart-single-item.png");
      });

      test("cart with multiple items", async ({ page }) => {
        for (const productId of [1, 2, 3]) {
          await page.goto(`/product_details/${productId}`);
          await page.getByRole("button", { name: "Add to cart" }).click();
          await page.getByRole("button", { name: "Continue Shopping" }).click();
        }
        await page.goto("/view_cart");
        await expect(page).toHaveScreenshot("cart-multi-item.png");
      });
});