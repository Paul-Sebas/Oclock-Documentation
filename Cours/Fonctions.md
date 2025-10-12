# Réutiliser des blocs de codes grâce aux fonctions

Une fonction c'est un programme dans le programme, rien que ça :boom:

C'est un paquet d'instructions qu'on va pouvoir définir puis réutiliser à volonté par la suite à différents endroits de notre programme. Ainsi si un objectif doit être atteint plusieurs fois dans un programme à différents endroits il suffira de réemployer une même fonction, évitant ainsi les répétitions. De plus il sera possible de paramétrer les fonctions les rendant encore plus réutilisables.

## Déclaration

On définit un paquet d'instructions, tant qu'on ne l'execute pas ça ne fait rien, c'est juste en mémoire prêt à servir pour plus tard.

- On écrit `function` suivi du nom qu'on désire
- puis les parenthèses des paramètres (vides quand il n'y en a pas)
- et on délimite les instructions par une paire d'accolades

Cela donne

```js
// déclaration
function sayHello() {
  const user = 'Alexis';
  console.log('Bonjour');
  console.log(`Je suis ${user}`);
}
```

_Remarque_ : avec une bonne indentation on identifie plus facilement les instructions à l'intérieur de la fonction

## Execution

Executer une fonction c'est l'invoquer par son nom suivi de parenthèses pour executer une à une les instructions qu'elle contient sans avoir à les réécrire

```js
// execution -> seulement à ce moment les instructions de la fonction sont executées
sayHello();

// je peux ensuite faire d'autres choses dans mon programme
console.log('coucou');

// puis réexecuter ma fonction à volonté si j'en ai besoin
sayHello();
```

## Portée

Une variable définie en dehors d'une fonction est accessible dans une fonction

On parle alors de portée globale

```js
const user = 'Alexis';

function sayHello() {
  console.log(`Je suis ${user}`);
}
// Ok : on utilise une variable globale dans la fonction
```

Une variable définie dans une fonction n'est pas accessible en dehors de la fonction

On parle de portée locale à la fonction

```js
function sayHello() {
  const user = 'Alexis';
  console.log(`Je suis ${user}`); // Ok : on utilise une variable locale dans la fonction
}

console.log(user); // Pas ok -> en dehors je n'ai pas accès à la variable
```

Cela est en fait très pratique : _on peut si on veut appeler 2 variables de la même manière dans des fonctions différentes sans avoir peur d'écraser l'une ou l'autre._

## Paramètres

Reprenons notre fonction de départ

```js
// déclaration
function sayHello() {
  const user = 'Alexis';
  console.log('Bonjour');
  console.log(`Je suis ${user}`);
}
```

Elle est limitée puisqu'elle est spécifique à une valeur en dur, ici le nom de l'utilisateur.

En ajoutant un ou plusieurs paramètres on va laisser la possibilité de configurer les valeurs à l'exécution.

```js
// déclaration
// on prépare un paramètre, 
// ça s'écrit dans les parenthèses à la définition
// c'est comme une variable pour laquelle on ne connait pas encore la valeur, 
// on peut l'utiliser dans la suite de la fonction
// un paramètre aura une portée locale à la fonction
function sayHello(user) {
  console.log('Bonjour');
  console.log(`Je suis ${user}`);
}

// execution
// à l'execution on peut passer la valeur à donner au paramètre
// on dit qu'on passe un argument
sayHello('Alexis');
// ainsi à chaque execution on peut paramétrer la fonction différemment
sayHello('Loris');

// /!\ Attention : 
// comme toujours la valeur passée en argument peut très bien être dans une variable
const name = 'Marion';
sayHello(name); 
// on passe la VALEUR de name soit 'Marion', 
// on se fiche complètement que le nom de la variable soit le même ou pas que le nom du paramètre
```

On peut avoir plusieurs paramètres séparés par des virgules

```js
function sayHello(user, age) {
  console.log('Bonjour');
  console.log(`Je suis ${user}`);
  console.log(`J'ai ${age} ans`);
}
// à l'execution on passe autant d'arguments qu'il y a de paramètres, dans le bon ordre
sayHello('Alexis', 20);
```

## Retourner une valeur

- Une fonction contient un paquet d'instructions qui rempli un objectif qu'on peut nommer explicitement.
- Une fonction c'est réutilisable : il suffit de l'executer plusieurs fois.
- Une fonction c'est paramétrable.
- Une fonction ça travaille dans son coin, puisqu'une variable définie dans une fonction est locale à la fonction.
- **En plus une fonction ça peut retourner une valeur pour que cette valeur soit utilisable ailleurs dans le programme.**

On retourne une valeur avec le mot `return` suivi d'une expression donnant la valeur à retourner.

Le mot `return` marque la fin de l'execution de la fonction donc on le met plutôt à la fin de la fonction, toutes les instructions écrites après ne seront pas executées

```js
function sum(a, b) {
  const result = a + b;
  return result; // je retourne la VALEUR de result
  console.log('toto'); // comme return stoppe l'execution d'une fonction je ne verrais jamais ce message
}

// dans la suite de mon programme
// l'execution de ma fonction est en fait une expression qui donne la VALEUR de retour de ma fonction
console.log(sum(1, 2)); // 3

// je peux donc mémoriser cette valeur pour m'en servir par la suite comme n'importe quelle autre
const total = sum(5, 5);
console.log(total); // 10
```

[Support d'illustration](https://o-clock-teach.github.io/supports-fabio/support-fonctions/)

---

## Synthèse

- Une fonction c'est un paquet d'instructions qu'on pourra utiliser et réutiliser plus tard
- On définit une fonction avec le mot `function` suivi d'un nom, de paramètres entre parenthèses et d'instructions délimitées par des `{}`
- Pour que les instructions d'une fonction agissent, on doit l'executer `maFonction()`
- Une fonction a sa propre portée locale, ce qui est définit dedans ne l'est pas à l'extérieur
- Une fonction est paramétrable, on prépare des paramètres dans la définition de la fonction. A l'execution on passera les valeurs de ces paramètres en arguments
- Une fonction peut retourner une valeur avec le mot `return`, ainsi l'execution de la fonction est une expression qui est évaluée en cette valeur.