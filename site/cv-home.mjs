import { copy, profile, publications, skills } from "./content.mjs";
import { studies } from "./research.mjs";

const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const base = (lang) => (lang === "fr" ? "/fr/" : "/");

const text = {
  fr: {
    hello: "Bonjour, moi c’est Yoann.",
    intro:
      "Je suis ingénieur algorithme & IA chez LYNRED, à Grenoble. J’associe vision par ordinateur, deep learning et perception multimodale pour mieux comprendre les images.",
    second:
      "Mon parcours relie recherche doctorale et ingénierie appliquée. Vous trouverez ici mes expériences, mes compétences et mes publications.",
    cv: "Télécharger mon CV",
    journey: "Mon parcours.",
    previous: "Expériences précédentes",
    fullCv: "Voir le parcours complet",
    current: "Aujourd’hui",
    role: "Ingénieur algorithme & IA",
    employment: "LYNRED · CDI",
    expertise: "Ce que je fais.",
    education: "Ma formation.",
    selected: "Un aperçu de mes recherches.",
    selectedNote: "Deux articles et une thèse sur la fusion des images et la perception multimodale.",
    allPublications: "Toutes les publications",
    beyond: "Un peu plus sur moi.",
    firstAuthor: "Premier auteur",
    coauthor: "Coauteur",
    read: "Lire l’article",
    conference: "Article de conférence",
    doctorate: "Thèse de doctorat",
    details: "Notice et citation",
    thesisRecord: "Consulter la thèse",
    place: "Grenoble, France",
    portrait: "Yoann Dupas",
    degrees: "Diplômes et formation",
    tools: "Outils et méthodes",
    thesis: "Recherche doctorale · Orange / LIG",
    contact: "Échangeons.",
  },
  en: {
    hello: "Hello, I’m Yoann.",
    intro:
      "I’m an algorithm & AI engineer at LYNRED, based in Grenoble, France. I bring together computer vision, deep learning and multimodal perception to better understand images.",
    second: "My background connects doctoral research with applied engineering. Here you’ll find my experience, skills and publications.",
    cv: "Download my CV",
    journey: "My experience.",
    previous: "Previous experience",
    fullCv: "View my full background",
    current: "Today",
    role: "Algorithm & AI engineer",
    employment: "LYNRED · Permanent role",
    expertise: "What I do.",
    education: "My education.",
    selected: "A look at my research.",
    selectedNote: "Two papers and a thesis on image fusion and multimodal perception.",
    allPublications: "All publications",
    beyond: "A little more about me.",
    firstAuthor: "First author",
    coauthor: "Coauthor",
    read: "Read paper",
    conference: "Conference paper",
    doctorate: "Doctoral thesis",
    details: "Record and citation",
    thesisRecord: "View thesis",
    place: "Grenoble, France",
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
    '<g fill="none" stroke="currentColor" stroke-width="2"><rect x="118" y="40" width="154" height="200" rx="3"/><path d="M138 40v200M158 78h88M158 92h64M158 205h88"/><rect x="166" y="119" width="42" height="45"/><rect x="188" y="137" width="42" height="45"/></g>',
  ];
  return `<svg viewBox="0 0 390 280" aria-hidden="true" class="work-illustration">${pieces[index]}</svg>`;
}

export function cvHome(lang, { timeline, contact }) {
  const t = text[lang],
    c = copy[lang];
  const headings = lang === "fr" ? ["Deep learning", "Vision par ordinateur", "Développement"] : ["Deep learning", "Computer vision", "Engineering"];
  const publicationDetails = (paper) => ({
    fullTitle: paper.title,
    summary: paper.summary[lang],
    authors: paper.authors,
    year: paper.year,
    venue: paper.venue,
    type: paper.type === "thesis" ? t.doctorate : t.conference,
    href: `${base(lang)}publications/#${paper.id}`,
    source: paper.pdf || paper.url,
    sourceLabel: paper.type === "thesis" ? t.thesisRecord : t.read,
  });
  const featuredWorks = [
    ...studies
      .filter((study) => study.id !== "fmcaf")
      .map((study) => ({
        ...publicationDetails(publications.find((paper) => paper.id === study.paper)),
        title: study.title,
        label: study.first ? t.firstAuthor : t.coauthor,
      })),
    {
      ...publicationDetails(publications.find((paper) => paper.type === "thesis")),
      title: lang === "fr" ? "Ma thèse" : "My thesis",
      fullTitle:
        lang === "fr"
          ? publications.find((publication) => publication.type === "thesis").title
          : "Advanced early fusion approaches for multimodal images in pedestrian and vehicle detection",
      label: t.thesis,
    },
  ];
  return `<section class="cv-welcome" id="about"><p class="welcome-label">${esc(profile.location)}</p><h1>${t.hello}</h1><p class="welcome-intro">${t.intro}</p><p class="welcome-second">${t.second}</p><div class="welcome-actions"><a class="button button-dark" href="/assets/yoann-dupas-cv-${lang}.pdf" download>${t.cv} <span aria-hidden="true">↓</span></a><a class="text-link" href="#experience">${t.journey.replace(".", "")} <span aria-hidden="true">↓</span></a></div></section>
  <section class="resume-section" id="experience"><div class="editorial-heading"><h2>${t.journey}</h2></div><div class="profile-grid"><article class="current-role-panel"><p class="panel-label">${t.current}</p><h3>${t.role}</h3><p class="current-employer">${t.employment}</p><p class="current-description">${lang === "fr" ? "Vision par ordinateur, deep learning et perception multimodale." : "Computer vision, deep learning and multimodal perception."}</p><p class="current-location">${t.place}</p></article><figure class="profile-photo"><img src="/assets/portrait.jpg" alt="${c.portrait}" width="524" height="516" fetchpriority="high"><figcaption>${profile.name}</figcaption></figure></div><div class="experience-content"><h3>${t.previous}</h3>${timeline(c.jobs.slice(1), { logos: true })}</div><a class="text-link" href="${base(lang)}cv/">${t.fullCv} <span aria-hidden="true">↗</span></a></section>
  <section class="resume-section" id="skills"><div class="editorial-heading"><h2>${t.expertise}</h2></div><div class="expertise-grid">${skills.map(([, tools], i) => `<article class="expertise-panel expertise-${i}"><span class="expertise-index" aria-hidden="true">0${i + 1}</span><h3>${headings[i]}</h3><p>${tools}</p></article>`).join("")}</div></section>
  <section class="resume-section education-section"><div class="editorial-heading"><h2>${t.education}</h2></div><div class="education-grid">${c.schools.map(([dates, title, institution]) => `<article><p class="panel-label">${dates}</p><h3>${title}</h3><p>${institution}</p></article>`).join("")}</div></section>
  <section class="resume-section home-research" id="research"><div class="editorial-heading"><h2>${t.selected}</h2><p>${t.selectedNote}</p></div><div class="research-preview-list">${featuredWorks.map((work, index) => `<article class="research-preview"><a href="${esc(work.href)}" class="work-cover work-cover-${index}" aria-label="${esc(work.fullTitle)}">${art(index)}<span class="cover-name">${esc(work.title)}</span></a><div class="research-preview-content"><ul class="research-preview-meta" aria-label="${lang === "fr" ? "Informations de publication" : "Publication information"}"><li>${work.type}</li><li>${work.year}</li><li>${esc(work.venue)}</li></ul><h3><a href="${esc(work.href)}">${esc(work.fullTitle)}</a></h3><p class="research-preview-authors">${esc(work.authors)}</p><p class="research-preview-summary">${esc(work.summary)}</p><p class="research-preview-role">${work.label}</p><div class="research-preview-links"><a class="text-link" href="${esc(work.href)}">${t.details} <span aria-hidden="true">↗</span></a><a class="text-link" href="${esc(work.source)}">${work.sourceLabel} <span aria-hidden="true">↗</span></a></div></div></article>`).join("")}</div><a class="text-link" href="${base(lang)}publications/">${t.allPublications} <span aria-hidden="true">↗</span></a></section>
  <section class="resume-section beyond-section"><h2>${t.beyond}</h2><p>${c.aboutText}</p><ul class="hobbies">${c.hobbies.map((h) => `<li>${h}</li>`).join("")}</ul></section>${contact(lang)}`;
}
