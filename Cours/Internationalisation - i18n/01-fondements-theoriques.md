# 1. Fondements Théoriques de l'Internationalisation

## 1.1 Terminologie fondamentale : i18n, l10n, g11n

### Internationalization (i18n)

**Définition** : Processus architectural consistant à concevoir un système logiciel pour supporter plusieurs langues et contextes culturels *sans modification du code source*. Le chiffre 18 représente les lettres entre "i" et "n".

**Responsabilités** :

- Externalisation des chaînes de caractères traduisibles
- Support des encodages Unicode (UTF-8)
- Gestion des formats de dates, nombres, devises indépendants de la locale
- Architecture permettant le chargement dynamique de ressources linguistiques

### Localization (l10n)

**Définition** : Adaptation concrète d'un système à une locale spécifique, incluant traductions, formats de dates/nombres/devises, conventions typographiques, et conformité culturelle.

**Exemples concrets** :

- Traduction "Submit" → "Envoyer" (fr), "Enviar" (es)
- Format date : 27/02/2026 (fr) vs 02/27/2026 (en-US)
- Séparateur décimal : 1.234,56 € (fr) vs 1,234.56 € (en)
- Direction texte : LTR (français) vs RTL (arabe)

### Globalization (g11n)

**Définition** : Stratégie globale combinant i18n (capacité technique) et l10n (adaptation culturelle) pour adresser un marché mondial.

**Relation conceptuelle** :

```plaintext
i18n = Prerequisite technique (architecture)
l10n = Instance d'application (traductions spécifiques)
g11n = Stratégie business (vision globale)
```

---

## 1.2 Problématique des ressources linguistiques

### Défi de la séparation

Les ressources linguistiques doivent être externalisées du code applicatif pour permettre :

1. **Maintenance indépendante** : Traducteurs non-techniques peuvent modifier les fichiers
2. **Ajout de langues sans recompilation** : Déploiement de nouvelles traductions sans rebuild
3. **Gestion de versions séparées** : Cycle de vie des traductions découplé du développement
4. **Réutilisation inter-applications** : Partage de traductions communes

### Formats de stockage

**JSON** (standard de facto pour i18next) :

```json
{
  "welcome": "Bienvenue",
  "button": {
    "save": "Enregistrer",
    "cancel": "Annuler"
  }
}
```

**Avantages** :

- Léger et performant
- Natif JavaScript (parsing direct)
- Support universel

**Alternatives supportées via plugins** :

- **ICU MessageFormat** : Grammaire complexe pour pluriels/contextes
- **Mozilla Fluent** : Syntax naturelle pour traducteurs
- **YAML** : Plus lisible humainement

### Organisation hiérarchique

**Structure canonique** :

```javascript
{
  langue: {
    namespace: {
      clé: valeur
    }
  }
}
```

**Exemple concret** :

```javascript
{
  fr: {
    common: {
      welcome: "Bienvenue",
      navigation: {
        home: "Accueil",
        profile: "Profil"
      }
    },
    errors: {
      required: "Ce champ est obligatoire"
    }
  },
  en: {
    common: {
      welcome: "Welcome",
      navigation: {
        home: "Home",
        profile: "Profile"
      }
    },
    errors: {
      required: "This field is required"
    }
  }
}
```

---

## 1.3 Système de namespaces

### Définition

Un **namespace** représente une unité logique de regroupement de traductions, typiquement matérialisée par un fichier JSON distinct.

### Rôles architecturaux

#### 1. Isolation sémantique

Séparation par domaine métier :

- `common` : Labels génériques, boutons réutilisables
- `errors` : Messages d'erreur
- `validation` : Règles de validation formulaires
- `dashboard` : Interface utilisateur spécifique
- `admin` : Zone administration

#### 2. Optimisation de chargement

Lazy loading par fonctionnalité :

```javascript
// Charger 'admin' uniquement pour utilisateurs admin
if (user.role === 'admin') {
  i18next.loadNamespaces('admin');
}
```

#### 3. Maintenabilité

Éviter les fichiers monolithiques :

- **Limite recommandée** : 300 segments par fichier
- **Raison** : Au-delà, perte de vue d'ensemble et conflits de merge fréquents

#### 4. Réutilisabilité

Namespaces communs partagés entre applications :

```plaintext
shared-translations/
  common.json         # Partagé entre app-web et app-mobile
  errors.json
```

### Pattern de nommage recommandé

```plaintext
/locales/
  fr/
    common.json        # Labels génériques, boutons
    validation.json    # Messages d'erreur validation
    auth.json          # Authentification/inscription
    dashboard.json     # Interface tableau de bord
    admin.json         # Administration
    emails.json        # Templates emails (serveur uniquement)
  en/
    common.json
    validation.json
    auth.json
    dashboard.json
    admin.json
    emails.json
```

### Configuration dans i18next

```javascript
i18next.init({
  ns: ['common', 'validation', 'auth'],  // Namespaces à charger
  defaultNS: 'common',                   // Namespace par défaut
  fallbackNS: 'common'                   // Namespace de secours
});

// Utilisation
i18next.t('welcome');                    // → common:welcome
i18next.t('validation:email.required');  // → validation:email.required
i18next.t('save', { ns: 'common' });     // Forcer namespace
```

---

## 1.4 Résolution de clés et Translation Resolution Flow

### Algorithme de résolution (ordre de priorité)

i18next suit une stratégie progressive, testant les combinaisons du **plus spécifique au plus générique** :

```plaintext
1. Variants de clés
   ├─ Pluriel contextualisé (key_male_other)
   ├─ Contexte seul (key_male)
   ├─ Pluriel seul (key_other)
   └─ Clé de base (key)

2. Langues
   ├─ Variante spécifique (fr-CA)
   ├─ Langue générique (fr)
   └─ Fallback configuré (en)

3. Namespaces
   ├─ Namespace spécifié (specific)
   ├─ Namespace par défaut (common)
   └─ Namespaces de fallback (fallbackNS)

4. Clés de secours
   └─ Tableau de clés alternatives
```

### Exemple concret de résolution

**Requête** :

```javascript
i18next.t('friend', {
  count: 2,
  context: 'male',
  ns: 'social',
  lng: 'fr-CA'
});
```

**Configuration** :

```javascript
{
  lng: 'fr-CA',
  fallbackLng: 'en',
  ns: ['social', 'common'],
  defaultNS: 'social',
  fallbackNS: 'common'
}
```

**Tentatives successives** :

```plaintext
1.  fr-CA/social.json → friend_male_other    ✗ (non trouvé)
2.  fr-CA/social.json → friend_male          ✗
3.  fr-CA/social.json → friend_other         ✗
4.  fr-CA/social.json → friend               ✗
5.  fr-CA/common.json → friend_male_other    ✗
6.  fr-CA/common.json → friend_male          ✗
7.  fr-CA/common.json → friend_other         ✗
8.  fr-CA/common.json → friend               ✗
9.  fr/social.json    → friend_male_other    ✗
10. fr/social.json    → friend_male          ✗
11. fr/social.json    → friend_other         ✓ TROUVÉ !

→ Retourne : "2 amis"
```

### Fallback final

Si aucune clé n'est trouvée :

```javascript
// Option 1 : Valeur par défaut fournie
i18next.t('missing', { defaultValue: 'Fallback text' });
// → "Fallback text"

// Option 2 : Clé brute (comportement par défaut)
i18next.t('missing');
// → "missing"

// Option 3 : Retour null (si configuré)
i18next.init({ returnNull: true });
i18next.t('missing');
// → null
```

---

## 1.5 Interpolation et sécurité XSS

### Concept fondamental

**Interpolation** : Mécanisme de remplacement de placeholders par des valeurs dynamiques au moment du rendu.

### Syntaxe canonique

```javascript
// Fichier de traduction
{
  "greeting": "Bonjour {{name}}, vous avez {{count}} messages"
}

// Utilisation
i18next.t('greeting', { name: 'Marie', count: 5 });
// → "Bonjour Marie, vous avez 5 messages"
```

### Structures complexes

**Objets imbriqués** :

```json
{
  "profile": "{{user.name}} ({{user.role}}) - {{user.email}}"
}
```

```javascript
i18next.t('profile', {
  user: {
    name: 'Alice',
    role: 'Admin',
    email: 'alice@example.com'
  }
});
// → "Alice (Admin) - alice@example.com"
```

### Sécurité XSS

#### Protection par défaut (échappement activé)

```javascript
i18next.init({
  interpolation: {
    escapeValue: true  // ✅ ACTIVÉ PAR DÉFAUT
  }
});

// Injection tentée
const malicious = '<script>alert("XSS")</script>';
i18next.t('message', { html: malicious });
// → "Message: &lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;"
```

#### Désactivation de l'échappement (dangereux)

**Syntax** : Préfixer la variable avec un tiret `-`

```json
{
  "unsafe": "Contenu HTML : {{- dangereux}}"
}
```

```javascript
i18next.t('unsafe', { dangereux: '<strong>Gras</strong>' });
// → "Contenu HTML : <strong>Gras</strong>"
```

⚠️ **ATTENTION CRITIQUE** : Si vous désactivez l'échappement, vous DEVEZ sanitizer manuellement toute entrée utilisateur :

```javascript
import DOMPurify from 'dompurify';

const userInput = req.body.comment; // Entrée utilisateur non fiable
const sanitized = DOMPurify.sanitize(userInput);

i18next.t('comment', { content: sanitized }); // ✅ SÉCURISÉ
```

### Protection contre injections de templates

**Option `skipOnVariables`** (activée par défaut depuis v21) :

```javascript
i18next.init({
  interpolation: {
    skipOnVariables: true  // ✅ Empêche l'interprétation de $t() ou {{}} dans variables
  }
});

// Tentative d'injection
const malicious = "{{admin.secret}} $t(admin.password)";
i18next.t('display', { value: malicious });
// → "{{admin.secret}} $t(admin.password)" (NON interprété)
```

### Options d'interpolation avancées

```javascript
i18next.init({
  interpolation: {
    prefix: '{{',              // Marque d'ouverture
    suffix: '}}',              // Marque de fermeture
    escapeValue: true,         // Protection XSS
    formatSeparator: ',',      // Séparateur pour formatage
    maxReplaces: 1000,         // Protection contre boucles infinies
    skipOnVariables: true,     // Protection injection templates

    // Variables globales par défaut
    defaultVariables: {
      appName: 'MonApp',
      year: new Date().getFullYear()
    }
  }
});

// Utilisation variables globales
i18next.t('footer');
// "© {{year}} {{appName}}" → "© 2026 MonApp"
```

---

## 1.6 Pluralisation et règles linguistiques CLDR

### Fondement : Standard CLDR

**CLDR** (Common Locale Data Repository) : Standard Unicode définissant les règles de pluralisation pour 150+ langues.

**API native** : i18next utilise `Intl.PluralRules` du navigateur.

### Formes plurielles universelles

| Forme   | Utilisation  | Exemple anglais | Exemple arabe  |
| ------- | ------------ | --------------- | -------------- |
| `zero`  | Exactement 0 | -               | 0 éléments     |
| `one`   | Singulier    | 1 item          | 1 élément      |
| `two`   | Duel         | -               | 2 éléments     |
| `few`   | Peu nombreux | -               | 3-10 éléments  |
| `many`  | Nombreux     | -               | 11-99 éléments |
| `other` | Fallback     | 2+ items        | 100+ éléments  |

### Syntaxe des clés (format JSON v4)

**Anglais** (2 formes : one, other) :

```json
{
  "item_one": "{{count}} item",
  "item_other": "{{count}} items"
}
```

**Français** (2 formes : one, other) :

```json
{
  "item_one": "{{count}} article",
  "item_other": "{{count}} articles"
}
```

**Arabe** (6 formes : zero, one, two, few, many, other) :

```json
{
  "item_zero": "لا توجد عناصر",
  "item_one": "عنصر واحد",
  "item_two": "عنصران",
  "item_few": "{{count}} عناصر",
  "item_many": "{{count}} عنصرًا",
  "item_other": "{{count}} عنصر"
}
```

### Utilisation en code

```javascript
// CRITIQUE : Le paramètre DOIT s'appeler "count"
i18next.t('item', { count: 0 });  // → "0 article" (ou forme _zero si définie)
i18next.t('item', { count: 1 });  // → "1 article"
i18next.t('item', { count: 5 });  // → "5 articles"
```

⚠️ **Sans paramètre `count`, pas de fallback** :

```javascript
i18next.t('item'); // ❌ ERREUR : retourne "item" (clé brute)
```

### Cas spécial : forme zéro

Si `count: 0` et une clé `_zero` existe, elle est prioritaire :

```json
{
  "cart_zero": "Votre panier est vide",
  "cart_one": "{{count}} article dans votre panier",
  "cart_other": "{{count}} articles dans votre panier"
}
```

```javascript
i18next.t('cart', { count: 0 }); // → "Votre panier est vide"
i18next.t('cart', { count: 1 }); // → "1 article dans votre panier"
i18next.t('cart', { count: 3 }); // → "3 articles dans votre panier"
```

### Nombres ordinaux

**Utilisation** : Rangs (1er, 2e, 3e)

```json
{
  "place_ordinal_one": "{{count}}er",
  "place_ordinal_other": "{{count}}e"
}
```

```javascript
i18next.t('place', { count: 1, ordinal: true }); // → "1er"
i18next.t('place', { count: 2, ordinal: true }); // → "2e"
```

### Intervalles (plugin)

**Plugin** : `i18next-intervalplural-postprocessor`

```json
{
  "items": "(0)[Aucun];(1)[Un seul];(2-5)[Quelques-uns];(6-inf)[Beaucoup];"
}
```

```javascript
i18next.t('items', { postProcess: 'interval', count: 0 });  // → "Aucun"
i18next.t('items', { postProcess: 'interval', count: 3 });  // → "Quelques-uns"
i18next.t('items', { postProcess: 'interval', count: 10 }); // → "Beaucoup"
```

---

## 1.7 Fallback chains multi-niveaux

### Définition

**Fallback chain** : Mécanisme de secours garantissant qu'un contenu soit toujours affiché, même en cas de traduction manquante.

### Trois dimensions de fallback

#### A. Fallback linguistique

```javascript
i18next.init({
  lng: 'fr-CA',              // Français canadien
  fallbackLng: ['fr', 'en']  // 1. Français standard, 2. Anglais
});

// Recherche pour clé "welcome" :
// 1. fr-CA/common.json → welcome  ✗
// 2. fr/common.json    → welcome  ✓ TROUVÉ
```

**Cascade avec variantes régionales** :

```javascript
i18next.init({
  lng: 'zh-cmn-Hant-HK',  // Chinois mandarin traditionnel Hong Kong
  fallbackLng: {
    'zh-cmn-Hant-HK': ['zh-Hant', 'zh', 'en'],
    'default': ['en']
  }
});

// Cascade : zh-cmn-Hant-HK → zh-Hant → zh → en
```

#### B. Fallback namespace

```javascript
i18next.init({
  ns: ['dashboard', 'common'],
  defaultNS: 'dashboard',
  fallbackNS: 'common'
});

// Recherche pour clé "save" dans dashboard :
// 1. dashboard.json → save  ✗
// 2. common.json    → save  ✓ TROUVÉ
```

**Cas d'usage** : Boutons génériques (save, cancel) dans `common`, réutilisés partout.

#### C. Fallback clé

```javascript
// Tableau de clés alternatives
i18next.t(['error.404', 'error.notFound', 'error.generic']);

// Tentatives :
// 1. error.404      ✗
// 2. error.notFound ✗
// 3. error.generic  ✓ TROUVÉ
```

**Cas d'usage** : Codes d'erreur dynamiques avec fallback générique.

### Ordre d'exécution combiné

```plaintext
Pour chaque LANGUE (fr-CA → fr → en) :
  Pour chaque NAMESPACE (specific → common) :
    Pour chaque CLÉ (['key1', 'key2']) :
      Pour chaque VARIANTE (contexte, pluriel) :
        SI TROUVÉ → RETOURNER

SI RIEN TROUVÉ :
  SI defaultValue → retourner defaultValue
  SI returnNull: false → retourner clé brute
  SINON → retourner null
```

### Configuration avancée

```javascript
i18next.init({
  fallbackLng: {
    'fr-CA': ['fr', 'en'],
    'fr-FR': ['fr', 'en'],
    'en-US': ['en'],
    'en-GB': ['en'],
    'default': ['en']  // Pour toute autre langue
  },

  fallbackNS: ['common', 'errors'],

  // Désactiver tous les fallbacks
  fallbackLng: false,  // ❌ Dangereux : pas de langue de secours
  fallbackNS: false    // ❌ Dangereux : pas de namespace de secours
});
```

---

## 1.8 Détection et négociation de langue

### Sources de détection (ordre typique)

#### Côté navigateur (client)

1. **Paramètre URL** : `?lng=fr` ou `/fr/page`
2. **Cookie persistant** : `i18nextLng=fr`
3. **localStorage** : `localStorage.getItem('i18nextLng')`
4. **Header HTTP** : `Accept-Language: fr-FR,fr;q=0.9,en;q=0.8`
5. **Attribut HTML** : `<html lang="fr">`
6. **Navigator API** : `navigator.language` (langue système)

#### Côté serveur (Node.js/Express)

1. **Paramètre query** : `/api/users?lng=fr`
2. **Cookie** : `req.cookies.i18nextLng`
3. **Header Accept-Language** : `req.headers['accept-language']`
4. **Path URL** : `/fr/api/users`
5. **Sous-domaine** : `fr.example.com`

### Plugins de détection

**Browser** : `i18next-browser-languagedetector`

```javascript
import LanguageDetector from 'i18next-browser-languagedetector';

i18next.use(LanguageDetector).init({
  detection: {
    order: ['querystring', 'localStorage', 'navigator'],
    caches: ['localStorage'],
    lookupQuerystring: 'lng',
    lookupLocalStorage: 'i18nextLng'
  }
});
```

**Server (Express)** : `i18next-http-middleware`

```javascript
const middleware = require('i18next-http-middleware');

i18next.use(middleware.LanguageDetector).init({
  detection: {
    order: ['querystring', 'cookie', 'header'],
    caches: ['cookie'],
    lookupQuerystring: 'lng',
    lookupCookie: 'i18nextLng'
  }
});
```

### Négociation de langue

**Problème** : L'utilisateur préfère `fr-CA`, mais l'app supporte seulement `fr` et `en`.

**Solution** : i18next compare avec `supportedLngs` et choisit la meilleure correspondance.

```javascript
i18next.init({
  supportedLngs: ['fr', 'en'],
  // Utilisateur demande : fr-CA
  // i18next sélectionne : fr (meilleure correspondance)
});
```

**Algorithme de matching** :

1. Correspondance exacte : `fr-CA` dans supportedLngs → `fr-CA`
2. Langue générique : `fr-CA` → `fr` (si `fr` dans supportedLngs)
3. Fallback configuré : → `en` (si rien ne correspond)

### Persistance du choix utilisateur

```javascript
i18next.init({
  detection: {
    caches: ['localStorage', 'cookie'],
    cookieOptions: {
      path: '/',
      maxAge: 365 * 24 * 60 * 60 * 1000,  // 1 an
      sameSite: 'lax'
    }
  }
});

// Changement manuel
i18next.changeLanguage('fr');
// → Automatiquement sauvegardé dans localStorage et cookie
```

---

## 1.9 Lazy loading des ressources

### Problématique

**Chargement initial complet** :

```javascript
// ❌ Charge TOUT au démarrage
resources: {
  fr: { common: {...}, errors: {...}, admin: {...}, dashboard: {...} },
  en: { common: {...}, errors: {...}, admin: {...}, dashboard: {...} },
  es: { common: {...}, errors: {...}, admin: {...}, dashboard: {...} }
}

// Conséquences :
// - Temps de chargement initial : 2-3 secondes
// - Bande passante : 500 KB+ pour traductions non utilisées
// - Memory footprint : 2 MB+ pour 3 langues × 4 namespaces
```

### Solutions architecturales

#### A. Backend HTTP dynamique

**Configuration** :

```javascript
import HttpBackend from 'i18next-http-backend';

i18next.use(HttpBackend).init({
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  }
});

// Charge uniquement : fr/common.json au démarrage
// Puis fr/admin.json quand nécessaire
```

**Avantages** :

- Chargement à la demande
- Mise à jour sans redéploiement
- CDN-friendly

#### B. Webpack code splitting

**Configuration** :

```javascript
import resourcesToBackend from 'i18next-resources-to-backend';

i18next.use(resourcesToBackend((language, namespace) =>
  import(`./locales/${language}/${namespace}.json`)
)).init();

// webpack crée automatiquement des chunks séparés :
// - locales-fr-common.chunk.js
// - locales-fr-admin.chunk.js
// - etc.
```

**Avantages** :

- Bundles optimisés
- Pas de requête HTTP (chunks inclus dans build)
- Cache navigateur efficace

#### C. Chargement explicite

```javascript
// Initialisation avec namespaces minimaux
i18next.init({
  ns: ['common'],  // Seulement common au démarrage
  defaultNS: 'common'
});

// Chargement à la demande
function openAdminPanel() {
  i18next.loadNamespaces('admin')
    .then(() => {
      // Namespace admin maintenant disponible
      renderAdminPanel();
    });
}
```

#### D. Hybride : Critical + Lazy

```javascript
import commonFR from './locales/fr/common.json';
import commonEN from './locales/en/common.json';

i18next
  .use(HttpBackend)
  .init({
    // Namespace critique bundlé (disponible immédiatement)
    resources: {
      fr: { common: commonFR },
      en: { common: commonEN }
    },

    // Active backend pour namespaces non bundlés
    partialBundledLanguages: true,

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });

// Résultat :
// - common.json : 0ms (bundlé)
// - admin.json : 50ms (HTTP)
```

---

## 1.10 Séparation des responsabilités frontend/backend

### Modèle canonique

#### Backend (Express) - Responsabilités

1. **Source de vérité** : Fichiers de traduction stockés serveur
2. **Détection primaire** : Analyse headers HTTP, cookies
3. **SSR** : Rendu HTML complet avec traductions
4. **API** : Exposition des ressources JSON (`/locales/:lng/:ns.json`)
5. **Traductions serveur** : Emails, logs, notifications push

#### Frontend (React) - Responsabilités

1. **Consommation** : Chargement ressources depuis backend
2. **Détection complémentaire** : localStorage, préférences utilisateur UI
3. **Gestion réactive** : Re-render automatique sur changement langue
4. **Interpolation** : Rendu dynamique des valeurs
5. **UX** : Indicateurs de chargement, fallbacks

### Stratégies d'architecture

#### Stratégie 1 : Backend source unique (recommandé)

**Architecture** :

```plaintext
┌─────────────┐
│   Express   │ ← Source de vérité (locales/)
│   Server    │
└──────┬──────┘
       │ GET /locales/fr/common.json
       ▼
┌─────────────┐
│   React     │ ← Consomme via HTTP backend
│   Client    │
└─────────────┘
```

**Avantages** :

- ✅ Cohérence SSR/CSR (mêmes fichiers)
- ✅ Mise à jour sans rebuild client
- ✅ Contrôle serveur (rate limiting, analytics)

**Inconvénient** :

- ❌ Latence requête HTTP initiale

#### Stratégie 2 : Duplication contrôlée

**Architecture** :

```plaintext
server/locales/     # Traductions serveur (emails, logs)
  fr/emails.json
  en/emails.json

client/locales/     # Traductions client (UI)
  fr/common.json
  en/common.json
```

**Avantages** :

- ✅ Optimisation séparée (serveur vs client)
- ✅ Pas de conflit entre besoins différents

**Inconvénient** :

- ❌ Duplication de `common` si partagé

#### Stratégie 3 : CDN

**Architecture** :

```plaintext
┌─────────────┐
│   CDN       │ ← Fichiers JSON statiques
│ (Cloudflare)│
└──────┬──────┘
       │
       ├─→ Express (chargement serveur)
       │
       └─→ React (chargement client)
```

**Configuration** :

```javascript
// Serveur ET client pointent vers CDN
backend: {
  loadPath: 'https://cdn.example.com/locales/{{lng}}/{{ns}}.json'
}
```

**Avantages** :

- ✅ Performance maximale (edge locations)
- ✅ Décharge serveur applicatif
- ✅ Mise en cache agressive

### Synchronisation langue serveur ↔ client

**Problème** : SSR génère HTML en `fr`, client détecte `en`.

**Solution 1 : Cookie partagé**

```javascript
// Serveur (Express)
i18next.init({
  detection: {
    order: ['cookie', 'header'],
    caches: ['cookie'],
    lookupCookie: 'i18nextLng'
  }
});

// Client (React)
i18next.init({
  detection: {
    order: ['cookie', 'localStorage'],
    lookupCookie: 'i18nextLng'  // Même nom !
  }
});

// Résultat : Cookie unique partagé = langue synchronisée
```

**Solution 2 : Injection langue dans HTML**

```html
<!-- Serveur génère -->
<html lang="fr">
  <script>window.__i18n_lng__ = 'fr';</script>
</html>
```

```javascript
// Client lit
i18next.init({
  lng: window.__i18n_lng__,  // Force même langue que SSR
  detection: false            // Désactive détection
});
```

---

**Fin de la section 1 - Fondements Théoriques**
