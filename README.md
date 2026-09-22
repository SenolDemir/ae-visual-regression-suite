# ae-visual-regression-suite

![Playwright](https://img.shields.io/badge/Playwright-1.63-45ba4b?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178c6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)

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
├── .github/
│   └── workflows/
│       ├── ci-visual-test.yml       # Visual regression suite workflow to run in CI
│       └── ci-update-baselines.yml  # Manually-triggered workflow to regenerate & commit baselines
├── fixtures/
│   └── visual.fixtures.ts           # Custom test fixtures
├── pages/
│   ├── base.page.ts                 # Base class shared by all page objects
│   ├── home.page.ts                 # Page objects for the homepage
│   └── login.page.ts                # Page objects for the login page
├── tests/
│   ├── homepage.spec.ts             # Visual regression tests with various diff-tolerance options
│   ├── responsive.spec.ts           # Per-viewport layout screenshots (mobile / tablet / desktop)
│   ├── cross.browser.spec.ts        # Cross-browser screenshot capture (Chromium, Firefox, WebKit)
│   ├── overflow-detection.spec.ts.  # DOM walk to detect horizontal overflow
│   └── cart.spec.ts                 # Visual regression tests for the shopping cart
│   
├── screenshots/                     # Screenshots written by cross-browser tests
├── playwright-report/               # HTML test report
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---


## Architecture


### Page Object Model

All page classes extend `BasePage`, which holds the injected Playwright `Page` instance. Page classes expose typed `Locator` properties and any interaction methods for their respective pages.

```
base.page.ts
├── home.page.ts    (logo, hero heading, nav links, carousel locators)
└── login.page.ts   (login form locators)
```

### Custom Fixtures

`fixtures/visual.fixtures.ts` extends Playwright's base `test` object with:
- **Ad blocking** — routes ad-related domains (doubleclick, googlesyndication, etc.) and aborts them to prevent layout shifts
- **Consent handling** — automatically detects and dismisses the consent button on initial page load
- **Font readiness** — waits for `document.fonts.ready` before tests execute to ensure stable typography in visual comparisons
- **Page objects** — lazily-instantiated fixtures for `homePage` and `loginPage`

```typescript
import { test, expect } from "../fixtures/visual.fixtures";
```

---


## Test Suites

### Visual Regression for Homepage `homepage.spec.ts`

Covers the homepage across multiple comparison strategies using Playwright's `toHaveScreenshot()` to ensure visual consistency and catch any unintended layout or styling changes.
- **Exact pixel match** — zero tolerance, fails on any pixel difference.
- **Pixel budget** — `maxDiffPixels: 100` allows up to 100 differing pixels.
- **Threshold tolerance** — `threshold: 0.5` sets a per-pixel colour-difference ratio.
- **Element-level snapshot** — isolates just the site logo for targeted regression.
- **Full-page capture** — scrolls the entire page with `fullPage: true`.
- **Masking** — excludes dynamic/animated regions (e.g. "Test Cases" and "APIs List" links) from comparison using the `mask` option.

### Responsive Layout `responsive.spec.ts` 

Iterates over three viewports and asserts a full-page screenshot at each breakpoint:

| Breakpoint | Width × Height |
| ---------- | -------------- |
| Mobile     | 375 × 812      |
| Tablet     | 768 × 1024     |
| Desktop    | 1440 × 900     |

Handles GDPR consent overlays that may appear before the layout is stable, and waits for fonts to finish loading (`document.fonts.ready`) before taking a snapshot.

### Cross-Browser Screenshots `cross.browser.spec.ts`

Two equivalent approaches are provided for comparison to test:
- Font rendering
- this is browser-agnostic functional check
- ensures scrolled-off content is captured,
where layout differences between engines are most visible


### Layout Overflow `overflow-detection.spec.ts` 

 Test to detect horizontal overflow on any element of the page. This helps in identifying layout issues where elements extend beyond the viewport width.

### Cart Visual Regression `cart.spec.ts`

Covers the shopping cart page across its main states using `toHaveScreenshot()`:
- **Empty cart** — no items added, baseline captured at `/view_cart`.
- **Single item** — one product added from its details page, then verified on the cart page.
- **Multiple items** — several products added in sequence, then verified together on the cart page.

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

## CI/CD Integration

For CI/CD purpose Github Actions is used. Visual testing in CI differs from local runs because of rendering differences across operating systems. A page that looks identical on macOS and Windows can produce a slightly different screenshot on the Linux based runners used by GitHub Actions. This issue can be handled in two ways:
- Generate baselines in CI and commit them back to the repo, then run tests against those baselines.
- Generate baselines locally using the official Playwright Docker image, so the images already match the Linux runner used in CI.

In this project the second approach is implemnted.  This solution provides one source of truth and easy to maintain the baselines. By the other way it is required to maintaine multiple sets of baselines. There is also a worklfow ([ci-update-baselines.yml](.github/workflows/ci-update-baselines.yml)) to use as a base of first solution and it can be used.

### Option 1: Commit baselines from CI

- Run the worklow manually in CI and generate CI runner based snapshots
- Run the main testing worklfow and check the results

### Option 2: Update locally through Docker (Recommended)

With Docker Desktop running, from the project root, start a container using the Playwright image whose version matches the project's `@playwright/test` version:

```bash
docker run --rm --network host \
  -v $(pwd):/work/ -w /work/ \
  -it mcr.microsoft.com/playwright:v1.63.0-noble \
  /bin/bash
```

Inside the container, install dependencies and confirm the Playwright version matches the project:

```bash
npm ci
npm ls playwright
npx playwright install --with-deps
```

Update the snapshots (the config treats `CI=true` as headless, matching CI behavior):

```bash
CI=true npx playwright test --update-snapshots --project=chromium
```

Check that the snapshot folders were updated, then exit the container:

```bash
exit
```

- Run the testing workflow
- When it is need to update baselines repeat the mentioned steps above with docker container.

> Note: Workflows are build to run manually. It can be converted into push or pull request actions in the repo or connect to the main functional project to be triggered accordingly


---
