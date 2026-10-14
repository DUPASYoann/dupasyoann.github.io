import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:8080";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || (process.platform === "win32" ? "msedge" : "chromium"),
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: "light",
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (r) => {
  if (r.status() >= 400 && !r.url().includes("missing-page")) errors.push(`${r.status()} ${r.url()}`);
});
const report = { responsiveChecks: 0, accessibilityChecks: 0, interactions: [], errors, violations: [] };
try {
  for (const route of ["/", "/fr/", "/publications/", "/fr/publications/", "/cv/", "/fr/cv/", "/research/", "/fr/research/"]) {
    await page.goto(base + route);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const sizes = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
      assert.ok(sizes.content <= sizes.viewport + 1, `Overflow on ${route} at ${width}: ${JSON.stringify(sizes)}`);
      report.responsiveChecks++;
    }
    for (const mode of ["light", "dark"]) {
      await page.evaluate((theme) => (document.documentElement.dataset.theme = theme), mode);
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      report.accessibilityChecks++;
      report.violations.push(...result.violations.map((v) => ({ route, mode, id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target) })));
    }
    await page.evaluate(() => (document.documentElement.dataset.theme = "light"));
  }
  await page.goto(base + "/fr/");
  await page.screenshot({ path: "test-results/home-desktop.png", fullPage: true });
  await page.locator(".theme-toggle").click();
  await page.reload();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await page.screenshot({ path: "test-results/home-dark.png", fullPage: true });
  await page.locator(".theme-toggle").click();
  report.interactions.push("theme persistence after reload");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/home-mobile.png", fullPage: true });
  await page.locator(".menu-toggle").click();
  assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
  await page.locator("#main-nav a").nth(1).click();
  await page.waitForURL("**/fr/publications/");
  assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
  report.interactions.push("mobile menu and navigation");
  await page.locator("#pub-search").fill("Cerin");
  assert.equal(await page.locator(".publication:visible").count(), 4);
  await page.locator("#pub-year").selectOption("2025");
  assert.equal(await page.locator(".publication:visible").count(), 2);
  await page.reload();
  assert.equal(await page.locator(".publication:visible").count(), 2);
  await page.locator(".language-switch").click();
  await page.waitForURL("**/publications/?**");
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert.equal(await page.locator(".publication:visible").count(), 2);
  await page.locator("#pub-search").fill("no-result-test");
  assert.ok(await page.locator("#empty-state").isVisible());
  await page.locator("#reset-filters").click();
  assert.equal(await page.locator(".publication:visible").count(), 5);
  report.interactions.push("accent-insensitive search, combined year filter, URL persistence, language switch, empty state and reset");
  const citation = page.locator(".cite-button").first();
  await citation.click();
  assert.ok(await page.locator("#citation-dialog").isVisible());
  await page.locator(".copy-citation").click();
  assert.equal(await page.locator(".copy-status").textContent(), "Copied");
  assert.match(await page.evaluate(() => navigator.clipboard.readText()), /@inproceedings\{dupas2026mefa/);
  await page.keyboard.press("Escape");
  assert.equal(await page.evaluate(() => document.activeElement?.classList.contains("cite-button")), true);
  report.interactions.push("citation dialog, clipboard, Escape and focus restoration");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "test-results/publications.png", fullPage: true });
  await page.goto(base + "/fr/cv/");
  await page.emulateMedia({ media: "print" });
  assert.equal(await page.locator(".site-header").isVisible(), false);
  await page.pdf({ path: "test-results/cv-fr.pdf", format: "A4", printBackground: true });
  report.interactions.push("print layout and PDF generation");
  await page.emulateMedia({ media: "screen" });
  await page.goto(base + "/fr/");
  await page.locator(".copy-email").click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), "yoann.dupas.pro@gmail.com");
  report.interactions.push("email clipboard");
  await page.goto(base + "/fr/research/");
  await page.locator('[data-mode-button="rgb"]').click();
  assert.equal(await page.locator(".perception-demo").getAttribute("data-mode"), "rgb");
  assert.equal(await page.locator("#sensor-mix").isDisabled(), true);
  await page.locator("#scene-condition").selectOption("night");
  assert.equal(await page.locator(".perception-demo").getAttribute("data-condition"), "night");
  await page.locator('[data-mode-button="ir"]').click();
  assert.equal(await page.locator('[data-mode-button="ir"]').getAttribute("aria-pressed"), "true");
  await page.locator('[data-mode-button="lidar"]').click();
  assert.equal(await page.locator(".perception-demo").getAttribute("data-mode"), "lidar");
  await page.locator('[data-mode-button="fusion"]').click();
  await page.locator("#sensor-mix").focus();
  await page.keyboard.press("End");
  assert.equal(await page.locator("#mix-value").textContent(), "100 %");
  assert.equal(await page.locator(".perception-demo").evaluate((el) => el.style.getPropertyValue("--ir-mix")), "1");
  await page.locator("#show-annotations").uncheck();
  assert.ok(await page.locator(".perception-demo").evaluate((el) => el.classList.contains("annotations-off")));
  await page.locator("#scene-condition").selectOption("fog");
  assert.equal(await page.locator(".perception-demo").getAttribute("data-condition"), "fog");
  await page.locator("#show-annotations").check();
  await page.locator("#sensor-mix").focus();
  await page.keyboard.press("Home");
  assert.equal(await page.locator("#mix-value").textContent(), "0 %");
  await page.locator("#scene-condition").selectOption("day");
  await page.locator("#sensor-mix").focus();
  await page.keyboard.press("ArrowRight");
  await page.locator("#sensor-mix").evaluate((el) => el.blur());
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: "test-results/research-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/research-mobile.png", fullPage: true });
  report.interactions.push("sensor modalities, day/night/fog conditions, blend via keyboard, annotations");
  for (const lang of ["fr", "en"]) {
    const pdf = await page.request.get(base + `/assets/yoann-dupas-cv-${lang}.pdf`);
    assert.equal(pdf.status(), 200);
    assert.ok(pdf.headers()["content-type"].includes("application/pdf"));
    assert.equal((await pdf.body()).subarray(0, 4).toString(), "%PDF");
  }
  report.interactions.push("direct bilingual PDF downloads");
  const notFound = await page.goto(base + "/missing-page");
  assert.equal(notFound.status(), 404);
  report.interactions.push("404 response");
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const plain = await noJs.newPage();
  await plain.goto(base + "/fr/");
  assert.ok(await plain.locator("#main-nav").isVisible());
  assert.ok(await plain.locator("h1").isVisible());
  await noJs.close();
  report.interactions.push("content and mobile navigation without JavaScript");
  assert.deepEqual(errors, [], "Browser runtime or resource errors");
  assert.deepEqual(report.violations, [], "Accessibility violations");
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile("test-results/browser-report.json", JSON.stringify(report, null, 2));
  await browser.close();
}
