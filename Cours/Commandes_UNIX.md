# Commandes UNIX

- `whoami` : Connaître l'utilisateur courant du système 
	- ex : student ou root (super utilisateur)

- `hostname` : Connaître le nom de la machine

- `pwd` : Afficher le chemin du dossier courant
	- PWD => Print Working Directory
	- ex : `/home/student` (équivalent de `~`) : répertoire de l'utilisateur courant 
	- ex : `/` (le dossier le plus haut dans l'architecture des fichiers Linux s'appelle la **racine**)

- `ls` : Afficher les dossiers et fichiers du dossier courant
	- LS => LiSt
	- ex : `ls -a -l` : pour afficher les fichiers cachés et les dossiers cachés avec des informations complémentaires
	- ex : `ls -al` : on peut regrouper les **options**
	- ex : `ls Desktop` : on peut fournir un **argument**, en l'occurence ici pour connaître le contenu du dossier Desktop
	- ex : `ls /home/student/Desktop` : en fournissant le chemin complet

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
