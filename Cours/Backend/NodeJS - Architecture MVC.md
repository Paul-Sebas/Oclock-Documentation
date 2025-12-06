# Architecture MVC : Model - View - Controller

MVC est un **pattern** (modèle ou « patron de conception ») de programmation objet. Il consiste en la séparation de l’application en trois couches (à titre de rappel une couche consiste de classes, ensemble de classes, ou composants), où chaque couche logicielle assure un rôle distinct : le Model, la View et le Controller.
> Avantage : Une meilleure lisibilité et organisation du code

> **Model :**
> - Gère l'accès aux entités manipulées par l'application
>    - protège l'intégrité des données en implémentant la logique métier
>    - s'occupe du stockage


> **View :**
> - Gère la présentation des données :
>   - Les données sont « récupérées » par le Controller (via le Model) et « passées » à la View, qui est chargée de les présenter.

> **Controller :**
> - Gère l'aspect dynamique de l'application
>   - A partir de l’action demandée (requête utilisateur), il récupère les données (avec le Model) les injecte dans la vue adéquate, et envoie la réponse produite.
>   - (selon l’implémentation, parfois c’est la vue qui renvoie elle-même la réponse)

## Exemple de projet MVC
```
📦 projet-mvc
├── 📂 controllers
│   └── movie.controller.js
│
├── 📂 data
│   └── bddmovies.js
│
├── 📂 public
│   ├── 📂 css
│   └── 📂 img
│
├── 📂 routers
│   └── movie.router.js
│
├── 📂 views
│   ├── 📂 partials
│   ├── home.ejs
│   ├── movie.ejs
│   ├── movies.ejs
│   └── 404.ejs
│
├── index.js
├── package.json
├── README.md
└── .gitignore
```

## Exemple de contenu des fichiers

### 1. Fichier `index.js`
```js
// charger les variables d'environnement (toujours en premier)
import "dotenv/config";
import path from "node:path";
import express from "express";

// importer movie router
import { movieRouter } from "./routers/movie.router.js";

// configure le serveur express
const app = express();
const port = process.env.PORT || 3000;

// définir le répertoire courant
// -> pour pouvoir construire dynamiquement les chemins absolus vers "views" et "public"
// -> path.join permet de construire des chemins compatibles Windows / Linux / MacOS
const __dirname = import.meta.dirname;

// définir les statics
app.use(express.static(path.join(__dirname, "public")));

// définir le moteur de vue
app.set("view engine", "ejs");

// définir le dossier de views
app.set("views", path.join(__dirname, "views"));

// un compteur de requete (de vues)
let viewCounter = 0;

// un middleware qui incrémente le nombre de vue à chaque requete
app.use((req, res, next) => {
  viewCounter ++;
  console.log("nombre de vues : " + viewCounter);

  // exposer la variable viewCounter pour les templates ejs
  res.locals.viewCounter = viewCounter;
  next();
});

// utilisation de movie router
app.use(movieRouter);

// démarrer le serveur
app.listen(port, () => {
  console.log(`🚀 Ghibliotheque démarrée sur http://localhost:${port}`);
});
```

### 2. Fichier `movie.router.js`
```js
import express from "express";
import { 
  directorsList,
  homePage,
  movieDetailPage,
  moviesByDirectorPage,
  moviesPage,
  recentMoviesPage
} from "../controllers/movie.controller.js";
import movies from "../data/movies.js";

// Initialiser le routeur + export pour être utilisé dans index.js
export const movieRouter = express.Router();

// *** LE ROLE DU ROUTEUR EST DE GERER LES ROUTES ***

// on veut faire bénéficier à toutes les routes de la valeur de nombre de film
movieRouter.use((req, res, next) => {
  res.locals.nbMovies = movies.length;

  // la methode next() permet de passe le relai à la prochaine fonction
  next();
});

// route home
movieRouter.get("/", homePage);

// route movies
movieRouter.get("/movies", moviesPage);

// route films récents
movieRouter.get("/movies/recent", recentMoviesPage);

// route détail d'un film 
movieRouter.get("/movies/:id", movieDetailPage);

// route films par réalisateur
movieRouter.get("/director/:directorName", moviesByDirectorPage);

// route pour afficher les réalisateurs
movieRouter.get("/directors", directorsList);
```

### 3. Fichier `movie.controller.js`
```js
import movies from "../data/movies.js";

// *** LE CONTROLLER CONTIENT LA LOGIQUE METIER (les fonctions) ***

export function homePage (req, res) {
// je veux les 3 premiers films de la liste
  const featuredMovies = movies.slice(0, 3);
  
  res.render("home.ejs", { 
    movies: featuredMovies,
    pageTitle: "Bienvenue",
  });
}

export function moviesPage (req, res) {
  res.render("movies.ejs", {
    movies,
    pageTitle: "Tous les films" });
}

export function movieDetailPage (req, res) {
  // récuperer l'id du film demandé
  const id = Number(req.params.id);

  // trouver le film qui correspond à cet id
  const foundMovie = movies.find((movie) => movie.id === id);

  // si on ne trouve pas de film
  if (!foundMovie) {
    // on renvoit une page 404
    res.status(404).render("404.ejs", { message: "Film non trouvé", pageTitle: "Film non trouvé" });

    // on bloque la fonction
    return; 
  }

  // transmettre ce film à la vue
  res.render("movie.ejs", {
    movie: foundMovie,
    pageTitle: foundMovie.title
  });
}

export function recentMoviesPage (req, res) {
  // trier les films par date de sortie décroissante
  // et les stocker dans un nouveau tableau
  const sortedMovies = movies.toSorted((movie1, movie2) => movie2.release_date - movie1.release_date);

  // extraire les 5 premiers
  const recentMovies = sortedMovies.slice(0, 5);

  // construire la vue avec ces données
  res.render("movies.ejs", { movies: recentMovies, pageTitle: "Les films récents" });
}

export function moviesByDirectorPage (req , res) {
  // recuperer le nom du realisateur
  const directorName = req.params.directorName;

  // récuperer les films de ce réalisateur
  const moviesByDirector = movies.filter((movie) => movie.director === directorName);

  // construire la vue avec ces données
  res.render("movies.ejs", { movies: moviesByDirector, pageTitle: `Les ${moviesByDirector.length} films de ${directorName}` });
}

export function directorsList(req, res) {
  // récuperer tous les réalisateurs et leur nombre de film
  // -> { "Hayao Miyazaki" : 10, "Isao Takahata": 4, ...}

  // l'objet vide
  const directors = {};

  // pour chaque films
  for (const movie of movies) {
    // est ce que le réalisateur n'est pas déjà dans mon objet
    if (!directors[movie.director]) {
      // je l'ajoute avec une valeur 
      directors[movie.director] = 0;
    }

    // j'incrémente le nombre de film 
    directors[movie.director] ++;
  }

  // méthode .json permet de fournir une réponse sous la forme d'un objet json
  res.json(directors);
}
```

### 3. Fichier `partial/head.ejs`
```ejs
<!DOCTYPE html>
<html lang="fr" data-theme="light">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>
    <%= pageTitle %> - Ghibliothèque
  </title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
  <link rel="stylesheet" href="/css/style.css">
</head>

<body>
  <header class="container">
    <nav>
      <ul>
        <li>
          <strong>
            <a href="/" class="contrast">
              <img src="/img/ponyo.png" alt="Logo Ghibliothèque" class="logo">
              Ghibliothèque
            </a>
          </strong>
        </li>
      </ul>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/movies">Films (<%= locals.nbMovies %>)</a></li>
        <li><a href="/movies/recent">Films récents</a></li>
      </ul>
    </nav>
  </header>

  <main class="container">
```

### 3. Fichier `partial/head.ejs`
```ejs
<%- include("./partials/head.ejs") %>

    <article>
      <div class="grid">
        <div>
          <hgroup>
            <h1><%= movie.title %></h1>
            <h2><%= movie.original_title %> (<%= movie.release_date %>)</h2>
          </hgroup>
          
          <p><strong>Durée:</strong>
            <%= movie.duration %> min
          </p>
          
          <div>
            <img src="<%= movie.banner_src %>" alt="<%= movie.title %>"
              style="width: 100%; height: auto; border-radius: 5px;">
          </div>
          
          <h3>Synopsis</h3>
          <p><%= movie.description %></p>

          <a href="/movies" role="button" class="secondary">Retour à la liste des films</a>
        </div>
      </div>
    </article>

  <%- include("./partials/foot.ejs") %>

```