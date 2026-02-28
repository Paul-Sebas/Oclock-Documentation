# 2. Architecture Interne de i18next

## 2.1 Cycle d'initialisation

### Diagramme conceptuel du cycle de vie

```plaintext
┌─────────────────────────────────────────────────────────┐
│ 1. INSTANCIATION                                        │
│    createInstance() ou singleton par défaut             │
│    • Création de l'objet i18next                        │
│    • Initialisation des composants internes             │
└────────────────────┬────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. ENREGISTREMENT DES PLUGINS                           │
│    .use(Backend).use(LanguageDetector).use(PostProc)    │
│    • Backend → chargement ressources                    │
│    • LanguageDetector → détection automatique           │
│    • PostProcessor → transformations                    │
└────────────────────┬────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. INITIALISATION (init)                                │
│    • Fusion options par défaut + options utilisateur    │
│    • Résolution de la langue (detector ou config)       │
│    • Détermination des namespaces à charger             │
│    • Configuration interpolation, pluralisation         │
└────────────────────┬────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. CHARGEMENT DES RESSOURCES                            │
│    • Backend.read(lng, ns) pour chaque combinaison      │
│    • Stockage dans ResourceStore                        │
│    • Gestion parallèle (maxParallelReads: 10)           │
│    • Gestion des erreurs (failedLoading event)          │
└────────────────────┬────────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. ÉVÉNEMENT 'initialized'                              │
│    • Promise résolue / Callback exécuté                 │
│    • État : isInitialized = true                        │
│    • Fonction t() maintenant utilisable                 │
└─────────────────────────────────────────────────────────┘
```

### Code d'illustration commenté

```javascript
import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// ÉTAPE 1 : i18next est un singleton par défaut
// Alternative : i18next.createInstance() pour multiples instances

// ÉTAPE 2 : Enregistrement des plugins
i18next
  .use(Backend)              // Plugin backend (chargement HTTP)
  .use(LanguageDetector)     // Plugin détection langue

  // ÉTAPE 3 : Configuration et initialisation
  .init({
    // Configuration langue
    fallbackLng: 'en',
    supportedLngs: ['fr', 'en'],

    // Configuration namespaces
    ns: ['common', 'errors'],
    defaultNS: 'common',

    // Configuration backend
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // ÉTAPE 4 : Ce path sera utilisé pour charger les ressources
      // Ex: /locales/fr/common.json, /locales/fr/errors.json
    },

    // Options de détection
    detection: {
      order: ['querystring', 'localStorage', 'navigator']
    },

    // Autres options
    debug: false,
    interpolation: {
      escapeValue: true
    }
  })

  // ÉTAPE 5 : Handler de complétion
  .then((t) => {
    // ✅ Initialisé : t() est maintenant disponible
    console.log(t('welcome'));

    // Événement aussi disponible :
    i18next.on('initialized', (options) => {
      console.log('i18next initialisé avec options:', options);
    });
  })
  .catch((err) => {
    console.error('Erreur initialisation:', err);
  });

// ❌ ERREUR COMMUNE : Utiliser t() avant init()
// console.log(i18next.t('welcome')); // Retourne "welcome" (clé brute)
```

### Points critiques

#### A. Ordre des .use()

```javascript
// ✅ CORRECT : Plugins AVANT init()
i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({ /* ... */ });

// ❌ ERREUR : Plugin APRÈS init()
i18next
  .init({ /* ... */ })
  .use(Backend); // Plugin ignoré !
```

#### B. Asynchronicité obligatoire

```javascript
// ❌ ERREUR : Utilisation synchrone
i18next.init(config);
const value = i18next.t('key'); // Peut retourner "key" si pas chargé

// ✅ CORRECT : Attendre init()
await i18next.init(config);
const value = i18next.t('key'); // Garanti de fonctionner

// ✅ CORRECT : Callback
i18next.init(config, (err, t) => {
  if (err) return console.error(err);
  const value = t('key');
});
```

#### C. Chargement parallèle

```javascript
// Protection contre saturation de sockets
i18next.init({
  maxParallelReads: 10, // Max 10 requêtes HTTP simultanées

  // Si 20 namespaces × 3 langues = 60 fichiers
  // Chargés par batch de 10
});
```

---

## 2.2 Resource Store : Architecture du magasin

### Structure de données interne

```javascript
// Représentation conceptuelle du ResourceStore
ResourceStore = {
  // Structure : langue → namespace → clés imbriquées
  fr: {
    common: {
      welcome: "Bienvenue",
      button: {
        save: "Enregistrer",
        cancel: "Annuler",
        delete: "Supprimer"
      },
      navigation: {
        home: "Accueil",
        profile: "Profil"
      }
    },
    errors: {
      required: "Ce champ est obligatoire",
      email: {
        invalid: "Email invalide"
      }
    }
  },
  en: {
    common: {
      welcome: "Welcome",
      button: {
        save: "Save",
        cancel: "Cancel",
        delete: "Delete"
      },
      navigation: {
        home: "Home",
        profile: "Profile"
      }
    },
    errors: {
      required: "This field is required",
      email: {
        invalid: "Invalid email"
      }
    }
  }
};
```

### Opérations CRUD

#### Lecture (interne lors de t())

```javascript
// API publique
const value = i18next.getResource('fr', 'common', 'button.save');
// Retourne : "Enregistrer"

// Récupération bundle complet
const bundle = i18next.getResourceBundle('fr', 'common');
// Retourne : { welcome: "Bienvenue", button: {...}, ... }

// Vérification existence
const exists = i18next.hasResourceBundle('fr', 'common');
// Retourne : true
```

#### Écriture dynamique

```javascript
// Ajouter une ressource unique
i18next.addResource('fr', 'common', 'newKey', 'Nouvelle valeur');

// Ajouter des ressources multiples
i18next.addResources('fr', 'common', {
  key1: 'Valeur 1',
  key2: 'Valeur 2'
});

// Ajouter un bundle complet
i18next.addResourceBundle('fr', 'admin', {
  users: {
    list: "Liste des utilisateurs",
    create: "Créer un utilisateur",
    edit: "Modifier l'utilisateur"
  },
  permissions: {
    manage: "Gérer les permissions"
  }
},
true,  // deep merge (fusionne avec existant)
true   // overwrite (remplace si conflit)
);
```

#### Suppression

```javascript
// Supprimer un bundle entier
i18next.removeResourceBundle('fr', 'admin');

// Note : Pas de méthode pour supprimer une clé individuelle
// Workaround : recharger le bundle sans la clé
```

#### Rechargement

```javascript
// Forcer le backend à re-télécharger
i18next.reloadResources(['fr', 'en'], ['common'])
  .then(() => {
    console.log('Ressources rechargées');
  });

// Recharger toutes les langues/namespaces
i18next.reloadResources();
```

### Gestion de la mémoire

```javascript
// Vérifier les ressources chargées
const languages = Object.keys(i18next.store.data);
// → ['fr', 'en']

languages.forEach(lng => {
  const namespaces = Object.keys(i18next.store.data[lng]);
  console.log(`${lng}: ${namespaces.join(', ')}`);
  // → fr: common, errors
  // → en: common, errors
});

// Libérer mémoire (supprimer langue inutilisée)
delete i18next.store.data['es']; // Si espagnol plus utilisé
```

---

## 2.3 Translation Resolution Flow (algorithme détaillé)

### Algorithme complet

```plaintext
FONCTION t(key, options)
│
├─ ÉTAPE 1 : NORMALISATION DES PARAMÈTRES
│  ├─ Extraction langue
│  │  • options.lng || i18next.language || fallbackLng
│  ├─ Extraction namespace
│  │  • options.ns || defaultNS
│  ├─ Construction fallback chains
│  │  • Langues : ['fr-CA', 'fr', 'en']
│  │  • Namespaces : ['specific', 'common']
│  └─ Normalisation clé
│     • String → [key]
│     • Array → [...keys]
│
├─ ÉTAPE 2 : BOUCLE DE RÉSOLUTION
│  │
│  └─ POUR CHAQUE LANGUE dans fallback chain
│     │
│     └─ POUR CHAQUE NAMESPACE dans fallback chain
│        │
│        └─ POUR CHAQUE CLÉ dans array de clés
│           │
│           └─ POUR CHAQUE VARIANTE de clé
│              │
│              ├─ SI count fourni
│              │  ├─ Tenter : key_context_zero (si count=0)
│              │  ├─ Tenter : key_context_one
│              │  ├─ Tenter : key_context_two
│              │  ├─ Tenter : key_context_few
│              │  ├─ Tenter : key_context_many
│              │  └─ Tenter : key_context_other
│              │
│              ├─ SI context fourni (sans count)
│              │  └─ Tenter : key_context
│              │
│              └─ Tenter : key (forme de base)
│              │
│              └─ SI TROUVÉ → ALLER À ÉTAPE 3
│
├─ ÉTAPE 3 : POST-TRAITEMENT (si valeur trouvée)
│  ├─ 3.1 Interpolation
│  │  • Remplacement {{variable}}
│  │  • Échappement XSS (si escapeValue: true)
│  │
│  ├─ 3.2 Nesting
│  │  • Résolution $t(autreClé)
│  │  • Récursion avec même contexte
│  │
│  ├─ 3.3 Formatage
│  │  • Application formatters (currency, datetime)
│  │  • Via Intl API
│  │
│  └─ 3.4 Post-processors
│     • sprintf, interval plurals, etc.
│     • Transformation finale
│
└─ ÉTAPE 4 : FALLBACK FINAL (si rien trouvé)
   ├─ SI options.defaultValue → retourner defaultValue
   ├─ SI returnNull: false → retourner clé brute
   └─ SINON → retourner null

RETOURNER valeur
```

### Code simplifié illustratif

```javascript
/**
 * Algorithme simplifié de résolution
 * (Code réel dans i18next beaucoup plus complexe)
 */
function resolveTranslation(key, options = {}) {
  // ÉTAPE 1 : Normalisation
  const languages = getLanguageFallbackChain(options.lng);
  const namespaces = getNamespaceFallbackChain(options.ns);
  const keys = Array.isArray(key) ? key : [key];

  // ÉTAPE 2 : Boucle de résolution
  for (const lng of languages) {
    for (const ns of namespaces) {
      for (const k of keys) {

        // Génération des variantes (pluriel, contexte)
        const variants = generateKeyVariants(k, options);
        // Ex: ['friend_male_other', 'friend_male', 'friend_other', 'friend']

        for (const variant of variants) {
          // Tentative de récupération depuis ResourceStore
          const value = resourceStore.getResource(lng, ns, variant);

          if (value !== undefined) {
            // ÉTAPE 3 : Post-traitement
            return postProcess(value, options);
          }
        }
      }
    }
  }

  // ÉTAPE 4 : Fallback final
  if (options.defaultValue) {
    return options.defaultValue;
  }

  if (i18next.options.returnNull === false) {
    return Array.isArray(key) ? key[0] : key;
  }

  return null;
}

/**
 * Génération des variantes de clés
 */
function generateKeyVariants(key, options) {
  const variants = [];
  const { count, context, ordinal } = options;

  // Avec count ET context
  if (count !== undefined && context) {
    const pluralSuffix = getPluralSuffix(count, ordinal);
    variants.push(`${key}_${context}_${pluralSuffix}`);
  }

  // Avec context seul
  if (context) {
    variants.push(`${key}_${context}`);
  }

  // Avec count seul
  if (count !== undefined) {
    const pluralSuffix = getPluralSuffix(count, ordinal);
    variants.push(`${key}_${pluralSuffix}`);
  }

  // Clé de base
  variants.push(key);

  return variants;
}

/**
 * Détermination du suffixe pluriel
 */
function getPluralSuffix(count, ordinal = false) {
  // Utilise Intl.PluralRules pour déterminer la forme
  const rule = new Intl.PluralRules(i18next.language, {
    type: ordinal ? 'ordinal' : 'cardinal'
  });

  const form = rule.select(count);
  // Retourne : 'zero', 'one', 'two', 'few', 'many', ou 'other'

  return form;
}
```

### Exemple de trace complète

```javascript
// Appel
i18next.t('friend', {
  count: 2,
  context: 'male',
  ns: 'social',
  lng: 'fr-CA'
});

// Configuration
{
  lng: 'fr-CA',
  fallbackLng: ['fr', 'en'],
  ns: ['social', 'common'],
  defaultNS: 'social',
  fallbackNS: 'common'
}

// Trace de résolution
[TRACE] Langues à tester : ['fr-CA', 'fr', 'en']
[TRACE] Namespaces à tester : ['social', 'common']
[TRACE] Clés à tester : ['friend']
[TRACE] Options : count=2, context='male'

[TRACE] lng='fr-CA', ns='social', variant='friend_male_other'
        → ResourceStore.get('fr-CA', 'social', 'friend_male_other')
        → undefined

[TRACE] lng='fr-CA', ns='social', variant='friend_male'
        → ResourceStore.get('fr-CA', 'social', 'friend_male')
        → undefined

[TRACE] lng='fr-CA', ns='social', variant='friend_other'
        → ResourceStore.get('fr-CA', 'social', 'friend_other')
        → undefined

[TRACE] lng='fr-CA', ns='social', variant='friend'
        → ResourceStore.get('fr-CA', 'social', 'friend')
        → undefined

[TRACE] lng='fr-CA', ns='common', variant='friend_male_other'
        → undefined

[... continue cascade ...]

[TRACE] lng='fr', ns='social', variant='friend_male_other'
        → ResourceStore.get('fr', 'social', 'friend_male_other')
        → "{{count}} amis"  ✅ TROUVÉ !

[TRACE] Post-traitement :
        - Interpolation : {{count}} → 2
        - Résultat final : "2 amis"

[RETURN] "2 amis"
```

---

## 2.4 Système de plugins

### Types de plugins et interfaces

#### A. Backend Plugin

**Responsabilité** : Charger les ressources de traduction depuis une source (HTTP, filesystem, localStorage, etc.)

**Interface** :

```javascript
class CustomBackend {
  // Type obligatoire
  type = 'backend';

  /**
   * Initialisation du backend
   * @param {Object} services - Services i18next (logger, etc.)
   * @param {Object} backendOptions - Options spécifiques au backend
   * @param {Object} i18nextOptions - Options globales i18next
   */
  init(services, backendOptions, i18nextOptions) {
    this.services = services;
    this.options = backendOptions;

    // Ex: Initialiser client HTTP, ouvrir connexion DB, etc.
  }

  /**
   * Charger une ressource (OBLIGATOIRE)
   * @param {String} language - Code langue (ex: 'fr')
   * @param {String} namespace - Nom du namespace (ex: 'common')
   * @param {Function} callback - callback(error, data)
   * @returns {Promise} ou utiliser callback
   */
  read(language, namespace, callback) {
    // Approche 1 : Callback
    fetch(`/api/translations/${language}/${namespace}`)
      .then(res => res.json())
      .then(data => callback(null, data))
      .catch(err => callback(err, null));

    // Approche 2 : Promise (i18next gère les deux)
    return fetch(`/api/translations/${language}/${namespace}`)
      .then(res => res.json());
  }

  /**
   * Charger plusieurs ressources simultanément (OPTIONNEL)
   */
  readMulti(languages, namespaces, callback) {
    // Optimisation : requête unique pour multiple lng/ns
    const promises = [];

    languages.forEach(lng => {
      namespaces.forEach(ns => {
        promises.push(this.read(lng, ns));
      });
    });

    Promise.all(promises)
      .then(results => callback(null, results))
      .catch(err => callback(err));
  }

  /**
   * Sauvegarder une clé manquante (OPTIONNEL)
   * Utilisé avec saveMissing: true
   */
  create(languages, namespace, key, fallbackValue) {
    languages.forEach(lng => {
      fetch(`/api/translations/${lng}/${namespace}`, {
        method: 'POST',
        body: JSON.stringify({ key, value: fallbackValue })
      });
    });
  }
}

// Utilisation
i18next.use(new CustomBackend()).init({ /* ... */ });
```

#### B. Language Detector Plugin

**Responsabilité** : Détecter la langue préférée de l'utilisateur

**Interface** :

```javascript
class CustomDetector {
  type = 'languageDetector';

  /**
   * Initialisation
   */
  init(services, detectorOptions, i18nextOptions) {
    this.services = services;
    this.options = detectorOptions;
  }

  /**
   * Détecter la langue (OBLIGATOIRE)
   * @returns {String|Array} Code langue ou array de langues préférées
   */
  detect() {
    // Exemple : Lire depuis un header personnalisé
    const customHeader = this.getCustomHeader();
    if (customHeader) return customHeader;

    // Fallback sur navigator
    return navigator.language;
  }

  /**
   * Persister le choix utilisateur (OPTIONNEL)
   * @param {String} lng - Langue à sauvegarder
   */
  cacheUserLanguage(lng) {
    // Exemple : Sauvegarder dans une API
    fetch('/api/user/preferences', {
      method: 'POST',
      body: JSON.stringify({ language: lng })
    });
  }

  /**
   * Méthodes utilitaires personnalisées
   */
  getCustomHeader() {
    // Exemple côté serveur Express
    if (typeof window === 'undefined' && this.req) {
      return this.req.headers['x-custom-language'];
    }
    return null;
  }
}
```

#### C. Post-Processor Plugin

**Responsabilité** : Transformer la valeur traduite après résolution

**Interface** :

```javascript
class CustomPostProcessor {
  type = 'postProcessor';
  name = 'customProcessor'; // Nom unique

  /**
   * Transformer la valeur (OBLIGATOIRE)
   * @param {String} value - Valeur traduite
   * @param {String} key - Clé de traduction
   * @param {Object} options - Options passées à t()
   * @param {Object} translator - Instance du translator
   * @returns {String} Valeur transformée
   */
  process(value, key, options, translator) {
    // Exemple : Convertir en majuscules
    if (options.uppercase) {
      return value.toUpperCase();
    }

    // Exemple : Ajouter des emojis
    if (options.emoji) {
      return `✨ ${value} ✨`;
    }

    return value;
  }
}

// Utilisation
i18next.use(new CustomPostProcessor()).init();

i18next.t('welcome', { postProcess: 'customProcessor', uppercase: true });
// → "BIENVENUE"
```

#### D. Formatter (via interpolation)

**Responsabilité** : Formater des valeurs lors de l'interpolation

```javascript
i18next.init({
  interpolation: {
    format: function(value, format, lng, options) {
      // Format personnalisé
      if (format === 'uppercase') return value.toUpperCase();
      if (format === 'lowercase') return value.toLowerCase();

      // Format date personnalisé
      if (format === 'shortDate') {
        return new Intl.DateTimeFormat(lng, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(value);
      }

      return value;
    }
  }
});

// Utilisation dans traductions
{
  "greeting": "Bonjour {{name, uppercase}}",
  "date": "Date : {{timestamp, shortDate}}"
}

i18next.t('greeting', { name: 'marie' });
// → "Bonjour MARIE"

i18next.t('date', { timestamp: new Date() });
// → "Date : 27 févr. 2026"
```

### Enregistrement et ordre

```javascript
// Ordre d'enregistrement important pour certains plugins
i18next
  .use(Backend)             // 1. Backend chargé en premier
  .use(LanguageDetector)    // 2. Puis détecteur
  .use(PostProcessor)       // 3. Puis post-processor
  .init({ /* ... */ });

// Chaînage de backends
import ChainedBackend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import HttpBackend from 'i18next-http-backend';

i18next
  .use(ChainedBackend)
  .init({
    backend: {
      backends: [
        LocalStorageBackend,  // Essaie d'abord localStorage
        HttpBackend           // Puis HTTP si pas en cache
      ],
      backendOptions: [
        { /* options localStorage */ },
        { /* options HTTP */ }
      ]
    }
  });
```

---

## 2.5 Abstractions principales

### Composants internes clés

#### 1. Translator

**Rôle** : Composant central coordonnant la résolution de traductions

**Responsabilités** :

- Appliquer l'algorithme de fallback (langue, namespace, clé)
- Générer les variantes de clés (pluriel, contexte)
- Orchestrer le post-traitement (interpolation, nesting, formatage)

**Méthodes principales** :

```javascript
// API interne (simplifiée)
class Translator {
  translate(keys, options) {
    // 1. Résolution de la clé
    const resolved = this.resolve(keys, options);

    // 2. Post-traitement
    return this.postProcess(resolved, options);
  }

  resolve(keys, options) {
    // Implémente l'algorithme de résolution décrit en 2.3
  }

  postProcess(value, options) {
    // Interpolation, nesting, formatage
  }
}
```

#### 2. ResourceStore

**Rôle** : Magasin in-memory des traductions

**Responsabilités** :

- Stocker la structure `{ langue: { namespace: { clés } } }`
- Exposer API CRUD pour manipulation
- Gérer la fusion (merge) de ressources

**Méthodes** : Voir section 2.2

#### 3. BackendConnector

**Rôle** : Adaptateur unifiant les différents backends

**Responsabilités** :

- Gérer la file d'attente de chargements
- Appeler backend.read() pour chaque combinaison langue/namespace
- Gérer les erreurs et retry
- Limiter le parallélisme (maxParallelReads)

**Workflow** :

```javascript
class BackendConnector {
  load(languages, namespaces, callback) {
    const toLoad = [];

    // Construire liste des combinaisons à charger
    languages.forEach(lng => {
      namespaces.forEach(ns => {
        if (!this.isLoaded(lng, ns)) {
          toLoad.push({ lng, ns });
        }
      });
    });

    // Charger avec limitation parallélisme
    this.loadBatch(toLoad, callback);
  }

  loadBatch(toLoad, callback) {
    const maxParallel = this.options.maxParallelReads || 10;
    const queue = [...toLoad];
    const results = {};

    const loadNext = () => {
      if (queue.length === 0) {
        return callback(null, results);
      }

      const batch = queue.splice(0, maxParallel);
      const promises = batch.map(({ lng, ns }) =>
        this.backend.read(lng, ns)
          .then(data => {
            results[`${lng}-${ns}`] = data;
          })
      );

      Promise.all(promises).then(loadNext);
    };

    loadNext();
  }
}
```

#### 4. LanguageUtils

**Rôle** : Utilitaires pour parser/normaliser codes de langue BCP-47

**Méthodes** :

```javascript
class LanguageUtils {
  // Générer chaîne de fallback pour une langue
  toResolveHierarchy(code, fallbackLng) {
    // 'fr-CA' → ['fr-CA', 'fr', 'en']
  }

  // Formatter code langue (normaliser)
  formatLanguageCode(code) {
    // 'fr_CA' → 'fr-CA'
    // 'FR-ca' → 'fr-CA'
  }

  // Vérifier si langue supportée
  isSupportedCode(code, supportedLngs) {
    // Vérifie dans liste supportedLngs
  }

  // Meilleure correspondance
  getBestMatchFromCodes(codes, supportedLngs) {
    // ['fr-CA', 'en-US'] vs ['fr', 'en'] → 'fr'
  }
}
```

#### 5. PluralResolver

**Rôle** : Déterminer la forme plurielle selon langue et count

**Basé sur** : `Intl.PluralRules` API

```javascript
class PluralResolver {
  constructor() {
    this.rules = {}; // Cache des PluralRules par langue
  }

  getRule(lng, ordinal = false) {
    const key = `${lng}-${ordinal ? 'ordinal' : 'cardinal'}`;

    if (!this.rules[key]) {
      this.rules[key] = new Intl.PluralRules(lng, {
        type: ordinal ? 'ordinal' : 'cardinal'
      });
    }

    return this.rules[key];
  }

  getSuffix(lng, count, ordinal = false) {
    const rule = this.getRule(lng, ordinal);
    const suffix = rule.select(count);

    // Retourne : 'zero', 'one', 'two', 'few', 'many', 'other'
    return suffix;
  }
}

// Utilisation interne
const resolver = new PluralResolver();
resolver.getSuffix('fr', 1);  // → 'one'
resolver.getSuffix('fr', 2);  // → 'other'
resolver.getSuffix('ar', 0);  // → 'zero'
resolver.getSuffix('ar', 11); // → 'many'
```

#### 6. Interpolator

**Rôle** : Remplacer placeholders, gérer échappement XSS, appliquer formatters

```javascript
class Interpolator {
  interpolate(str, data, lng, options) {
    // 1. Remplacement des variables
    str = this.replaceVariables(str, data, options);

    // 2. Échappement XSS (si activé)
    if (options.escapeValue !== false) {
      str = this.escape(str);
    }

    // 3. Application formatters
    str = this.applyFormatters(str, data, lng, options);

    return str;
  }

  replaceVariables(str, data, options) {
    const regex = /{{(.*?)}}/g;

    return str.replace(regex, (match, key) => {
      const value = this.getNestedValue(data, key.trim());
      return value !== undefined ? value : match;
    });
  }

  escape(str) {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };

    return str.replace(/[&<>"'/]/g, char => escapeMap[char]);
  }
}
```

---

## 2.6 Mécanismes d'extension et événements

### Système d'événements

i18next expose un EventEmitter permettant de réagir aux changements d'état.

#### Événements disponibles

```javascript
// 1. Initialisation complète
i18next.on('initialized', (options) => {
  console.log('i18next initialisé avec options:', options);
});

// 2. Ressources chargées
i18next.on('loaded', (loaded) => {
  console.log('Ressources chargées:', loaded);
  // loaded = { fr: { common: true, errors: true }, en: { ... } }
});

// 3. Échec de chargement
i18next.on('failedLoading', (lng, ns, msg) => {
  console.error(`Échec chargement ${lng}/${ns}:`, msg);
  // Envoyer à monitoring (Sentry, etc.)
});

// 4. Changement de langue
i18next.on('languageChanged', (lng) => {
  console.log(`Langue changée: ${lng}`);

  // MAJ attribut HTML
  document.documentElement.lang = lng;

  // MAJ direction (RTL/LTR)
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
});

// 5. Clé manquante
i18next.on('missingKey', (lngs, namespace, key, res) => {
  console.warn(`Clé manquante: ${namespace}:${key}`);

  // Analytics
  analytics.track('i18n_missing_key', {
    languages: lngs,
    namespace,
    key,
    fallback: res
  });
});

// 6. Ressources ajoutées
i18next.on('added', (lng, ns) => {
  console.log(`Ressources ajoutées: ${lng}/${ns}`);
});

// 7. Ressources supprimées
i18next.on('removed', (lng, ns) => {
  console.log(`Ressources supprimées: ${lng}/${ns}`);
});
```

### Pattern d'extension par composition

#### Extension via plugin tiers

```javascript
// Plugin de monitoring personnalisé
const monitoringPlugin = {
  type: '3rdParty',

  init(instance) {
    // Accès à l'instance i18next complète
    this.i18next = instance;

    // Écouter événements
    instance.on('languageChanged', (lng) => {
      this.trackLanguageChange(lng);
    });

    instance.on('missingKey', (...args) => {
      this.trackMissingKey(...args);
    });
  },

  trackLanguageChange(lng) {
    fetch('/api/analytics/language-change', {
      method: 'POST',
      body: JSON.stringify({ language: lng, timestamp: Date.now() })
    });
  },

  trackMissingKey(lngs, ns, key, res) {
    fetch('/api/analytics/missing-key', {
      method: 'POST',
      body: JSON.stringify({ lngs, namespace: ns, key })
    });
  }
};

i18next.use(monitoringPlugin).init({ /* ... */ });
```

#### Extension via middleware custom

```javascript
// Middleware pour logger toutes les traductions
const loggingMiddleware = {
  type: '3rdParty',

  init(instance) {
    // Wrapper la fonction t()
    const originalT = instance.t.bind(instance);

    instance.t = (...args) => {
      const [key, options] = args;
      const result = originalT(...args);

      console.log(`[i18n] t('${key}') → "${result}"`);

      return result;
    };
  }
};
```

### Hooks et interception

```javascript
// Intercepter résolution AVANT post-traitement
i18next.on('loaded', (loaded) => {
  // Modifier dynamiquement les ressources chargées
  Object.keys(loaded).forEach(lng => {
    Object.keys(loaded[lng]).forEach(ns => {
      const resources = i18next.getResourceBundle(lng, ns);

      // Transformer toutes les clés (ex: ajouter préfixe)
      const transformed = transformResources(resources);

      i18next.addResourceBundle(lng, ns, transformed, true, true);
    });
  });
});

function transformResources(obj, prefix = '') {
  const result = {};

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      result[key] = transformResources(obj[key], `${prefix}${key}.`);
    } else {
      // Exemple : ajouter préfixe debug
      result[key] = `[DEBUG:${prefix}${key}] ${obj[key]}`;
    }
  });

  return result;
}
```

---

**Fin de la section 2 - Architecture Interne de i18next**
