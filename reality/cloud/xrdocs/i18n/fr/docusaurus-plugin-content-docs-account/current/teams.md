---
id: teams
sidebar_position: 4
---

# Les équipes

Chaque espace de travail a une équipe contenant un ou plusieurs utilisateurs, chacun avec des permissions différentes. Les utilisateurs peuvent appartenir à plusieurs équipes de l'espace de travail.

Ajoutez d'autres personnes à votre équipe pour leur permettre d'accéder aux projets de votre espace de travail. Cela vous permet de créer, de gérer, de tester et de publier en équipe des projets de RA Web.

## Inviter des utilisateurs {#invite-users}

1. Sélectionnez votre espace de travail.

![SelectWorkspace](/images/console-home-my-workspaces.jpg)

2. Cliquez sur **Team** dans la navigation de gauche.

![SelectAccountNav](/images/console-workspace-nav-teams.jpg)

3. Saisissez l'adresse électronique des utilisateurs que vous souhaitez inviter.  Saisissez plusieurs courriels séparés par des virgules.
4. Cliquez sur **Inviter les utilisateurs**

![ManagePlans](/images/console-teams-invite.jpg)

## Rôles des utilisateurs {#user-roles}

Les membres de l'équipe peuvent jouer l'un des rôles suivants :

- PROPRIÉTAIRE
- ADMIN
- BILLMANAGER
- DEV

Capacités pour chaque rôle :

| Capacité                                             | PROPRIÉTAIRE | ADMIN | BILLMANAGER | DEV |
| ---------------------------------------------------- | ------------ | ----- | ----------- | --- |
| Projets - Voir                                       | X            | X     | X           | X   |
| Projets - Créer                                      | X            | X     | X           | X   |
| Projets - Editer                                     | X            | X     | X           | X   |
| Projets - Supprimer                                  | X            | X     | X           | X   |
| Équipe - Voir les utilisateurs                       | X            | X     | X           | X   |
| Équipe - Inviter des utilisateurs                    | X            | X     |             |     |
| Équipe - Supprimer des utilisateurs                  | X            | X     |             |     |
| Équipe - Gérer les rôles des utilisateurs            | X            | X     |             |     |
| Profil public - Activer                              | X            | X     |             |     |
| Profil public - Désactiver                           | X            | X     |             |     |
| Profil public - Publier un projet en vedette         | X            | X     |             |     |
| Profil public - Modifier le projet présenté          | X            | X     |             | X   |
| Profil public - Dépublier le projet présenté         | X            | X     |             |     |
| Compte - Gérer les abonnements                       | X            | X     | X           |     |
| Compte - Gérer les modes de paiement                 | X            | X     | X           |     |
| Compte - Mise à jour des informations de facturation | X            | X     | X           |     |
| Compte - Consulter/payer les factures                | X            | X     | X           |     |

## Manipulation par l'utilisateur {#user-handles}

Chaque utilisateur de votre espace de travail dispose d'un identifiant. Les poignées de l'espace de travail seront les mêmes que celles définies dans le profil de l'utilisateur, à moins qu'elles n'aient déjà été prises ou personnalisées par l'utilisateur.

Les Handles sont utilisés comme partie de l'URL (dans le format "handle-client-workspace.dev.8thwall.app") pour prévisualiser les nouvelles modifications lors du développement avec l'éditeur cloud de 8th Wall.

Exemple : tony-default-mycompany.dev.8thwall.app

:::danger

- Avant de changer de pseudonyme, assurez-vous que tout le travail effectué dans l'Éditeur de nuages est sauvegardé.
- Toutes les modifications apportées aux projets de l'espace de travail qui n'ont pas été approuvées seront abandonnées.
- Tous les clients que vous avez créés dans les projets de l'espace de travail seront supprimés.
  :::

#### Modifier la poignée de l'utilisateur {#modify-user-handle}

1. Sélectionnez votre espace de travail.
2. Cliquez sur **Team** dans la navigation de gauche
3. Saisir une nouvelle poignée.
4. Cliquez sur &#10004; pour enregistrer.
5. Confirmez

![Change Handle](/images/console-teams-handle.jpg)
