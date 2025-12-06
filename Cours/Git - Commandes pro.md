# 🚀 Fiche pratique : Commandes Git essentielles pour un développeur Web Full Stack

Git est **l’outil de versionning** standard en entreprise.  
Voici la liste des **commandes les plus utilisées en équipe**, au-delà des bases (`git add`, `git commit`, `git push`).

---

## 🧱 1. Configuration de base

### 🔹 `git config --global user.name "Ton Nom"`
Configure ton nom d’utilisateur pour tous les dépôts Git de ta machine.

### 🔹 `git config --global user.email "ton.email@example.com"`
Configure ton adresse email pour les commits.

### 🔹 `git config --list`
Affiche toutes les configurations Git (utile pour vérifier).

---

## 🌿 2. Gestion des branches

### 🔹 `git branch`
Liste toutes les branches locales.

### 🔹 `git branch <nom-branche>`
Crée une nouvelle branche sans s’y déplacer.

### 🔹 `git checkout <nom-branche>`
Change de branche.

### 🔹 `git checkout -b <nom-branche>`
Crée **et** bascule sur la nouvelle branche (très courant).

### 🔹 `git branch -d <nom-branche>`
Supprime une branche locale (après fusion).

### 🔹 `git push origin --delete <nom-branche>`
Supprime une branche sur le dépôt distant.

---

## 🔁 3. Synchronisation avec le dépôt distant

### 🔹 `git fetch`
Récupère les informations du dépôt distant sans fusionner les changements.  
> ⚠️ N’altère pas ton code local, mais met à jour les références distantes.

### 🔹 `git pull`
Récupère et fusionne les changements distants dans ta branche actuelle.  
Equivalent à `git fetch` + `git merge`.

### 🔹 `git push origin <branche>`
Envoie tes commits locaux sur le dépôt distant.

---

## 🧩 4. Fusion et Rebase

### 🔹 `git merge <branche>`
Fusionne une autre branche dans la tienne.  
> Ex : depuis `main`, tu fais `git merge feature/login`.

### 🔹 `git rebase <branche>`
Rejoue les commits de ta branche **par-dessus** une autre.  
> Rend l’historique plus linéaire, mais à utiliser prudemment.

### 🔹 `git rebase -i HEAD~3`
Permet de **réécrire ou fusionner** les 3 derniers commits (mode interactif).

---

## 🧹 5. Nettoyage et correction

### 🔹 `git status`
Affiche l’état actuel des fichiers (modifiés, suivis, non suivis).

### 🔹 `git diff`
Montre les différences entre les fichiers modifiés et ceux commités.

### 🔹 `git restore <fichier>`
Annule les modifications non ajoutées (`git add` non fait).

### 🔹 `git reset <fichier>`
Retire un fichier de la zone de staging (après `git add` mais avant commit).

### 🔹 `git reset --hard HEAD`
Reviens à l’état exact du dernier commit (⚠️ détruit les modifications locales).

### 🔹 `git clean -fd`
Supprime les fichiers non suivis par Git (⚠️ à utiliser avec prudence).

---

## 🕒 6. Historique et suivi

### 🔹 `git log`
Affiche l’historique des commits.

### 🔹 `git log --oneline --graph --all`
Affiche un historique visuel simplifié des branches et commits.

### 🔹 `git blame <fichier>`
Montre qui a modifié chaque ligne d’un fichier.

### 🔹 `git show <commit_id>`
Montre les détails d’un commit précis.

---

## 🧪 7. Stash (sauvegarde temporaire)

### 🔹 `git stash`
Sauvegarde temporairement tes modifications sans les commiter.

### 🔹 `git stash list`
Liste les stashes enregistrés.

### 🔹 `git stash pop`
Restaure le dernier stash et le supprime de la liste.

### 🔹 `git stash drop`
Supprime un stash spécifique.

---

## 🌍 8. Remote (dépôts distants)

### 🔹 `git remote -v`
Liste les dépôts distants configurés.

### 🔹 `git remote add origin <url>`
Lie ton dépôt local à un dépôt distant (ex : GitHub).

### 🔹 `git remote remove origin`
Supprime le lien avec un dépôt distant.

---

## 🧱 9. Tags (versions)

### 🔹 `git tag <nom_tag>`
Crée un tag léger pour une version (ex : `v1.0.0`).

### 🔹 `git tag -a <nom_tag> -m "message"`
Crée un tag annoté (plus descriptif, recommandé).

### 🔹 `git push origin --tags`
Envoie tous les tags sur le dépôt distant.

---

## 🧰 10. Commandes utiles en workflow d’entreprise

| Commande | Utilisation |
|-----------|--------------|
| `git pull --rebase` | Met à jour ta branche sans créer de commit de merge. |
| `git cherry-pick <commit_id>` | Copie un commit spécifique dans ta branche. |
| `git revert <commit_id>` | Annule un commit sans casser l’historique. |
| `git stash apply` | Applique un stash sans le supprimer. |
| `git push --force-with-lease` | Met à jour le dépôt distant en toute sécurité après un rebase. |

---

## 💡 Bonnes pratiques en entreprise

1. **Travaille toujours sur une branche** (`feature/`, `fix/`, `hotfix/`).
2. **Fais des commits petits et clairs** avec des messages explicites.
3. **Avant de pousser**, fais toujours un `git pull --rebase`.
4. **Évite `git push --force`**, sauf si tu comprends ses implications.
5. **Utilise des Pull Requests** pour les revues de code.

---

## 🧭 Exemple de workflow typique en entreprise

```bash
# 1. Récupérer les dernières modifications
git checkout main
git pull origin main

# 2. Créer une nouvelle branche
git checkout -b feature/ajout-login

# 3. Travailler et valider
git add .
git commit -m "feat: ajout du système de login"

# 4. Mettre à jour avec main
git pull --rebase origin main

# 5. Pousser la branche sur le remote
git push origin feature/ajout-login

# 6. Ouvrir une Pull Request sur GitHub/GitLab
