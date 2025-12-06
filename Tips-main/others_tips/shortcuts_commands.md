# 🧩 Créer des raccourcis de commandes dans le terminal

Les alias permettent de créer des raccourcis personnalisés pour exécuter plusieurs commandes en une seule ligne.  
C'est le top pour automatiser des actions répétitives (ex. initialiser un projet Node ou faire un commit Git rapide).

## Ouvrir le fichier de configuration du shell ⚙️

Selon ton terminal :

- bash :
  - `nano ~/.bashrc`
- zsh (Oh My Zsh, etc.) :
  - `nano ~/.zshrc`

## Ajouter des alias personnalisés 🥸

Ajoute ces lignes à la fin du fichier :

```bash
# 🚀 Initialise un projet npm et le bascule en module (ESM)
alias npm-esm='npm init -y && npm pkg set type=module'
# 💬 Ajoute tous les fichiers et fait un commit avec un message
alias gac='git add . && git commit -m'
```

Pour le deuxième alias, tu l'utilises ainsi :

- `gac "Mon message de commit"`

Ça exécutera automatiquement :

- `git add .`
- `git commit -m "Mon message de commit"`

## Recharge ta config ♻️

Recharge ton terminal pour activer les nouveaux alias :

`source ~/.bashrc`
ou
`source ~/.zshrc`

## Comment ça s'utilise ? 🤔

- Crée un projet npm en ESM
  - `npm-esm`
- Fait un commit rapide
  - `gac "Fix: correction du bug de démarrage"`

### Astuce

Tu peux regrouper tous tes alias dans un fichier dédié, par exemple `~/.aliases`,  
et l'inclure dans le fichier de config de ton shell en ajoutant cette ligne à la fin :

- `source ~/.aliases`

Cela te permettra d'avoir une configuration plus propre et réutilisable entre machines.
