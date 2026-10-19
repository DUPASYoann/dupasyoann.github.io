import { mkdir, writeFile, copyFile, readFile, cp } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { profile, publications, copy, skills } from "../site/content.mjs";
import { researchCopy } from "../site/research.mjs";
import { researchPage } from "../site/research-components.mjs";
import { cvFingerprint } from "../site/cv-fingerprint.mjs";
import { cvHome } from "../site/cv-home.mjs";

export const root = fileURLToPath(new URL("../", import.meta.url));
export const out = path.join(root, "dist");
const origin = "https://dupasyoann.github.io";
export const escape = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export function bibtex(p) {
  const fields = {
    title: p.title,
    author: p.authors
      .split(", ")
      .map((a) => {
        const parts = a.split(" ");
        return `${parts.pop()}, ${parts.join(" ")}`;
      })
      .join(" and "),
    year: p.year,
    booktitle: p.booktitle,
    school: p.school,
    pages: p.pages,
    volume: p.volume,
    url: p.url,
    doi: p.doi,
  };
  return `@${p.type === "thesis" ? "phdthesis" : "inproceedings"}{${p.id},\n${Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `  ${k} = {${v}}`)
    .join(",\n")}\n}`;
}
const arrow = '<span aria-hidden="true">↗</span>';
const url = (lang, page = "") => `${lang === "fr" ? "/fr/" : "/"}${page ? `${page}/` : ""}`;
const external = (href, text, cls = "") => `<a class="${cls}" href="${escape(href)}" target="_blank" rel="noopener noreferrer">${text} ${arrow}</a>`;
const eyebrow = (text) => `<p class="eyebrow">${text}</p>`;

function publicationList(lang, items = publications, rich = true) {
  const c = copy[lang],
    r = researchCopy[lang];
  return `<div class="publication-list">${items.map((p) => `<article id="${p.id}" class="publication" data-year="${p.year}" data-search="${escape(`${p.title} ${p.authors} ${p.venue} ${p.summary?.[lang] || ""}`)}"><div class="pub-year">${p.year}</div><div class="pub-body"><p class="pub-venue">${escape(p.venue)} <span> / ${p.type === "thesis" ? c.thesis : c.conference}</span></p><h3>${escape(p.title)}</h3><p class="pub-authors">${escape(p.authors).replace("Yoann Dupas", "<strong>Yoann Dupas</strong>")}</p>${rich && p.summary ? `<p class="pub-summary">${escape(p.summary[lang])}</p><p class="pub-contribution"><strong>${r.contribution} :</strong> ${escape(p.contribution[lang])}</p>` : ""}<div class="pub-actions"><button type="button" class="text-link cite-button" data-cite="${p.id}" aria-label="${c.cite}: ${escape(p.title)}">${c.cite} <span aria-hidden="true">{ }</span></button>${p.pdf ? external(p.pdf, r.pdf, "text-link") : ""}${p.doi ? external(`https://doi.org/${p.doi}`, "DOI", "text-link") : ""}${p.url ? external(p.url, p.type === "thesis" ? c.record : r.record, "text-link") : ""}${rich && p.study ? `<a class="text-link" href="${url(lang, "research")}#${p.study}">${r.readStudy} ↗</a>` : ""}</div></div></article>`).join("")}</div>`;
}

function timeline(items) {
  return `<div class="timeline">${items.map(([date, title, org, text]) => `<article class="timeline-item"><p class="date">${escape(date)}</p><div><h3>${escape(title)}</h3><p class="organization">${escape(org)}</p>${text ? `<p class="timeline-description">${escape(text)}</p>` : ""}</div></article>`).join("")}</div>`;
}

function contact(lang) {
  const c = copy[lang];
  return `<section class="contact-section" id="contact"><div>${eyebrow(c.contactEyebrow)}<h2>${lang === "fr" ? "Échangeons." : "Let’s connect."}</h2><p>${c.contactText}</p><a class="button button-dark" href="mailto:${profile.email}">${c.email} ${arrow}</a></div><div class="contact-links"><a class="email-link" href="mailto:${profile.email}">${profile.email}</a><button class="copy-email text-link" data-email="${profile.email}">${c.copyEmail} <span aria-hidden="true">＋</span></button><div class="social-links">${external(profile.linkedin, "LinkedIn")}${external(profile.github, "GitHub")}${external(profile.hal, "HAL")}${external(profile.scholar, "Scholar")}</div></div></section>`;
}

function home(lang) {
  return cvHome(lang, { timeline, contact });
}

function papers(lang) {
  const c = copy[lang];
  return `<section class="page-intro">${eyebrow(c.pubEyebrow)}<h1>${c.pubTitle}</h1><p>${c.pubIntro}</p><div class="hero-actions">${external(profile.scholar, c.scholar, "text-link")}${external(profile.hal, "HAL", "text-link")}<a class="text-link" href="/assets/publications.bib" download>${c.bibDownload} <span aria-hidden="true">↓</span></a></div></section><section class="papers-section" aria-label="${c.nav[1]}"><form class="publication-filters" role="search"><div class="search-field"><span aria-hidden="true">⌕</span><label class="sr-only" for="pub-search">${c.searchLabel}</label><input id="pub-search" type="search" placeholder="${c.search}" autocomplete="off"></div><label class="sr-only" for="pub-year">${c.all}</label><select id="pub-year"><option value="all">${c.all}</option>${[...new Set(publications.map((p) => p.year))].map((y) => `<option value="${y}">${y}</option>`).join("")}</select></form><p class="results" role="status" aria-live="polite"><span id="result-count">${publications.length}</span> ${c.results}</p>${publicationList(lang)}<div id="empty-state" hidden><p>${c.empty}</p><button class="text-link" id="reset-filters" type="button">${c.reset} ↗</button></div></section>${contact(lang)}`;
}

function cv(lang) {
  const c = copy[lang];
  return `<section class="page-intro cv-intro">${eyebrow("YOANN DUPAS / CV")}<h1>${c.cvTitle}</h1><p>${c.cvIntro}</p><p class="cv-contact">${profile.location} · <a href="mailto:${profile.email}">${profile.email}</a></p><a class="button button-dark download-cv" href="/assets/yoann-dupas-cv-${lang}.pdf" download>${researchCopy[lang].downloadCv} ↓</a><button type="button" class="button print-button">${c.print} <span aria-hidden="true">↓</span></button></section><section class="cv-section"><h2>${c.experience}</h2>${timeline(c.jobs)}</section><section class="cv-section"><h2>${c.education}</h2>${timeline(c.schools)}</section><section class="cv-section"><h2>${c.skills}</h2><div class="skills-grid">${skills.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></section><section class="cv-section"><h2>${c.languages}</h2><p>${c.languageText}</p></section><section class="cv-section cv-publications"><h2>${c.nav[1]}</h2>${publicationList(lang, publications, false)}</section>${contact(lang)}`;
}

function document(lang, page = "") {
  const c = copy[lang],
    homeUrl = url(lang),
    pageUrl = url(lang, page),
    otherLang = lang === "fr" ? "en" : "fr";
  const titles = {
    "": `Yoann Dupas — ${c.role}`,
    publications: `${c.nav[1]} — Yoann Dupas`,
    cv: `CV — Yoann Dupas`,
    research: `${c.nav[0]} — Yoann Dupas`,
    404: `404 — Yoann Dupas`,
  };
  const navLabels = lang === "fr" ? ["À propos", "Parcours", "Publications"] : ["About", "Experience", "Publications"];
  const navTargets = [`${homeUrl}#about`, url(lang, "cv"), url(lang, "publications")];
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: origin,
    image: `${origin}/assets/portrait.jpg`,
    jobTitle: c.role,
    worksFor: { "@type": "Organization", name: "LYNRED" },
    email: `mailto:${profile.email}`,
    sameAs: [profile.github, profile.linkedin, profile.scholar, profile.hal],
    knowsAbout: ["Computer vision", "Deep learning", "Multimodal fusion"],
    alumniOf: [{ "@type": "CollegeOrUniversity", name: "Polytech Tours" }],
  };
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>${escape(titles[page])}</title><meta name="description" content="${escape(c.description)}"><link rel="canonical" href="${origin}${pageUrl}"><link rel="alternate" hreflang="en" href="${origin}${url("en", page)}"><link rel="alternate" hreflang="fr" href="${origin}${url("fr", page)}"><link rel="alternate" hreflang="x-default" href="${origin}${url("en", page)}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(titles[page])}"><meta property="og:description" content="${escape(c.description)}"><meta property="og:url" content="${origin}${pageUrl}"><meta property="og:locale" content="${lang === "fr" ? "fr_FR" : "en_GB"}"><meta property="og:image" content="${origin}/assets/social-card.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#ffffff"><link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><link rel="stylesheet" href="/assets/style.css"><link rel="stylesheet" href="/assets/fonts.css" media="screen"><link rel="stylesheet" href="/assets/editorial.css" media="screen"><script src="/assets/theme-init.js"></script><script src="/assets/app.js" defer></script><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>${page === "404" ? '<meta name="robots" content="noindex">' : ""}</head><body data-page="${page || "home"}"><a class="skip-link" href="#main">${c.skip}</a><header class="site-header"><a class="wordmark" href="${homeUrl}" aria-label="Yoann Dupas — ${c.backHome}">Yoann Dupas<span aria-hidden="true">.</span></a><nav id="main-nav" aria-label="${lang === "fr" ? "Navigation principale" : "Main navigation"}">${navLabels.map((label, i) => `<a href="${navTargets[i]}"${(page === "" && i === 0) || (page === "cv" && i === 1) || (page === "publications" && i === 2) || (page === "research" && i === 3) ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav><div class="header-actions"><a class="language-switch" lang="${otherLang}" hreflang="${otherLang}" href="${url(otherLang, page === "404" ? "" : page)}" aria-label="${otherLang === "fr" ? "Version française" : "English version"}">${otherLang.toUpperCase()}</a><button class="theme-toggle icon-button" type="button" aria-label="${c.theme}" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><path d="M12 5a7 7 0 0 1 0 14Z"/></svg></button><a class="header-contact" href="${homeUrl}#contact">${c.contact} ${arrow}</a><button class="menu-toggle icon-button" aria-label="${c.menu}" aria-expanded="false" aria-controls="main-nav" type="button"><span></span><span></span></button></div></header><main id="main">${page === "" ? home(lang) : page === "publications" ? papers(lang) : page === "cv" ? cv(lang) : page === "research" ? researchPage(lang) + contact(lang) : `<section class="page-intro not-found">${eyebrow("ERROR / 404")}<h1>${c.notFound}</h1><p>${c.notFoundText}</p><a href="${homeUrl}" class="button button-dark">${c.backHome} ${arrow}</a></section>`}</main><footer class="site-footer"><a class="wordmark" href="${homeUrl}">Yoann Dupas<span>.</span></a><p>${c.footer}</p><a href="#main" class="text-link">${c.backTop} ↑</a></footer><dialog id="citation-dialog" aria-labelledby="citation-title"><div class="dialog-heading"><h2 id="citation-title">${c.citation}</h2><button type="button" class="close-dialog icon-button" aria-label="${c.close}">×</button></div><pre id="citation-text" tabindex="0"></pre><button class="button button-dark copy-citation" type="button">${c.copy}</button><p class="copy-status" role="status" aria-live="polite"></p></dialog><div class="toast" role="status" aria-live="polite"></div><script type="application/json" id="citation-data">${JSON.stringify(Object.fromEntries(publications.map((p) => [p.id, bibtex(p)]))).replace(/</g, "\\u003c")}</script><script type="application/json" id="ui-data">${JSON.stringify({ copied: c.copied, copyFailed: c.copyFailed })}</script></body></html>`;
}

export async function build() {
  if (!process.env.CV_EXPORT) {
    const manifest = JSON.parse(await readFile(path.join(root, "site/downloads/manifest.json"), "utf8"));
    if (manifest.sourceHash !== cvFingerprint()) throw new Error("CV PDFs are out of date. Run npm run cv:pdf before building.");
  }
  await mkdir(path.join(out, "assets"), { recursive: true });
  const routes = [];
  for (const lang of ["en", "fr"]) {
    for (const page of ["", "publications", "cv", "research", "404"]) {
      const route = url(lang, page);
      const target = page === "404" ? path.join(out, lang === "fr" ? "fr/404.html" : "404.html") : path.join(out, route, "index.html");
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, document(lang, page));
      if (page !== "404") routes.push(route);
    }
  }
  for (const file of ["style.css", "editorial.css", "fonts.css", "app.js", "theme-init.js", "favicon.svg", "social-card.png"])
    await copyFile(path.join(root, "site", file), path.join(out, "assets", file));
  await cp(path.join(root, "site/fonts"), path.join(out, "assets/fonts"), { recursive: true });
  if (!process.env.CV_EXPORT) {
    for (const lang of ["fr", "en"])
      await copyFile(path.join(root, "site/downloads", `yoann-dupas-cv-${lang}.pdf`), path.join(out, "assets", `yoann-dupas-cv-${lang}.pdf`));
  }
  await copyFile(path.join(root, "site/figures/mefa-qualitative.png"), path.join(out, "assets/mefa-qualitative.png"));
  await copyFile(path.join(root, "assets/img/photo_de_profil.jpg"), path.join(out, "assets/portrait.jpg"));
  await writeFile(path.join(out, "assets/publications.bib"), publications.map(bibtex).join("\n\n") + "\n");
  await writeFile(path.join(out, ".nojekyll"), "");
  await writeFile(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  await writeFile(
    path.join(out, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((r) => `<url><loc>${origin}${r}</loc></url>`).join("")}</urlset>`
  );
  // Keep old entry points useful without publishing the original demo pages.
  for (const [route, target] of Object.entries({ projects: "/#research", repositories: profile.github, about: "/" })) {
    await mkdir(path.join(out, route), { recursive: true });
    await writeFile(
      path.join(out, route, "index.html"),
      `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Yoann Dupas</title><meta http-equiv="refresh" content="0;url=${escape(target)}"><link rel="canonical" href="${target.startsWith("https:") ? target : origin + target}"><p><a href="${target}">Continue to Yoann Dupas</a></p></html>`
    );
  }
  console.log(`Built ${routes.length} pages (EN + FR), 404 pages, legacy redirects, SEO metadata and bibliography in dist/.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
