import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";


/**
 * BasePage class represents common functionality for all page objects
 */
export class BasePage {
  protected readonly page: Page;

  /**
   * Constructs a BasePage instance
   * @param page - The Playwright Page object
   * @param testData - The shared test data
   */
  constructor(page: Page) {
    this.page = page; // injected — caller owns it
  
  }


}
