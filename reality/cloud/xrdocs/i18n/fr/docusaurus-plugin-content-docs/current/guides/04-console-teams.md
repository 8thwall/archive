---
id: teams
---

# Les équipes

Chaque espace de travail a une équipe contenant un ou plusieurs utilisateurs, chacun avec des permissions différentes. Les utilisateurs peuvent appartenir à plusieurs équipes de l'espace de travail.

Ajoutez d'autres personnes à votre équipe pour leur permettre d'accéder aux projets de votre espace de travail. Cela vous permet de créer, de gérer, de tester et de publier des projets de WebAR en équipe.

## Inviter des utilisateurs {#invite-users}

1. Sélectionnez votre espace de travail.

![Sélectionnez l'espace de travail](/images/console-home-my-workspaces.jpg)

2. Cliquez sur **Team** dans la navigation de gauche.

![SelectAccountNav](/images/console-workspace-nav-teams.jpg)

3. Saisissez l'adresse électronique des utilisateurs que vous souhaitez inviter.  Saisissez plusieurs courriels séparés par des virgules.
4. Cliquez sur **Inviter des utilisateurs**

![ManagePlans](/images/console-teams-invite.jpg)

## Rôles des utilisateurs {#user-roles}

Les membres de l'équipe peuvent occuper l'un des rôles suivants :
* PROPRIÉTAIRE
* ADMIN
* BILLMANAGER
* DEV

Capacités pour chaque rôle :

| Capacité                                             | PROPRIÉTAIRE | ADMIN | BILLMANAGER | DEV |
| ---------------------------------------------------- | ------------ | ----- | ----------- | --- |
| Projets - Voir                                       | X            | X     | X           | X   |
| Projets - Créer                                      | X            | X     | X           | X   |
| Projets - Éditer                                     | X            | X     | X           | X   |
| Projets - Supprimer                                  | X            | X     | X           | X   |
| Équipe - Voir les utilisateurs                       | X            | X     | X           | X   |
| Équipe - Inviter des utilisateurs                    | X            | X     |             |     |
| Équipe - Supprimer des utilisateurs                  | X            | X     |             |     |
| Équipe - Gérer les rôles des utilisateurs            | X            | X     |             |     |
| Profil public - Activer                              | X            | X     |             |     |
| Profil public - Désactiver                           | X            | X     |             |     |
| Profil public - Publier un projet mis en avant       | X            | X     |             |     |
| Profil public - Modifier le projet mis en avant      | X            | X     |             | X   |
| Profil public - Dépublier le Projet mis en avant     | X            | X     |             |     |
| Compte - Gérer le plan                               | X            | X     | X           |     |
| Compte - Gérer les licences commerciales             | X            | X     | X           |     |
| Compte - Gérer les modes de paiement                 | X            | X     | X           |     |
| Compte - Mise à jour des informations de facturation | X            | X     | X           |     |
| Compte - Consulter/payer les factures                | X            | X     | X           |     |

## Poignées d'utilisateurs {#user-handles}

Chaque utilisateur de votre espace de travail dispose d'un identifiant. Les poignées de l'espace de travail seront les mêmes que celles définies dans le profil de l'utilisateur, à moins qu'elles n'aient déjà été prises ou personnalisées par l'utilisateur.

Les Handles sont utilisés comme partie de l'URL (dans le format "handle-client-workspace.dev.8thwall.app") pour prévisualiser les nouvelles modifications lors du développement avec le Cloud Editor de 8th Wall.

Exemple : tony-default-mycompany.dev.8thwall.app

#### Important {#important}

* Avant de changer de pseudonyme, assurez-vous que tout le travail effectué dans le Cloud Editor est sauvegardé.
* Toutes les modifications que vous avez apportées aux projets de l'espace de travail et qui n'ont pas été validées seront abandonnées.
* Tous les clients que vous avez créés dans les projets de l'espace de travail seront supprimés.

#### Modifier la poignée de l'utilisateur {#modify-user-handle}

1. Sélectionnez votre espace de travail.
2. Cliquez sur **Team** dans la navigation de gauche
3. Saisissez une nouvelle poignée.
4. Cliquez sur ✔ pour enregistrer.
5. Confirmez vous

![Changer la poignée](/images/console-teams-handle.jpg)
