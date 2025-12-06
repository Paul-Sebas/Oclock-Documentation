# POO - Architecture Objet

## 1. Le Principe DRY (Don’t Repeat Yourself) 🚫🔁
Le principe **DRY** (pour **Don't Repeat Yourself**, ou "Ne vous répétez pas") est une règle fondamentale de l'ingénierie logicielle, pas seulement de la POO.

- **Le Concept** : Chaque élément d'information (une donnée, une logique de validation, une méthode) doit avoir une **représentation unique** et **non ambiguë** au sein du système.

- **Pourquoi** ? Si vous copiez-collez le même bloc de code à plusieurs endroits, et qu'une erreur y est trouvée ou qu'une modification est nécessaire, vous devrez la faire partout. Cela introduit des risques d'oublier une copie ou de créer des incohérences.

- **La POO et DRY** : L'**Héritage** est l'un des mécanismes principaux de la POO pour respecter le principe DRY, en permettant de **factoriser** (regrouper) le code commun à plusieurs entités.

------

## 2. L’Héritage pour Factoriser le Code entre les Classes 🧬
L'**Héritage** permet à une nouvelle classe (appelée **classe enfant**, **classe dérivée** ou **sous-classe**) d'acquérir les attributs et les méthodes d'une autre classe existante (appelée **classe parent**, **classe de base** ou **super-classe**).

- **Analogie** : C'est comme l'héritage génétique. Si vous avez une classe générale ``Animal``, tous les animaux ont un attribut ``nom`` et une méthode ``manger()``. Les classes spécifiques comme ``Chien`` ou ``Chat`` peuvent **hériter** de ces propriétés communes, au lieu de les réécrire.

**Intérêt**

L'héritage permet de :

- **Respecter DRY** : Éviter de réécrire la logique commune.
- **Structurer le Code** : Établir une hiérarchie logique (ex: ``Véhicule`` > ``Voiture`` > ``Berline``).

------

## 3. Le mot-clé ``extends`` pour Définir une Classe Enfant
En Javascript, le mot clé `extends` pour indiquer qu'une classe hérite d'une autre.

**Exemple :** 
```js
// La classe Parent (Super-classe)
class Animal {
  constructor(nom) {
    this.nom = nom;
  }

  manger() {
    return `${this.nom} est en train de manger.`;
  }
}

// La classe Enfant (Sous-classe) qui hérite de Animal
class Chien extends Animal {
  constructor(nom, race) {
    // 1. Appel au constructeur parent (voir point 4)
    super(nom);
    // 2. Initialisation des attributs spécifiques
    this.race = race;
  }

  // Ajout d'une méthode spécifique au Chien
  aboyer() {
    return `Wouaf ! Wouaf !`;
  }
}

const max = new Chien('Max', 'Labrador');

console.log(max.manger()); // Le Chien utilise la méthode héritée de Animal
// Affiche : Max est en train de manger.
console.log(max.aboyer()); // Le Chien utilise sa propre méthode
// Affiche : Wouaf ! Wouaf !
```

------

## 4. L’opérateur ``super()`` pour Appeler le Constructeur Parent
Lorsqu'une classe enfant a son propre ``constructor``, elle doit **obligatoirement** appeler le constructeur de sa classe parent **avant** d'utiliser ``this`` ou d'initialiser ses propres attributs. C'est le rôle de ``super()``.

- ``super(arguments...)`` : Il exécute le ``constructor`` de la classe parent avec les arguments nécessaires (dans notre exemple, le ``nom``). Cela permet à la classe parent de faire son travail d'initialisation (ici, définir ``this.nom = nom;``).

- **Règle essentielle** : Si une classe enfant a un ``constructor``, ``super()`` doit être la **première instruction** à l'intérieur de celui-ci.

------

## 5. Les Membres ``static`` (Méthodes et Propriétés)
Jusqu'à présent, tous les attributs et méthodes que nous avons vus appartiennent à une **instance** spécifique (ex: ``max`` est une instance de ``Chien``).

Les membres ``static`` (statiques) sont différents :

- Ils appartiennent à la **classe elle-même** (le moule), et non aux objets individuels (les instances).

- Ils sont appelés **directement sur la classe** et ne nécessitent pas de créer une instance.

- Ils sont parfaits pour les fonctions utilitaires ou les constantes qui sont liées conceptuellement à la classe mais ne dépendent pas des données d'un objet spécifique.

**Exemple de Membres Statiques**
```js
class UtilitaireMaths {
  // Propriété statique (constante pour la classe)
  static #PI = 3.14159; 

  // Méthode statique (fonction utilitaire)
  static calculerAireCercle(rayon) {
    // Une méthode statique accède aux autres membres statiques via 'this' ou le nom de la classe
    return this.#PI * rayon * rayon; 
  }

  // Méthode statique pour la validation
  static estValide(valeur) {
    return typeof valeur === 'number' && valeur > 0;
  }
}

// Utilisation (sans créer d'instance)
const aire = UtilitaireMaths.calculerAireCercle(5);
console.log(`L'aire d'un cercle de rayon 5 est : ${aire}`);
// Affiche : L'aire d'un cercle de rayon 5 est : 78.53975

// console.log(new UtilitaireMaths().calculerAireCercle(5)); // ERREUR : La méthode n'existe pas sur l'instance
```

------

## L’Application de l’Héritage à l’Architecture des Contrôleurs
Dans une architecture logicielle (comme une application web utilisant le modèle MVC), les **contrôleurs** gèrent la logique entre la vue (affichage) et le modèle (données).

L'héritage est très utile pour structurer ces contrôleurs :

1. **Classe ``BaseController`` (Classe Parent)** :

- Contient les méthodes et propriétés **communes** à tous les contrôleurs de l'application (ex : un attribut ``#db`` pour la connexion à la base de données, une méthode pour gérer les erreurs, ou pour vérifier si l'utilisateur est connecté).

2. **Classes Spécifiques (Classes Enfants)** :

- ``UserController`` ``extends`` ``BaseController``

- ``ProductController`` ``extends`` ``BaseController``

- ``AuthController`` ``extends`` ``BaseController``

Chaque contrôleur spécifique hérite ainsi de la logique de base et n'a besoin d'implémenter que les méthodes uniques à son domaine (ex: ``getUtilisateur(id)`` ou ``creerProduit()`` ). Cela garantit que toutes les fonctionnalités partagées (DRY) sont gérées de manière cohérente au même endroit ( ``BaseController`` ).