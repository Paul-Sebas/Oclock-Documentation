# Fonctions JS

## Interactions

### En fenetre
- `alert(message)` :
  Affiche une pop-up avec un message et un bouton `OK`


  ```
  alert('Hello !');
  ```

- `prompt()` :
  Affiche une pop-up / boîte de dialogue permettant à l’utilisateur de saisir une valeur, avec un bouton `OK` pour valider, et possibilité d’`Annuler`

    ```
    const name = prompt('Quel est ton nom ?', 'Entres ton nom içi');

    // name contiendra la chaîne de caractères entrée par l'utilisateur
    // si l'utilisateur a annulé, name vaut null
    ```

- `confirm()` : 
  Affiche une boîte de dialogue permettant à l’utilisateur de choisir entre `Annuler` et `OK`

    ```
    const confirmation = confirm('Êtes-vous sûr ?');

    // confirmation vaudra true (OK) ou false (Annuler)
    ```


### En console
- `console.log()` : affiche un message dans la console

- `console.info()` : affiche un message dans la console (dans l’onglet "info")

- `console.warn()` : affiche un message **d’avertissement** **(jaune avec icône)** dans la console

- `console.error()` : affiche un message **d’erreur** **(rouge avec icône d’erreur)** dans la console


## Fonctions sur les variables
- `Number(string)` : transforme une chaîne de caractère en nombre (ex : `Number('42') => 42`)

- `parseInt(string)` : transforme une chaîne de caractère en nombre (comme `Number()`), mais en plus, est capable de rechercher les chiffres en début de texte pour les transformer en nombre (ex : `parseInt('3 pommes') => 3`)


### Méthodes et propriétés des chaines de caractères

- **length** : Permet de récupérer la longueur d'une chaine de caractères

```
const chaine = 'Une phrase assez courte.';

console.log(chaine.length); // => 24
```

- **indexOf()** : Permet de récupérer le premier index d’un élément dans une chaîne de caractères

```
'fruits'.indexOf('i'); // => 3 (index 3 de la chaîne)
'fruits'.indexOf('a'); // => -1 ('a' n'est pas trouvé)
```

- **lastIndexOf()** : Permet de récupérer l’index de la position de la dernière occurrence d’un élément dans une chaîne de caractères

```
'banane'.lastIndexOf('a'); // => 3 (index 3 de la chaîne, ie. 4ème lettre)
'banane'.lastIndexOf('f'); // => -1 ('f' n'est pas trouvé, donc -1)
```


### Méthodes et propriétés des tableaux
- **length** : Permet de récupérer le nombre d'éléments que possède un tableau

```
const fruits = ['banane', 'clémentine', 'orange'];

console.log(fruits.length); // => 3
```

- **indexOf()** : Permet de récupérer l'index de la position de la première occurrence d'un élément dans un tableau

```
const fruits = ['banane', 'clémentine', 'orange'];

fruits.indexOf('orange'); // => 2 (index 2 du tableau fruits, ie. 3ème élément)
fruits.indexOf('banane'); // => 0 (index 0 du tableau fruits, ie. 1er élément)
fruits.indexOf('pomme'); // => -1 (pomme n'est pas trouvé, donc -1)
```


### Module `Math`

- `Math.random()` : génère un nombre aléatoire entre 0 (inclus) et 1 (exclu)

- `Math.round()` : arrondi un nombre à l’entier le plus proche

- `Math.floor()` : arrondi un nombre à l’entier inférieur

- `Math.ceil()` : arrondi un nombre à l’entier supérieur
