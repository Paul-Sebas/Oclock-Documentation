# 🧩 Optional Chaining (`?.`) en JavaScript

## 🎯 Objectif

Comprendre comment utiliser l’opérateur **optional chaining** `?.` pour accéder à des propriétés **sans provoquer d’erreur**, quand des propriétés _intermédiaires_ peuvent être `null` ou `undefined`.

> ⚠ Important :  
> `?.` **ne protège pas** si la variable elle-même n’est pas déclarée.  
> Il sert uniquement à stopper la chaîne **à partir d’une valeur qui existe déjà** (mais qui peut être `null`/`undefined`).

---

## 1️⃣ Problème de base sans optional chaining

Sans optional chaining, ce genre de code casse facilement :

```js
const user = {
  lastname: "toto",
  firstname: "tata",
};

console.log(user.firstname); // "tata"
console.log(user.age.birthdate); // ❌ TypeError: Cannot read properties of undefined
```

Ici, `user.age` vaut `undefined`.  
JavaScript essaie quand même de lire `.birthdate` → erreur.

---

## 2️⃣ Avec optional chaining `?.`

```js
const user = {
  lastname: "toto",
  firstname: "tata",
};

console.log(user.firstname); // "tata"
console.log(user.age?.birthdate); // undefined (et PAS d’erreur)
```

### Comment ça marche ?

`a?.b` signifie :

- si `a` est **ni `null` ni `undefined`** → renvoie `a.b`
- sinon → renvoie **`undefined`** sans lancer d’erreur

Ici :

- `user` existe → on peut écrire `user.age?.birthdate`
- `user.age` vaut `undefined` → la chaîne s’arrête là, et renvoie `undefined`.

---

## 3️⃣ Limite importante : variable non déclarée

Optional chaining **ne fonctionne pas** si la variable n’existe pas du tout :

```js
const user = {};

console.log(user?.name); // undefined → OK : user existe
console.log(users?.name); // ❌ ReferenceError: users is not defined
```

La différence :

- `user` est **déclarée** (c’est un objet vide) → `user?.name` renvoie `undefined`
- `users` n’est **pas déclarée** → JavaScript plante avant d’évaluer `?.`

> 🔑 **Le premier maillon doit exister** (variable déclarée).  
> Optional chaining sert à sécuriser **les maillons suivants**.

---

## 4️⃣ Cas pratiques

### Accéder en profondeur sans casse

```js
const user = {
  profile: {
    address: {
      city: "Paris",
    },
  },
};

console.log(user.profile?.address?.city); // "Paris"
console.log(user.profile?.job?.company); // undefined (aucune erreur)
```

Ici on n’écrit **pas** `user?.profile` parce que dans cet exemple, `user` est toujours défini.  
Ce qui peut manquer, c’est `profile`, `address`, `job`, etc.

Si tu avais un cas où `user` peut être `null` ou `undefined` (par exemple `const user = currentSession.user`), tu pourrais écrire :

```js
const city = user?.profile?.address?.city;
```

…mais **uniquement si la variable `user` est bien déclarée**.

---

### Sur un appel de fonction

```js
const user = {
  sayHello() {
    console.log("Bonjour !");
  },
};

user.sayHello?.(); // "Bonjour !"

const otherUser = {};
otherUser.sayHello?.(); // ne fait rien, pas d’erreur
```

---

### Sur un tableau

```js
const users = [{ name: "Toto" }];

console.log(users[0]?.name); // "Toto"
console.log(users[1]?.name); // undefined (pas d’erreur)
```

---

## 5️⃣ Combiner avec `??` pour une valeur par défaut

`?.` renvoie `undefined` si la chaîne est interrompue.  
On peut donc le combiner avec **nullish coalescing** (`??`) :

```js
const city = user?.profile?.address?.city ?? "Ville inconnue";
```

- si la ville existe → on la récupère
- sinon → `"Ville inconnue"`

---

## 6️⃣ Résumé

- ✅ `obj.prop?.child` : n’explose pas si `prop` est `null`/`undefined`, renvoie `undefined`.
- ✅ `obj.method?.()` : n’appelle la méthode que si elle existe.
- ✅ `arr[index]?.prop` : accès “safe” à un élément de tableau.
- ⚠ Si la variable de départ n’est pas déclarée (`users?.name` avec `users` inexistant) → **ReferenceError**.
- 💡 Souvent combiné avec `??` pour fournir une valeur par défaut.

---

> 🧡 À retenir :
>
> - Optional chaining sécurise **la navigation dans un objet déjà déclaré**.
> - Il n’empêche pas une erreur si **la variable de départ n’existe pas**.
> - Il renvoie simplement `undefined` là où, avant, tu aurais eu un `TypeError`.

/_**************\*\***************\_\_**************\*\***************_/
/\*

- la doc MDN : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Optional_chaining
  \*/
