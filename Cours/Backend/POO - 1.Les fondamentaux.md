# LES BASE DE LA PROGRAMMATION ORIENTÉE OBJET (POO)

## 1. Les limites du code Procédural et l’intérêt de la POO
### Le Code Procédural (Les Limites 🚧)
Imaginez que vous construisez une ville. Avec l'approche procédurale (celle qui utilise principalement des fonctions indépendantes et des variables globales), toutes vos instructions (fonctions) pour construire des maisons, des routes, et gérer les habitants sont dispersées.

- **Le problème** : Au fur et à mesure que la ville grandit (que votre code devient plus gros), il devient difficile de savoir quelle fonction modifie quelle donnée. Les données et le comportement sont séparés, rendant le code plus fragile et difficile à réutiliser ou à modifier sans introduire de bugs.

### L’intérêt de la POO (La Solution ✨)
La **POO** (Programmation Orientée Objet) vous propose de modéliser votre code en **objets**. Un objet regroupe à la fois :

1. **Des données** (les caractéristiques, appelées ***attributs*** ou propriétés).

2. **Des actions** (les comportements, appelés ***méthodes***).

**L'avantage** : Chaque entité (un `Personnage`, une `Voiture`, un `CompteBancaire`) est autonome. Ses données sont directement liées à ses actions, ce qui rend le code plus **clair**, plus **organisé** et plus **facile à maintenir** et à **réutiliser**.

------

## 2. La syntaxe `class` pour définir un "Moule" à objets
En POO, pour créer plusieurs objets du même type (par exemple, plusieurs chiens), on utilise une **classe** comme un **plan** ou un **moule**.

La classe définit les attributs et les méthodes que tous les objets (appelés **instances**) créés à partir de ce moule posséderont.

Exemple :
```js
// La classe (le moule) pour tous les "Chiens"
class Chien {
  // Le constructeur est la fonction spéciale qui est appelée
  // lorsque l'on crée un nouveau Chien.
  constructor(nom, race) {
    this.nom = nom; // Attribut
    this.race = race; // Attribut
  }

  // Une méthode (comportement) que tous les Chiens peuvent faire
  aboyer() {
    return `${this.nom} dit : Wouaf ! Wouaf !`;
  }
}

// Création d'une instance (un objet concret)
const max = new Chien('Max', 'Labrador');
const felix = new Chien('Félix', 'Caniche');

console.log(max.aboyer()); // Affiche: Max dit : Wouaf ! Wouaf !
```

------

## 3. Le `constructor` pour initialiser une nouvelle instance
Le `constructor` (constructeur) est une méthode spéciale au sein de la classe. C'est la **première** et **unique** fonction appelée lorsque vous utilisez le mot-clé `new` pour créer un nouvel objet à partir de la classe.

- **Son rôle** : Il sert à **initialiser** les **attributs** de l'objet (lui donner ses valeurs de départ).

- Dans l'exemple ci-dessus, il reçoit le `nom` et la `race` et les attribue à l'instance qui est en train d'être créée via `this.nom = nom;`.

------

## 4. L'encapsulation pour protéger les données
L'**encapsulation** est un principe clé de la POO. Elle signifie que les données internes d'un objet (ses attributs) **devraient être cachées** et protégées des modifications directes et non contrôlées venant de l'extérieur.

- **Le but** : S'assurer que les données restent **cohérentes** et qu'elles ne sont modifiées que via les **méthodes** de l'objet, qui peuvent appliquer des règles de **validation**.

Par exemple, dans un objet `CompteBancaire`, on ne veut pas qu'on puisse changer le solde directement (`monCompte.solde = -10000;`). On doit passer par des méthodes comme `retirer()` ou `deposer()` qui vérifient si l'opération est possible.

------

## 5. Les attributs privés avec le préfixe `#`
Pour implémenter l'encapsulation en JavaScript, on utilise le préfixe ``#`` pour définir des **attributs privés**.

- **Ce que ça fait** : Un attribut défini avec ``#`` ne peut être accédé ou modifié que **depuis l'intérieur** de la classe elle-même. Si vous essayez de le lire ou de le modifier de l'extérieur, vous obtiendrez une erreur.

Exemple d'Attribut Privé :
```js
class CompteBancaire {
  // Attribut privé : le solde ne peut être modifié que par les méthodes internes
  #solde;

  constructor(montantInitial) {
    this.#solde = montantInitial;
  }

  // Méthode publique pour voir le solde
  voirSolde() {
    return `Le solde actuel est de : ${this.#solde} €`;
  }
}

const monCompte = new CompteBancaire(500);

console.log(monCompte.voirSolde()); // Fonctionne : Le solde actuel est de : 500 €

// console.log(monCompte.#solde); // ERREUR : Tentative d'accès à un attribut privé
// monCompte.#solde = 1000; // ERREUR : Tentative de modification
```

------

## 6. Les Getters et Setters pour contrôler l'accès aux données
Puisque les attributs privés (``#attribut``) ne sont pas accessibles directement, on utilise souvent des **getters** et des **setters** pour contrôler ***comment*** ces données sont lues et modifiées de l'extérieur.

- ``Getter`` (**l'Accesseur**) : Une méthode spéciale utilisée pour **lire** la valeur d'un attribut privé. Il commence par le mot-clé ``get``. Il permet d'effectuer des calculs ou des formats avant de retourner la donnée.

- Setter (**le Mutateur**) : Une méthode spéciale utilisée pour **modifier** la valeur d'un attribut privé. Il commence par le mot-clé ``set``. Il permet d'ajouter des **règles de validation** avant d'accepter une nouvelle valeur.

**Exemple de Getters et Setters**

Reprenons le ``CompteBancaire`` et ajoutons des méthodes pour déposer et retirer de l'argent de manière sécurisée.

```js
class CompteBancaire {
  #solde;

  constructor(montantInitial) {
    this.#solde = montantInitial;
  }

  // *** GETTER *** : Pour lire le solde (sans le laisser accessible directement)
  get solde() {
    // On pourrait ajouter des vérifications ou des formats ici
    return this.#solde;
  }

  // *** SETTER *** : Pour modifier le solde (avec une validation)
  set solde(montant) {
    if (montant < 0) {
      console.error("Erreur: Le solde ne peut pas être négatif directement.");
      return; // On bloque la modification
    }
    this.#solde = montant;
  }

  // Méthode métier
  deposer(montant) {
    this.#solde += montant;
  }
}

const compteEpargne = new CompteBancaire(100);

// Utilisation du GETTER : On y accède comme une propriété, mais c'est une méthode
console.log(`Solde initial: ${compteEpargne.solde} €`); // Affiche: 100 €

// Utilisation du SETTER : On l'appelle comme si on affectait une propriété
compteEpargne.solde = 50; // Le setter est appelé, il valide et met à jour le #solde
console.log(`Nouveau solde: ${compteEpargne.solde} €`); // Affiche: 50 €

// Tentative d'accès non sécurisé (bloqué par la validation du setter)
compteEpargne.solde = -10; // Affiche l'erreur dans la console
console.log(`Solde final: ${compteEpargne.solde} €`); // Reste à 50 €
```
