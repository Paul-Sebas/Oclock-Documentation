# 🧩 Fiche Récap – Les sous-langages SQL (DDL, DML, DCL, TCL, DRL)

Dans SQL, on ne manipule pas seulement des données : on **crée**, **modifie**, **sécurise**, **contrôle**, et **interroge** une base.  
Pour que tout ça reste clair, SQL est découpé en plusieurs _sous-langages_, chacun avec sa logique.

Voici ce que tes requêtes SQL veulent réellement dire 👇

---

# 1️⃣ DDL – Data Definition Language

**👉 "Je définis la structure de la base."**

Le DDL sert à **créer**, **modifier** ou **supprimer** :

- des tables
- des colonnes
- des contraintes
- des index
- des schémas

### Exemples :

```sql
CREATE TABLE student (...);
ALTER TABLE student ADD COLUMN github_profile TEXT;
DROP TABLE student;
```

💡 Retient :  
**DDL = architecture de la base.**

---

# 2️⃣ DML – Data Manipulation Language

**👉 "Je manipule les données."**

C’est ce que tu utilises **tout le temps**, quand tu ajoutes, modifies ou supprimes des enregistrements.

### Exemples :

```sql
INSERT INTO student (...) VALUES (...);
UPDATE student SET github_profile = 'https://github.com/toto' WHERE id = 1;
DELETE FROM student WHERE id = 1;
```

💡 Retient :  
**DML = CRUD sur les données.**

---

# 3️⃣ DQL – Data Query Language

**👉 "Je récupère les données."**

Tu le connais déjà : c’est **SELECT**.

### Exemple :

```sql
SELECT * FROM student WHERE promo_id = 904;
```

💡 Retient :  
**DQL = SELECT.**

---

# 4️⃣ DCL – Data Control Language

**👉 "Je gère les permissions."**

Le DCL permet de donner ou retirer des droits.

### Exemples :

```sql
GRANT SELECT ON utilisateurs TO apprenant;
REVOKE UPDATE ON utilisateurs FROM apprenant;
```

💡 Retient :  
**DCL = qui a accès à quoi.**

---

# 5️⃣ TCL – Transaction Control Language

**👉 "Je contrôle les transactions."**

Utilisé quand tu fais plusieurs opérations qui doivent **réussir ensemble** ou **échouer ensemble**.

### Exemples :

```sql
BEGIN;
UPDATE compte SET solde = solde - 100 WHERE id = 1;
UPDATE compte SET solde = solde + 100 WHERE id = 2;
COMMIT;
```

Et si un truc se passe mal :

```sql
ROLLBACK;
```

C'est à dire, annule toutes les opérations depuis le dernier `BEGIN;` en cas d'erreur.

💡 Retient :  
**TCL = sécurité et cohérence des opérations.**

---

# 🎯 Récap express

| Sous-langage | Objectif               | Exemples               |
| ------------ | ---------------------- | ---------------------- |
| **DDL**      | Gérer la structure     | CREATE, ALTER, DROP    |
| **DML**      | Manipuler les données  | INSERT, UPDATE, DELETE |
| **DQL**      | Lire les données       | SELECT                 |
| **DCL**      | Gérer la sécurité      | GRANT, REVOKE          |
| **TCL**      | Gérer les transactions | COMMIT, ROLLBACK       |

s
