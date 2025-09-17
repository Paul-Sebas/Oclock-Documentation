# Commandes UNIX

- `whoami` : Connaître l'utilisateur courant du système 
	- ex : student ou root (super utilisateur)

- `hostname` : Connaître le nom de la machine

- `pwd` : Afficher le chemin du dossier courant
	- PWD => Print Working Directory
	- ex : `/home/student` (équivalent de `~`) : répertoire de l'utilisateur courant 
	- ex : `/` (le dossier le plus haut dans l'architecture des fichiers Linux s'appelle la **racine**)

- `cd` : Changer de dossier
	- CD => Change Directory
	- ex : `cd Desktop` : pour aller dans le dossier Desktop (si on est dans le dossier `/home/student`)
	- ex : `cd ..` : pour remonter d'un niveau dans l'arborescence des dossiers
	- ex : `cd` ou `cd ~` : pour revenir dans le dossier de l'utilisateur courant
	- ex : `cd /` : pour aller à la racine

- `ls` : Afficher les dossiers et fichiers du dossier courant
	- LS => LiSt
	- ex : `ls -a -l` : pour afficher les fichiers cachés et les dossiers cachés avec des informations complémentaires
	- ex : `ls -al` : on peut regrouper les **options**
	- ex : `ls Desktop` : on peut fournir un **argument**, en l'occurence ici pour connaître le contenu du dossier Desktop
	- ex : `ls /home/student/Desktop` : en fournissant le chemin complet

	**Options utiles pour `ls` :**
	> `ls -lS` : pour trier par taille (du plus grand au plus petit)
	>
  	> `ls -lr` : pour inverser l'ordre d'affichage (du plus petit au plus grand)
	>
	> `ls -lt` : pour trier par date (du plus récent au plus ancien)

- `tree` : Afficher l'arborescence des dossiers et fichiers du dossier courant
	- ex : `tree -L 2` : pour limiter la profondeur de l'affichage à 2 niveaux

Attention ! Si le dossier que tu veux explorer contient beaucoup de choses, tree risque d’être très, très bavard. Pour stopper cette avalanche de lignes, tu peux utiliser le raccourci **Ctrl + C**.

Exemple d'affichage de la commande `tree` :

```
student@teleporter:~/formation$ tree module-1
module-1
├── mon-projet
│   ├── cv.md
│   ├── home.md
│   ├── images
│   └── intro.md
└── S01E09-Atelier
    ├── cv.html
    ├── index.html
    ├── README.md
    ├── recette.md
    └── style.css
```

- `clear` : Nettoyer l'affichage du terminal 
	- possibilité d'utiliser également le raccourci `CTRL + L` (y compris pour MacOS)

- `mkdir` : Créer un dossier
	- MKDIR => Make Directory
	- ex : `mkdir figueres`

- `rmdir` : Supprimer un dossier

- `touch` : Créer un (ou plusieurs) fichier(s)

- `rm` : Supprimer un (ou plusieurs) fichier(s) ou dossier avec `-d`

- `mv` : Pour déplacer (et/ou renommer) un fichier
	- ex : `mv lapin.txt poule.md` --> rename
	- ex : `mv ./michel.md ../figueres/michel.md` --> déplacement (pas indispensable de réécrire le nom du fichier)

- `cp` : Copier un fichier
	- ex : `cp Amaury.txt ../figueres/Amaury.txt`

- `man` : Pour avoir la documentation d'une commande terminale
	- ex : `man ls` et on pense à la touche "q" pour quitter la documentation

- `nano` : Ouvrir un éditeur dans le terminal
	- pour enregistrer : CTRL + O puis ENTER
	- pour quitter : CTRL + X

- `cat` : Afficher le contenu d'un fichier
  - `cat Dali.txt` affiche le contenu du fichier `Dali.txt`

- `history` : Afficher l'historique des commandes déjà saisies dans le terminal



## Régler les droits sur un fichier ou dossier

### Permissions / Droits
Pour définir les droits, il faut déjà savoir les compter !

| **Type**     | **Chiffre** |
|:-------------|:-----------:|
| Lecture      |     4       |
| Écriture     |     2       |
| Exécution    |     1       |

Et ensuite on fait la somme des chiffres pour déterminer les droits que l’ont souhaite.

Exemples :
- droits en lecture et écriture => `6`
- droits en lecture, écriture et exécution => `7`
- droits en lecture uniquement => `4`

### Utilisateurs

Ensuite, on peut déterminer les permissions pour 3 niveaux/types d’utilisateurs :

- l’utilisateur propriétaire du fichier/dossier
- le groupe d’utilisateurs lié au fichier/dossier
- tous les autres

Ainsi, on peut dire que le propriétaire a tous les droits 7, le groupe lecture + exécution 5, aucun droit pour tous les autres 0 => 750

### La commande
```bash
chmod 755 /var/www/html
```

- lecture+écriture+exécution pour le propriétaire du dossier `/var/www/html`
- lecture+exécution pour le groupe du dossier `/var/www/html`
- lecture+exécution pour tous les autres

````bash
chmod -Rf 755 /var/www/html :
````

- applique la commande précédente pour le dossier `/var/www/html` mais aussi tous ses enfants

## Les commandes Git
- `git status` : Voir l'état du dépôt Git
- `git add .` : Ajouter tous les fichiers modifiés au prochain commit
- `git commit -m "message"` : Faire un commit avec un message
- `git log` : Voir l'historique des commits
- `git branch` : Voir les branches du dépôt
- `git switch nom-de-branche` : Changer de branche
- `git switch -c nom-de-branche` : Créer et changer pour une nouvelle
- `git merge nom-de-branche` : Fusionner une branche dans la branche courante
- `git push -u origin nom-de-branche` : Envoyer les commits de la branche courante vers le dépôt distant
- `git pull origin nom-de-branche` : Récupérer les commits du dépôt distant vers la branche courante
- `git clone url-du-depot` : Cloner un dépôt distant dans un nouveau dossier
- `git reset --hard HEAD~1` : Annuler le dernier commit (attention, les modifications seront perdues)
- `git diff` : Voir les différences entre les fichiers modifiés et la dernière version commitée
- `git remote -v` : Voir les dépôts distants configurés
- `git fetch` : Récupérer les mises à jour des branches distantes sans les fusionner
- `git rebase nom-de-branche` : Rejouer les commits de la branche courante sur une autre branche