# Le DOM

Le DOM (Document Object Model) est une interface de programmation qui permet de représenter et d'interagir avec les documents HTML. Il représente la structure du document sous forme d'un arbre où chaque nœud est un objet représentant une balise du document.

Pour accéder au DOM, on utilise l'objet global `document` en JavaScript.

## structure du DOM

Un document HTML est structuré en plusieurs parties :

- La balise `<html>` est la racine du document.
- La balise `<head>` contient des métadonnées, des liens vers des feuilles de style, des scripts, etc.
- La balise `<body>` contient le contenu visible de la page web.

ces balises sont accessibles via les propriétés `document.documentElement`, `document.head` et `document.body`.

Les autres balises HTML sont des nœuds enfants de ces balises principales, formant une hiérarchie. Leur présence n'étant pas systématique, elles sont accessibles via des méthodes de sélection.

# Selection d'éléments

Il existe de nombreuses méthodes pour sélectionner des éléments dans le DOM. Voici les 2 plus courantes :

- `document.querySelector(selecteur css)` -> renvoie le premier élément html qui match le selecteur
- `document.querySelectorAll(selecteur css)` -> renvoie un 'tableau' contenant tous les élements html qui match le selecteur

il en existe d'autres, plus spécifiques, mais elles sont moins utilisées :

- `document.getElementById(id)` -> renvoie l'élément html qui a l'id spécifié
- `document.getElementsByClassName(className)` -> renvoie un 'tableau' contenant tous les éléments html qui ont la classe spécifiée
- `document.getElementsByTagName(tagName)` -> renvoie un 'tableau' contenant tous les éléments html qui ont la balise spécifiée

## modifier le contenu d'une balise

Ici encore, il existe de nombreuses façons de modifier le contenu d'une balise. Voici les 2 plus courantes :

- `elem.textContent` -> renvoie ou modifie le texte contenu dans elem (sans balise html)
- `elem.innerHTML` -> renvoie ou modifie le contenu HTML de elem (avec balises html)

⚠️ Attention à l'injection de code malveillant avec innerHTML ! Utiliser avec précaution.

## modifier les attributs d'une balise

### les classes

- `elem.classList` -> renvoie la liste des classe de elem
- `elem.classList.add` -> ajoute une classe à elem
- `elem.classList.remove` -> supprime une classe de elem
- `elem.classList.contains` -> vérifie si elem a une certaine classe
- `elem.classList.toggle` -> ajoute la classe si elle n'existe pas, la supprime si elle existe

### modifier le style d'une balise

- `elem.style.proprieteCSS` -> renvoie ou modifie la valeur de la propriété CSS de elem

Le nom de la propriété CSS est en camelCase (ex: background-color -> backgroundColor)

### modifier les attributs standard d'une balise

En ce qui concerne tous les attributs standard (id, src, href, alt, title, value, etc.), on peut les y accéder et les modifier directement via la notation pointée.

`elem.id` -> renvoie ou modifie l'id de elem
`elem.src` -> renvoie ou modifie la source de elem (pour une balise img)
`elem.href` -> renvoie ou modifie le lien de elem (pour une balise a)
`elem.alt` -> renvoie ou modifie le texte alternatif de elem (pour une balise img)
etc...

### modifier les attributs personnalisés d'une balise (ou les autres... mais bon c'est pas le plus simple)

`elem.getAttribute('attribut')` -> renvoie la valeur de l'attribut personnalisé
`elem.setAttribute('attribut', 'valeur')` -> modifie ou crée l'attribut personnalisé
`elem.removeAttribute('attribut')` -> supprime l'attribut personnalisé

## Créer un élément

`document.createElement('tagName')` -> crée un nouvel élément avec la balise spécifiée et le renvoie

## Ajouter un élément dans le DOM

`parentElement.appendChild(elem)` -> ajoute elem à la fin des enfants de parentElement
`parentElement.insertAdjacentElement('position', elem)` -> ajoute elem à la position spécifiée par rapport à parentElement. Position peut être 'beforebegin', 'afterbegin', 'beforeend', 'afterend'

beforebegin : avant le début de parentElement
afterbegin : juste après le début de parentElement
beforeend : juste avant la fin de parentElement
afterend : juste après la fin de parentElement

Il existe aussi `insertAdjacentHTML` et `insertAdjacentText` pour insérer du HTML ou du texte directement.

## supprimer une balise

- `elem.remove()` -> supprime elem du DOM
- `parentElement.removeChild(elem)` -> supprime elem des enfants de parentElement