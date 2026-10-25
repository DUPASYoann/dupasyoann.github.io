import { copy, profile, publications } from "./content.mjs";

export const siteOrigin = "https://dupasyoann.github.io";
export const isIndexable = (page) => page !== "404" && page !== "research";

export function pageMetadata(lang, page) {
  const fr = lang === "fr";
  const metadata = {
    "": {
      title: `Yoann Dupas — ${copy[lang].role}`,
      description: fr
        ? "Yoann Dupas, ingénieur algorithme et IA chez LYNRED à Grenoble. Découvrez mon parcours en vision par ordinateur, fusion multimodale et deep learning."
        : "Yoann Dupas, algorithm and AI engineer at LYNRED in Grenoble, France. Explore my background in computer vision, multimodal fusion and deep learning.",
    },
    cv: {
      title: fr ? "Parcours et CV — Yoann Dupas, ingénieur IA" : "Experience and CV — Yoann Dupas, AI engineer",
      description: fr
        ? "Parcours de Yoann Dupas : ingénieur IA chez LYNRED, recherche doctorale Orange et LIG, expériences WiseBIM et I3S, formation et CV à télécharger."
        : "Yoann Dupas’s experience: AI engineering at LYNRED, doctoral research with Orange and LIG, WiseBIM and I3S, education and a downloadable CV.",
    },
    publications: {
      title: fr ? "Publications scientifiques — Yoann Dupas" : "Research publications — Yoann Dupas",
      description: fr
        ? "Articles et thèse de Yoann Dupas sur la fusion multimodale et la détection d’objets : MEFA, MEFA-MS, résumés, textes intégraux et citations BibTeX."
        : "Yoann Dupas’s papers and thesis on multimodal fusion and object detection: MEFA, MEFA-MS, research summaries, full texts and BibTeX citations.",
      heading: fr ? "Mes publications scientifiques." : "My research publications.",
    },
    research: {
      title: fr ? "Travaux de recherche — Yoann Dupas" : "Research projects — Yoann Dupas",
      description: fr
        ? "Études de cas sur MEFA, MEFA-MS et FMCAF : architectures de fusion multimodale, attention et détection de piétons et de véhicules."
        : "Case studies on MEFA, MEFA-MS and FMCAF: multimodal fusion architectures, attention, and pedestrian and vehicle detection.",
    },
    404: {
      title: "404 — Yoann Dupas",
      description: fr
        ? "Page introuvable. Retrouvez le parcours et les publications de Yoann Dupas."
        : "Page not found. Explore Yoann Dupas’s experience and research publications.",
    },
  };
  return metadata[page];
}

export function pageSchema(lang, page) {
  const metadata = pageMetadata(lang, page);
  const pageUrl = `${siteOrigin}${lang === "fr" ? "/fr/" : "/"}${page ? `${page}/` : ""}`;
  const personId = `${siteOrigin}/#person`;
  const person = {
    "@type": "Person",
    "@id": personId,
    name: profile.name,
    url: `${siteOrigin}/`,
    image: `${siteOrigin}/assets/portrait.jpg`,
    jobTitle: copy[lang].role,
    worksFor: { "@type": "Organization", name: "LYNRED", url: "https://www.lynred.com/" },
    sameAs: [profile.github, profile.linkedin, profile.scholar, profile.hal],
    knowsAbout: ["Computer vision", "Deep learning", "Multimodal fusion"],
    alumniOf: [{ "@type": "CollegeOrUniversity", name: "Polytech Tours" }],
  };
  const webPage = {
    "@type": page === "" || page === "cv" ? "ProfilePage" : page === "publications" ? "CollectionPage" : "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: metadata.title,
    description: metadata.description,
    inLanguage: lang,
    isPartOf: { "@id": `${siteOrigin}/#website` },
    about: { "@id": personId },
    ...(page === "" || page === "cv" ? { mainEntity: { "@id": personId } } : {}),
  };
  if (page === "publications") {
    webPage.mainEntity = {
      "@type": "ItemList",
      itemListElement: publications.map((paper, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": paper.type === "thesis" ? "Thesis" : "ScholarlyArticle",
          "@id": `${pageUrl}#${paper.id}`,
          url: `${pageUrl}#${paper.id}`,
          name: paper.title,
          datePublished: String(paper.year),
          description: paper.summary[lang],
          author: paper.authors.split(", ").map((name) => (name === profile.name ? { "@id": personId } : { "@type": "Person", name })),
          ...(paper.doi ? { identifier: `https://doi.org/${paper.doi}` } : {}),
          ...(paper.url ? { sameAs: paper.url } : {}),
        },
      })),
    };
  }
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${siteOrigin}/#website`, url: `${siteOrigin}/`, name: profile.name, inLanguage: ["fr", "en"] },
      person,
      webPage,
    ],
  };
}
