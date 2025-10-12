# Décider ou répéter : les blocs

Par défaut toutes nos instructions s'executent les unes après les autres dans l'ordre.

On va voir qu'il est possible de délimiter un morceau de code en créant ce qu'on appelle un bloc, et surtout qu'il sera possible de contrôler ce bloc ; en décidant si on l'execute ou non ou encore si on souhaite le répéter.

## Les conditions

Avec une condition, on décide si oui ou non on execute un bloc de code

### Si : `if`

Derrière un if on écrit entre `()` une expression qui donne vrai ou faux pour savoir si oui ou non on execute le bloc de code associé. 

Un bloc de code c'est une série d'instructions délimitée par des `{}`.

```js
let isOpen = true;

if (isOpen) {
  console.log('le resto est ouvert'); // je verrais ce message car isOpen est vrai
}

let isFree = false;

if (isFree) {
  console.log('le resto est gratuit'); // je ne verrais pas ce message car isFree est faux
}

let amount = 5;

if (isOpen && amount > 2) {
  console.log('je peux payer et entrer'); // je verrais ce message car l'expression du if est une opération qui donne la valeur true
}
```

Chaque bloc contrôlé par un if est évalué indépendamment des autres.

Les `let` et les `const` ont une portée de bloc. C'est à dire qu'une `let` ou une `const` définit dans un bloc, n'existe qu'au sein de ce bloc. Pratique pour avoir des variables de même nom dans des blocs différents sans conflits. 
Une `let` ou une `const` définit en dehors d'un bloc est quant à elle globale à tout le script.

```js
// Cette variable est globale car pas dans un bloc
let value = 123;

if (value > 50) {
  let sentence = 'ok';
  console.log(value); // ok car elle est globale
  console.log(sentence); // ok car on est toujours dans le même bloc
}

console.log(value); // ok car elle est globale
console.log(sentence); // pas ok car on n'est plus dans le bloc
```

#### Sinon : `else`

Directement à la suite d'un if _on peut_ placer un bloc contrôlé par un else. Il sera executé si le if précédent n'est pas vérifié. Un else est dépendant d'un if, il n'a donc pas de sens s'il n'est pas précédé d'un if.

```js
let isOpen = true;

if (isOpen) {
  console.log('le resto est ouvert'); // je verrais ce message car isOpen est vrai
}
else { // il n'y a pas d'expression à associer à else
  console.log('le rest est fermé'); // je ne verrais pas ce message car on est entré dans le if
}

let isFree = false;

if (isFree) {
  console.log('le resto est gratuit'); // je ne verrais pas ce message car isFree est faux
}
else {
  console.log('le resto est payant'); // par conséquent je verrais celui ci
}
```

#### Sinon si : `else if`

On n'est pas limité à 2 possibilités avec if et else. On peut placer autant de else if qu'on le souhaite entre les deux pour prévoir des cas alternatifs.

Dès qu'on entre dans un if ou un else if, les else if ou else qui suivent directement sont ignorés.

```js
let amount = 15;

if (amount === 0) { // je n'entre pas
  console.log('le montant est nul'); 
}
else if (amount < 10) { // je n'entre pas non plus
  console.log('le montant est faible');
}
else if (amount < 20) { // j'entre
  console.log('le montant est correct');
}
else if (amount < 30) { // du coup tout ce qui suit n'est pas évalué
  console.log('le montant est large'); 
}
else {
  console.log('le montant est excessif');
}

console.log('reprise'); // je reprends ensuite ici
```

Comme toujours la [documentation mdn](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/if...else) nous aidera à retrouver ces informations

### `switch`

L'instruction [switch](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/switch) peut être une alternative à plein de if/else if lorsqu'on effectue des tests d'égalités.

Si j'ai une succession d'égalités

```js
let role = 'redacteur';

if (role === 'admin') {
  console.log('Tous les accès');
}
else if (role === 'moderateur') {
  console.log('Accès à la modération');
}
else if (role === 'redacteur') {
  console.log('Accès à la rédaction');
}
else {
  console.log('Accès à rien');
}
```

Je peux l'écrire sous forme de switch si je préfère, plus besoin d'écrire d'opérateur, ce sera forcemment des tests d'égalité

```js
let role = 'redacteur';

// on place dans le switch la valeur à tester
switch (role) {
  case 'admin': // puis le mot clé case suivi de la valeur à vérifier suivi de :
    console.log('Tous les accès'); // suivi des instructions conditionnelles
    break; // on termine par l'instruction break pour sortir du block si on est entré dans ce cas
  case 'moderateur':
    console.log('Accès à la modération');
    break;
  case 'redacteur':
    console.log('Accès à la rédaction');
    break;
  default: // on peut terminer par un cas par défaut qui sera évalué si tous les autres cas ne sont pas vérifiés
    console.log('Accès à rien');
}

```


## Synthèse

- On délimite un bloc de code par des `{}`
- Les `let` et les `const` ont une portée limitée au bloc
- Via l'instruction `if` on précise une expression qui détermine si ce bloc doit être executé ou non
- Un if peut être de suivi de plusieurs `else if` pour des cas alternatifs
- On peut terminer par un `else` pour le cas de repli
- En cas de succession de multiples tests d'égalité on peut préférer l'instruction `switch`