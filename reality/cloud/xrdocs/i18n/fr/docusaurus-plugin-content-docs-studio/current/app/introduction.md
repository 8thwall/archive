---
id: introduction
description: Cette section explique comment utiliser l'application 8th Wall Desktop.
sidebar_position: 2
---

# Utilisation de l'application 8th Wall

:::info[Public Bêta]
L'application de bureau **8th Wall est en version bêta publique** et ses fonctionnalités sont susceptibles d'être modifiées dans une prochaine version. Nous apprécions vos commentaires et nous avons un [forum d'assistance dédié aux utilisateurs de l'application bureautique bêta](https://forum.8thwall.com/c/desktop-beta/17)- merci de nous faire part de tous les problèmes que vous rencontrez ou de vos suggestions ici.
:::

Après la première connexion à 8th Wall via l'application de bureau, vous verrez les projets existants que vous avez créés dans la vue hub. Si vous êtes membre de plusieurs espaces de travail, vous pouvez changer d'espace de travail en utilisant le menu déroulant en haut à gauche du hub. Pour créer un nouveau projet, cliquez sur le bouton **Nouveau projet** en haut à droite du hub.

![](/images/studio/app/hub.jpg)

## Projets

Dans la vue hub de Studio, vous pouvez déplacer, supprimer et rechercher des projets à l'aide du menu Actions de projet `(...)` :

- **Révéler dans le finder** : ouvre votre navigateur de fichiers locaux à l'emplacement du projet
- **Supprimer du disque** : supprime les fichiers locaux de votre projet (le projet restera disponible sur le web à partir de sa dernière version dans le nuage).
- **Changer l'emplacement du disque** : ouvre votre navigateur de fichiers pour sélectionner un nouvel emplacement de dossier pour votre projet.
- **Paramètres du projet** : ouvre les paramètres de votre projet sur le web pour des actions telles que renommer le projet, créer une description ou changer l'image de couverture, et plus encore.

![](/images/studio/app/project-actions.jpg)

## Structure du projet

Lorsque vous créez ou ouvrez un projet pour la première fois, une version locale du projet est ajoutée sur votre machine dans `~/Documents/8th Wall/`. Par défaut, le dossier 8th Wall est créé dans votre dossier Documents, mais vous pouvez le modifier en le déplaçant à un autre endroit si vous le souhaitez.

Le dossier créé pour votre projet comprendra par défaut certains fichiers et dossiers. Le dossier `src` reflète le répertoire des fichiers du projet que vous voyez dans Studio. Ce dossier est un répertoire de la structure de fichiers de votre projet dans lequel vous stockez des fichiers tels que des scripts de composants, ainsi que des ressources telles que des images, des polices, des sons ou d'autres médias dont votre projet a besoin.

![](/images/studio/app/project-directories.jpg)

:::info
N'essayez pas de copier ces fichiers sur un autre serveur, votre projet ne fonctionnerait pas comme prévu. Pour publier et partager votre expérience, vous devez utiliser le processus de construction et d'hébergement de 8th Wall.
:::

L'application de bureau est à l'écoute des modifications apportées à votre répertoire local en temps réel. Par exemple, si vous utilisez VSCode pour mettre à jour le fichier `component.ts` d'un projet, dès que vous enregistrez le fichier, vous devriez voir le fichier mis à jour apparaître dans Studio.

De même, vous pouvez travailler avec des outils de modélisation 3D tels que Blender et Maya et enregistrer les modifications apportées aux actifs directement dans votre projet 8th Wall. Cela vous permet de travailler avec différents programmes et de créer un seul pipeline rationalisé, de sorte que votre flux de travail reste intact du début à la fin.

![](/images/studio/app/blender-to-studio.gif)

## Contrôle à la source

Il y a quelques différences importantes à noter entre la version bureautique de Studio et la version web.

Tout d'abord, vous ne verrez pas de bouton **Construire** dans la barre de navigation en haut à droite, comme c'est le cas dans Studio sur le web. En effet, Studio on desktop enregistre automatiquement les modifications au fur et à mesure et n'a pas besoin d'utiliser des serveurs cloud pour compiler vos modifications et reconstruire votre projet.

Lorsque vous souhaitez synchroniser les modifications de votre projet avec le nuage, vous pouvez accéder à la fonction **Cloud Build** dans les paramètres du projet sous **Source Control**. Par exemple, vous pouvez passer à la version web de Studio pour continuer à travailler. Vous pouvez sélectionner le bouton Cloud Build pour synchroniser vos dernières modifications, puis retrouver ces modifications sur la version Web de Studio. Pour en savoir plus sur les fonctionnalités de Source Control [ici](/studio/getting-started/build-land/).

![](/images/studio/app/source-control.jpg)
