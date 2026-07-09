import { BasePage } from "./BasePage";
import type { Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class HomePage extends BasePage {
  // Locators
  public readonly logo: Locator = this.page.getByRole("img", {
    name: "Website for automation practice",
  });

  private readonly activeCarouselItem: Locator = this.page.locator(".item.active");
  public readonly heroHeading: Locator = this.activeCarouselItem.getByRole("heading", {
    name: /automation.*exercise/i,
  });
  public readonly heroSubheading: Locator = this.activeCarouselItem.getByRole("heading", {
    name: /full-fledged practice website/i,
  });
  public readonly testCasesLink: Locator = this.activeCarouselItem.getByRole("link", { name: /test cases/i });
  public readonly apiListLink: Locator = this.activeCarouselItem.getByRole("link", { name: /apis list for practice/i });
  public readonly heroBannerImage: Locator = this.activeCarouselItem.getByAltText("demo website for practice");


  
}
