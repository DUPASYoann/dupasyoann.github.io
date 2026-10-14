import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { build, out, root } from "./build.mjs";
import { cvFingerprint } from "../site/cv-fingerprint.mjs";

// Generates PDFs from the same HTML and content as the website, without an external service.
process.env.CV_EXPORT = "1";
await build();
const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, "http://localhost").pathname;
    const filename = path.join(out, pathname.endsWith("/") ? pathname + "index.html" : pathname);
    const body = await readFile(filename);
    const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg" };
    res.writeHead(200, { "Content-Type": types[path.extname(filename)] || "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || (process.platform === "win32" ? "msedge" : "chromium"),
  headless: true,
});
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, colorScheme: "light" });
  const directory = path.join(root, "site/downloads");
  await mkdir(directory, { recursive: true });
  for (const lang of ["fr", "en"]) {
    await page.goto(`http://127.0.0.1:${server.address().port}/${lang === "fr" ? "fr/" : ""}cv/`);
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: path.join(directory, `yoann-dupas-cv-${lang}.pdf`),
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate:
        '<div style="font:8px Arial;color:#666;width:100%;text-align:center">Yoann Dupas · <span class="pageNumber"></span> / <span class="totalPages"></span></div>',
      margin: { top: "15mm", right: "15mm", bottom: "18mm", left: "15mm" },
    });
  }
  await writeFile(path.join(directory, "manifest.json"), JSON.stringify({ sourceHash: cvFingerprint() }, null, 2) + "\n");
  console.log("Generated bilingual CV PDFs in site/downloads/.");
} finally {
  await browser.close();
  server.close();
}
