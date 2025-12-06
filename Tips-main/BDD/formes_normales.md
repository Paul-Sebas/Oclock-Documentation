# 🧩 Formes normales (1FN, 2FN, 3FN) en modélisation de bases de données

Les formes normales sont des règles de conception pour structurer les bases de données relationnelles. Elles visent à minimiser la redondance et à éviter les anomalies lors des opérations de manipulation des données (insertion, mise à jour, suppression).

## 📝 Pourquoi “normaliser” ?

La normalisation permet de structurer une base de données pour :

- éviter la redondance des données
- éviter les anomalies d’insertion, de mise à jour ou de suppression
- améliorer la cohérence et l’intégrité des données

Les formes normales s’emboîtent : respecter 3FN implique aussi respecter 2FN et 1FN.

---

## 1️⃣ Première Forme Normale (1FN)

**Règle** : Chaque attribut d’une table doit contenir une **valeur atomique**, et aucun ensemble de valeurs (liste, tableau) ne doit être stocké dans une seule cellule. De plus, la table ne doit pas contenir de lignes en double.

**En clair** :

- On ne stocke pas « fournisseurs = Sony, Sharp, LG » dans un seul champ.
- Chaque colonne contient une seule valeur simple.
- On ne mélange pas type de données ou liste/array dans un champ.

**Exemple non conforme** :  
| produit | fournisseurs |
|----------------|----------------------------------|
| Téléviseur | Sony, Sharp, LG |  
→ Le champ « fournisseurs » contient plusieurs valeurs → violation de 1FN.

**Solution conforme** :  
| produit | fournisseur |
|------------|-------------|
| Téléviseur | Sony |
| Téléviseur | Sharp |
| Téléviseur | LG |

---

## 2️⃣ Deuxième Forme Normale (2FN)

**Règle** : Une relation est en 2FN si :

- elle est déjà en 1FN, **et**
- chaque attribut non-clé dépend **de la totalité** de la clé primaire (et **non d’une partie seulement**)

**En clair** :

- Si la clé primaire est composée (ex : [code_produit, code_fournisseur]), alors aucun attribut non-clé ne doit dépendre uniquement de code_produit **ou** uniquement de code_fournisseur. Il doit dépendre de la **clé entière**.
- Si la clé est simple (un seul attribut), alors la 1FN implique déjà la 2FN.

**Exemple non conforme** :  
| code_produit | code_fournisseur | adresse_fournisseur |
|-----------|---------------|----------------------------|
| 15 | VIDEO SA | 13 rue du Cherche-Midi |
| 20 | VIDEO SA | 13 rue du Cherche-Midi |  
→ « adresse_fournisseur » dépend **uniquement** de code_fournisseur, et non de la paire complète. Violation de 2FN.
**Solution conforme** :

- Entité fournisseur (code_fournisseur, adresse_fournisseur)
- Entité produit_fournisseur (code_produit, code_fournisseur)  
  La dépendance est corrigée.

---

## 3️⃣ Troisième Forme Normale (3FN)

**Règle** : Une relation est en 3FN si :

- elle est déjà en 2FN, **et**
- aucun attribut non-clé ne dépend **transitivement** de la clé primaire (i.e., il ne dépend pas via un autre attribut non-clé)

**En clair** :

- Si A → B et B → C, alors C dépend transitivement de A. Cela viole la 3FN.
- Pour respecter 3FN, chaque attribut non-clé doit dépendre directement **et uniquement** de la clé primaire.
- On décompose les tables pour éliminer ces dépendances.

**Exemple non conforme** :  
| code_fournisseur | adresse | ville | pays |
|---------------|----------------|--------|----------|
| VIDEO SA | 13 rue … | Paris | France |
| HITEK LTD | 25 Bond St. | London | England |  
→ « pays » dépend de « ville », qui elle dépend de code_fournisseur → dépendance transitive → violation de 3FN.
**Solution conforme** :

- Entité adresse (code_adresse, code_fournisseur, code_ville)
- Entité ville (code_ville, ville, code_pays)
- Entité pays (code_pays, pays)  
  Ainsi, tous les attributs dépendent directement de la clé primaire sans intermédiaire.

---

## 📌 Résumé rapide

| Forme | Condition clé                                      | But principal                                 |
| ----- | -------------------------------------------------- | --------------------------------------------- |
| 1FN   | Valeurs atomiques                                  | Éliminer liste/multi-valeurs dans une cellule |
| 2FN   | Attributs non-clé dépendent de la clé entière      | Éliminer dépendances partielles à la clé      |
| 3FN   | Pas de dépendance transitive pour attribut non-clé | Éliminer dépendances via un autre attribut    |

> « La clé, **la clé entière**, et **rien d’autre que la clé** » — Bill Kent (résumé de Codd)

---

## 📎 Ressource de référence

[L’article Wikipédia sur les form es normales](<https://fr.wikipedia.org/wiki/Forme_normale_(bases_de_donn%C3%A9es_relationnelles)>)

---

## Résumé des bonnes pratiques

- Commence toujours par la 1FN avant d’aller plus loin.
- 2FN & 3FN sont des paliers progressifs : respecter 3FN signifie déjà respecter 2FN et 1FN.
- Une base bien normalisée améliore l’intégrité, mais peut parfois compliquer les requêtes : un bon compromis peut être nécessaire.
- La normalisation excessive sans raison peut ralentir, mais la **dé-normalisation** ne doit venir qu’après mesure.
