# 3. Implémentation Côté Express

[Le contenu complet de la section 3 depuis l'analyse précédente, incluant toutes les sous-sections 3.1 à 3.7 avec code commenté et explications]

## 3.1 Installation des dépendances

```bash
# i18next core (framework de base)
npm install i18next

# Middleware Express (intégration requêtes HTTP)
npm install i18next-http-middleware

# Backend filesystem (lecture fichiers JSON sur serveur Node.js)
npm install i18next-fs-backend
```

### Justification des choix

**i18next** : Bibliothèque core, indépendante du framework. Fournit les mécanismes fondamentaux de résolution, interpolation, pluralisation.

**i18next-http-middleware** : Package officiel d'intégration Express comprenant :

- Détection automatique de langue (query, cookie, header)
- Injection `req.t()`, `req.i18n`, `req.language`
- Gestion multi-requêtes concurrentes (chaque requête a sa propre langue)

**i18next-fs-backend** : Backend pour environnements Node.js/Deno. Lit fichiers JSON depuis le filesystem local. Optimisé pour SSR et serverless (AWS Lambda, Google Cloud Functions).

### Alternatives possibles

```bash
# Si traductions servies par API externe
npm install i18next-http-backend

# Si traductions en base de données
npm install i18next-node-mongo-backend  # MongoDB
npm install i18next-node-postgres-backend  # PostgreSQL

# Si cloud (Locize)
npm install i18next-locize-backend
```

---

## 3.2 Structure de fichiers recommandée

```plaintext
projet/
├── server/
│   ├── config/
│   │   └── i18n.js              # Configuration i18next
│   ├── middleware/
│   │   └── i18nMiddleware.js    # Wrapper middleware (optionnel)
│   ├── routes/
│   │   ├── api.js               # Routes API
│   │   └── locales.js           # Routes exposition JSON (pour client)
│   ├── services/
│   │   └── emailService.js      # Services utilisant traductions
│   ├── validators/
│   │   └── userValidator.js     # Validation avec messages traduits
│   └── app.js                   # Application Express principale
│
├── locales/                     # 📁 SOURCE DE VÉRITÉ DES TRADUCTIONS
│   ├── fr/
│   │   ├── common.json          # Labels génériques, boutons
│   │   ├── errors.json          # Messages d'erreur
│   │   ├── validation.json      # Messages validation formulaires
│   │   └── emails.json          # Templates emails
│   └── en/
│       ├── common.json
│       ├── errors.json
│       ├── validation.json
│       └── emails.json
│
├── client/                      # Application React (séparée)
└── package.json
```

### Principes d'organisation

**Séparation des préoccupations** :

- `/config` : Configuration centralisée
- `/routes` : Logique de routage
- `/services` : Logique métier réutilisable
- `/locales` : Ressources linguistiques externalisées

**Source de vérité unique** : Le dossier `locales/` au niveau racine est partagé entre serveur et client.

---

## 3.3 Configuration i18next serveur

### Fichier `server/config/i18n.js`

```javascript
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const path = require('path');

/**
 * Configuration i18next pour environnement serveur Node.js/Express
 */
i18next
  // Plugin Backend : Lecture fichiers JSON depuis filesystem
  .use(Backend)

  // Plugin LanguageDetector : Détection langue via HTTP (query, cookie, header)
  .use(middleware.LanguageDetector)

  // Initialisation avec options
  .init({
    // ==========================================
    // CONFIGURATION LANGUES
    // ==========================================

    /**
     * fallbackLng : Langue par défaut si détection échoue
     * Critique pour éviter affichage de clés brutes
     */
    fallbackLng: 'en',

    /**
     * supportedLngs : Liste blanche des langues acceptées
     * Sécurise contre injections (ex: /locales/../../../etc/passwd)
     * Optimise détection (ignore langues non supportées)
     */
    supportedLngs: ['fr', 'en'],

    /**
     * preload : Précharger langues au démarrage serveur
     * Serveur a mémoire suffisante, évite latence première requête
     * Pour nombreuses langues, charger seulement fallbackLng
     */
    preload: ['fr', 'en'],

    /**
     * load : Stratégie de chargement des variantes régionales
     * - 'all' : charge fr-FR et fr
     * - 'currentOnly' : charge seulement fr-FR
     * - 'languageOnly' : charge seulement fr (recommandé)
     */
    load: 'languageOnly',

    // ==========================================
    // CONFIGURATION NAMESPACES
    // ==========================================

    /**
     * ns : Namespaces disponibles
     * Organisés par domaine fonctionnel
     */
    ns: ['common', 'errors', 'validation', 'emails'],

    /**
     * defaultNS : Namespace par défaut si non spécifié
     * req.t('welcome') → common:welcome
     */
    defaultNS: 'common',

    /**
     * fallbackNS : Namespace de secours
     * Si clé non trouvée dans NS spécifié, cherche dans fallbackNS
     */
    fallbackNS: 'common',

    // ==========================================
    // CONFIGURATION BACKEND FILESYSTEM
    // ==========================================

    backend: {
      /**
       * loadPath : Template de chemin pour lire fichiers
       * {{lng}} remplacé par code langue (fr, en)
       * {{ns}} remplacé par nom namespace (common, errors)
       */
      loadPath: path.join(__dirname, '../../locales/{{lng}}/{{ns}}.json'),

      /**
       * addPath : Template pour sauvegarder clés manquantes (dev uniquement)
       * Utilisé avec saveMissing: true
       */
      addPath: path.join(__dirname, '../../locales/{{lng}}/{{ns}}.missing.json'),

      /**
       * jsonIndent : Indentation JSON (lisibilité)
       * 2 espaces pour cohérence avec standards
       */
      jsonIndent: 2
    },

    // ==========================================
    // CONFIGURATION DÉTECTION LANGUE
    // ==========================================

    detection: {
      /**
       * order : Ordre de priorité de détection
       * 1. querystring (?lng=fr)
       * 2. cookie (i18next cookie)
       * 3. header (Accept-Language)
       */
      order: ['querystring', 'cookie', 'header'],

      /**
       * caches : Mécanismes de persistance du choix utilisateur
       * Cookie permet synchronisation multi-requêtes
       */
      caches: ['cookie'],

      /**
       * lookupQuerystring : Nom du paramètre URL
       * Permet override via /api/users?lng=fr
       */
      lookupQuerystring: 'lng',

      /**
       * lookupCookie : Nom du cookie
       * Standardisé 'i18next' pour compatibilité client
       */
      lookupCookie: 'i18next',

      /**
       * cookieOptions : Configuration cookie
       */
      cookieOptions: {
        path: '/',                              // Disponible sur toutes les routes
        maxAge: 365 * 24 * 60 * 60 * 1000,      // 1 an (persistance longue)
        httpOnly: false,                        // Accessible depuis JavaScript client
        sameSite: 'lax',                        // Protection CSRF
        secure: process.env.NODE_ENV === 'production'  // HTTPS uniquement en prod
      }
    },

    // ==========================================
    // OPTIONS DE COMPORTEMENT
    // ==========================================

    /**
     * initImmediate : CRITIQUE pour serveur
     * false = initialisation synchrone (bloquante)
     * Permet utilisation immédiate de t() après init()
     *
     * true (défaut) = asynchrone avec setTimeout
     * Inapproprié pour SSR (race conditions)
     */
    initImmediate: false,

    /**
     * debug : Activer logs détaillés
     * true en développement pour diagnostiquer problèmes de chargement
     * false en production pour performances
     */
    debug: process.env.NODE_ENV === 'development',

    /**
     * saveMissing : Sauvegarder clés manquantes automatiquement
     * true en dev : génère fichiers .missing.json
     * false en prod : SÉCURITÉ (évite écriture filesystem)
     */
    saveMissing: process.env.NODE_ENV === 'development',

    /**
     * saveMissingTo : Où sauvegarder les clés manquantes
     * 'all' : dans toutes les langues
     * 'current' : seulement langue actuelle
     * 'fallback' : seulement langue fallback
     */
    saveMissingTo: 'current',

    // ==========================================
    // INTERPOLATION
    // ==========================================

    interpolation: {
      /**
       * escapeValue : Échappement automatique HTML
       * false côté serveur car multiples contextes :
       * - HTML : nécessite échappement
       * - JSON API : pas d'échappement
       * - Emails texte : pas d'échappement
       *
       * Responsabilité du développeur de gérer selon contexte
       */
      escapeValue: false,

      /**
       * formatSeparator : Séparateur pour formatage
       * "{{value, uppercase}}" → virgule sépare valeur et format
       */
      formatSeparator: ',',

      /**
       * Variables par défaut globales
       * Disponibles dans toutes les traductions
       */
      defaultVariables: {
        appName: process.env.APP_NAME || 'MonApp',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com'
      }
    },

    // ==========================================
    // AUTRES OPTIONS
    // ==========================================

    /**
     * returnNull : Comportement si clé non trouvée
     * false : retourne clé brute (visible pour debug)
     * true : retourne null (doit être géré par application)
     */
    returnNull: false,

    /**
     * returnEmptyString : Retourner chaîne vide si valeur vide
     * false : retourne clé si valeur = ""
     * true : retourne ""
     */
    returnEmptyString: false,

    /**
     * keySeparator : Séparateur pour clés imbriquées
     * '.' permet "button.save" pour accéder { button: { save: "..." } }
     * false : désactive (clés plates)
     */
    keySeparator: '.',

    /**
     * nsSeparator : Séparateur namespace:clé
     * ':' permet "errors:email.invalid"
     * false : désactive (namespace toujours via option)
     */
    nsSeparator: ':',

    /**
     * pluralSeparator : Séparateur pour suffixes pluriels
     * '_' permet "item_one", "item_other"
     */
    pluralSeparator: '_',

    /**
     * contextSeparator : Séparateur pour contextes
     * '_' permet "friend_male", "friend_female"
     */
    contextSeparator: '_'
  });

/**
 * Export de l'instance configurée
 * Utilisable dans toute l'application serveur
 */
module.exports = i18next;
```

### Points critiques expliqués

#### 1. `initImmediate: false`

**Pourquoi** : Par défaut (`true`), i18next utilise `setTimeout(() => { /* chargement */ }, 0)` pour rendre l'initialisation asynchrone. Cela crée une race condition en SSR :

```javascript
// ❌ Avec initImmediate: true (défaut)
i18next.init(config);
console.log(i18next.t('welcome')); // Peut retourner "welcome" (pas encore chargé)

// ✅ Avec initImmediate: false
i18next.init(config);
console.log(i18next.t('welcome')); // Garanti de retourner traduction
```

#### 2. `escapeValue: false`

**Pourquoi** : Le serveur génère différents formats (HTML, JSON, emails texte). L'échappement automatique HTML serait :

- ✅ Approprié pour HTML
- ❌ Inapproprié pour JSON (corrompt les données)
- ❌ Inapproprié pour emails texte (affiche `&lt;` au lieu de `<`)

**Solution** : Échapper contextuellement :

```javascript
// HTML
const htmlSafe = escapeHtml(i18next.t('message', { input: userInput }));

// JSON (pas d'échappement)
res.json({ message: i18next.t('message') });

// Email texte (pas d'échappement)
sendEmail({ body: i18next.t('emails:welcome.body') });
```

#### 3. `preload: ['fr', 'en']`

**Pourquoi** : Le serveur a mémoire suffisante et traite des requêtes concurrentes. Précharger toutes les langues évite la latence lors de la première requête pour une langue donnée.

**Alternative** (si > 10 langues) :

```javascript
preload: ['en'],  // Seulement fallback
// Autres langues chargées à la demande (légère latence première requête)
```

---

## 3.4 Intégration middleware Express

### Fichier `server/app.js`

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const i18next = require('./config/i18n');
const middleware = require('i18next-http-middleware');

const app = express();

// ==========================================
// MIDDLEWARE ESSENTIELS (AVANT i18next)
// ==========================================

/**
 * cookie-parser : OBLIGATOIRE pour détection via cookie
 * Doit être avant middleware i18next
 */
app.use(cookieParser());

/**
 * Body parser pour JSON
 */
app.use(express.json());

// ==========================================
// MIDDLEWARE i18next
// ==========================================

/**
 * middleware.handle(i18next) crée un middleware Express
 * Injecte dans chaque requête (req) :
 *
 * - req.language : Langue détectée (string) ex: 'fr'
 * - req.languages : Tableau de langues fallback ['fr', 'en']
 * - req.i18n : Instance i18next complète
 * - req.t : Fonction de traduction (raccourci vers req.i18n.t)
 *
 * Workflow :
 * 1. Détecte langue (selon order configuré)
 * 2. Change langue via i18next.changeLanguage(lng)
 * 3. Crée fonction t() fixée sur cette langue
 * 4. Injecte dans req
 */
app.use(middleware.handle(i18next));

// ==========================================
// ROUTES API
// ==========================================

/**
 * Route exemple : Welcome message traduit
 */
app.get('/api/welcome', (req, res) => {
  // req.t() utilise automatiquement la langue détectée
  res.json({
    message: req.t('welcome'),      // common:welcome
    language: req.language          // 'fr' ou 'en'
  });
});

/**
 * Route exemple : Validation avec messages traduits
 */
app.post('/api/users', (req, res) => {
  const { email, password } = req.body;

  const errors = [];

  // Validation avec traductions
  if (!email) {
    errors.push(req.t('validation:email.required'));
  } else if (!isValidEmail(email)) {
    errors.push(req.t('validation:email.invalid', { email }));
  }

  if (!password) {
    errors.push(req.t('validation:password.required'));
  } else if (password.length < 8) {
    errors.push(req.t('validation:password.tooShort', { min: 8 }));
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Création utilisateur...
  res.json({
    success: true,
    message: req.t('users.created')
  });
});

/**
 * Route exemple : Changement manuel de langue
 */
app.post('/api/language', (req, res) => {
  const { lng } = req.body;

  // Validation langue supportée
  if (!['fr', 'en'].includes(lng)) {
    return res.status(400).json({
      error: req.t('errors:invalidLanguage')
    });
  }

  // Mise à jour cookie (automatique via middleware si détection configurée)
  res.cookie('i18next', lng, {
    maxAge: 365 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: 'lax'
  });

  res.json({
    success: true,
    message: req.t('language.changed', { lng })
  });
});

// ==========================================
// EXPOSITION FICHIERS TRADUCTION (pour client)
// ==========================================

/**
 * Route pour servir fichiers JSON au client React
 * Permet chargement dynamique côté frontend
 */
app.get('/locales/:lng/:ns.json', (req, res) => {
  const { lng, ns } = req.params;

  // SÉCURITÉ : Whitelist stricte
  const supportedLngs = ['fr', 'en'];
  const supportedNs = ['common', 'errors', 'validation'];

  if (!supportedLngs.includes(lng) || !supportedNs.includes(ns)) {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    // Récupération depuis ResourceStore (déjà chargé par preload)
    const bundle = i18next.getResourceBundle(lng, ns);

    if (!bundle) {
      return res.status(404).json({ error: 'Translation not found' });
    }

    // Headers optimisation
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache 24h
    res.setHeader('ETag', `"${lng}-${ns}-${Date.now()}"`);   // Validation cache

    res.json(bundle);
  } catch (error) {
    console.error(`Erreur lecture ${lng}/${ns}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// GESTION D'ERREURS GLOBALE
// ==========================================

/**
 * Middleware d'erreur avec messages traduits
 */
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);

  // Code erreur HTTP
  const statusCode = err.statusCode || 500;

  // Message traduit selon code
  const message = req.t(`errors:server.${statusCode}`, {
    defaultValue: req.t('errors:server.generic')
  });

  res.status(statusCode).json({
    error: message,
    code: err.code || 'UNKNOWN',
    // En dev seulement : stack trace
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==========================================
// DÉMARRAGE SERVEUR
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Languages: ${i18next.languages.join(', ')}`);
  console.log(`Namespaces: ${i18next.options.ns.join(', ')}`);
});

module.exports = app;
```

### Détail du middleware i18next

```javascript
// Ce que fait middleware.handle(i18next) en interne (simplifié)
function handle(i18nextInstance) {
  return (req, res, next) => {
    // 1. Exécuter les détecteurs de langue configurés
    const detectedLng = detectLanguage(req);

    // 2. Sélectionner meilleure langue supportée
    const lng = i18nextInstance.services.languageUtils
      .getBestMatchFromCodes([detectedLng], i18nextInstance.options.supportedLngs);

    // 3. Créer fonction t() fixée sur cette langue
    const t = i18nextInstance.getFixedT(lng);

    // 4. Injecter dans req
    req.language = lng;
    req.languages = i18nextInstance.services.languageUtils.toResolveHierarchy(lng);
    req.i18n = i18nextInstance;
    req.t = t;

    // 5. Continuer chaîne middleware
    next();
  };
}
```

**Avantage clé** : Chaque requête HTTP a sa propre langue, permettant le multitenant linguistique (requêtes concurrentes en langues différentes).

---

## 3.5 Exemples de fichiers de traduction

### `locales/fr/common.json`

```json
{
  "welcome": "Bienvenue sur notre plateforme",
  "appName": "MonApp",

  "button": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "edit": "Modifier",
    "create": "Créer",
    "close": "Fermer"
  },

  "navigation": {
    "home": "Accueil",
    "profile": "Profil",
    "settings": "Paramètres",
    "dashboard": "Tableau de bord",
    "logout": "Déconnexion"
  },

  "status": {
    "active": "Actif",
    "inactive": "Inactif",
    "pending": "En attente"
  }
}
```

### `locales/fr/validation.json`

```json
{
  "email": {
    "required": "L'adresse email est obligatoire",
    "invalid": "L'adresse email {{email}} n'est pas valide",
    "exists": "Cette adresse email est déjà utilisée"
  },

  "password": {
    "required": "Le mot de passe est obligatoire",
    "tooShort": "Le mot de passe doit contenir au moins {{min}} caractères",
    "tooWeak": "Le mot de passe est trop faible",
    "mismatch": "Les mots de passe ne correspondent pas"
  },

  "username": {
    "required": "Le nom d'utilisateur est obligatoire",
    "tooShort": "Le nom d'utilisateur doit contenir au moins {{min}} caractères",
    "invalidChars": "Le nom d'utilisateur contient des caractères invalides"
  },

  "required": "Ce champ est obligatoire",
  "minLength": "Minimum {{min}} caractères requis",
  "maxLength": "Maximum {{max}} caractères autorisés"
}
```

### `locales/fr/errors.json`

```json
{
  "server": {
    "generic": "Une erreur est survenue",
    "500": "Erreur interne du serveur",
    "404": "Ressource introuvable",
    "401": "Non autorisé",
    "403": "Accès interdit",
    "400": "Requête invalide"
  },

  "auth": {
    "invalidCredentials": "Identifiants invalides",
    "sessionExpired": "Votre session a expiré",
    "accountLocked": "Votre compte est verrouillé"
  },

  "database": {
    "connectionFailed": "Impossible de se connecter à la base de données",
    "queryFailed": "Erreur lors de la requête"
  }
}
```

### `locales/fr/emails.json`

```json
{
  "welcome": {
    "subject": "Bienvenue sur {{appName}}",
    "greeting": "Bonjour {{name}},",
    "body": "Nous sommes ravis de vous accueillir sur notre plateforme.\n\nVotre compte a été créé avec succès.",
    "cta": "Commencer maintenant",
    "footer": "Cordialement,\nL'équipe {{appName}}"
  },

  "resetPassword": {
    "subject": "Réinitialisation de votre mot de passe",
    "greeting": "Bonjour {{name}},",
    "body": "Vous avez demandé la réinitialisation de votre mot de passe.\n\nCliquez sur le lien ci-dessous pour créer un nouveau mot de passe :",
    "link": "Réinitialiser mon mot de passe",
    "expiry": "Ce lien expirera dans {{hours}} heures.",
    "ignore": "Si vous n'avez pas demandé cette réinitialisation, ignorez cet email."
  },

  "notification": {
    "subject": "Nouvelle notification",
    "body": "{{message}}"
  }
}
```

### Équivalents anglais (`locales/en/*.json`)

Structure identique, valeurs traduites en anglais.

---

## 3.6 Bonnes pratiques architecturales serveur

### A. Services avec i18n

```javascript
// services/emailService.js
class EmailService {
  /**
   * Injecter i18next plutôt que l'importer directement
   * Facilite tests (mocking)
   */
  constructor(i18next, mailer) {
    this.i18next = i18next;
    this.mailer = mailer;
  }

  /**
   * Envoyer email de bienvenue
   * @param {Object} user - Utilisateur
   * @param {String} language - Langue préférée utilisateur
   */
  async sendWelcome(user, language = 'en') {
    // Fonction t() fixée sur langue et namespace
    const t = this.i18next.getFixedT(language, 'emails');

    const subject = t('welcome.subject', { appName: 'MonApp' });
    const body = `
      ${t('welcome.greeting', { name: user.name })}

      ${t('welcome.body')}

      ${t('welcome.footer', { appName: 'MonApp' })}
    `;

    await this.mailer.send({
      to: user.email,
      subject,
      body
    });

    console.log(`Email bienvenue envoyé à ${user.email} (${language})`);
  }

  /**
   * Envoyer email réinitialisation mot de passe
   */
  async sendPasswordReset(user, resetToken, language = 'en') {
    const t = this.i18next.getFixedT(language, 'emails');

    const resetLink = `https://example.com/reset-password?token=${resetToken}`;

    const subject = t('resetPassword.subject');
    const body = `
      ${t('resetPassword.greeting', { name: user.name })}

      ${t('resetPassword.body')}

      ${resetLink}

      ${t('resetPassword.expiry', { hours: 24 })}
      ${t('resetPassword.ignore')}
    `;

    await this.mailer.send({
      to: user.email,
      subject,
      body
    });
  }
}

module.exports = EmailService;
```

**Utilisation** :

```javascript
// app.js ou route handler
const EmailService = require('./services/emailService');
const emailService = new EmailService(i18next, mailer);

app.post('/api/register', async (req, res) => {
  const user = await createUser(req.body);

  // Langue de l'utilisateur (détectée ou choisie)
  const language = req.language;

  // Envoyer email dans la langue de l'utilisateur
  await emailService.sendWelcome(user, language);

  res.json({ success: true });
});
```

### B. Validators avec messages traduits

```javascript
// validators/userValidator.js

/**
 * Valider données utilisateur
 * @param {Object} data - Données à valider
 * @param {Function} t - Fonction traduction
 * @returns {Array} Liste d'erreurs (vide si valide)
 */
function validateUser(data, t) {
  const errors = [];

  // Email
  if (!data.email) {
    errors.push({
      field: 'email',
      message: t('validation:email.required')
    });
  } else if (!isValidEmail(data.email)) {
    errors.push({
      field: 'email',
      message: t('validation:email.invalid', { email: data.email })
    });
  }

  // Password
  if (!data.password) {
    errors.push({
      field: 'password',
      message: t('validation:password.required')
    });
  } else {
    if (data.password.length < 8) {
      errors.push({
        field: 'password',
        message: t('validation:password.tooShort', { min: 8 })
      });
    }

    if (!isStrongPassword(data.password)) {
      errors.push({
        field: 'password',
        message: t('validation:password.tooWeak')
      });
    }
  }

  // Confirmation password
  if (data.password !== data.passwordConfirm) {
    errors.push({
      field: 'passwordConfirm',
      message: t('validation:password.mismatch')
    });
  }

  return errors;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  // Au moins 1 majuscule, 1 minuscule, 1 chiffre
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

module.exports = { validateUser };
```

**Utilisation** :

```javascript
const { validateUser } = require('./validators/userValidator');

app.post('/api/users', (req, res) => {
  const errors = validateUser(req.body, req.t);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Continuer création utilisateur...
});
```

### C. Gestion multi-instance pour isolation

```javascript
/**
 * Contextes nécessitant langues différentes simultanément
 * Ex: Notifications push en plusieurs langues
 */
const i18nextFR = i18next.createInstance();
const i18nextEN = i18next.createInstance();

// Initialisation séparée
await i18nextFR.init({
  lng: 'fr',
  backend: { loadPath: './locales/{{lng}}/{{ns}}.json' }
});

await i18nextEN.init({
  lng: 'en',
  backend: { loadPath: './locales/{{lng}}/{{ns}}.json' }
});

// Utilisation parallèle
async function sendMultilangNotification(users, message) {
  const promises = users.map(user => {
    const i18n = user.language === 'fr' ? i18nextFR : i18nextEN;
    const localizedMessage = i18n.t(message);

    return sendPushNotification(user.deviceToken, localizedMessage);
  });

  await Promise.all(promises);
}
```

### D. Configuration environnements dev/prod

```javascript
// config/i18n.config.js

/**
 * Configuration par environnement
 */
const configs = {
  development: {
    debug: true,
    saveMissing: true,  // Génère fichiers .missing.json
    saveMissingTo: 'current',

    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json',
      addPath: './locales/{{lng}}/{{ns}}.missing.json'
    },

    // Pas de cache (rechargement à chaque requête)
    cache: {
      enabled: false
    }
  },

  production: {
    debug: false,
    saveMissing: false,  // SÉCURITÉ : ne jamais modifier filesystem en prod

    backend: {
      loadPath: './dist/locales/{{lng}}/{{ns}}.json'
      // Pas d'addPath
    },

    // Cache agressif
    cache: {
      enabled: true,
      expirationTime: 7 * 24 * 60 * 60 * 1000  // 7 jours
    }
  },

  test: {
    debug: false,
    saveMissing: false,

    // Ressources statiques pour tests reproductibles
    resources: {
      en: {
        common: require('../test/fixtures/locales/en/common.json')
      }
    }
  }
};

module.exports = configs[process.env.NODE_ENV || 'development'];
```

**Utilisation** :

```javascript
// config/i18n.js
const baseConfig = require('./i18n.config');

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    ...baseConfig,  // Spread config spécifique environnement
    fallbackLng: 'en',
    supportedLngs: ['fr', 'en'],
    // ... autres options communes
  });
```

---

**Fin de la section 3 - Implémentation Express**
