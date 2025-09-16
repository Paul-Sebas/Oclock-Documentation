# Markdown

C'est un langage de mise en forme de texte qui est *comprit* par plusieurs outils comme github, slack, Discorde, Notion, ...
C'est celui qui est utilisé pour les fiches recap de ce repo 😉

## Titres

Les titres sont créés en utilisant le symbole `#`. Le nombre de `#` détermine le niveau du titre.

```markdown
# Titre 1
## Titre 2
### Titre 3
#### Titre 4
##### Titre 5
###### Titre 6
```

## Texte en gras et en italique

- **Texte en gras** : `**texte**` ou `__texte__`
- *Texte en italique* : `*texte*` ou `_texte_`
- ***Texte en gras et italique*** : `***texte***` ou `___texte___`

## Listes

### Listes non ordonnées

Utilisez `-`, `*` ou `+` pour créer des listes non ordonnées.

```markdown
- Élément 1
- Élément 2
  - Sous-élément 1
  - Sous-élément 2
```

### Listes ordonnées

Utilisez des chiffres suivis d'un point pour créer des listes ordonnées.

```markdown
1. Premier élément
2. Deuxième élément
   1. Sous-élément 1
   2. Sous-élément 2
```

## Liens

Pour créer un lien, utilisez la syntaxe suivante :

```markdown
[Texte du lien](URL)
```

Exemple :

```markdown
[Google](https://www.google.com)
```

## Images

Pour insérer une image, utilisez la syntaxe suivante :

```markdown
![Texte alternatif](URL de l'image)
```

Exemple :

```markdown
![Logo Markdown](https://markdown-here.com/img/icon256.png)
```

## Citations

Utilisez le symbole `>` pour créer des citations.

```markdown
> Ceci est une citation.
```

## Code

### Code en ligne

Utilisez des backticks pour inclure du code en ligne.

```markdown
Voici un exemple de code en ligne : `print("Hello, world!")`
```

### Blocs de code

Utilisez trois backticks ou une indentation de quatre espaces pour créer des blocs de code. Vous pouvez préciser le type de langage pour avoir une coloration syntaxique adapée.

    ```javascript
    console.log('hello world');
    ```

  ```javascript
  console.log('hello world');
  ```

## Lignes horizontales

Utilisez trois tirets `---`, astérisques `***` ou tirets bas `___` pour créer une ligne horizontale.

```markdown
---
```

## Échappement de caractères

Pour afficher un caractères spécial comme un backtic sans que ça "ouvre un bloc de code", précédez le caractère d'un backslash `\`.

```markdown
Le caractère backtick est le suivant : \`
```

Le caractère backtick est le suivant : \`

## Tableaux

Pour créer un tableau vous devez placer une ligne de tirets `-` sous la ligne d’entête et séparer les colonnes avec des `|`.

Vous pouvez aussi préciser l’alignement en utilisant des `:` (optionnel).

```md
|Aligné à gauche|Centré     |Aligné à droite|
|:--------------|:---------:|-----:|
|Aligné à gauche|   ce texte    |Aligné à droite |
|Aligné à gauche|est            |Aligné à droite |
|Aligné à gauche|centré         |Aligné à droite |
```