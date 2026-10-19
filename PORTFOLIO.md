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
- `site/cv-home.mjs` : accueil bilingue centré sur le CV, présentation personnelle, expérience actuelle, parcours, compétences et aperçus de recherche.
- `site/editorial.css` : direction graphique à l’écran (fond blanc, signature bleue, typographies arrondies et blocs pastel). La référence visuelle est [le site de Kira Olson](https://www.kiraolson.com/) ; les contenus, la signature textuelle et les illustrations sont propres à ce portfolio.
- `site/fonts.css` et `site/fonts/` : Poppins, Urbanist et Kalam, hébergées localement avec leurs licences SIL Open Font License. Aucun appel à Google Fonts n’est effectué par les visiteurs.
- `site/research.mjs` : résumés éditoriaux, DOI et liens vérifiés, études de cas et textes de la démonstration.
- `site/research-components.mjs` : schémas SVG originaux et composants de la page recherche.
- `site/style.css` : fondations des composants et mise en page d’impression du CV. Les feuilles `editorial.css` et `fonts.css` sont limitées au média écran ; la refonte visuelle ne modifie pas les CV PDF existants.
- `site/app.js` : navigation mobile, préférence de thème, recherche et filtres, citations et copie d’e-mail.
- `scripts/build.mjs` : pages HTML, métadonnées, données structurées, sitemap, bibliographie et redirections.
- `assets/img/photo_de_profil.jpg` : portrait original.
- `site/social-card.png` : aperçu pour le partage sur les réseaux.

Les cinq références bibliographiques du dépôt original sont conservées. Les métadonnées complémentaires et résumés sont dans `site/research.mjs`. Le générateur met à jour les deux langues et le fichier BibTeX, y compris les DOI. Les dates ont été corrigées avec les indications du propriétaire : stage de fin d’études WiseBIM de mars à août 2021, poste actuel d’ingénieur algorithme & IA en CDI chez LYNRED. Aucune date de début chez LYNRED n’est inventée : le parcours indique simplement « Aujourd’hui » / « Present ».

Le CV est une page HTML imprimable et dispose de téléchargements PDF français et anglais, stockés dans `site/downloads/`. Pour régénérer les deux fichiers après une modification : `npm run cv:pdf` (après `npm ci` et installation du navigateur si nécessaire). Cette commande utilise le contenu et les styles du site, lance son propre serveur éphémère puis l’arrête. Un manifeste de hachage permet au build de refuser les PDF dont le contenu n’est plus à jour. Après une modification de la mise en page d’impression, régénérer aussi les PDF et les contrôler visuellement.

## Recherche et sources

Les études de cas sont disponibles sous `/research/` et `/fr/research/`. La démonstration est un SVG pédagogique original : aucun modèle n’est exécuté, les annotations sont dessinées et aucun score de détection n’est simulé. La superposition RGB / IR ne prétend pas reproduire MEFA. Elle fonctionne au clavier et propose quatre modalités, trois conditions de visibilité, un réglage de mélange et des annotations facultatives.

L’étude MEFA inclut aussi la figure 5 publiée dans l’article original (p. 616), avec ses images et légendes conservées. Il s’agit des résultats qualitatifs du papier, distincts du schéma interactif. La figure est attribuée aux auteurs, liée à sa source et accompagnée de la licence CC BY-NC-ND 4.0. Elle est chargée à la demande et s’ouvre en grand pour lire les annotations.

Sources primaires vérifiées le 14 octobre 2026 :

- MEFA : [article SCITEPRESS](https://www.scitepress.org/Papers/2025/132360/132360.pdf), [HAL](https://hal.science/hal-05010469), DOI `10.5220/0013236000003912`.
- MEFA-MS : [notice et résumé HAL](https://hal.science/hal-05368360), [métadonnées HAL](https://api.archives-ouvertes.fr/search/?q=halId_s:hal-05368360&fl=title_s,abstract_s,fileMain_s&wt=json). Le temps d’inférence réduit de 50 % est rapporté par les auteurs pour DENSE + RT-DETR face à MEFA. Le DOI est également répertorié dans la [bibliographie de Christophe Cérin](https://lipn.univ-paris13.fr/~cerin/cerin.pdf).
- FMCAF : [article CVF](https://openaccess.thecvf.com/content/ICCV2025W/MIRA/papers/Berjawi_Towards_a_Generalizable_Fusion_Architecture_for_Multimodal_Object_Detection_ICCVW_2025_paper.pdf), [arXiv](https://arxiv.org/abs/2510.17078). La conférence est précisée comme ICCV Workshops / MIRA.
- Empreinte énergétique : [notice de l’éditeur RNTI](https://editions-rnti.fr/?inprocid=1002941).

Les résumés sont des reformulations bilingues, pas des copies d’abstracts. Les rôles « premier auteur » et « coauteur » reflètent l’ordre des auteurs ; ils n’inventent pas de répartition individuelle du travail. Aucun dépôt de code propre à ces articles n’a été confirmé : aucun lien de code n’est ajouté.

## GitHub Pages

`.github/workflows/deploy.yml` construit et teste le site, puis publie uniquement `dist/` sur `gh-pages`, comme le workflow original. Les pull requests construisent un artefact de prévisualisation sans déployer. Conserver la configuration GitHub Pages existante (branche `gh-pages`, dossier racine). Le jeton GitHub Actions doit disposer du droit d’écriture sur le contenu.

Un push vers `main` ou `master` déclenche le déploiement. La refonte locale n’altère pas le site en ligne avant ce push. Les anciens workflows manuels du thème restent présents ; ils concernent Jekyll et ne valident pas cette nouvelle version. Utiliser le nouveau workflow et `npm test` pour cette dernière.

Les anciennes URLs `/publications/` et `/cv/` sont conservées. `/projects/` redirige vers la recherche, `/repositories/` vers GitHub. Les pages et projets de démonstration ne sont pas exportés.

## Vérification

Les tests Node vérifient les liens et fragments internes de toutes les pages, les traductions, l’unicité des identifiants, les métadonnées, la conservation des références, le sitemap et les pages 404. Vérifier également dans un navigateur le menu mobile, le thème, les filtres combinés, les citations au clavier, le changement de langue et l’impression.

Le site fonctionne sans JavaScript pour le contenu, les liens, les langues et les publications. Le menu mobile est affiché lorsque JavaScript est désactivé. JavaScript enrichit la recherche, les citations, l’impression via bouton et la sélection manuelle du thème ; l’impression du navigateur reste utilisable sans JavaScript.
