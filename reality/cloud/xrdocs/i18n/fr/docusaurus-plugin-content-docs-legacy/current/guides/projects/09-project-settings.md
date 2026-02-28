---
id: project-settings
---

# Paramètres du projet

La page Paramètres du projet vous permet de

- Définir les préférences du développeur, telles que les raccourcis clavier et le mode sombre
- Modifier les informations sur le projet :
  - Titre
  - Description
  - Activer/désactiver l'écran de démarrage par défaut
  - Mise à jour de l'image de couverture
- Gérer le code d'accès de la phase d'essai
- Accéder à la chaîne de clés du projet
- Définir la version du moteur
- Dépublier l'application
- Désactiver temporairement le projet
- Supprimer un projet

## Préférences de l'éditeur de code {#code-editor-preferences}

Les préférences suivantes de l'éditeur de code peuvent être définies :

- Mode sombre (activé/désactivé)
  - Utilisez une palette de couleurs plus foncées dans l'éditeur de code, avec des couleurs d'arrière-plan plus foncées et des couleurs d'avant-plan plus claires.
- Raccords de touches
  - Activation des raccourcis clavier des éditeurs de texte les plus courants.  Choisir parmi :
    - Normal
    - Sublime
    - Vim
    - Emacs
    - VSCode

## Informations de base {#basic-information}

Les paramètres du projet vous permettent de modifier les informations de base de votre projet.

- Titre du projet
- Description
- [Activer ou désactiver l'écran d'accueil par défaut](/legacy/guides/projects/project-settings/#default-splash-screen)
- Mise à jour de l'image de couverture

## Écran d'accueil par défaut {#default-splash-screen}

L'écran de démarrage par défaut s'affiche au début de chaque expérience de RA Web créée à l'aide de l'éditeur de nuages de
8th Wall. Il ne peut pas être personnalisé, cependant, il peut être désactivé pour
`Commercial projects` si vous êtes sur un plan payant `Pro` ou `Enterprise`.

![DefaultSplashScreen](/images/default-splash-screen.jpg)

Pour activer ou désactiver l'écran d'accueil par défaut :

1. Allez sur la page `Paramètres du projet`.
2. Développez la section "Informations de base".
3. Activer/désactiver le "Splash Screen" par défaut

![DefaultSplashScreenToggle](/images/basic-information-splash-screen.jpg)

**Note:** Tous les projets doivent toujours afficher le badge [Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing)
sur la page de chargement. Il est inclus par défaut dans le `Module de chargement` et ne peut pas être supprimé.
[En savoir plus sur la personnalisation de l'écran de chargement](/legacy/guides/advanced-topics/load-screen/).

## Code d'accès à la mise en scène {#staging-passcode}

Lorsque votre application est mise à disposition sur XXXXX.staging.8thwall.app (où XXXX représente l'URL de votre espace de travail), elle
est protégée par un code d'accès.  Pour visualiser le projet WebAR, l'utilisateur doit d'abord saisir le code d'accès que vous avez fourni à l'adresse
.  C'est un excellent moyen de présenter des projets à des clients ou à d'autres parties prenantes avant le lancement public de
.

Un code d'accès doit comporter 5 caractères ou plus et peut inclure des lettres (A-Z, minuscules ou majuscules),
des chiffres (0-9) et des espaces.

## Clé d'application {#app-key}

:::info
Les clés d'application et l'auto-hébergement ne sont disponibles que dans le cadre d'un [Plan personnalisé] (https://8thwall.com/custom).
:::

Les projets auto-hébergés nécessitent l'ajout d'une clé d'application au code.

Pour accéder à la clé d'application d'un projet :

1. [Créer un projet d'éditeur patrimonial](/legacy/guides/projects/create-legacy-editor-project/) et sélectionner **App Key** comme type de projet.

2. Dans la navigation de gauche, sélectionnez Paramètres du projet :

![LeftNavProjectSettings](/images/left-nav-project-settings.jpg)

3. Faites défiler la page jusqu'à la section **Self-Hosting** et développez le widget **My App Key** :

![ProjectSettingsMyAppKey](/images/project-settings-app-key.jpg)

4. Cliquez sur le bouton **Copier** et collez la chaîne App Key dans la balise `<script>` dans le `<head>` de votre code auto-hébergé.

#### Exemple - Clé d'application {#example---app-key}

```html
<!-- Replace the X's with your App Key -->
<script async src="//apps.8thwall.com/xrweb?appKey=XXXXX"></script>
```

## Version du moteur {#engine-version}

Vous pouvez spécifier la version du moteur 8th Wall utilisée pour servir les clients web publics (`Release`
ou `Beta`).

Les utilisateurs qui consultent une expérience publiée se verront toujours proposer la version la plus récente de 8th Wall
Engine à partir de ce canal.

En général, 8th Wall recommande d'utiliser le canal officiel **release** pour les applications web de production.

Si vous souhaitez tester votre application web avec une version préliminaire du moteur de 8th Wall, qui peut
contenir de nouvelles fonctionnalités et/ou des corrections de bogues qui n'ont pas encore fait l'objet d'un contrôle qualité complet, vous pouvez passer au canal bêta de
. Les expériences commerciales ne doivent pas être lancées sur le canal bêta.

#### Gel de la version du moteur {#freezing-engine-version}

:::note
Le gel de la version du moteur n'est disponible que pour les projets **Commerciaux** disposant d'une licence active.
:::

Pour **Geler** la version actuelle du moteur, sélectionnez le canal souhaité (release ou beta) et cliquez sur le bouton **Geler**.

![EngineFreeze](/images/engine-freeze.png)

Pour **rejoindre** une chaîne et rester à jour, cliquez sur le bouton **Dégeler**.  Cela **dégelera**
la version du moteur associée à votre projet et vous permettra de rejoindre un canal (release ou beta) pour utiliser la
dernière version disponible pour ce canal.

![EngineUnfreeze](/images/engine-unfreeze.png)

## Dépublier l'application {#unpublish-app}

La dépublication de votre projet le supprimera de staging (XXXXX.staging.8thwall.app) ou de public (XXXXX.8thwall.app).

Vous pouvez le publier à nouveau à tout moment à partir de l'éditeur de code ou des pages d'historique du projet.

Cliquez sur **Unpublish Staging** pour supprimer votre projet de XXXXX.staging.8thwall.app.

Cliquez sur **Unpublish Public** pour retirer votre projet de XXXXX.8thwall.app.

## Désactiver temporairement le projet {#temporarily-disable-project}

Si vous désactivez votre projet, votre application ne sera pas visible. Les vues ne sont pas comptabilisées lorsqu'elles sont désactivées.

Les licences commerciales actives pour les projets temporairement désactivés continueront à vous être facturées.

Faites basculer le curseur pour désactiver / activer votre projet.

## Supprimer le projet {#delete-project}

Un projet avec une licence commerciale ne peut pas être supprimé. Visitez la [page de compte]
(/legacy/guides/account-settings#manage-commercial-licenses) pour annuler un projet commercial actif
.

La suppression d'un projet entraîne l'arrêt de son fonctionnement. Il n'est pas possible d'annuler cette opération.
