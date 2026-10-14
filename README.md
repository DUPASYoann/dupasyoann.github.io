# Yoann Dupas — Computer Vision & Deep Learning

Portfolio personnel bilingue français / anglais : recherche, publications, parcours et contact.

Une refonte statique légère, sans framework ni dépendance d’exécution, compatible avec GitHub Pages. Le contenu est généré en HTML, lisible sans JavaScript. Recherche de publications, filtres, citations BibTeX, thème clair/sombre et CV imprimable enrichissent la navigation.

## Prévisualisation locale

Avec Node.js 22 ou supérieur :

```sh
npm run dev
```

Ouvrir `http://127.0.0.1:8080/fr/` pour le français ou `http://127.0.0.1:8080/` pour l’anglais.

## Construire et tester

```sh
npm run build
npm test
```

Ces commandes ne nécessitent pas d’installation de dépendances. La sortie est générée dans `dist/`.

Pour le formatage et les tests navigateur : `npm ci`. Voir [PORTFOLIO.md](PORTFOLIO.md) pour le développement, les tests d’accessibilité, les sources de contenu et le déploiement GitHub Pages.

Les anciens fichiers al-folio/Jekyll sont conservés comme référence, avec leur documentation dans [LEGACY-README.md](LEGACY-README.md). Ils ne sont plus exportés par le workflow de déploiement.
