---
id: project-sharing
sidebar_position: 7
---

# Partage de projets

Le partage de projet permet aux membres d'un autre espace de travail de confiance d'accéder à un projet spécifique dans votre espace de travail
. Il n'y a pas de limite au nombre d'espaces de travail que vous pouvez inviter à accéder à votre projet.

## Permissions de partage de projet {#permissions}

Les membres d'un espace de travail invité **peuvent** :

- Accéder au projet partagé à partir de leur propre espace de travail.
- Modifiez le code dans l'éditeur de nuages.
- Gérer les domaines connectés (projets hébergés par 8th Wall) et/ou les domaines auto-hébergés (projets auto-hébergés).
- Mettre à jour les méta-informations (titre, description, image de couverture, etc.).
- Ajouter/modifier des cibles d'images.

Les membres d'un espace de travail invité **ne peuvent pas** :

- Voir les projets de votre espace de travail qui n'ont pas été partagés avec eux.
- Acheter ou gérer des abonnements en marque blanche.
- Modifier/supprimer le projet.
- Gérer le partage et les autorisations.
- Voir le graphique de l'utilisation et des tendances récentes.

## Partager le projet avec 8th Wall Support {#share-project-with-support}

1. Se connecter en tant qu'utilisateur avec les permissions de l'espace de travail `OWNER` ou `ADMIN`.
2. Assurez-vous que vos derniers changements sont [landed](/studio/getting-started/build-land/)
3. Sur la page de l'espace de travail, cliquez sur le menu "..." du projet souhaité et cliquez sur **Partager**.
4. Cliquez sur **Inviter le 8e soutien mural**.

![](/images/account/project-sharing-support.gif)

## Partager un projet avec un autre espace de travail {#share-project-with-another-workspace}

1. Se connecter en tant qu'utilisateur avec les permissions de l'espace de travail `OWNER` ou `ADMIN`.
2. Assurez-vous que vos derniers changements sont [landed](/studio/getting-started/build-land/)
3. Depuis la page de l'espace de travail, cliquez sur le menu "..." du projet souhaité et cliquez sur **Share** :

![ShareProject](/images/account/share-project.jpg)

4. Saisissez l'**URL complète de l'espace de travail** (par exemple "https://www.8thwall.com/otherworkspace") ou l'espace de travail
   **shortname** (par exemple "otherworkspace") et cliquez sur **Inviter l'espace de travail**.

![ShareProjectUrl](/images/account/share-project-url.jpg)

5. Une invitation par courriel sera envoyée aux utilisateurs `OWNER` et `ADMIN` de l'espace de travail invité. L'invitation
   doit être acceptée dans les sept jours, faute de quoi elle expirera.

## Supprimer l'accès à l'espace de travail d'un projet partagé {#remove-workspace-access-from-a-shared-project}

1. Se connecter en tant qu'utilisateur avec les permissions de l'espace de travail `OWNER` ou `ADMIN`.
2. Depuis la page de l'espace de travail, cliquez sur le menu "..." du projet souhaité et cliquez sur **Share** :

![ShareProject](/images/account/share-project.jpg)

3. Cliquez sur l'icône **Poubelle** à côté de l'espace de travail que vous souhaitez empêcher d'accéder au projet.

![ProjectShareRemove](/images/account/share-project-remove.jpg)

4. Cliquez sur **Supprimer** pour confirmer.

## Accéder à un projet partagé par un autre espace de travail {#accessing-a-project-shared-by-another-workspace}

Si vous avez accepté une invitation à des projets appartenant à d'autres espaces de travail, vous les trouverez sous l'onglet
**Projets externes** de votre espace de travail :

![ProjectSharedWithMe](/images/console-appkey-share-project-external-projects.jpg)
