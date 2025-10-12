# La syntaxe Javascript

Rappel sur la séparation des concepts : 
- HTML => structure des contenus
- CSS => présentation des contenus (**mise en forme**)
- **Javascript => gestion des interactions** (entre l'utilisateur et le navigateur) + **évolution dynamique du contenu**

## Déclaration d'un variable
Pour créer une variable, on utilise un mot-clé : `let`, `const`

```
const nomDeVariable = valeur;

Exemple :
const age = 44;
let taille;
```

> On privilégiera `const` **autant que possible**.
>
> On se servira de `let` **uniquement lorsque la valeur initiale doit être modifiée** au cours de l’exécution.

## Types de variables
- `number` : Le type **number** désigne tous les nombres, entiers et décimaux
  
- `boolean` : Le type **booléen** ne peut prendre que 2 valeurs : **true** ou **false**
  
- `string` : Le type string désigne une chaine de caractères
  > "" et '' permettent d’encadrer une chaîne de caractères. Pas de différence entre les deux, en tout cas en JS. <br>
  > \ permet **d'échapper** les caractères spéciaux (par ex les " si je suis dans une chaîne délimitée par des "")

- `Array` : Le type **tableau**, c'est à dire une liste ordonnée
```
    // déclarer un tableau :
    const fruits = ["cerise", "banane", "kiwi"];
    
    // accéder à un élément du tableau avec la syntaxe [index] :
    fruits[0]; // => accède à "cerise"
    fruits[2]; // => accède à "kiwi"
```

- `Objets`
Un objet peut stocker de multiples valeurs (comme un tableau), mais chaque valeur est indexée non pas par un nombre, mais par un nom : sa clé.

> Convention de nommage pour les clés d’objets : **camelCase**

```
// déclarer un objet :
    const fruits = {
    superbon : "cerise",
    sucre : "banane",
    acide : "kiwi"
    };
```
> On parle de structure `cle: valeur`. Un objet contient zéro, une ou plusieurs paires de `cle: valeur`

En JS, on accède aux éléments d’un objet :
- avec la notation fruits["key"]
- avec la notation fruits.key

```
// Lire une valeur :
    fruits["acide"]; // retourne "kiwi"
// syntaxe alternative, résultat équivalent :
    fruits.acide;

// Modifier une valeur :
    fruits.acide = "citron";
```

## Type d'une variable
Le mot-clé `typeof` permet de vérifier **le type** d’une variable :

```
typeof 12 //=> "number"

typeof 'coucou' //=> "string"

typeof true //=> "boolean"
```

> Attention, `typeof` n’est pas une fonction : il n’y a pas de parenthèses, ***on n’écrit pas*** `typeof(12`) par exemple.

