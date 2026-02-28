# 5. Intégration Full-Stack Express + React

## 5.1 Source de vérité linguistique

### Modèle recommandé : Backend comme source unique

**Architecture** :

```plaintext
projet/
├── locales/          # ← SOURCE DE VÉRITÉ
│   ├── fr/
│   │   ├── common.json
│   │   ├── errors.json
│   │   └── emails.json
│   └── en/
│       └── ...
├── server/
│   ├── routes/locales.js    # Expose /locales/:lng/:ns.json
│   └── app.js
└── client/
    └── src/i18n.js          # Pointe vers http://localhost:3000/locales/
```

**Route Express pour exposer traductions** :

```javascript
// server/routes/locales.js
const express = require('express');
const router = express.Router();

router.get('/:lng/:ns.json', async (req, res) => {
  const { lng, ns } = req.params;

  // SÉCURITÉ : Whitelist stricte
  if (!['fr', 'en'].includes(lng) || !['common', 'errors'].includes(ns)) {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    const bundle = req.i18n.getResourceBundle(lng, ns);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache 24h
    res.json(bundle);
  } catch (error) {
    res.status(404).json({ error: 'Translation not found' });
  }
});

module.exports = router;
```

**Configuration React** :

```javascript
// client/src/i18n.js
i18next.use(HttpBackend).init({
  backend: {
    loadPath: 'http://localhost:3000/locales/{{lng}}/{{ns}}.json'
  }
});
```

**Avantages** :

- ✅ Cohérence SSR/CSR (mêmes fichiers)
- ✅ Mise à jour sans rebuild client
- ✅ Contrôle serveur (validation, rate limiting)

---

## 5.2 Stratégies SSR vs CSR

### Client-Side Rendering (CSR)

**Workflow** :

1. Serveur envoie HTML minimal
2. React monte, i18next détecte langue
3. i18next charge traductions (requête HTTP)
4. Composants s'affichent avec traductions

**Avantages** : Simple, découplage total
**Inconvénients** : FOUC (Flash Of Untranslated Content), SEO dégradé

### Server-Side Rendering (SSR avec Next.js)

**Configuration** :

```javascript
// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en']
  }
};

// pages/_app.js
import { appWithTranslation } from 'next-i18next';
export default appWithTranslation(MyApp);

// pages/index.js
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
}
```

**Avantages** : SEO optimal, pas de FOUC
**Inconvénients** : Complexité accrue

### Hybride : Critical + Lazy

```javascript
import commonFR from './locales/fr/common.json';
import commonEN from './locales/en/common.json';

i18next.use(HttpBackend).init({
  resources: {
    fr: { common: commonFR },  // Bundlé (instant)
    en: { common: commonEN }
  },
  partialBundledLanguages: true,  // Backend pour autres NS
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  }
});
```

---

## 5.3 Gestion du cache

### Cache HTTP (navigateur)

```javascript
// Serveur
res.setHeader('Cache-Control', 'public, max-age=86400'); // 24h
res.setHeader('ETag', generateETag(content));
```

### Cache localStorage (client)

```javascript
import ChainedBackend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import HttpBackend from 'i18next-http-backend';

i18next.use(ChainedBackend).init({
  backend: {
    backends: [
      LocalStorageBackend,  // Essaie localStorage d'abord
      HttpBackend           // Puis HTTP si pas en cache
    ],
    backendOptions: [
      {
        expirationTime: 7 * 24 * 60 * 60 * 1000,  // 7 jours
        versions: { fr: 'v1.2', en: 'v1.2' }      // Versioning
      },
      {
        loadPath: '/locales/{{lng}}/{{ns}}.json'
      }
    ]
  }
});
```

### Invalidation via versioning

```javascript
// Endpoint version côté serveur
app.get('/locales/version', (req, res) => {
  res.json({ version: process.env.TRANSLATIONS_VERSION || '1.0' });
});

// Client : vérification au démarrage
useEffect(() => {
  fetch('/locales/version')
    .then(res => res.json())
    .then(({ version }) => {
      if (localStorage.getItem('i18next_version') !== version) {
        localStorage.clear();
        localStorage.setItem('i18next_version', version);
        window.location.reload();
      }
    });
}, []);
```

---

## 5.4 Optimisations de performance

### A. Code splitting par namespace

```javascript
const AdminPanel = lazy(() => {
  i18n.loadNamespaces('admin');
  return import('./components/AdminPanel');
});
```

### B. Compression serveur

```javascript
const compression = require('compression');
app.use(compression()); // Gzip automatique
```

### C. CDN pour fichiers statiques

```javascript
backend: {
  loadPath: 'https://cdn.example.com/locales/{{lng}}/{{ns}}.json'
}
```

### D. Préchargement stratégique

```html
<link rel="preload" href="/locales/fr/common.json" as="fetch" crossorigin>
```

### E. Bundle splitting webpack

```javascript
// webpack.config.js
optimization: {
  splitChunks: {
    cacheGroups: {
      i18n: {
        test: /[\\/]locales[\\/]/,
        name: 'i18n',
        chunks: 'all'
      }
    }
  }
}
```

---

## 5.5 Impacts SEO

### Solution 1 : SSR (optimal)

- HTML complet traduit pour chaque langue
- URLs distinctes (`/fr/about`, `/en/about`)
- Balises `<link rel="alternate" hreflang="fr">`

### Solution 2 : CSR + pre-rendering

```bash
npm install react-snap

# package.json
{
  "scripts": {
    "postbuild": "react-snap"
  },
  "reactSnap": {
    "include": ["/fr", "/fr/about", "/en", "/en/about"]
  }
}
```

### Solution 3 : Métadonnées dynamiques

```javascript
import { Helmet } from 'react-helmet';

function About() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Helmet>
        <html lang={i18n.language} />
        <title>{t('about.title')}</title>
        <meta name="description" content={t('about.description')} />
        <link rel="alternate" hreflang="fr" href="https://example.com/fr/about" />
        <link rel="alternate" hreflang="en" href="https://example.com/en/about" />
      </Helmet>
      <h1>{t('about.heading')}</h1>
    </>
  );
}
```

---

## 5.6 Sécurité des ressources de traduction

### Vecteurs d'attaque et protections

#### A. Injection XSS via traductions

```javascript
// ✅ SAFE (escapeValue: true par défaut en React)
interpolation: { escapeValue: true }

const userInput = "<script>alert('XSS')</script>";
t('greeting', { name: userInput });
// → "Bonjour &lt;script&gt;..."
```

#### B. Path traversal sur endpoint locales

```javascript
// ❌ VULNÉRABLE
app.get('/locales/:lng/:ns', (req, res) => {
  const file = `./locales/${req.params.lng}/${req.params.ns}.json`;
  res.sendFile(file); // Attaque : /locales/../../etc/passwd/x
});

// ✅ SÉCURISÉ
app.get('/locales/:lng/:ns', (req, res) => {
  const { lng, ns } = req.params;

  if (!['fr', 'en'].includes(lng) || !['common', 'errors'].includes(ns)) {
    return res.status(404).end();
  }

  const file = path.join(__dirname, 'locales', lng, `${ns}.json`);
  res.sendFile(file);
});
```

#### C. CSRF sur saveMissing

```javascript
// ✅ SAFE : Désactiver en production
const isProd = process.env.NODE_ENV === 'production';
i18next.init({
  saveMissing: !isProd
});
```

### Recommandations

- ✅ Valider/sanitiser toutes les entrées utilisateur
- ✅ Whitelist stricte pour langues/namespaces
- ✅ `escapeValue: true` côté client
- ✅ Désactiver `saveMissing` en production
- ✅ Audit régulier des fichiers de traduction

---

**Fin de la section 5 - Intégration Full-Stack**
