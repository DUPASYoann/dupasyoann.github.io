import { publications } from "./content.mjs";
import { researchCopy, studies } from "./research.mjs";

const esc = (text) => String(text).replace(/[&<>"']/g, (x) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[x]);
const root = (lang) => (lang === "fr" ? "/fr/" : "/");
const link = (href, text) => `<a class="text-link" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${text} ↗</a>`;

function scene(lang) {
  const c = researchCopy[lang];
  const person =
    '<circle cx="425" cy="177" r="13"/><path d="M409 195Q425 184 439 195L446 237 432 241 438 286 427 289 417 247 410 288 399 286 404 239 393 232Z"/>';
  const car = '<path d="M135 250 158 216h88l32 34 20 10v44H110v-43Z"/><circle cx="148" cy="300" r="19"/><circle cx="262" cy="300" r="19"/>';
  let points = "";
  // Deterministic, drawn point cloud: an explanatory graphic, not acquired LiDAR data.
  for (let y = 145; y < 330; y += 10)
    for (let x = 25; x < 715; x += 12) {
      const inPerson = x > 395 && x < 447 && y > 168 && y < 291;
      const inCar = x > 110 && x < 298 && y > 220 && y < 310;
      const ground = y > 290 && (x + y) % 4 === 0;
      const building = y < 190 && (x < 300 || x > 520) && (x + y) % 3 === 0;
      if (inPerson || inCar || ground || building)
        points += `<circle cx="${x}" cy="${y}" r="${inPerson ? 2.1 : 1.3}" fill="${inPerson ? "#ffd096" : inCar ? "#87c3be" : "#6c8992"}"/>`;
    }
  return `<svg viewBox="0 0 740 360" class="sensor-scene" role="img" aria-labelledby="scene-title scene-desc"><title id="scene-title">${lang === "fr" ? "Illustration d’une rue avec un véhicule et un piéton" : "Illustration of a street with a vehicle and a pedestrian"}</title><desc id="scene-desc">${c.demoNote}</desc><defs><linearGradient id="scene-sky" x2="0" y2="1"><stop stop-color="#657e8a"/><stop offset="1" stop-color="#aab5ac"/></linearGradient><radialGradient id="thermal-glow"><stop stop-color="#ffcf83" stop-opacity=".7"/><stop offset="1" stop-color="#bb5575" stop-opacity="0"/></radialGradient></defs><g class="scene-rgb"><rect width="740" height="360" fill="url(#scene-sky)"/><path d="M0 203V74h91v129M100 202V37h127v166M244 203V95h83v108M520 203V76h99v127M630 203V23h110v180" fill="#586762"/><path d="M118 58h26v23h-26m47-23h26v23h-26M118 101h26v23h-26m47-23h26v23h-26M546 104h20v24h-20m33-24h20v24h-20M650 52h20v24h-20m34-24h20v24h-20" fill="#b4bd9e" opacity=".65"/><path d="M0 203h740v157H0Z" fill="#5c625d"/><path d="m326 203-90 157h310l-97-157Z" fill="#71776f"/><path d="m385 220-2 24m-3 15-3 34m-3 18-3 40" stroke="#dad6be" stroke-width="5"/><g fill="#597d8e" stroke="#293e43" stroke-width="2">${car}</g><path d="m165 225-17 25h111l-23-25Z" fill="#b5c8c7"/><g fill="#c79161">${person}</g><rect class="scene-fog" width="740" height="360" fill="#d7dcd4"/></g><g class="scene-ir"><rect width="740" height="360" fill="#242238"/><path d="M0 203V74h91v129M100 202V37h127v166M244 203V95h83v108M520 203V76h99v127M630 203V23h110v180" fill="#454157"/><path d="M0 203h740v157H0Z" fill="#37344b"/><ellipse cx="422" cy="230" rx="65" ry="95" fill="url(#thermal-glow)"/><g fill="#bb7896" stroke="#e9a99c" stroke-width="2">${car}</g><g fill="#ffda90">${person}</g></g><g class="scene-lidar"><rect width="740" height="360" fill="#192b32"/>${points}<path d="M370 207 220 360M413 207l125 153" stroke="#36505a" fill="none"/></g><g class="scene-annotations" fill="none" stroke="#e9f5cd" stroke-width="2" stroke-dasharray="6 4"><rect x="383" y="154" width="76" height="145"/><rect x="102" y="208" width="205" height="116"/><g fill="#192b21" stroke="none"><rect x="383" y="129" width="112" height="25"/><rect x="102" y="183" width="112" height="25"/></g><g fill="#f6f5f0" stroke="none" font-family="Arial,sans-serif" font-size="14"><text x="392" y="147">${c.person}</text><text x="111" y="201">${c.car}</text></g></g></svg>`;
}

function paperFigure(lang) {
  const title = lang === "fr" ? "Résultats qualitatifs publiés — MEFA" : "Published qualitative results — MEFA";
  const description =
    lang === "fr"
      ? "Comparaison par temps de pluie et de nuit : visible, infrarouge, LiDAR, puis détections après concaténation ou MEFA. Figure 5 de l’article original, à lire dans son contexte expérimental."
      : "Rain and night comparisons: visible, infrared, LiDAR, followed by detections with concatenation or MEFA. Figure 5 from the original paper; interpret it within its experimental setup.";
  return `<figure class="paper-figure"><h3>${title}</h3><a href="/assets/mefa-qualitative.png" target="_blank" rel="noopener noreferrer" aria-label="${lang === "fr" ? "Ouvrir la figure en grand" : "Open full-size figure"}"><img src="/assets/mefa-qualitative.png" alt="${description}" width="870" height="745" loading="lazy"></a><figcaption><p>${description}</p><p>Dupas, Hotel, Lefebvre &amp; Cérin · VISAPP 2025 · ${link("https://www.scitepress.org/Papers/2025/132360/132360.pdf", lang === "fr" ? "Source : figure 5, p. 616" : "Source: Figure 5, p. 616")} · ${link("https://creativecommons.org/licenses/by-nc-nd/4.0/", "CC BY-NC-ND 4.0")}</p></figcaption></figure>`;
}

export function demo(lang) {
  const c = researchCopy[lang];
  return `<section class="perception-demo" id="perception-demo" data-mode="fusion" data-condition="day"><div class="demo-heading"><div><p class="eyebrow">${c.demoBadge}</p><h2>${c.demoTitle}</h2></div><p>${c.demoIntro}</p></div><div class="demo-workbench"><div class="demo-toolbar" role="group" aria-label="${c.modesLabel}">${["rgb", "ir", "lidar", "fusion"].map((mode, i) => `<button type="button" data-mode-button="${mode}" aria-pressed="${mode === "fusion"}">${c.modes[i]}</button>`).join("")}</div><div class="scene-frame">${scene(lang)}<span class="scene-label" aria-hidden="true">RGB + IR</span></div><div class="demo-settings"><div><label for="scene-condition">${c.conditions}</label><select id="scene-condition"><option value="day">${c.day}</option><option value="night">${c.night}</option><option value="fog">${c.fog}</option></select></div><div class="mix-setting"><label for="sensor-mix">${c.mix} <output for="sensor-mix" id="mix-value">50 %</output></label><input id="sensor-mix" type="range" min="0" max="100" value="50"></div><label class="annotation-setting"><input id="show-annotations" type="checkbox" checked>${c.annotation}</label></div><p id="sensor-explanation" class="sensor-explanation" role="status" aria-live="polite">${c.explanations[3]}</p></div><p class="demo-note">${c.demoNote}</p><script type="application/json" id="demo-copy">${JSON.stringify(c.explanations)}</script></section>`;
}

export function studyCards(lang) {
  const c = researchCopy[lang];
  return `<div class="study-cards">${studies.map((study, i) => `<article class="study-card"><p class="eyebrow">0${i + 1} / ${study.first ? c.firstAuthor : c.coauthor}</p><h3>${study.title}</h3><p>${study[lang].subtitle}</p><a class="text-link" href="${root(lang)}research/#${study.id}">${c.readStudy} ↗</a></article>`).join("")}</div>`;
}

export function researchPage(lang) {
  const c = researchCopy[lang];
  return `<section class="page-intro"><p class="eyebrow">${c.eyebrow}</p><h1>${c.title}</h1><p>${c.intro}</p><nav class="study-jump" aria-label="${c.studies}">${studies.map((s) => `<a href="#${s.id}">${s.title} ↓</a>`).join("")}</nav></section>${demo(lang)}<section class="case-studies" aria-label="${c.studies}">${studies
    .map((s) => {
      const p = publications.find((paper) => paper.id === s.paper);
      const content = s[lang];
      return `<article class="case-study" id="${s.id}"><div class="case-heading"><div><p class="eyebrow">${esc(p.venue)} / ${p.year}</p><h2>${s.title}</h2><p class="case-subtitle">${content.subtitle}</p></div><p class="author-role">${c.role}<br><strong>${s.first ? c.firstAuthor : c.coauthor}</strong></p></div><div class="pipeline" aria-label="${lang === "fr" ? "Vue simplifiée du traitement" : "Simplified processing overview"}">${s.tag
        .split(" → ")
        .map((step, i) => `<div><span>${c.steps[i]}</span><strong>${step}</strong></div>`)
        .join('<span class="pipeline-arrow" aria-hidden="true">→</span>')}</div><div class="case-content">${[
        [c.problem, content.problem],
        [c.method, content.method],
        [c.outcome, content.outcome],
      ]
        .map(([heading, text]) => `<div><h3>${heading}</h3><p>${text}</p></div>`)
        .join(
          ""
        )}</div>${s.id === "mefa" ? paperFigure(lang) : ""}${s.id === "mefa-ms" ? `<aside class="result-callout"><div><p class="eyebrow">${c.measured}</p><strong>−50 %</strong><p>${c.metricLabel}</p></div><p>${c.metricContext}</p></aside>` : ""}<div class="case-source"><p>${c.source} : <strong>${esc(p.title)}</strong></p><div>${link(p.pdf, c.pdf)}${link(`https://doi.org/${p.doi}`, "DOI")}<a class="text-link" href="${root(lang)}publications/#${p.id}">${c.readPaper} ↗</a></div></div></article>`;
    })
    .join("")}</section>`;
}
