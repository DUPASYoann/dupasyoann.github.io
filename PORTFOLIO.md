# Yoann Dupas — portfolio

La nouvelle version est un site statique bilingue (anglais à la racine, français sous `/fr/`). Elle utilise HTML, CSS et JavaScript natifs, avec un petit générateur Node.js. Aucun framework, CDN, cookie de suivi, service tiers ou dépendance d’exécution n’est nécessaire. Les fichiers de l’ancien thème Jekyll sont conservés comme référence, mais ne sont pas publiés par le nouveau workflow.

## Développer

Node.js 22 ou supérieur est recommandé.

```sh
npm run dev
```

Ouvrir `http://127.0.0.1:8080/fr/`. Le serveur reconstruit le site au démarrage ; après une modification, le relancer. Le port est configurable via `PORT`.

```sh
npm run build
npm test
```

La sortie est dans `dist/` (ignorée par Git). La construction et les tests de contenu n’ont besoin d’aucune installation npm. Pour les outils de développement : `npm ci`, puis `npm run format`.

Pour les tests navigateur et d’accessibilité, laisser tourner la prévisualisation et lancer `npm run test:browser`. Le script utilise Edge sous Windows et Chromium ailleurs. Sur Linux/macOS : installer préalablement le navigateur via `npx playwright install --with-deps chromium`. `BROWSER_CHANNEL` et `PREVIEW_URL` permettent de choisir le navigateur et le serveur. Les captures, le rapport JSON et le CV PDF de contrôle sont enregistrés dans `test-results/` (ignoré par Git).

## Modifier le contenu

- `site/content.mjs` : profil, liens, publications, expériences et textes anglais/français. C’est la source de vérité du nouveau site.
- `site/style.css` : design, responsive, thèmes clair/sombre et impression du CV.
- `site/app.js` : navigation mobile, préférence de thème, recherche et filtres, citations et copie d’e-mail.
- `scripts/build.mjs` : pages HTML, métadonnées, données structurées, sitemap, bibliographie et redirections.
- `assets/img/photo_de_profil.jpg` : portrait original.
- `site/social-card.png` : aperçu pour le partage sur les réseaux.

Les cinq références bibliographiques du dépôt original sont conservées. Pour ajouter une référence, renseigner les informations vérifiées dans `publications` ; le générateur met à jour les deux langues et le fichier BibTeX. Les champs DOI, résumé, PDF et nombre de citations ne sont pas inventés. Les dates d’expériences ont été conservées, y compris le chevauchement WiseBIM 2021–2022 : à confirmer avant publication si nécessaire.

Le CV est une vraie page HTML imprimable : utiliser « Imprimer / enregistrer en PDF ». Aucun lien vers le PDF de démonstration de l’ancien thème n’est affiché.

## GitHub Pages

`.github/workflows/deploy.yml` construit et teste le site, puis publie uniquement `dist/` sur `gh-pages`, comme le workflow original. Les pull requests construisent un artefact de prévisualisation sans déployer. Conserver la configuration GitHub Pages existante (branche `gh-pages`, dossier racine). Le jeton GitHub Actions doit disposer du droit d’écriture sur le contenu.

Un push vers `main` ou `master` déclenche le déploiement. La refonte locale n’altère pas le site en ligne avant ce push. Les anciens workflows manuels du thème restent présents ; ils concernent Jekyll et ne valident pas cette nouvelle version. Utiliser le nouveau workflow et `npm test` pour cette dernière.

Les anciennes URLs `/publications/` et `/cv/` sont conservées. `/projects/` redirige vers la recherche, `/repositories/` vers GitHub. Les pages et projets de démonstration ne sont pas exportés.

## Vérification

Les tests Node vérifient les liens et fragments internes de toutes les pages, les traductions, l’unicité des identifiants, les métadonnées, la conservation des références, le sitemap et les pages 404. Vérifier également dans un navigateur le menu mobile, le thème, les filtres combinés, les citations au clavier, le changement de langue et l’impression.

Le site fonctionne sans JavaScript pour le contenu, les liens, les langues et les publications. Le menu mobile est affiché lorsque JavaScript est désactivé. JavaScript enrichit la recherche, les citations, l’impression via bouton et la sélection manuelle du thème ; l’impression du navigateur reste utilisable sans JavaScript.
