# 🧩 Fiche Récap – Installer et utiliser **GitHub CLI (`gh`)**

## 🎯 C’est quoi GitHub CLI ?

GitHub CLI (la commande `gh`) te permet d’interagir avec GitHub **depuis le terminal**, sans ouvrir ton navigateur.

Avec `gh`, tu peux :

- créer des repos,
- cloner plus vite,
- gérer tes issues et PR,
- t’authentifier facilement,
- parcourir des fichiers ou des commits…

Bref : **GitHub, mais en ligne de commande**.
⚠️ On oublie pas que git et GitHub sont deux choses différentes ! `gh` est un outil pour interagir avec GitHub, pas avec git directement.

---

## 🚀 Installer GitHub CLI

### 🍏 macOS (avec Homebrew)

#### 1. Vérifier que Homebrew est installé

```bash
brew --version
```

- Si une version s’affiche → parfait
- Sinon : https://brew.sh/index_fr

#### 2. Installer GitHub CLI

```bash
brew install gh
```

#### 3. Vérifier l’installation

```bash
gh --version
```

---

### 🪟 Windows (avec Winget)

### 1. Vérifier que Winget est installé

```bash
winget --version
```

- Si une version s’affiche → ok
- Sinon : installer Winget ici :  
  https://learn.microsoft.com/fr-fr/windows/package-manager/winget/#install-winget  
  ou via Microsoft Store.

#### 2. Installer GitHub CLI

```bash
winget install --id GitHub.cli
```

#### 3. Vérifier

```bash
gh --version
```

---

### 🐧 Linux (Debian/Ubuntu)

#### 1. Ouvrir un terminal

#### 2. Installer avec la commande officielle :

```bash
type -p curl >/dev/null || (sudo apt update && sudo apt install curl -y)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
 | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) \
 signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] \
 https://cli.github.com/packages stable main" \
 | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null

sudo apt update
sudo apt install gh -y
```

#### 3. Vérifier

```bash
gh --version
```

---

## 🔐 Se connecter à GitHub via GitHub CLI

Pour éviter de retaper ton mot de passe à chaque fois, tu peux t’authentifier avec :

```bash
gh auth login
```

Ensuite, GitHub CLI te pose quelques questions :

1️⃣ Choisis **GitHub.com**  
2️⃣ Choisis le protocole **SSH**  
3️⃣ Confirme l’utilisation de ta clé SSH (ou laisse `gh` en créer une)  
4️⃣ Choisis **Login with a web browser**  
5️⃣ Copie le code affiché, appuie sur Entrée  
6️⃣ Colle le code sur GitHub et autorise

Tu devrais voir :

```
Authentication complete.
Logged in as <ton-username>
```

🎉 Et voilà, tu es connecté !

---

### 💡 Astuce : connexion “automatique”

Tu peux sauter toutes les questions :

```bash
gh auth login -p SSH -h github.com -w
```

---

## Creation rapide d’un repo GitHub avec `gh`

Tu peux créer un repo GitHub directement depuis ton terminal avec :

```bash
gh repo create
```

Cette commande va déclenché une série de questions pour configurer ton repo (nom, orga, visibilité, README, etc.).

On te conseille de lancer cette commande **depuis le dossier local** que tu souhaites lier à ton futur repo GitHub.

Cela te permettra de créer le repo distant **et** de lier ton dossier local au repo GitHub en une seule commande.

Il existe aussi une version “express” de cette commande, qui crée un repo public avec le nom du dossier courant, et qui lie automatiquement le local au distant :

```bash
gh repo create <nom-du-repo> --public --source=. --remote=origin
```

On vouls laisse faire les curieux pour découvrir les autres options disponibles avec cette cli super pratique 😉

---

## 🔗 Liens utiles

- Documentation officielle : https://cli.github.com/
- Guide installation macOS : https://github.com/cli/cli#macos
- Guide installation Windows : https://github.com/cli/cli#windows
- Guide installation Linux : https://github.com/cli/cli/blob/trunk/docs/install_linux.md
- Liste des commandes `gh` : https://cli.github.com/manual/gh

---

> 💬 À retenir :  
> **`gh` = GitHub dans ton terminal.**  
> Une fois installé + authentifié, tout devient plus fluide ✨
