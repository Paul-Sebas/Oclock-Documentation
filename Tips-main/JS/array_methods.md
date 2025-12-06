# 🧩 Les principales méthodes d’Array en JavaScript

---

# 1️⃣ forEach

→ Exécute une fonction **sur chaque élément** du tableau (mais ne retourne rien).

```js
const fruits = ["pomme", "banane", "fraise"];

fruits.forEach((fruit) => {
  console.log(fruit);
});
```

✔ Pour **parcourir**  
❌ Ne retourne rien → impossible d’enchaîner

👉 MDN : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

---

# 2️⃣ map

→ Crée un **nouveau tableau** en transformant chaque élément.

```js
const numbers = [1, 2, 3];

const doubled = numbers.map((n) => n * 2);
console.log(doubled); // [2, 4, 6]
```

✔ Retourne **un nouveau tableau**

⚠ **Important (MDN)** :

> Si tu n’utilises PAS le tableau retourné, tu dois utiliser `forEach` où `for...of` à la place.  
> `map` est destiné UNIQUEMENT à produire un nouvel array.

👉 MDN : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/map

---

# 3️⃣ filter

→ Retourne un **nouveau tableau** contenant seulement les éléments qui valident la condition.

```js
const numbers = [1, 2, 3, 4];

const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens); // [2, 4]
```

👉 MDN : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

---

# 4️⃣ find

→ Retourne **le premier élément** correspondant.

```js
const users = [
  { id: 1, name: "Ana" },
  { id: 2, name: "Léa" },
];

const found = users.find((u) => u.id === 2);
console.log(found); // { id: 2, name: "Léa" }
```

👉 MDN : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/find

---

# 5️⃣ findIndex

→ Retourne **l'index** du premier élément correspondant.

```js
const index = [10, 20, 30].findIndex((n) => n === 20);
console.log(index); // 1
```

👉 MDN : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex

---

# 6️⃣ some

→ Renvoie `true` si **au moins un** élément correspond.

```js
const hasEven = [1, 3, 5].some((n) => n % 2 === 0);
console.log(hasEven); // false
```

👉 MDN : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/some

---

# 7️⃣ every

→ Renvoie `true` si **tous** les éléments correspondent.

```js
console.log([2, 4, 6].every((n) => n % 2 === 0)); // true
```

👉 MDN : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/every

---

# 8️⃣ fill

→ Remplit un tableau avec une valeur.

```js
const arr = new Array(5).fill(0);
console.log(arr); // [0, 0, 0, 0, 0]
```

👉 MDN : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/fill

---

# 9️⃣ reduce

→ Réduit un tableau à **une seule valeur** (somme, objet, résultat calculé…).

```js
const total = [1, 2, 3].reduce((acc, n) => acc + n, 0);
console.log(total); // 6
```

👉 MDN : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce

---

# 🔟 includes

→ Vérifie si le tableau contient une valeur.

```js
console.log([1, 2, 3].includes(2)); // true
```

👉 MDN : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/includes

---

# 🧰 Bonus – Autres méthodes utiles

| Méthode     | Rôle                   |
| ----------- | ---------------------- |
| `sort()`    | Trie                   |
| `reverse()` | Inverse                |
| `join()`    | Convertit en string    |
| `flat()`    | Aplati                 |
| `concat()`  | Fusionne               |
| `slice()`   | Copie                  |
| `splice()`  | Modifie (⚠ destructif) |

---

# 🎓 Résumé simple

| Méthode   | Retourne           | Quand l’utiliser ?                       |
| --------- | ------------------ | ---------------------------------------- |
| forEach   | rien               | juste exécuter                           |
| map       | un nouveau tableau | transformer (⚠ si pas utilisé → forEach) |
| filter    | un nouveau tableau | sélectionner                             |
| find      | un élément         | chercher                                 |
| findIndex | un index           | localiser                                |
| some      | boolean            | au moins un                              |
| every     | boolean            | tous                                     |
| reduce    | une valeur         | accumuler                                |
| fill      | tableau modifié    | initialisation                           |

---

## 📎 Ressource globale

Documentation Array (MDN) :  
https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array

---

> 🧡 À retenir :  
> **map = transformer → retourner un tableau**  
> **forEach = exécuter → pas de retour**  
> Les méthodes d’Array rendent ton code plus court, plus clair, plus lisible. 💡

## Récap avec de la nourriture 🍟 ... les Figueres aime bien 😋

![Méthodes d'Array en JS - Récap avec de la nourriture](../assets/img/array_methods.gif)
