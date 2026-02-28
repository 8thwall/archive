---
id: quickstart
sidebar_position: 2
---

# Démarrage rapide

## Création d'un projet Studio {#creating-a-studio-project}

1. Pour démarrer un projet Studio, cliquez sur le bouton **"Démarrer un nouveau projet "** de la page Espace de travail.

![StartNewProject](/images/console-workspace-start-project.jpg)

2. Si votre espace de travail est sur un "plan pro", vous devez sélectionner un type de projet. Sélectionnez **Studio** :

![StartNewProject](/images/studio/new-project-studio.png)

3. **Sélectionnez un modèle** : Lorsque vous ouvrez le nouveau projet, quelques modèles de projet
   vous sont proposés pour vous aider à démarrer, notamment des modèles axés sur les jeux et sur la réalité augmentée. Ces modèles de projet
   présentent différentes fonctionnalités et peuvent être facilement modifiés en y insérant vos propres éléments
   . Créez un projet en utilisant l'un des modèles disponibles ou créez un projet à partir du modèle Empty
   .

![StudioTemplatePicker](/images/studio/studio-template-picker.png)

Lorsque votre projet a chargé tout ce dont il a besoin pour commencer, vous pouvez commencer à créer.

## Naviguer dans l'interface {#navigating-the-interface}

:::warning
**Limitez votre projet à un seul onglet de navigateur.** L'ouverture simultanée de plusieurs onglets d'un même projet peut provoquer
des problèmes inattendus au cours du processus de construction. Pour éviter tout problème potentiel, assurez-vous qu'un seul onglet de votre projet est actif
à la fois.
:::

Studio dispose d'une interface d'édition riche composée d'un certain nombre d'outils et de vues différents, chacun d'entre eux
étant essentiel au développement de votre projet.

Les sections ci-dessous présentent les principaux éléments de l'interface de l'éditeur Studio, les fonctionnalités fondamentales étant mises en évidence sur le site
.

![StudioInterface1](/images/studio/studio-navigate-interface.png)

![StudioInterface2](/images/studio/studio-navigate-editor.png)

### Hiérarchie {#hierarchy}

Visualiser les entités et les objets inclus dans l'espace, et modifier leur imbrication. Vous pouvez reparenter ou
déparenter l'objet en cliquant et en faisant glisser l'objet vers une autre position dans la hiérarchie. Cliquez avec le bouton droit de la souris pour
dupliquer ou supprimer des objets. Ajoutez de nouveaux objets à votre espace. Recherche et filtrage de différents objets.

![StudioHierarchy](/images/studio/studio-navigate-hierarchy.png)

### Actifs {#assets}

Les fichiers et les actifs peuvent être gérés à partir du panneau inférieur gauche. Téléchargez vos propres modèles 3D, images 2D, fichiers audio
, scripts personnalisés, etc. Créez des dossiers et faites glisser des fichiers pour réorganiser leur emplacement. Vous pouvez également
glisser-déposer un objet dans la fenêtre de visualisation ou dans la hiérarchie pour ajouter l'entité à votre scène. Pour
en savoir plus sur l'utilisation et l'optimisation des modules 3D au format GLB/GLTF, veuillez consulter [Vos modèles 3D sur le Web
](https://www.8thwall.com/docs/guides/your-3d-models-on-the-web/).

![StudioAssets](/images/studio/studio-navigate-assets.png)

### Fenêtre de visualisation {#viewport}

Ajouter, positionner, mettre à jour et travailler avec les objets et l'éclairage dans l'espace. Utilisez le gizmo de la perspective inférieure
pour changer la vue de la scène, modifier l'éclairage et la visibilité des ombres, et passer de la vue orthographique
à la vue en perspective. Utilisez la barre d'outils supérieure pour modifier la position, la rotation ou l'échelle de
un objet sélectionné, ou pour annuler et rétablir des modifications.

![StudioViewport](/images/studio/studio-navigate-viewport.png)

#### Raccourcis de navigation dans la fenêtre de visualisation {#viewport-navigation-shortcuts}

| Fonction                                              | Raccourci clavier                                          |
| ----------------------------------------------------- | ---------------------------------------------------------- |
| Orbite de la caméra                                   | ⌥ Clic gauche+Glisser                                      |
| Panoramique de la caméra                              | Clic droit+glisser, clic droit+glisser, clic moyen+glisser |
| Zoom de l'appareil photo                              | Molette de défilement                                      |
| Focus sur l'objet sélectionné                         | F                                                          |
| Traduire                                              | W                                                          |
| Rotation                                              | E                                                          |
| Échelle                                               | R                                                          |
| Masquer/afficher le calque de l'interface utilisateur | ⌘\                                                        |
| Supprimer l'objet                                     | Supprimer                                                  |
| Duplicata                                             | ⌘D                                                         |
| Copier l'objet                                        | ⌘C                                                         |
| Coller l'objet                                        | ⌘V                                                         |
| Annuler                                               | ⌘Z                                                         |
| Refaire                                               | ⌘⇧Z, ⌘Y                                                    |

### Liens vers le simulateur et l'aperçu {#simulator--preview-links}

#### Simulateur {#simulator}

Lorsque vous jouez votre scène, elle connecte une instance du Simulateur. Votre fenêtre de visualisation reflétera à distance
la lecture qui se déroule dans le simulateur. Vous pouvez voir les objets spawnés ou procéduraux qui sont
et qui se produisent en lecture dans la hiérarchie de l'espace. Vous pouvez apporter des modifications aux entités de votre espace et
les voir immédiatement reflétées dans la vue du client. Dans les paramètres de l'espace, si l'option Persist
Changes while in Play Mode est activée, ces changements persisteront après la déconnexion de l'état de jeu à l'adresse
. Le client actuellement connecté est indiqué par l'icône de la prise.

![Simulator1](/images/studio/studio-navigate-simulator1.png)

![Simulator2](/images/studio/studio-navigate-simulator2.png)

Le simulateur vous permet également de tester et de visualiser les modifications apportées à un projet en fonction de la taille de l'écran de l'appareil et de l'environnement réel simulé (
), sans avoir à quitter Studio. Le simulateur fonctionne en exécutant
le 8th Wall AR Engine en temps réel sur la collection incluse de séquences AR préenregistrées.
Vous pouvez ouvrir autant d'instances du simulateur que vous le souhaitez, ce qui vous permet de tester les changements apportés au projet dans un éventail de scénarios diversifiés (
). Le simulateur dispose d'un certain nombre de commandes de lecture et de fonctions pratiques, comme
:

- Barre de lecture, scrubber et poignées d'entrée/sortie : Vous permettent de définir des points de boucle, ce qui vous donne un contrôle granulaire sur la séquence sélectionnée (
  ).
- Bouton de recentrage (en bas à droite) : Recentre le flux de la caméra à son point d'origine. NOTE : Recenter est également appelé sur
  à chaque fois que la séquence tourne en boucle et à chaque fois qu'une nouvelle séquence est sélectionnée.
- Bouton d'actualisation (en haut à droite) : actualise la page en conservant le contenu mis en cache. Si vous maintenez la touche SHIFT enfoncée et que vous cliquez sur le bouton d'actualisation à l'adresse
  , vous effectuerez un rechargement complet, sans tenir compte du contenu mis en cache.

#### Liens de prévisualisation {#preview-links}

Prévisualisez instantanément vos projets sur un appareil mobile, un ordinateur de bureau, un casque ou dans une autre fenêtre de navigateur pendant que vous développez sur
via un lien ou un code QR.

![SimulatorPreview](/images/studio/studio-navigate-preview-links.png)

#### Utilisation de Live Preview {#using-live-preview}

- En haut de la fenêtre de l'éditeur de nuages, cliquez sur le bouton Connecter un nouveau périphérique.
- Scannez le code QR avec votre appareil mobile pour ouvrir un navigateur web et voir un aperçu en direct du projet
  WebAR. Ou cliquez sur le code QR pour ouvrir un nouvel onglet dans votre navigateur actuel.
- Lorsque la page se charge, si votre projet utilise la RA Web, vous serez invité à accéder aux capteurs de mouvement et d'orientation
  (sur certains appareils) et à la caméra (sur tous les appareils). Cliquez sur Autoriser pour toutes les invites
  . Vous serez redirigé vers l'URL de développement privé du projet.
- Remarque : le code QR "Preview" affiché dans le Cloud Editor est un code QR temporaire, à usage unique
  , destiné uniquement au développeur pendant qu'il travaille activement dans le Cloud Editor. Ce code QR vous emmène
  à une URL privée, de développement, et n'est pas accessible par d'autres. Pour partager votre travail avec d'autres,
  , veuillez consulter la section ci-dessous sur la publication de votre projet.
- Cliquez sur l'icône du casque pour générer un lien pour un périphérique de casque.

:::tip
En testant votre projet sur plusieurs appareils, vous vous assurez que les utilisateurs bénéficieront d'une expérience cohérente sur
une variété de tailles d'écran et de plates-formes.
:::

### Lancer la barre d'outils {#launch-toolbar}

Studio enregistre automatiquement vos progrès au fur et à mesure que vous travaillez sur un projet, mais les étapes clés du développement de
peuvent être marquées en construisant manuellement votre projet, en enregistrant vos modifications sous forme de commits et en publiant votre projet à l'adresse
.

![StudioLaunchToolbar](/images/studio/studio-navigate-launch-toolbar.png)

**Construire** : Cliquez sur Construire pour enregistrer votre travail et lancer une nouvelle construction de votre projet dans le nuage.

**Land or Sync** : Une fois que vous êtes satisfait de vos modifications, insérez le code mis à jour dans le système intégré de contrôle de la source de Studio (
). En haut à droite de la fenêtre Studio, cliquez sur Land. Le bouton sera vert,
indiquant qu'il y a des changements dans votre projet qui n'ont pas encore été transférés dans le contrôle de source.
"Sync" indique que votre projet n'est pas à jour avec les dernières modifications apportées au contrôle de la source
(exemple : un autre membre de l'équipe a apporté des modifications au projet dans le contrôle de la source).

<!-- ![StudioLand](/images/studio/TODO.png) -->

**Publier** : L'étape finale consiste à publier le code de votre projet mis à jour et atterri en utilisant l'hébergement intégré de 8th Wall (
). Public permet au projet d'être consulté publiquement par n'importe qui sur l'internet. Staging
permet aux personnes disposant d'un code d'accès de visualiser votre projet.

![StudioPublish](/images/studio/studio-navigate-publish.png)

Lorsque vous serez prêt à publier votre projet, vous aurez besoin d'une description et d'une image de couverture. Pour en savoir plus
sur le flux de publication et la présentation d'un projet en vue d'une consultation publique, veuillez consulter
[Section sur la publication dans la documentation générale du 8e mur](https://www.8thwall.com/docs/getting-started/quick-start-guide/#publish-your-project).

### Inspecteur et paramètres spatiaux {#inspector--space-settings}

Visualiser et configurer des composants spécifiques à l'objet, ainsi qu'ajuster les paramètres généraux de l'éditeur.

#### Paramètres généraux {#general-settings}

Si aucun objet n'est sélectionné, les paramètres généraux de votre projet s'affichent.

![StudioGeneralSettings](/images/studio/studio-navigate-general-settings.png)

#### Réglages de l'espace {#space-settings}

Donnez du style à la boîte à ciel de votre espace. Les boîtes à ciel sont une enveloppe autour de votre scène entière qui montre à quoi ressemble le monde
au-delà de votre géométrie. Si votre projet est configuré pour utiliser la RA sur un appareil compatible avec la RA,
(voir [XR](/studio/guides/xr/world/)), la Skybox ne sera pas rendue.

#### Contrôle à la source {#source-control}

Gérer les différentes versions de votre projet et l'historique des modifications. La création d'un nouveau client crée une nouvelle version
de votre projet, ce qui peut être utile pour tester des changements sans affecter la version principale
. Vous pouvez également accéder à l'historique des modifications apportées au projet en sélectionnant la fonction
Project History.

#### Entrées {#inputs}

Utilisez le gestionnaire d'entrées pour configurer des expériences qui fonctionnent avec les entrées de différents appareils, comme les claviers
, les commandes de manettes de jeu, les trackpads et les actions sur l'écran tactile. Créez votre action événementielle et mettez en place sur
un mapping (ou binding) vers différentes entrées. [En savoir plus sur le système Input](/studio/guides/input)

#### Éditeur de code {#code-editor}

Choisissez parmi différents paramètres d'utilisation tels que les modes clair/foncé, les combinaisons de touches et les paramètres d'enregistrement du code.

#### Mode de lecture {#play-mode}

Si le paramètre Live Sync est activé, les modifications apportées dans l'éditeur seront maintenues après la déconnexion du simulateur
ou de la prévisualisation en direct. Si ce paramètre est désactivé, vous pouvez effectuer des modifications dans l'éditeur
et les voir apparaître dans le simulateur, mais ces modifications ne seront pas sauvegardées une fois que le simulateur
sera déconnecté. Pour plus d'informations sur le simulateur, voir la section
[Simulator](/studio/getting-started/quickstart#simulator--preview-links). L'option Persist Changes est activée par défaut sur
.

#### Inspecteur {#inspector}

Inspecter et configurer une entité et ses composants. Pour en savoir plus sur les entités et les composants, consultez le site
[Key Concepts](/studio/essentials/entities-and-components/).

Par défaut, chaque entité affiche un composant Transform dans l'inspecteur. Différents types d'entités
peuvent afficher différents composants, par exemple une primitive affichera un composant Mesh avec
options configurables telles que les paramètres de forme géométrique, les matériaux, les textures, etc.

#### Ajout d'un composant {#adding-a-component}

Vous pouvez ajouter un composant en utilisant le bouton "+ Nouveau composant". Studio comprend plusieurs types de composants
intégrés, notamment les composants physiques, l'éclairage, l'audio, les animations, etc. Des composants personnalisés
peuvent également être ajoutés - [En savoir plus sur les composants personnalisés](/studio/essentials/entities-and-components/components/).
Une fois configuré, votre composant personnalisé
apparaîtra dans la catégorie Personnalisé. Cliquez sur les trois points pour supprimer un composant.

![StudioNewComponent](/images/studio/studio-navigate-adding-a-component.png)

### Console {#console}

Déboguer les actions de construction et d'exécution de votre projet. Le mode débogage est une fonction avancée de Studio qui permet d'enregistrer
, d'obtenir des informations sur les performances et des visualisations améliorées directement sur votre appareil.

![StudioConsole](/images/studio/studio-navigate-console.png)

### Éditeur de code {#code-editor-1}

L'éditeur de code 8th Wall fournit aux développeurs un ensemble d'outils de codage leur permettant de créer, de collaborer et de publier sur
du contenu XR basé sur le web. Notre puissant IDE comprend l'éditeur de code, le contrôle de source intégré, l'historique des modifications (
), la prévisualisation en direct, le débogage à distance sans fil et l'hébergement par bouton-poussoir sur un CDN mondial.
Les autres caractéristiques de l'éditeur de code sont les suivantes

- Intellisense
- Palette de commandes
- Coup d'œil sur le code
- Thèmes clairs/sombres

![StudioEditor](/images/studio/studio-navigate-editor.png)

### Modules {#modules}

8th Wall Modules est une fonction puissante de 8th Wall conçue pour augmenter considérablement l'efficacité du
développement des projets. Les modules 8th Wall vous permettent de sauvegarder et de réutiliser des composants (code, actifs, fichiers)
dans votre espace de travail, ainsi que de trouver et d'importer dans votre projet des modules créés par 8th Wall.

[En savoir plus sur les modules 8th Wall](https://www.8thwall.com/docs/guides/modules/overview/).

#### Module de page d'atterrissage {#landing-page-module}

À côté du navigateur de fichiers, vous verrez un onglet appelé Modules. Tous les exemples de projets, y compris
le projet Empty de base, sont accompagnés du module "Landing Page". Pour en savoir plus sur les modules en général,
, consultez notre [Vue d'ensemble des modules du 8e mur](https://www.8thwall.com/docs/guides/modules/overview/).

![StudioLandingPageModule](/images/studio/studio-navigate-landing-page.png)

Les pages d'atterrissage sont personnalisables grâce au configurateur de modules. Tous les modèles de page d'atterrissage sont
optimisés pour l'image de marque et l'éducation avec différentes mises en page, une conception améliorée du code QR et le support
pour les médias clés.

Les pages d'atterrissage permettent à vos utilisateurs de vivre une expérience enrichissante, quel que soit l'appareil qu’ils utilisent.
Ils apparaissent sur des appareils qui ne sont pas autorisés ou capables d'accéder directement à l'expérience Web AR.

Les pages d'atterrissage s'adaptent intelligemment à votre configuration. Par exemple :

![StudioLandingPageModuleExamples](/images/studio/studio-navigate-landing-page2.png)

:::tip
Nous recommandons à tous les projets d'utiliser le module de page d'atterrissage pour garantir une expérience cohérente sur tous les appareils
.
:::
