# Les Boucles

Toutes les boucles en JS se basent au minimum sur :

- une condition de répétition (on dit aussi « de sortie »)
- des instructions à répéter

et éventuellement sur :

- une gestion fine de la condition de sortie, avec par exemple un compteur numérique (par exemple, boucle `for`)


## while
**Tant que** la condition est vérifiée, j’exécute les instructions :
```
while (condition) {
  // ... instructions JS
}
```

## do ... while
J’exécute les instructions une première fois, puis **tant que** la condition est vérifiée, je recommence :

```
do {
  // ... instructions
} while (condition)
```

## for
**Pour chaque nouvelle valeur de ma variable de contrôle de boucle**, et ce jusqu’à ce que la condition ne soit plus vérifiée, j’exécute les instructions :

```
for(let i = 0; i < 3; i++) {
  // ... instructions
}
```

> Ici, la variable `i` (comme incrément) sera incrémentée de 1 à chaque itération, et la condition ré-évaluée à chaque tour de boucle, jusqu’à ce qu’elle ne soit plus vérifiée et que la boucle s’arrête.

## for ... in (Utilisé pour parcourir ***un objet***)
Pour chaque propriété dans l’objet, j’exécute les instructions :

```
const fruit = {
  nom: 'fraise',
  couleur: 'rouge'
};

for (let propriete in fruit) {
  console.log('Propriété ' + propriete + ' :');
  console.log('Le fruit est ' + fruit[propriete]);
}

// Affichage obtenu en console :
//
// Propriété nom :
// Le fruit est fraise
// Propriété couleur :
// Le fruit est rouge
```

## for ... of (Utilisé pour parcourir ***un tableau***)
Pour chaque élément du tableau, j’exécute les instructions :

```
const winners = [
  {name: 'Christian Taylor', distance: 17.86},
  {name: 'Will Claye', distance: 17.76},
  {name: 'Dong Bin', distance: 17.58}
];

console.log('Podium du triple saut hommes, Rio 2016');

for(let athlete of winners) {
  console.log(athlete.name + " avec " + athlete.distance + "m");
}

// Affichage obtenu en console :
//
// Podium du triple saut hommes, Rio 2016
// Christian Taylor avec 17.86m
// Will Claye avec 17.76m
// Dong Bin avec 17.58m
```

#### NB : la boucle `for...of` **NE fonctionne PAS** avec les objets.


### Instructions de contrôle de boucle
Deux instructions sont disponibles dans toutes les boucles et permettent d’en contrôler le fonctionnement :

- Il est possible d’interrompre une boucle avec l’instruction `break;`
- Il est possible d’interrompre l’itération courante et de passer à la suivante avec l’instruction `continue;`