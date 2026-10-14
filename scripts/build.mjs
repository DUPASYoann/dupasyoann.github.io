import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { profile, publications, copy, skills } from "../site/content.mjs";

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

function fusion() {
  let points = "";
  for (let i = 0; i < 115; i++) {
    const a = i * 2.39996,
      r = 12 + Math.sqrt(i) * 5.8;
    const x = 252 + Math.cos(a) * r * 1.25,
      y = 97 + Math.sin(a) * r * 0.83;
    points += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i % 5 === 0 ? 2.6 : 1.7}" fill="${i % 3 === 0 ? "#b56a41" : "#6b7657"}" opacity="${0.3 + (i % 6) * 0.12}"/>`;
  }
  return `<svg class="fusion-svg" viewBox="0 0 390 190" role="img" aria-labelledby="fusion-title"><title id="fusion-title">RGB + IR + LiDAR → multimodal fusion</title><defs><pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M 12 0 L 0 0 0 12" fill="none" stroke="currentColor" stroke-opacity=".13" stroke-width=".5"/></pattern></defs><rect x="7" y="18" width="89" height="130" rx="4" fill="url(#grid)" stroke="currentColor" stroke-opacity=".18"/><rect x="27" y="33" width="89" height="130" rx="4" fill="url(#grid)" stroke="#b56a41" stroke-opacity=".65"/><rect x="47" y="48" width="89" height="130" rx="4" fill="url(#grid)" stroke="#6b7657" stroke-opacity=".8"/><path d="M144 95H172m-7-5 7 5-7 5" fill="none" stroke="currentColor" stroke-opacity=".5"/>${points}<text x="8" y="185" class="svg-label">RGB / IR / LiDAR</text><text x="224" y="185" class="svg-label">FUSION</text></svg>`;
}

function researchArt(index) {
  const shapes = [
    '<rect x="35" y="16" width="74" height="64" rx="3"/><rect x="55" y="32" width="74" height="64" rx="3"/><rect x="75" y="48" width="74" height="64" rx="3"/>',
    '<path d="M40 35 95 20 150 35M40 35 95 64 150 35M40 35v60l55 25 55-25V35M95 64v56M40 65l55 26 55-26"/><circle cx="40" cy="35" r="5"/><circle cx="95" cy="20" r="5"/><circle cx="150" cy="35" r="5"/><circle cx="95" cy="64" r="5"/><circle cx="95" cy="120" r="5"/>',
    '<circle cx="95" cy="67" r="43"/><ellipse cx="95" cy="67" rx="20" ry="43"/><ellipse cx="95" cy="67" rx="43" ry="17"/><path d="M95 10v114M38 67h114"/><circle cx="133" cy="45" r="5"/>',
  ];
  return `<svg viewBox="0 0 190 140" aria-hidden="true" class="research-art"><g fill="none" stroke="currentColor" stroke-width="1.2">${shapes[index]}</g></svg>`;
}

function publicationList(lang, items = publications) {
  const c = copy[lang];
  return `<div class="publication-list">${items.map((p) => `<article class="publication" data-year="${p.year}" data-search="${escape(`${p.title} ${p.authors} ${p.venue}`)}"><div class="pub-year">${p.year}</div><div class="pub-body"><p class="pub-venue">${escape(p.venue)} <span> / ${p.type === "thesis" ? c.thesis : c.conference}</span></p><h3>${escape(p.title)}</h3><p class="pub-authors">${escape(p.authors).replace("Yoann Dupas", "<strong>Yoann Dupas</strong>")}</p><div class="pub-actions"><button type="button" class="text-link cite-button" data-cite="${p.id}" aria-label="${c.cite}: ${escape(p.title)}">${c.cite} <span aria-hidden="true">{ }</span></button>${p.url ? external(p.url, c.record, "text-link") : ""}</div></div></article>`).join("")}</div>`;
}

function timeline(items) {
  return `<div class="timeline">${items.map(([date, title, org, text]) => `<article class="timeline-item"><p class="date">${escape(date)}</p><div><h3>${escape(title)}</h3><p class="organization">${escape(org)}</p>${text ? `<p class="timeline-description">${escape(text)}</p>` : ""}</div></article>`).join("")}</div>`;
}

function contact(lang) {
  const c = copy[lang];
  return `<section class="contact-section" id="contact"><div>${eyebrow(c.contactEyebrow)}<h2>${c.contactTitle}</h2><p>${c.contactText}</p><a class="button button-dark" href="mailto:${profile.email}">${c.email} ${arrow}</a></div><div class="contact-links"><a class="email-link" href="mailto:${profile.email}">${profile.email}</a><button class="copy-email text-link" data-email="${profile.email}">${c.copyEmail} <span aria-hidden="true">＋</span></button><div class="social-links">${external(profile.linkedin, "LinkedIn")}${external(profile.github, "GitHub")}${external(profile.hal, "HAL")}${external(profile.scholar, "Scholar")}</div></div></section>`;
}

function home(lang) {
  const c = copy[lang];
  return `<section class="hero" id="top"><div class="hero-copy">${eyebrow(c.eyebrow)}<h1>${c.hero}</h1><p class="hero-intro">${c.intro}</p><div class="hero-actions"><a class="button button-dark" href="#research">${c.explore} <span aria-hidden="true">↓</span></a><a class="text-link" href="${url(lang, "cv")}">${c.viewCv} ${arrow}</a></div><p class="hero-role">${c.role}</p></div><aside class="hero-aside"><div class="portrait-frame"><img src="/assets/portrait.jpg" alt="${c.portrait}" width="524" height="516" fetchpriority="high"><span class="portrait-index" aria-hidden="true">YD / 01</span></div><p class="location"><span aria-hidden="true">⌖</span> ${c.location}</p><div class="fusion">${fusion()}<p>${c.caption}</p></div></aside><div class="hero-bottom"><span>${c.scroll}</span><span aria-hidden="true">↓</span><span>RGB + IR + LiDAR</span></div></section>
  <section class="section research-section" id="research"><div class="section-heading"><div>${eyebrow(c.researchEyebrow)}<h2>${c.researchTitle}</h2></div><p>${c.researchIntro}</p></div><div class="research-grid">${c.research.map((r, i) => `<article class="research-card"><div class="research-card-top"><span class="card-index">0${i + 1}</span>${researchArt(i)}</div><p class="tagline">${r.tag}</p><h3>${r.title}</h3><p>${r.text}</p></article>`).join("")}</div><div class="thesis-banner"><span class="thesis-mark" aria-hidden="true">↗</span><div>${eyebrow(c.thesisLabel)}<h3>${c.thesisTitle}</h3><p>${c.thesisText}</p></div>${external(profile.thesis, c.thesisLink, "text-link")}</div></section>
  <section class="section" id="publications"><div class="section-heading"><div>${eyebrow(c.pubEyebrow)}<h2>${c.pubTitle}</h2></div><a class="text-link" href="${url(lang, "publications")}">${c.allPubs} ${arrow}</a></div>${publicationList(lang, publications.filter((p) => p.type !== "thesis").slice(0, 3))}</section>
  <section class="section experience-section" id="experience"><div class="experience-heading">${eyebrow(c.expEyebrow)}<h2>${c.expTitle}</h2><a class="text-link" href="${url(lang, "cv")}">${c.viewCv} ${arrow}</a></div>${timeline(c.jobs.filter((_, i) => i !== 2))}</section>
  <section class="section about-section" id="about"><div class="mountain-art" aria-hidden="true"><svg viewBox="0 0 400 300"><path d="M0 260 90 120l65 92 87-164 158 212M45 260l94-120 88 120M176 173l66-125 60 105-37-17-21 21-22-27-19 41"/><circle cx="85" cy="60" r="22"/><path d="M0 278h400M0 290h400"/></svg><span>45°34′ N / 5°55′ E</span></div><div>${eyebrow(c.aboutEyebrow)}<h2>${c.aboutTitle}</h2><p>${c.aboutText}</p><ul class="hobbies">${c.hobbies.map((h) => `<li>${h}</li>`).join("")}</ul></div></section>${contact(lang)}`;
}

function papers(lang) {
  const c = copy[lang];
  return `<section class="page-intro">${eyebrow(c.pubEyebrow)}<h1>${c.pubTitle}</h1><p>${c.pubIntro}</p><div class="hero-actions">${external(profile.scholar, c.scholar, "text-link")}${external(profile.hal, "HAL", "text-link")}<a class="text-link" href="/assets/publications.bib" download>${c.bibDownload} <span aria-hidden="true">↓</span></a></div></section><section class="papers-section" aria-label="${c.nav[1]}"><form class="publication-filters" role="search"><div class="search-field"><span aria-hidden="true">⌕</span><label class="sr-only" for="pub-search">${c.searchLabel}</label><input id="pub-search" type="search" placeholder="${c.search}" autocomplete="off"></div><label class="sr-only" for="pub-year">${c.all}</label><select id="pub-year"><option value="all">${c.all}</option>${[...new Set(publications.map((p) => p.year))].map((y) => `<option value="${y}">${y}</option>`).join("")}</select></form><p class="results" role="status" aria-live="polite"><span id="result-count">${publications.length}</span> ${c.results}</p>${publicationList(lang)}<div id="empty-state" hidden><p>${c.empty}</p><button class="text-link" id="reset-filters" type="button">${c.reset} ↗</button></div></section>${contact(lang)}`;
}

function cv(lang) {
  const c = copy[lang];
  return `<section class="page-intro cv-intro">${eyebrow("YOANN DUPAS / CV")}<h1>${c.cvTitle}</h1><p>${c.cvIntro}</p><p class="cv-contact">${profile.location} · <a href="mailto:${profile.email}">${profile.email}</a></p><button type="button" class="button button-dark print-button">${c.print} <span aria-hidden="true">↓</span></button></section><section class="cv-section"><h2>${c.experience}</h2>${timeline(c.jobs)}</section><section class="cv-section"><h2>${c.education}</h2>${timeline(c.schools)}</section><section class="cv-section"><h2>${c.skills}</h2><div class="skills-grid">${skills.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></section><section class="cv-section"><h2>${c.languages}</h2><p>${c.languageText}</p></section><section class="cv-section cv-publications"><h2>${c.nav[1]}</h2>${publicationList(lang)}</section>${contact(lang)}`;
}

function document(lang, page = "") {
  const c = copy[lang],
    homeUrl = url(lang),
    pageUrl = url(lang, page),
    otherLang = lang === "fr" ? "en" : "fr";
  const titles = { "": `Yoann Dupas — ${c.role}`, publications: `${c.nav[1]} — Yoann Dupas`, cv: `CV — Yoann Dupas`, 404: `404 — Yoann Dupas` };
  const navTargets = [`${homeUrl}#research`, url(lang, "publications"), url(lang, "cv"), `${homeUrl}#about`];
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: origin,
    image: `${origin}/assets/portrait.jpg`,
    jobTitle: c.role,
    email: `mailto:${profile.email}`,
    sameAs: [profile.github, profile.linkedin, profile.scholar, profile.hal],
    knowsAbout: ["Computer vision", "Deep learning", "Multimodal fusion"],
    alumniOf: [{ "@type": "CollegeOrUniversity", name: "Polytech Tours" }],
  };
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>${escape(titles[page])}</title><meta name="description" content="${escape(c.description)}"><link rel="canonical" href="${origin}${pageUrl}"><link rel="alternate" hreflang="en" href="${origin}${url("en", page)}"><link rel="alternate" hreflang="fr" href="${origin}${url("fr", page)}"><link rel="alternate" hreflang="x-default" href="${origin}${url("en", page)}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(titles[page])}"><meta property="og:description" content="${escape(c.description)}"><meta property="og:url" content="${origin}${pageUrl}"><meta property="og:locale" content="${lang === "fr" ? "fr_FR" : "en_GB"}"><meta property="og:image" content="${origin}/assets/social-card.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#f6f5f0"><link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><link rel="stylesheet" href="/assets/style.css"><script src="/assets/theme-init.js"></script><script src="/assets/app.js" defer></script><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>${page === "404" ? '<meta name="robots" content="noindex">' : ""}</head><body data-page="${page || "home"}"><a class="skip-link" href="#main">${c.skip}</a><header class="site-header"><a class="wordmark" href="${homeUrl}" aria-label="Yoann Dupas — ${c.backHome}">yoann dupas<span aria-hidden="true">.</span></a><nav id="main-nav" aria-label="${lang === "fr" ? "Navigation principale" : "Main navigation"}">${c.nav.map((label, i) => `<a href="${navTargets[i]}"${(page === "publications" && i === 1) || (page === "cv" && i === 2) ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav><div class="header-actions"><a class="language-switch" lang="${otherLang}" hreflang="${otherLang}" href="${url(otherLang, page === "404" ? "" : page)}" aria-label="${otherLang === "fr" ? "Version française" : "English version"}">${otherLang.toUpperCase()}</a><button class="theme-toggle icon-button" type="button" aria-label="${c.theme}" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><path d="M12 5a7 7 0 0 1 0 14Z"/></svg></button><a class="header-contact" href="${homeUrl}#contact">${c.contact} ${arrow}</a><button class="menu-toggle icon-button" aria-label="${c.menu}" aria-expanded="false" aria-controls="main-nav" type="button"><span></span><span></span></button></div></header><main id="main">${page === "" ? home(lang) : page === "publications" ? papers(lang) : page === "cv" ? cv(lang) : `<section class="page-intro not-found">${eyebrow("ERROR / 404")}<h1>${c.notFound}</h1><p>${c.notFoundText}</p><a href="${homeUrl}" class="button button-dark">${c.backHome} ${arrow}</a></section>`}</main><footer class="site-footer"><a class="wordmark" href="${homeUrl}">yoann dupas<span>.</span></a><p>${c.footer}</p><a href="#main" class="text-link">${c.backTop} ↑</a></footer><dialog id="citation-dialog" aria-labelledby="citation-title"><div class="dialog-heading"><h2 id="citation-title">${c.citation}</h2><button type="button" class="close-dialog icon-button" aria-label="${c.close}">×</button></div><pre id="citation-text" tabindex="0"></pre><button class="button button-dark copy-citation" type="button">${c.copy}</button><p class="copy-status" role="status" aria-live="polite"></p></dialog><div class="toast" role="status" aria-live="polite"></div><script type="application/json" id="citation-data">${JSON.stringify(Object.fromEntries(publications.map((p) => [p.id, bibtex(p)]))).replace(/</g, "\\u003c")}</script><script type="application/json" id="ui-data">${JSON.stringify({ copied: c.copied, copyFailed: c.copyFailed })}</script></body></html>`;
}

export async function build() {
  await mkdir(path.join(out, "assets"), { recursive: true });
  const routes = [];
  for (const lang of ["en", "fr"]) {
    for (const page of ["", "publications", "cv", "404"]) {
      const route = url(lang, page);
      const target = page === "404" ? path.join(out, lang === "fr" ? "fr/404.html" : "404.html") : path.join(out, route, "index.html");
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, document(lang, page));
      if (page !== "404") routes.push(route);
    }
  }
  for (const file of ["style.css", "app.js", "theme-init.js", "favicon.svg", "social-card.png"])
    await copyFile(path.join(root, "site", file), path.join(out, "assets", file));
  await copyFile(path.join(root, "assets/img/photo_de_profil.jpg"), path.join(out, "assets/portrait.jpg"));
  await writeFile(path.join(out, "assets/publications.bib"), publications.map(bibtex).join("\n\n") + "\n");
  await writeFile(path.join(out, ".nojekyll"), "");
  await writeFile(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  await writeFile(
    path.join(out, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((r) => `<url><loc>${origin}${r}</loc></url>`).join("")}</urlset>`
  );
  // Keep old entry points useful without publishing the original demo pages.
  for (const [route, target] of Object.entries({ projects: "/#research", repositories: profile.github, about: "/", research: "/#research" })) {
    await mkdir(path.join(out, route), { recursive: true });
    await writeFile(
      path.join(out, route, "index.html"),
      `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Yoann Dupas</title><meta http-equiv="refresh" content="0;url=${escape(target)}"><link rel="canonical" href="${target.startsWith("https:") ? target : origin + target}"><p><a href="${target}">Continue to Yoann Dupas</a></p></html>`
    );
  }
  console.log(`Built ${routes.length} pages (EN + FR), 404 pages, legacy redirects, SEO metadata and bibliography in dist/.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
