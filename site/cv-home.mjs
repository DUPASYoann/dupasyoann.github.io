import { copy, profile, publications, skills } from "./content.mjs";
import { studies } from "./research.mjs";

const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const base = (lang) => (lang === "fr" ? "/fr/" : "/");

const text = {
  fr: {
    hello: "Bonjour, moi c’est Yoann.",
    intro:
      "Je suis ingénieur algorithme & IA chez LYNRED, à Chambéry. J’associe vision par ordinateur, deep learning et perception multimodale pour mieux comprendre les images.",
    second:
      "Mon parcours relie recherche doctorale et ingénierie appliquée. Vous trouverez ici mes expériences, mes compétences et mes publications.",
    cv: "Télécharger mon CV",
    journey: "Mon parcours.",
    journeyNote: "De la recherche à l’ingénierie, un même fil conducteur : la vision par ordinateur.",
    previous: "Expériences précédentes",
    fullCv: "Voir le parcours complet",
    current: "Aujourd’hui",
    role: "Ingénieur algorithme & IA",
    employment: "LYNRED · CDI",
    expertise: "Ce que je fais.",
    education: "Ma formation.",
    selected: "Un aperçu de mes recherches.",
    selectedNote: "Trois travaux sur la fusion des images et la perception multimodale.",
    publication: "Publications choisies.",
    allPublications: "Toutes les publications",
    beyond: "Un peu plus sur moi.",
    research: "Découvrir la recherche",
    firstAuthor: "Premier auteur",
    coauthor: "Coauteur",
    read: "Lire l’article",
    place: "Chambéry, France",
    portrait: "Yoann Dupas",
    degrees: "Diplômes et formation",
    tools: "Outils et méthodes",
    thesis: "Recherche doctorale · Orange / LIG",
    contact: "Échangeons.",
  },
  en: {
    hello: "Hello, I’m Yoann.",
    intro:
      "I’m an algorithm & AI engineer at LYNRED, based in Chambéry, France. I bring together computer vision, deep learning and multimodal perception to better understand images.",
    second: "My background connects doctoral research with applied engineering. Here you’ll find my experience, skills and publications.",
    cv: "Download my CV",
    journey: "My experience.",
    journeyNote: "From research to engineering, with computer vision as the common thread.",
    previous: "Previous experience",
    fullCv: "View my full background",
    current: "Today",
    role: "Algorithm & AI engineer",
    employment: "LYNRED · Permanent role",
    expertise: "What I do.",
    education: "My education.",
    selected: "A look at my research.",
    selectedNote: "Three studies on image fusion and multimodal perception.",
    publication: "Selected publications.",
    allPublications: "All publications",
    beyond: "A little more about me.",
    research: "Explore the research",
    firstAuthor: "First author",
    coauthor: "Coauthor",
    read: "Read paper",
    place: "Chambéry, France",
    portrait: "Yoann Dupas",
    degrees: "Degrees and education",
    tools: "Tools and methods",
    thesis: "Doctoral research · Orange / LIG",
    contact: "Let’s connect.",
  },
};

function art(index) {
  const pieces = [
    '<g fill="none" stroke="currentColor" stroke-width="2"><rect x="105" y="43" width="142" height="152" rx="2"/><rect x="139" y="69" width="142" height="152" rx="2"/><rect x="173" y="95" width="142" height="152" rx="2"/></g>',
    '<g fill="none" stroke="currentColor" stroke-width="2"><path d="M74 69h49v64h49v64h49v-64h49V69h49M98 69h65m-16 64h65m-16 64h55m-5-64h65M123 84h147M172 148h49"/><rect x="53" y="45" width="42" height="48"/><rect x="104" y="109" width="42" height="48"/><rect x="153" y="173" width="87" height="48"/><rect x="249" y="109" width="42" height="48"/><rect x="298" y="45" width="42" height="48"/></g>',
    '<g fill="none" stroke="currentColor" stroke-width="1.6"><path d="M80 68 184 121 80 194M80 68l104 73 104-73M80 194l104-53 104 53M184 121l104 73M184 121V45M184 141v84"/><circle cx="80" cy="68" r="18"/><circle cx="80" cy="194" r="18"/><circle cx="288" cy="68" r="18"/><circle cx="288" cy="194" r="18"/><circle cx="184" cy="131" r="30"/></g>',
  ];
  return `<svg viewBox="0 0 390 280" aria-hidden="true" class="work-illustration">${pieces[index]}</svg>`;
}

export function cvHome(lang, { timeline, contact }) {
  const t = text[lang],
    c = copy[lang];
  const headings = lang === "fr" ? ["Deep learning", "Vision par ordinateur", "Développement"] : ["Deep learning", "Computer vision", "Engineering"];
  return `<section class="cv-welcome" id="about"><p class="welcome-label">${esc(profile.location)}</p><h1>${t.hello}</h1><p class="welcome-intro">${t.intro}</p><p class="welcome-second">${t.second}</p><div class="welcome-actions"><a class="button button-dark" href="/assets/yoann-dupas-cv-${lang}.pdf" download>${t.cv} <span aria-hidden="true">↓</span></a><a class="text-link" href="#experience">${t.journey.replace(".", "")} <span aria-hidden="true">↓</span></a></div></section>
  <section class="resume-section" id="experience"><div class="editorial-heading"><h2>${t.journey}</h2><p>${t.journeyNote}</p></div><div class="profile-grid"><article class="current-role-panel"><p class="panel-label">${t.current}</p><h3>${t.role}</h3><p class="current-employer">${t.employment}</p><p class="current-description">${lang === "fr" ? "Vision par ordinateur, deep learning et perception multimodale." : "Computer vision, deep learning and multimodal perception."}</p><p class="current-location">${t.place}</p></article><figure class="profile-photo"><img src="/assets/portrait.jpg" alt="${c.portrait}" width="524" height="516" fetchpriority="high"><figcaption>${profile.name}</figcaption></figure></div><div class="experience-content"><h3>${t.previous}</h3>${timeline(c.jobs.slice(1))}</div><a class="text-link" href="${base(lang)}cv/">${t.fullCv} <span aria-hidden="true">↗</span></a></section>
  <section class="resume-section" id="skills"><div class="editorial-heading"><h2>${t.expertise}</h2></div><div class="expertise-grid">${skills.map(([, tools], i) => `<article class="expertise-panel expertise-${i}"><span class="expertise-index" aria-hidden="true">0${i + 1}</span><h3>${headings[i]}</h3><p>${tools}</p></article>`).join("")}</div></section>
  <section class="resume-section education-section"><div class="editorial-heading"><h2>${t.education}</h2></div><div class="education-grid">${c.schools.map(([dates, title, institution]) => `<article><p class="panel-label">${dates}</p><h3>${title}</h3><p>${institution}</p></article>`).join("")}</div></section>
  <section class="resume-section home-research" id="research"><div class="editorial-heading"><h2>${t.selected}</h2><p>${t.selectedNote}</p></div><div class="visual-work-grid">${studies.map((study, index) => `<article class="visual-work"><a href="${base(lang)}research/#${study.id}" class="work-cover work-cover-${index}" aria-label="${esc(study.title + " — " + study[lang].subtitle)}">${art(index)}<span class="cover-name">${study.title}</span></a><div class="work-caption"><h3><a href="${base(lang)}research/#${study.id}">${study.title}</a></h3><p>${study[lang].subtitle}</p><span>${study.first ? t.firstAuthor : t.coauthor}</span></div></article>`).join("")}</div><a class="text-link" href="${base(lang)}research/">${t.research} <span aria-hidden="true">↗</span></a></section>
  <section class="resume-section home-publications" id="publications"><div class="editorial-heading"><h2>${t.publication}</h2><a class="text-link" href="${base(lang)}publications/">${t.allPublications} ↗</a></div>${publications
    .filter((p) => p.type !== "thesis")
    .slice(0, 3)
    .map(
      (p) =>
        `<article class="home-paper"><p class="panel-label">${p.year} · ${esc(p.venue)}</p><h3><a href="${base(lang)}publications/#${p.id}">${esc(p.title)}</a></h3><p>${esc(p.authors)}</p></article>`
    )
    .join("")}</section>
  <section class="resume-section beyond-section"><h2>${t.beyond}</h2><p>${c.aboutText}</p><ul class="hobbies">${c.hobbies.map((h) => `<li>${h}</li>`).join("")}</ul></section>${contact(lang)}`;
}
