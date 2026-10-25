import test, { before } from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { build, out, root, bibtex } from "../scripts/build.mjs";
import { publications } from "../site/content.mjs";
import { cvFingerprint } from "../site/cv-fingerprint.mjs";

before(build);
const routes = ["", "fr", "publications", "fr/publications", "cv", "fr/cv", "research", "fr/research"];

test("every translated page has valid local links, assets and fragment targets", async () => {
  for (const route of routes) {
    const html = await readFile(path.join(out, route, "index.html"), "utf8");
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, route);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, `Duplicate IDs: ${route}`);
    assert.match(html, new RegExp(`<html lang="${route.startsWith("fr") ? "fr" : "en"}"`));
    assert.ok(!html.includes("example_pdf") && !html.includes("Albert Einstein"));
    assert.match(html, /rel="canonical"/);
    assert.match(html, /hreflang="fr"/);
    assert.match(html, /hreflang="en"/);
    for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (!href.startsWith("/") && !href.startsWith("#")) continue;
      const targetUrl = new URL(href, `https://dupasyoann.github.io/${route}${route ? "/" : ""}`);
      let filename = path.join(out, targetUrl.pathname);
      if ((await stat(filename)).isDirectory()) filename = path.join(filename, "index.html");
      await stat(filename);
      if (targetUrl.hash) assert.ok((await readFile(filename, "utf8")).includes(`id="${targetUrl.hash.slice(1)}"`), `${route}: ${href}`);
    }
  }
});

test("all original publication keys are retained and BibTeX is complete", async () => {
  const original = await readFile(path.join(root, "_bibliography/papers.bib"), "utf8");
  const keys = [...original.matchAll(/@(?:inproceedings|phdthesis)\{([^,]+),/g)].map((m) => m[1]);
  assert.deepEqual(publications.map((p) => p.id).sort(), keys.sort());
  for (const p of publications) {
    assert.match(bibtex(p), /author = \{/);
    assert.ok(bibtex(p).includes(`year = {${p.year}}`));
    assert.ok(p.type === "thesis" ? p.school : p.booktitle);
  }
  const page = await readFile(path.join(out, "publications/index.html"), "utf8");
  assert.equal((page.match(/class="publication"/g) || []).length, keys.length);
});

test("sitemap contains only the six indexable pages; paused research and errors are noindex", async () => {
  const sitemap = await readFile(path.join(out, "sitemap.xml"), "utf8");
  assert.equal((sitemap.match(/<loc>/g) || []).length, 6);
  assert.ok(!sitemap.includes("404"));
  assert.ok(!sitemap.includes("research/"));
  for (const route of routes) {
    const html = await readFile(path.join(out, route, "index.html"), "utf8");
    assert.equal(html.includes('name="robots" content="noindex"'), route.includes("research"), route);
  }
  for (const file of ["404.html", "fr/404.html"]) assert.match(await readFile(path.join(out, file), "utf8"), /noindex/);
  await stat(path.join(out, ".nojekyll"));
  assert.match(await readFile(path.join(out, "robots.txt"), "utf8"), /Sitemap: https:\/\/dupasyoann.github.io\/sitemap.xml/);
});

test("indexable pages have unique metadata, explicit headings and consistent structured data", async () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const route of routes.filter((route) => !route.includes("research"))) {
    const html = await readFile(path.join(out, route, "index.html"), "utf8");
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    const description = html.match(/name="description" content="([^"]+)"/)[1];
    assert.ok(!titles.has(title), route);
    assert.ok(!descriptions.has(description), route);
    titles.add(title);
    descriptions.add(description);
    assert.ok(html.includes(`property="og:description" content="${description}"`));
    const graph = JSON.parse(html.match(/type="application\/ld\+json">(.*?)<\/script>/)[1])["@graph"];
    const person = graph.find((item) => item["@type"] === "Person");
    const page = graph.find((item) => item["@id"].endsWith("#webpage"));
    assert.equal(person.name, "Yoann Dupas");
    assert.equal(page.about["@id"], person["@id"]);
    assert.equal(page.description.replaceAll("&", "&amp;"), description);
    if (route.includes("publications")) {
      assert.equal(page["@type"], "CollectionPage");
      assert.equal(page.mainEntity.itemListElement.length, publications.length);
      assert.match(html, /<h1>(Mes publications scientifiques|My research publications)\./);
    } else {
      assert.equal(page["@type"], "ProfilePage");
      assert.equal(page.mainEntity["@id"], person["@id"]);
      if (!route.includes("cv")) assert.match(html, /<h1>Yoann Dupas/);
    }
  }
});

test("downloadable CV PDFs match current source content", async () => {
  const manifest = JSON.parse(await readFile(path.join(root, "site/downloads/manifest.json"), "utf8"));
  assert.equal(manifest.sourceHash, cvFingerprint());
  for (const lang of ["fr", "en"]) {
    const pdf = await readFile(path.join(out, `assets/yoann-dupas-cv-${lang}.pdf`));
    assert.equal(pdf.subarray(0, 4).toString(), "%PDF");
    assert.ok(pdf.length > 10000);
  }
});

test("research studies and public summaries retain primary source links", async () => {
  for (const lang of ["fr", "en"]) {
    const html = await readFile(path.join(out, lang === "fr" ? "fr/research/index.html" : "research/index.html"), "utf8");
    for (const study of ["mefa", "mefa-ms", "fmcaf"]) assert.ok(html.includes(`id="${study}"`));
    assert.match(html, /hal-05368360/);
    assert.match(html, /132360.pdf/);
    assert.match(html, /10.1109\/ICCVW69036.2025.00231/);
    assert.match(html, /data-mode="fusion"/);
  }
  for (const paper of publications) assert.ok(paper.summary.fr && paper.summary.en);
});
