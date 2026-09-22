
 

### Ad & Consent Overlay Handling

Visual regression testing assumes the page renders deterministically — same input, same pixels, every time. Anything that breaks that assumption becomes a source of flaky diffs. Third-party embedded content is a classic offender because it's inherently outside your control:

Ads — rotate creatives per request, per session, per ad-auction outcome; sometimes fail to load at all (blank space vs. banner)
Consent/cookie banners — presence depends on cookie/session state, geo-detection, or whether a vendor script races the page load
Embedded widgets — chat bubbles, social feeds, "related content" recommendation engines (Taboola/Outbrain-style), live chat launchers
Timestamps / relative dates ("2 minutes ago", live clocks)
Randomized or personalized content — "recommended for you," A/B test variants, randomized testimonials
Web fonts loading asynchronously — causes text reflow if a screenshot fires before fonts settle (Playwright does handle this reasonably well by default, waiting for fonts)
Animations/transitions — caught mid-frame if not disabled

Since automationexercise.com serves third-party ads and a GDPR consent overlay, both are neutralized in test setup to keep visual snapshots deterministic:

Ad blocking — Requests to known ad-serving domains (e.g., doubleclick, googlesyndication, googletagservices, adsystem, adnxs) are intercepted via page.route() and aborted before the page loads, so rotating ad creatives never render and can't cause false-positive pixel diffs. As a safety net for ad domains not covered by the blocklist, the ad container region can also be masked (mask option in toHaveScreenshot) so any unblocked ad content is excluded from comparison regardless of source.
Consent overlay dismissal — The GDPR consent banner, if present, is detected and dismissed before any assertions run, preventing it from obscuring page content in screenshots.

Both are applied in a shared setup (beforeEach / fixture) so every visual test starts from a clean, ad-free, consent-dismissed page state.


### Hamburger Menu Behavior
Since target app has no hamburger manu behavior, it is not taken into account in the project








