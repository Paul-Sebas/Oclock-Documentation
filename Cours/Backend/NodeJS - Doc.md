# Documentation importante pour NodeJS

## Initialiser un projet Node.js avec module ESM (EcmaScriptModule)

```Bash
npm init -y && npm pkg set type="module"
```

## Installation des modules express, ejs
```Bash
npm i express ejs
```
## Installation de nodemon en tant que module de développement
```
npm i -D nodemon
```

## Vérifier que dans le fichier package.json il y a `"dev": "nodemon FichierPrincipal.js"`
```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon index.js"
  }
```

## Autre solution à nodemon : Utilisation de --watch pour recharger le serveur après un modification de fichier
Dans le fichier `package.json`
```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "node --watch index.js"
  }
```

## Paramétrage du FichierPrincipale.js (Généralement index.js ou app.js)
```Javascript
// Import des modules nécessaires
import express from "express";
import path from "node:path"; // sert à manipuler des chemins
import { fileURLToPath } from "node:url"; // sert à transformer une url de fichier en chemin

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration d'express
const app = express();
const port = 3000;

// Configuration des fichiers statiques dans express
app.use(express.static("./public"));

// Configuration d'ejs
app.set("view engine", "ejs");
app.set("views", "./views");

// *** ICI LES ROUTES A PARAMETRER ***

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```
## Création des répertoires
- `views` : Répertoire des templates ejs
- `public` : Répertoire pour les fichiers statiques (css et images)

***👉 IMPORTANT***
> Pour rendre un fichier ejs, il faut utiliser la fonction render de l'objet res
>
> Cette fonction prend en paramètre une chaine de caractères qui est le **chemin relatif** depuis le répertoire views. 
>
> Si le template est à la racine et se nomme "nom_template.ejs" ça donne : res.render('mon_template');

Si l'arborescense de projet resemble à ça :
```
- public
    - css
        - style.css
    - img
        - img.jpg
         ....
- views
    ...
```
Le lien pour accéder aux ressoures publiques commence par / puis on a un accès directe aux sous répertoires de `public` :
```
/css/...
/img/...
```

## Déplacement du code répété dans des fichiers partials
- Créer le répertoire `partials` dans le dossier `views`
  - Fichier header.ejs => contient le code du header
  - Fichier footer.ejs => contient le code du footer

Pour inclure les fichiers dans le document principal, par exemple home.ejs 
```
<%- include("partials/header") %>
	...
	... 
	...
<%- include("partials/footer") %>
```

## Les routes avec express
- 1er type de route => http://localhost:3000/
````
app.get("/", (req, res) => {
	console.log("Ceci est une route par défaut")
});
````

- 2eme type de route => http://localhost:3000/chiens/
````
app.get("/chiens", (req, res) => {
	console.log("Ceci est un autre type de route")
});
````

- Route paramétrée => http://localhost:3000/chiens/toby
````
app.get("/chiens/:nomduparametre", (req, res) => {
	console.log("Ceci est une route paramétrée")
});
````