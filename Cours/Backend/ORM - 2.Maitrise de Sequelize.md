# Maîtrise de Sequelize

## 1. Définition des Modèles de Données avec ``sequelize.define()`` et ``DataTypes`` 📝
Un **Modèle** Sequelize est l'équivalent orienté objet d'une table dans votre base de données. Il définit les colonnes (attributs) et les types de données qu'elles contiennent.

Avec l'approche ES6 Module, vous définissez souvent chaque modèle dans un fichier séparé.

**Exemple de Définition de Modèle (dans ``models/User.js``)**

```js
import { DataTypes } from 'sequelize';

// La fonction reçoit l'instance de Sequelize configurée
export default (sequelize) => {
  const User = sequelize.define('User', {
    // Le nom de la table sera 'Users' par défaut
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50), // Une chaîne de caractères de 50 max
      allowNull: false, // Ne peut pas être nul
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    // Options du modèle
    tableName: 'users' // Nomme explicitement la table 'users'
  });

  return User;
};
```

- ``sequelize.define('User', { ... })`` : C'est la méthode utilisée pour créer la définition du modèle. Le premier argument est le nom du modèle (``User``).

- ``DataTypes`` : Un objet fourni par Sequelize pour définir le type de chaque colonne dans le langage SQL (ex: ``DataTypes.INTEGER`` devient ``INT``, ``DataTypes.STRING`` devient ``VARCHAR`` ).

------

## 2. Synchronisation du Schéma avec ``sequelize.sync()`` 🏗️
Une fois que vous avez défini vos modèles, vous devez indiquer à Sequelize de créer ou de mettre à jour les tables correspondantes dans la base de données PostgreSQL.

C'est le rôle de la méthode **asynchrone** ``sequelize.sync()``.

**Utilisation**

```js
// Dans votre fichier principal (ex: `index.js`) après avoir importé et configuré les modèles
async function initDatabase() {
  try {
    // Crée les tables si elles n'existent pas (option par défaut)
    await sequelize.sync(); 
    console.log("Base de données synchronisée ! Les tables sont prêtes.");
  } catch (error) {
    console.error("Erreur de synchronisation:", error);
  }
}

// Option `force: true` (à utiliser avec PRUDENCE) :
// await sequelize.sync({ force: true });
// Cette option supprime toutes les tables existantes et les recrée. Utile en développement.
```

------

## 3. Création des Associations entre les Modèles 🔗
Les associations définissent les relations entre vos tables (relations un-à-un, un-à-plusieurs, plusieurs-à-plusieurs). Elles permettent à Sequelize de savoir comment faire les jointures SQL nécessaires.

| Type d'Association | Description | Clé Étrangère (FK) | Exemple (Utilisateur ↔️ Post) |
|---|---|---|---|
| ``belongsTo`` | **Relation 1:N** : L'instance enfant appartient à un parent. | FK créée dans la **source** (enfant). | ``Post.belongsTo(User)`` (Un Post a un seul User, le FK ``UserId`` est dans la table ``posts`` ). |
| ``hasMany`` | **Relation 1:N** : L'instance parent possède plusieurs enfants. | FK créée dans la **cible** (enfant). | ``User.hasMany(Post)`` (Un User a plusieurs Posts). |
| ``belongsToMany`` | **Relation N:N** : Plusieurs instances se réfèrent à plusieurs autres instances. | Table de **jonction** créée par Sequelize. | ``User.belongsToMany(Role)`` (Un User a plusieurs Rôles, et un Rôle appartient à plusieurs Users). |

**Exemple de Définition d'Associations**

```js
// Après avoir défini les modèles User et Post
User.hasMany(Post, { 
  foreignKey: 'userId', // Précise le nom de la colonne FK dans la table Post
  as: 'articles' // Alias utilisé pour la jointure et l'accès
}); 

Post.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'author' 
});
```

## 4. Utilisation de l’option ``include`` pour Charger les Données Associées (Jointures) 🤝
Par défaut, lorsque vous récupérez un objet, Sequelize ne charge **pas** ses objets associés pour des raisons de performance (il ne fait pas de jointure). C'est ce qu'on appelle le **lazy loading**.

Pour charger les données associées en même temps (un **eager loading** via une jointure SQL), vous utilisez l'option ``include``.

**Exemple d'Utilisation de ``include``**

```js
// Trouver un post et inclure les données de son auteur (User)
const postWithAuthor = await Post.findByPk(1, {
  include: {
    model: User,
    as: 'author' // Important d'utiliser l'alias défini dans l'association
  }
});

console.log(postWithAuthor.title);
console.log(postWithAuthor.author.username); // Accès facile aux données de l'association
```

Vous pouvez inclure plusieurs associations et même des associations imbriquées. L'ORM génère automatiquement le ``LEFT JOIN`` ou ``INNER JOIN`` nécessaire en SQL.

## 5. Peuplement de la Base de Données (Seeding) 🌱
Le **Seeding** (Peuplement) est le processus d'insertion de données initiales dans la base de données pour la rendre fonctionnelle, souvent pour les tests ou la démonstration.

En général, cela consiste à créer un script qui utilise les méthodes Sequelize pour insérer les données.

**Exemple de Seeding**

```js
async function seedDatabase(User, Post) {
  // Création d'un nouvel utilisateur
  const john = await User.create({ username: 'JohnDoe', email: 'john@exemple.com' });

  // Création de posts associés à l'utilisateur
  await Post.bulkCreate([
    { title: 'Mon premier article', content: '...', userId: john.id },
    { title: 'Mon deuxième article', content: '...', userId: john.id },
  ]);

  console.log("Données de base insérées !");
}

// Appeler seedDatabase(User, Post) après la synchronisation (sequelize.sync())
```

## 6. Remplacement Complet de la Couche d’Accès aux Données Manuelle par Sequelize 🧰
L'objectif final de l'introduction de Sequelize est d'**éliminer** complètement le besoin d'écrire des requêtes SQL ou de manipuler des Data Mappers manuels.

**Avant (Manuelle)** :
```js
// Dans un Data Mapper :
// db.query('SELECT * FROM users WHERE username = $1', [username])
// .then(result => new User(result.rows[0]))
```

**Après (Avec Sequelize)** :
```js
// Dans un Contrôleur ou Service :
const user = await User.findOne({ 
  where: { username: 'JohnDoe' } 
});

if (user) {
  // Le résultat 'user' est une instance de la classe User,
  // avec toutes les méthodes et propriétés de l'objet.
  await user.destroy(); // Génère : DELETE FROM users WHERE id = user.id
}
```

En utilisant des méthodes comme ``create(``), ``findAll()``, ``findByPk()``, ``update()``, et ``destroy()``, vous manipulez directement des objets, et Sequelize se charge de l'interfaçage sécurisé et performant avec la base de données, atteignant ainsi le principe **DRY (Don't Repeat Yourself)**.