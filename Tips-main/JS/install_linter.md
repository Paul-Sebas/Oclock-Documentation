# 🧩 Mise en place d'ESLint

Eslint est un linter JavaScript très populaire qui permet de détecter les erreurs de code et d'imposer un style cohérent dans un projet. Il est principalement utilisé pour harmoniser le code au sein d'une équipe et pour apprendre les bonnes pratiques.

## 1️⃣ Initialisation avec la commande officielle

Dans un projet déjà initialisé avec npm `npm init -y && npm pkg set type="module"`, on installe ESLint via la commande fournie dans la documentation :

    npm init @eslint/config@latest

ESLint va poser une série de questions.  
L'objectif est d'ajuster la configuration en fonction de ce que tu veux en faire.

### Important : sélection Node / Browser

À la question :

    Where does your code run?

Tu dois :

- utiliser la **barre espace** pour sélectionner/désélectionner :
  - `Browser`
  - `Node`
- puis valider avec **Entrée**.

Tu peux cocher l'un, l'autre, ou les deux selon ton contexte (front, back, fullstack…).

---

## 2️⃣ Base : règles recommandées et documentation

La configuration générée s'appuie sur des règles recommandées par ESLint et ses plugins.

Les principales règles sont listées dans la doc d'Eslint :

👉 https://eslint.org/docs/latest/rules

En pratique :

- on part des règles **recommandées** ;
- puis on **adapte** ce qu'on veut réellement imposer dans notre linter (points-virgules, type de guillemets, indentation…).

---

## 3️⃣ Exemple de configuration vue en cours (`eslint.config.js`)

Voici le fichier que nous avons utilisé ensemble en classe.  
On va s'appuyer dessus pour détailler chaque partie :

    import js from "@eslint/js";
    import globals from "globals";

    export default [
      js.configs.recommended,
      {
        languageOptions: {
          globals: { ...globals.browser, ...globals.node },
        },
        rules: {
          "semi": "error",
          "indent": ["error", 2],
          "quotes": ["error", "double"]
        }
      }
    ];

---

## 4️⃣ Décomposition de la configuration

### Imports

    import js from "@eslint/js";
    import globals from "globals";

- `@eslint/js` fournit les configurations officielles pour JavaScript, notamment :
  - `js.configs.recommended` → un socle de règles "bonnes pratiques".
- `globals` permet de récupérer facilement des ensembles de variables globales prédéfinies :
  - `globals.browser` → `window`, `document`, etc.
  - `globals.node` → `process`, `__dirname`, etc.

### Structure générale : export par défaut

    export default [
      js.configs.recommended,
      { ... }
    ];

ESLint v9 utilise un **config array** (un tableau de config ⚙️) :

- chaque élément du tableau est un bloc de configuration ;
- ils sont appliqués les uns après les autres (héritage / surcharge).

Ici on a :

1. `js.configs.recommended` → règles recommandées par ESLint (base solide) ;
2. un objet de config personnalisé qui vient compléter/adapter ces règles.

### Définir l'environnement d'exécution

    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },

On dit à ESLint :

- "Considère que je suis dans un environnement _browser_ ET/OU _Node_ ;
- ne signale pas ces globals comme `no-undef`."

En pratique, ça évite des erreurs du type :

- `document is not defined` (alors qu'on sait qu'on est côté browser) ;
- `process is not defined` (alors qu'on est côté Node).

Tu peux ajuster selon le projet :

- front pur : `globals.browser`
- back pur : `globals.node`
- tests : `globals.jest`, etc.

### Personnalisation du style et des contraintes

    rules: {
      "semi": "error",
      "indent": ["error", 2],
      "quotes": ["error", "double"]
    }

- `"semi": "error"`  
  → impose la présence des **points-virgules** ;  
  → absence ou mauvaise utilisation = **erreur**.

- `"indent": ["error", 2]`  
  → impose une **indentation de 2 espaces** ;  
  → toute indentation différente est signalée comme erreur.

- `"quotes": ["error", "double"]`  
  → impose les **guillemets doubles** (`"texte"`) pour les chaînes de caractères.

Tu peux bien sûr adapter :

- guillemets simples :

      "quotes": ["error", "single"]

- pas de point-virgule :

      "semi": ["error", "never"] // interdit les points-virgules

- console autorisé / avertissement / interdit :

      "no-console": "off" // autorisé
      "no-console": "warn" // avertissement
      "no-console": "error" // interdit

---

## 5️⃣ Ajuster la configuration à tes besoins

### Niveaux de sévérité

Pour chaque règle, trois niveaux possibles :

- `"off"` → règle désactivée ;
- `"warn"` → avertissement (non bloquant, utile en apprentissage) ;
- `"error"` → erreur (peut faire échouer un build / une CI).

Exemples :

- avertir plutôt que bloquer :

      "eqeqeq": ["warn", "always"] // avertit si on n'utilise pas === (on l'a déjà dit == c'est mal 🙈)

- désactiver temporairement une règle jugée "trop pénible" :

      "no-console": "off" // on autorise les console.log pendant le dev

---

## 6️⃣ Scripts npm : lancer ESLint et corriger automatiquement

Dans ton `package.json`, ajoute un script `lint` :

    {
      "scripts": {
        "lint": "eslint ."
      }
    }

### Lancer une analyse :

    npm run lint

→ analyse tous les fichiers (par défaut) à partir du dossier courant.

### Tenter une correction automatique :

    npm run lint -- --fix

→ corrige automatiquement :

- indentation ;
- points-virgules ;
- type de guillemets ;
- et d'autres règles "fixables".

Les règles non "fixables" (par exemple `no-unused-vars`, `no-undef`) doivent être corrigées manuellement en modifiant le code.

---

## 7️⃣ Ignorer certains fichiers / dossiers

Pour ne pas analyser certains répertoires (build, dist, etc.), crée un fichier `.eslintignore` à la racine du projet :

    node_modules
    dist
    build
    coverage
    public

ESLint ignorera ces chemins lors du `npm run lint`.

---

## 8️⃣ Résumé

1.  **Initialiser ESLint avec la commande officielle**

        npm init @eslint/config@latest

    - bien lire les questions ;
    - utiliser **Espace** pour sélectionner Browser / Node.

2.  **Comprendre la configuration générée**

    - `js.configs.recommended` ➜ socle de règles recommandées ;
    - `globals.browser` / `globals.node` ➜ environnement d'exécution ;
    - `rules` ➜ ce que l'on choisit réellement d'imposer (style + bonnes pratiques).

3.  **Adapter les règles**

    - semicolon : `"semi"`
    - guillemets : `"quotes"`
    - indentation : `"indent"`
    - logs : `"no-console"`
    - sévérité : `"off"`, `"warn"`, `"error"`.

4.  **Utiliser ESLint au quotidien**

    - lancer une analyse :

          npm run lint

    - corriger automatiquement :

          npm run lint -- --fix

5.  **But pédagogique**

ESLint n'est pas là pour "casser les pieds", mais pour :

- détecter les erreurs avant l'exécution ;
- harmoniser le style dans l'équipe de développement (et par extension éviter les commits avec beaucoup de changements inutiles qui ne sont que de l'indentation ou des guillemets différents) ;
- apprendre les bonnes pratiques JavaScript et un code plus propre.

Idéalement :  
installer aussi l'extension ESLint dans l'éditeur (VS Code, WebStorm…) pour avoir des retours en temps réel.

- VS Code : https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
- WebStorm : https://www.jetbrains.com/help/webstorm/eslint.html
