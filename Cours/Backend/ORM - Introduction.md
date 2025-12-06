# Introduction aux ORM

## 1. Les Limites d’un Data Mapper Manuel 🧱
Dans un projet sans ORM, on doit écrire manuellement ce qu'on appelle un **Data Mapper** (ou Mappeur de Données).

- **Le Data Mapper Manuel** : C'est une couche de code (souvent des fonctions) dont le seul rôle est de faire la conversion dans les deux sens :

  1. **Objet vers SQL** : Prendre un objet JavaScript (ex: une instance de ``Utilisateur``) et construire la requête SQL ( ``INSERT`` ou ``UPDATE`` ) correspondante.

  2. **SQL vers Objet** : Prendre le résultat d'une requête SQL ( ``SELECT`` ) et le transformer en objets JavaScript utilisables.

- **Les Limites dans un Projet Complexe** :

  - **Répétition (Non-DRY)** : Il faut écrire et maintenir de très nombreuses lignes de code pour chaque table ( ``SELECT *``, ``INSERT INTO``, ``DELETE FROM``, etc.).

  - **Vulnérabilité aux Bugs** : Si vous changez le nom d'une colonne dans votre base de données, vous devez la corriger manuellement dans des dizaines de requêtes SQL différentes dans votre code.

  - **Sécurité** : Il faut gérer manuellement la protection contre les injections SQL (bien que des librairies d'accès à la base de données aident là-dessus).

------

## 2. Le Concept d’ORM : Un Traducteur Objet ↔️ SQL 🔄
L'**ORM** (Object-Relational Mapping) est une librairie logicielle qui automatise le Data Mapping. C'est le **traducteur** intelligent qui se place entre votre code orienté objet et votre base de données relationnelle.

- **Le Rôle de l'ORM** : Il vous permet de manipuler les données de votre base de données comme si c'étaient de simples **objets JavaScript**.

  - **Au lieu de** : Écrire la chaîne de caractères ``SQL SELECT * FROM utilisateurs WHERE id = 1;``

  - **Vous écrivez** : ``Utilisateur.findByPk(1)`` (une méthode sur une classe).

**Avantages de l'ORM**
- **Productivité** : Vous passez moins de temps à écrire du SQL répétitif.

- **Maintenabilité** : Le code est plus clair et utilise la syntaxe de votre langage (JS).

- **Portabilité** : Souvent, l'ORM peut être configuré pour parler à différentes bases de données (PostgreSQL, MySQL, SQLite) sans changer votre code JavaScript.

------

## Présentation de Sequelize comme Solution ORM pour Node.js
**Sequelize** est l'une des solutions ORM les plus populaires pour les applications **Node.js** qui utilisent des bases de données relationnelles.

- **Ce qu'il fait** : Il vous permet de définir vos modèles de données (vos "classes") en JavaScript, et Sequelize se charge de générer le SQL nécessaire pour communiquer avec la base de données (PostgreSQL, MySQL, MariaDB, SQLite, etc.).

------

## 4. L’Installation des Paquets sequelize et pg 📦
Pour utiliser Sequelize, vous avez besoin de deux éléments principaux (en supposant que vous utilisez PostgreSQL, d'où pg) :

1. ``sequelize`` : Le paquet principal qui contient toute la logique de l'ORM (classes, méthodes, etc.).

```bash
npm install sequelize
```

2. ``pg`` (ou ``mysql2``, ``sqlite3`` ...) : Le **driver** (ou connecteur) spécifique à la base de données que vous utilisez. C'est un petit logiciel que Sequelize utilise en interne pour établir la connexion et envoyer les commandes SQL brutes à votre base.
```bash
npm install pg
```

------

## 5. La Création et la Configuration d’une Instance de Sequelize ⚙️
Avant de pouvoir interagir avec la base de données, vous devez créer une **instance** de Sequelize et lui fournir les informations de connexion. Cette instance agit comme le point d'entrée unique pour toutes vos opérations de base de données.

**Exemple de Configuration**
```js
// 1. Importer la classe Sequelize
import { Sequelize } from 'sequelize';

// 2. Créer l'instance (le traducteur)
const sequelize = new Sequelize(
  'nom_de_la_db', // Nom de la base de données
  'utilisateur',  // Nom d'utilisateur
  'mot_de_passe', // Mot de passe
  {
    host: 'localhost', // Où se trouve la base de données
    dialect: 'postgres', // Quel type de base de données (doit correspondre au driver installé)
    logging: false // Désactive l'affichage des requêtes SQL générées
  }
);

export default sequelize;
```

Dans cet exemple, l'objet ``sequelize`` est maintenant configuré pour communiquer avec votre base de données PostgreSQL spécifique.

------

## 6. Le Test de la Connexion avec sequelize.authenticate() ✅
Une fois l'instance configurée, il est essentiel de vérifier que les paramètres de connexion sont corrects et que le serveur de base de données est accessible. C'est le rôle de la méthode **asynchrone** ``authenticate()``.

- **Fonctionnement** : ``sequelize.authenticate()`` tente d'établir une connexion.

  - Si la connexion réussit, la promesse est **résolue** (tout va bien).

  - Si la connexion échoue (mauvais mot de passe, base de données éteinte), la promesse est **rejetée** (il y a une erreur).

**Exemple de Connexion**
```js
async function connecterBaseDeDonnees() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès !');
  } catch (error) {
    console.error('Impossible de se connecter à la base de données :', error);
  }
}

connecterBaseDeDonnees();
```

C'est ainsi que vous mettez en place la fondation pour que vos objets JavaScript puissent interagir avec les tables de votre base de données relationnelle !