# Module DOTENV
Dotenv est un module sans dépendance qui charge les variables d'environnement d'un fichier `.env` dans `process.env`.

Le stockage de la configuration dans l'environnement distinct du code est basé sur la méthodologie `The Twelve-Factor App`.
> La méthodologie **Twelve-Factor App** est une méthodologie permettant de créer des applications logicielles en tant que service. Ces bonnes pratiques sont conçues pour permettre la création d'applications avec portabilité et résilience lorsqu'elles sont déployées sur le Web.

## Installation
```
npm i dotenv
```

## Utilisation
À la racine de votre projet, créez un fichier nommé .env et ajoutez-y vos variables de configuration sous la forme `CLE=VALEUR` :

```bash
# .env file

PORT=3000
DATABASE_URL="mongodb://localhost:27017/ma_base"
API_KEY=votre_cle_secrete_12345
```

## Chargement de `dotenv`
```js
// index.js (ou votre fichier principal)
import 'dotenv/config'; // Charge immédiatement les variables du .env

import express from 'express'; // Le reste de vos imports
// ...

const PORT = process.env.PORT; // Les variables sont maintenant accessibles
const API_KEY = process.env.API_KEY;

const app = express();

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Clé API: ${API_KEY}`);
});
```