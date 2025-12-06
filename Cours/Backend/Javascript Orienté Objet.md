# Object Oriented Javascript
## Créer un Object 
Il existe plusieurs façons de créer un objet en Javascript.

### Première façon de créer un objet 
```javascript 
// Créer un Objet
var person = {
  name: 'Bob',
  age: 21,
  bio: function() {
    console.log("Hi, I'm Bob");
  };
};
```

### Deuxième façon de créer un objet 
```javascript 
function Person(name, age) {
  this.name = name
  this.age = age;
  this.bio: function() {
    console.log("Hi, I'm Bob");
  };
};

// Création de l'object
var bob = new Person('Bob', 20);
```

### Troisième façon de créer un objet
```javascript 
// Création de l'object
var person = new Object();

person.name = 'Bob';
person['age'] = 21;
person.greeting = function() {
  console.log("Hi, I'm Bob");
};
```

### Quatrième façon de créer un objet 
```javascript 
// Création de l'objet
var person = new Object({
  name: 'Bob',
  age: 21,
  greeting: function() {
    console.log("Hi, I'm Bob");
  }
});
```

### Cinquième façon de créer un objet 
```swift
// Création de l'objet
var newPerson = Object.create(person); // héritage

newPerson.name
newPerson.greeting() // "Hi, I'm Bob"
```

### Cinquième et demi-chemin pour créer un objet
```javascript 
function Animal(name) {
    this.name = name;
}

Animal.prototype.sleep = function() {
    console.log(this.name + ': Zzz...');
}

function Dog(name) {
    this.name = name;
}

// Créer une référence pour le prototype
Dog.prototype = Object.create(new Animal());
```



### Sixième façon de créer un objet 
```javascript 
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.greet = function() {
      console.log("Hi, I'm Bob")
    }
};

Person.prototype.introduce = function() {
  console.log("Hi, I'm Bob")
};

// Création de l'objet
let bob = Person("Bob", 21)
bob.greet() // "Hi, I'm Bob"
bob.introduce() // "Hi, I'm Bob"
```


## Héritage

### Conception du Parent
```javascript 
var Parent = function() {
    this.name = "Parent";
}

Parent.prototype.print = function() {
    console.log(this.name);
}

var parent = new Parent();

parent.print(); // "Parent"
```

## Conception de l'Enfant
```javascript
var Child = function() {
    this.name = "Child";
    this.initial = "Jr.";
}
```

## Design de la fonction
```javascript
var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

inheritsFrom(Child, Parent);
```

### Méthode disponible
```javascript 
var son  = new Child();
son.print(); // "Child"
```

### Méthode de remplacement
```javascript 
Child.prototype.print = function() {
    Parent.prototype.print.call(this);
    console.log(this.initial);
}

son.print() // "Jr."
```

### Child to Grand Child - Enfant à petit-enfant

```javascript
var GrandChild = function() {
    this.name = "Grand Child";
    this.initial = "JrJr.";
}

inheritsFrom(GrandChild, Child);
```

```javascript 
GrandChild.prototype.dance = function() {
  console.log("Let me dance for you, Bob")
}

GrandChild.prototype.print = function () {
    Child.prototype.print.call(this);
    console.log(this.initial);
}
```

```javascript 
var grandChild = new GrandChild();
grandChild.print(); // "JrJr."
```

## `Call`
```javascript
function Product(name, price) {
  this.name = name;
  this.price = price;
}

function Food(name, price) {
  Product.call(this, name, price);
  this.category = 'food';
}

function Toy(name, price) {
  Product.call(this, name, price);
  this.category = 'toy';
}

var cheese = new Food('feta', 5);
var fun = new Toy('robot', 40);
```
Autre exemple de `call`

```javascript
function greet() {
  var reply = [this.person, 'is a', this.role].join(' ');
  console.log(reply);
}

var i = {
  person: 'Bob', 
  role: 'Javascript Developer'
};

greet.call(i); // Bob is a Javascript Developer
```

## `Apply()`
> `apply` est très similaire à `call()`, à l'exception du type d'arguments qu'il prend en charge. Vous utilisez un tableau d'arguments au lieu d'une liste d'arguments (paramètres). Avec `apply`, vous pouvez également utiliser un `array` littéral, par exemple, `func.apply(this, ['eat', 'bananas'])`, ou un objet `Array`, par exemple, `func.apply(this, new Array('eat', 'bananas'))`.
```javascript 
```

## `Bind()`
```javascript
this.x = 9;    // Ceci fait référence à l'objet global "window" dans le navigateur
var module = {
  x: 81,
  getX: function() { return this.x; }
};

module.getX(); // 81

var retrieveX = module.getX;
retrieveX();   
// retourne 9 - La fonction est invoquée à la portée globale
var boundGetX = retrieveX.bind(module);
boundGetX(); // 81
```


#### Besoin d'étudier davantage

> __proto__ est l'objet réel utilisé dans la chaîne de recherche pour résoudre les méthodes, etc. prototype est l'objet utilisé pour construire __proto__ lorsque vous créez un objet avec new :

```javascript 
( new Foo ).__proto__ === Foo.prototype
( new Foo ).prototype === undefined
```

`prototype` est une propriété d'un objet Function. C'est le prototype des objets construits par cette fonction.


```javascript
function Point(x, y) {
    this.x = x;
    this.y = y;
}

var myPoint = new Point();

// les éléments suivants sont tous vrais
myPoint.__proto__ == Point.prototype
myPoint.__proto__.__proto__ == Object.prototype
myPoint instanceof Point;
myPoint instanceof Object;
```

Ici `Point` est une fonction constructeur, elle construit un objet (structure de données) de manière procédurale. `myPoint` est un object construit par `Point()` donc `Point.prototype` est enregistré dans `myPoint.__proto__` à ce moment-là.


#### Study Materials: 
  - http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/
  - https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics
  - https://www.thecodeship.com/web-development/methods-within-constructor-vs-prototype-in-javascript/
  - https://www.sitepoint.com/simple-inheritance-javascript/
  - http://archive.oreilly.com/oreillyschool/courses/advancedjavascript/Advanced%20JavaScript%20Essentials%20v1.pdf
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
