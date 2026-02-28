# 4. Implémentation Côté React

## 4.1 Installation des dépendances

```bash
# i18next core
npm install i18next

# Intégration React officielle
npm install react-i18next

# Backend HTTP (charger depuis serveur Express)
npm install i18next-http-backend

# Détection langue navigateur
npm install i18next-browser-languagedetector
```

### Justification des choix

**react-i18next** : Bindings officiels React (hooks, HOC, composant Trans, re-render automatique)

**i18next-http-backend** : Charge JSON depuis endpoints HTTP Express

**i18next-browser-languagedetector** : Détecte langue (localStorage, cookie, navigator)

---

## 4.2 Configuration i18next React

Voir [section 03-implementation-express.md](./03-implementation-express.md) pour configuration serveur.

**Fichier `src/i18n.js`** :

```javascript
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)  // OBLIGATOIRE pour React
  .init({
    fallbackLng: 'en',
    supportedLngs: ['fr', 'en'],
    ns: ['common', 'errors'],
    defaultNS: 'common',

    backend: {
      loadPath: 'http://localhost:3000/locales/{{lng}}/{{ns}}.json'
    },

    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie']
    },

    react: {
      useSuspense: true
    },

    interpolation: {
      escapeValue: true  // Protection XSS
    }
  });

export default i18next;
```

---

## 4.3 Intégration dans l'application

**Fichier `src/index.js`** :

```javascript
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';  // Initialise i18next

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Chargement...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);
```

---

## 4.4 Utilisation via Hooks (useTranslation)

### Hook de base

```javascript
import { useTranslation } from 'react-i18next';

function Welcome() {
  const { t, i18n, ready } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('greeting', { name: 'Marie' })}</p>
      <p>{t('item', { count: 5 })}</p>
      <p>Langue : {i18n.language}</p>
    </div>
  );
}
```

### Hook avec namespace

```javascript
function ErrorMessage({ code }) {
  const { t } = useTranslation('errors');

  return (
    <div className="alert">
      {t(`server.${code}`, { defaultValue: t('server.generic') })}
    </div>
  );
}
```

### Hook avec keyPrefix

```javascript
function UserForm() {
  const { t } = useTranslation('common', { keyPrefix: 'forms.user' });

  return (
    <form>
      <label>{t('email')}</label>
      {/* Résout: common:forms.user.email */}
      <input placeholder={t('emailPlaceholder')} />
    </form>
  );
}
```

---

## 4.5 Utilisation via HOC (withTranslation)

Pour composants de classe ou legacy code :

```javascript
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

class Profile extends Component {
  handleSubmit = () => {
    const { t } = this.props;
    alert(t('profile.saved'));
  };

  render() {
    const { t, i18n } = this.props;

    return (
      <div>
        <h1>{t('profile.title')}</h1>
        <p>{t('profile.greeting', { name: this.props.user.name })}</p>

        <button onClick={this.handleSubmit}>
          {t('button.save')}
        </button>

        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>
    );
  }
}

// HOC injecte props : t, i18n, tReady
export default withTranslation()(Profile);

// Avec namespace et options
// export default withTranslation('profile', { keyPrefix: 'settings' })(Profile);
```

---

## 4.6 Composant Trans pour JSX complexe

### Problématique

Interpoler du JSX dans traductions (liens, gras, etc.).

### Solution avec <Trans>

**Fichier de traduction** :

```json
{
  "agreement": "J'accepte les <1>conditions d'utilisation</1> et la <3>politique de confidentialité</3>."
}
```

**Composant React** :

```javascript
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

function SignupForm() {
  return (
    <Trans i18nKey="agreement">
      J'accepte les
      <Link to="/terms">conditions d'utilisation</Link>
      et la
      <Link to="/privacy">politique de confidentialité</Link>.
    </Trans>
  );
}
```

**Résultat** : Les balises `<1>` et `<3>` sont remplacées par les composants `<Link>`.

### Avec interpolation

**Traduction** :

```json
{
  "itemsCount": "Vous avez <strong>{{count}}</strong> articles dans votre panier."
}
```

**Composant** :

```javascript
<Trans i18nKey="itemsCount" count={items.length}>
  Vous avez <strong>{{ count: items.length }}</strong> articles.
</Trans>
```

---

## 4.7 Gestion dynamique du changement de langue

### Sélecteur de langue

```javascript
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
      .then(() => {
        console.log(`Langue changée: ${lng}`);
        // MAJ attribut HTML
        document.documentElement.lang = lng;
      })
      .catch(err => console.error('Erreur changement langue:', err));
  };

  return (
    <div>
      <button
        onClick={() => changeLanguage('fr')}
        disabled={i18n.language === 'fr'}
      >
        Français
      </button>

      <button
        onClick={() => changeLanguage('en')}
        disabled={i18n.language === 'en'}
      >
        English
      </button>
    </div>
  );
}
```

### Effet sur l'application

1. `i18n.changeLanguage('fr')` déclenche :
   - Chargement ressources `fr` (si pas déjà chargées)
   - Événement `languageChanged`
   - **Re-render automatique** de tous composants avec `useTranslation`

2. Le plugin `initReactI18next` écoute et force les re-renders

**Persistance** : Si `detection.caches: ['localStorage']`, le choix est automatiquement sauvegardé.

---

## 4.8 Synchronisation avec le backend

### Stratégie 1 : Backend comme source de vérité

```javascript
// Configuration pointant vers Express
backend: {
  loadPath: 'http://localhost:3000/locales/{{lng}}/{{ns}}.json'
}
```

**Avantages** : Fichiers centralisés, mises à jour sans rebuild
**Inconvénient** : Latence requête HTTP initiale

### Stratégie 2 : Ressources bundlées + backend

```javascript
import commonFR from './locales/fr/common.json';
import commonEN from './locales/en/common.json';

i18next.use(HttpBackend).init({
  resources: {
    fr: { common: commonFR },  // Bundlé (instantané)
    en: { common: commonEN }
  },
  partialBundledLanguages: true,  // Backend pour autres NS
  backend: {
    loadPath: 'http://localhost:3000/locales/{{lng}}/{{ns}}.json'
  }
});
```

### Stratégie 3 : Chained backend (cache + HTTP)

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
        expirationTime: 7 * 24 * 60 * 60 * 1000  // Cache 7 jours
      },
      {
        loadPath: 'http://localhost:3000/locales/{{lng}}/{{ns}}.json'
      }
    ]
  }
});
```

---

## 4.9 Gestion des états asynchrones

### Solution 1 : Suspense (recommandé)

```javascript
<Suspense fallback={<LoadingSpinner />}>
  <App />
</Suspense>
```

### Solution 2 : Vérification manuelle via ready

```javascript
function MyComponent() {
  const { t, ready } = useTranslation();

  if (!ready) {
    return <div>Chargement...</div>;
  }

  return <h1>{t('title')}</h1>;
}
```

### Solution 3 : Désactiver Suspense

```javascript
// Configuration
i18next.init({
  react: {
    useSuspense: false
  }
});

// Dans composants
function MyComponent() {
  const { t, ready } = useTranslation();

  return (
    <div>
      {ready ? t('title') : 'Loading...'}
    </div>
  );
}
```

### Chargement de namespaces supplémentaires

```javascript
import { useState, useEffect } from 'react';

function AdminPanel() {
  const { t, i18n } = useTranslation();
  const [adminLoaded, setAdminLoaded] = useState(false);

  useEffect(() => {
    i18n.loadNamespaces('admin')
      .then(() => setAdminLoaded(true))
      .catch(err => console.error(err));
  }, [i18n]);

  if (!adminLoaded) {
    return <div>Chargement panneau admin...</div>;
  }

  return (
    <div>
      <h1>{t('admin:title')}</h1>
    </div>
  );
}
```

---

**Fin de la section 4 - Implémentation React**
