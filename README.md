# ae-visual-regression-suite

![Playwright](https://img.shields.io/badge/Playwright-1.61+-45ba4b?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)

A Playwright + TypeScript visual regression test suite targeting [automationexercise.com](https://www.automationexercise.com). It catches visual regressions, responsive-layout breakages, cross-browser rendering differences, and horizontal overflow issues.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation & visual comparison |
| TypeScript | Type-safe test authoring |
| Node.js | Runtime |

---

## Project Structure

```
ae-visual-regression-suite/
├── fixtures/
│   └── index.ts                  # Custom test fixtures (page objects injected via Playwright's extend)
├── pages/
│   ├── BasePage.ts               # Base class shared by all page objects
│   ├── HomePage.ts               # Locators for the Automation Exercise homepage
│   ├── LoginPage.ts              
│   ├── SignupPage.ts             
│   └── AccountSetupPage.ts      
├── tests/
│   ├── homepage.spec.ts          # Visual regression tests with various diff-tolerance options
│   ├── responsive.spec.ts        # Per-viewport layout screenshots (mobile / tablet / desktop)
│   ├── cross.browser.spec.ts     # Cross-browser screenshot capture (Chromium, Firefox, WebKit)
│   ├── overflow-detection.spec.ts# DOM walk to detect horizontal overflow
│   ├── homepage.spec.ts-snapshots/   # Baseline images for homepage tests
│   └── responsive.spec.ts-snapshots/ # Baseline images for responsive tests
├── screenshots/                  # Screenshots written by cross-browser tests
├── playwright-report/            # HTML test report
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---


## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

---

## Installation

```bash
git clone <repo-url>
cd ae-visual-regression-suite
npm install
npx playwright install          # download browser binaries
```

---

## Running Tests

| Script | Command | Description |
|---|---|---|
| `test` | `npm test` | Run all tests headlessly across Chromium, Firefox, and WebKit |
| `test:headed` | `npm run test:headed` | Run all tests with a visible browser window |
| `test:visual:update` | `npm run test:visual:update` | Regenerate all baseline snapshots |
| `test:report` | `npm run test:report` | Open the last HTML report in the browser |

Run a single spec file:

```bash
npx playwright test homepage.spec.ts
npx playwright test responsive.spec.ts

```

Run a single test by name:

```bash
npx playwright test cross.browser.spec.ts --grep "cross-browsertest 2"
```

Run against a specific browser:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

---

## Updating Visual Baselines

When an intentional UI change is made, regenerate the baseline snapshots so future runs compare against the updated UI:

```bash
npm run test:visual:update
```

> **Note:** Baseline images are OS- and browser-specific (e.g. `homepage-chromium-darwin.png`). Baselines checked in on macOS will not match runs on Linux CI without separate CI-generated baselines.

---

## Test Suites

### `homepage.spec.ts` — Visual Regression

Covers the homepage across multiple comparison strategies using Playwright's `toHaveScreenshot()`:

- **Exact pixel match** — zero tolerance, fails on any pixel difference.
- **Pixel budget** — `maxDiffPixels: 100` allows up to 100 differing pixels.
- **Threshold tolerance** — `threshold: 0.5` sets a per-pixel colour-difference ratio.
- **Element-level snapshot** — isolates just the site logo for targeted regression.
- **Full-page capture** — scrolls the entire page with `fullPage: true`.
- **Masking** — excludes dynamic/animated regions (e.g. "Test Cases" and "APIs List" links) from comparison using the `mask` option.

### `responsive.spec.ts` — Responsive Layout

Iterates over three viewports and asserts a full-page screenshot at each breakpoint:

| Breakpoint | Width × Height |
|---|---|
| Mobile | 375 × 812 |
| Tablet | 768 × 1024 |
| Desktop | 1440 × 900 |

Handles GDPR consent overlays that may appear before the layout is stable, and waits for fonts to finish loading (`document.fonts.ready`) before taking a snapshot.

### `cross.browser.spec.ts` — Cross-Browser Screenshots

Two equivalent approaches are provided for comparison:

- **Test 1** — manually launches each browser engine (`chromium`, `firefox`, `webkit`) inside a single test using `browser.launch()`, captures a full-page screenshot per engine, then closes each browser.
- **Test 2** — uses the Playwright project fixture (`browserName`) to capture a screenshot for the currently active browser. Run this variant with `--project` flags.

Screenshots are written to `screenshots/homepage-<browser>.png` (not baseline-compared — useful for side-by-side visual inspection).

### `overflow-detection.spec.ts` — Layout Overflow

Walks every DOM element on the page via `page.evaluate()` and reports any element whose right edge exceeds the viewport width by more than 1 px. The test fails with a list of offending selectors if horizontal overflow is detected.

---

## Architecture

### Page Object Model

All page classes extend `BasePage`, which holds the injected Playwright `Page` instance. Page classes expose typed `Locator` properties and any interaction methods for their respective pages.

```
BasePage
├── HomePage         (logo, hero heading, nav links, carousel locators)
├── LoginPage        (stub)
├── SignupPage       (stub)
└── AccountSetupPage (stub)
```

### Custom Fixtures

`fixtures/index.ts` extends Playwright's base `test` object with lazily-instantiated page objects:

```typescript
import { test, expect } from "../fixtures/index";
// now `homePage`, `loginPage`, `signupPage`, `accountSetupPage`
// are available as typed fixture arguments in every test
```

Each fixture receives the `page` object from Playwright, constructs the corresponding page class, and yields it via `use()`.

---

## CI Behaviour

`playwright.config.ts` automatically adjusts for CI environments (`process.env.CI`):

- `forbidOnly: true` — fails the build if `test.only` is accidentally left in source.
- `retries: 2` — retries failing tests twice before reporting a failure.
- `workers: 1` — runs tests serially to avoid resource contention on CI agents.
