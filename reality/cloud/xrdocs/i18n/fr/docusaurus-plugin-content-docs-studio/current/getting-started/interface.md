---
id: navigate-interface
sidebar_position: 4
---

# Navigation dans l'interface

Studio dispose d'une interface d'édition riche composée d'un certain nombre d'outils et de vues différents, chacun d'entre eux
étant essentiel au développement de votre projet.

Les sections ci-dessous présentent les principaux éléments de l'interface de l'éditeur Studio, les fonctionnalités fondamentales étant mises en évidence sur le site
.

![StudioInterface1](/images/studio/studio-navigate-interface.png)

![StudioInterface2](/images/studio/studio-navigate-editor.png)

## Hiérarchie {#hierarchy}

Visualiser les entités et les objets inclus dans l'espace, et modifier leur imbrication. Vous pouvez reparenter ou
déparenter l'objet en cliquant et en faisant glisser l'objet vers une autre position dans la hiérarchie. Cliquez avec le bouton droit de la souris pour
dupliquer ou supprimer des objets. Ajoutez de nouveaux objets à votre espace. Recherche et filtrage de différents objets.

![StudioHierarchy](/images/studio/studio-navigate-hierarchy.png)

## Actifs {#assets}

Les fichiers et les actifs peuvent être gérés à partir du panneau inférieur gauche.

![StudioAssets](/images/studio/studio-navigate-assets.png)

### Fichiers {#files}

Téléchargez vos propres modèles 3D, images 2D, fichiers audio
, scripts personnalisés, etc. Créez des dossiers et faites glisser des fichiers pour réorganiser leur emplacement. Vous pouvez également
glisser-déposer un objet dans la fenêtre de visualisation ou dans la hiérarchie pour ajouter l'entité à votre scène. Pour
en savoir plus sur l'utilisation et l'optimisation des modules 3D au format GLB/GLTF, veuillez consulter [Vos modèles 3D sur le Web
] (/legacy/guides/your-3d-models-on-the-web/).

### Asset Lab {#asset-lab}

Générez des images, des modèles 3D et des personnages animés et truqués avec Asset Lab et accédez à votre bibliothèque
Asset Lab pour importer facilement des ressources dans votre projet.
[En savoir plus sur Asset Lab](/studio/asset-lab/).

### Préfabriqués {#prefabs}

Créez des modèles de jeux réutilisables et personnalisables qui rationalisent et étendent votre développement.
[En savoir plus sur les préfabriqués](/studio/guides/prefabs/).

### Cibles {#targets}

Télécharger et gérer les cibles d'images du projet.
[En savoir plus sur les cibles d'image](/studio/guides/xr/image-targets/).

### Modules {#modules}

8th Wall Modules est une fonction puissante de 8th Wall conçue pour augmenter considérablement l'efficacité du développement des projets
. Les modules 8th Wall vous permettent de sauvegarder et de réutiliser des composants (code, actifs, fichiers)
dans votre espace de travail, ainsi que de trouver et d'importer dans votre projet des modules créés par 8th Wall.
[En savoir plus sur les modules 8th Wall](/studio/guides/modules/).

## Fenêtre de visualisation {#viewport}

Ajouter, positionner, mettre à jour et travailler avec les objets et l'éclairage dans l'espace. Utilisez le gizmo de la perspective inférieure
pour changer la vue de la scène, modifier l'éclairage et la visibilité des ombres, et passer de la vue orthographique
à la vue en perspective. Utilisez la barre d'outils supérieure pour modifier la position, la rotation ou l'échelle de
un objet sélectionné, ou pour annuler et rétablir des modifications.

![StudioViewport](/images/studio/studio-navigate-viewport.png)

### Raccourcis {#shortcuts}

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

## Simulateur {#simulator}

Lancez le simulateur pour jouer votre scène. Vous pouvez apporter des modifications aux entités de votre espace et
les voir immédiatement reflétées dans le simulateur. Le simulateur vous permet également de tester et de visualiser les modifications apportées au projet en fonction de la taille de la fenêtre de visualisation de l'appareil et de
simuler des environnements réels sans avoir à quitter Studio.

![Simulator1](/images/studio/studio-navigate-simulator1.png)

![Simulator2](/images/studio/studio-navigate-simulator2.png)

Si vous développez la réalité augmentée, vous pouvez accéder à une collection de séquences de caméras préenregistrées.
Le simulateur de réalité augmentée dispose d'un certain nombre de commandes de lecture et de fonctions pratiques, comme
:

- Barre de lecture, scrubber et poignées d'entrée/sortie : Vous permettent de définir des points de boucle, ce qui vous donne un contrôle granulaire sur la séquence sélectionnée (
  ).
- Bouton de recentrage (en bas à droite) : Recentre le flux de la caméra à son point d'origine. NOTE : Recenter est également appelé sur
  à chaque fois que la séquence tourne en boucle et à chaque fois qu'une nouvelle séquence est sélectionnée.

## Lancer la barre d'outils {#launch-toolbar}

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

![StudioLand](/images/studio/studio-navigate-land.png)

**Publier** : L'étape finale consiste à publier le code de votre projet mis à jour et atterri en utilisant l'hébergement intégré de 8th Wall (
). Public permet au projet d'être consulté publiquement par n'importe qui sur l'internet. Staging
permet aux personnes disposant d'un code d'accès de visualiser votre projet.

![StudioPublish](/images/studio/studio-navigate-publish.png)

Lorsque vous serez prêt à publier votre projet, vous aurez besoin d'une description et d'une image de couverture. Pour en savoir plus
sur la présentation d'un projet en vue d'une consultation publique, veuillez consulter la section
[Publiez votre projet](/studio/getting-started/publish).

## Paramètres et inspecteur {#settings-inspector}

Visualiser et configurer des composants spécifiques à l'objet, ainsi qu'ajuster les paramètres généraux de l'éditeur.

### Réglages de l'espace {#space-settings}

Si **aucune entité n'est sélectionnée**, vous verrez les paramètres généraux de votre projet.

![StudioGeneralSettings](/images/studio/studio-navigate-general-settings.png)

#### Paramètres par défaut {#default-settings}

Donnez du style à votre espace avec des paramètres tels que Skybox et Fog. Les boîtes à ciel sont une enveloppe autour de votre scène entière qui montre à quoi ressemble le monde
au-delà de votre géométrie. Si votre projet est configuré pour utiliser la RA sur un appareil compatible avec la RA,
(voir [XR](/studio/guides/xr/world/)), la Skybox ne sera pas rendue.

#### Paramètres du projet {#project-settings}

Si vous avez plusieurs espaces, sélectionnez celui qui est l'espace d'entrée.

Utilisez le gestionnaire d'entrées pour configurer des expériences qui fonctionnent avec les entrées de différents appareils, comme les claviers
, les commandes de manettes de jeu, les trackpads et les actions sur l'écran tactile. Créez votre action événementielle et mettez en place sur
un mapping (ou binding) vers différentes entrées. [En savoir plus sur le système de saisie](/studio/guides/input)

#### Version du projet {#project-version}

Les projets Studio peuvent être exécutés avec une version d'exécution spécifique, qui peut être sélectionnée ici. Fixez la durée d'exécution de votre projet pour plus de prévisibilité, ou optez pour des mises à jour mineures et des corrections de bogues automatiques pour rester toujours à la page.

#### Contrôle à la source {#source-control}

Gérer les différentes versions de votre projet et l'historique des modifications. La création d'un nouveau client crée une nouvelle version
de votre projet, ce qui peut être utile pour tester des changements sans affecter la version principale
. Vous pouvez également accéder à l'historique des modifications apportées au projet en sélectionnant la fonction
Project History.

#### Éditeur de code {#code-editor}

Choisissez parmi différents paramètres d'utilisation tels que les modes clair/foncé, les combinaisons de touches et les paramètres d'enregistrement du code.

### Inspecteur {#inspector}

Inspecter et configurer une entité et ses composants. Pour en savoir plus sur les entités et les composants, voir [Overview](/studio/essentials/overview/).

Par défaut, chaque entité affiche un composant Transform dans l'inspecteur. Différents types d'entités
peuvent afficher différents composants, par exemple une primitive affichera un composant Mesh avec
options configurables telles que les paramètres de forme géométrique, les matériaux, les textures, etc.

#### Composants {#components}

Vous pouvez ajouter un composant en utilisant le bouton "+ Nouveau composant". Studio comporte plusieurs types de composants
intégrés, notamment des composants physiques, d'éclairage, audio, d'animation, etc. Des composants personnalisés
peuvent également être ajoutés - [En savoir plus sur les composants personnalisés](/studio/essentials/custom-components/). Une fois configuré, votre composant personnalisé
apparaîtra dans la catégorie Personnalisé. Cliquez sur les trois points pour supprimer un composant.

![StudioNewComponent](/images/studio/studio-navigate-components.png)

## Appareils et consoles {#devices--console}

### Connecter l'appareil {#connect-device}

:::tip
En testant votre projet sur plusieurs appareils, vous vous assurez que les utilisateurs bénéficieront d'une expérience cohérente sur
une variété de tailles d'écran et de plates-formes.
:::

Prévisualisez instantanément vos projets sur un appareil mobile, un ordinateur de bureau, un casque ou dans une autre fenêtre de navigateur pendant que vous développez sur
via un lien ou un code QR.

![SimulatorPreview](/images/studio/studio-navigate-preview-links.png)

- En bas de l'interface Studio, cliquez sur le bouton Connect Device.
- Scannez le code QR avec votre appareil mobile pour ouvrir un navigateur web et tester votre projet.
  Ou cliquez sur le code QR pour ouvrir un nouvel onglet sur le navigateur de votre ordinateur.
- Lorsque la page se charge, si votre projet utilise WebAR, vous serez invité à accéder aux capteurs de mouvement et d'orientation
  (sur certains appareils) et à la caméra (sur tous les appareils). Cliquez sur Autoriser pour toutes les invites
  . Vous serez dirigé vers l'URL de développement privé du projet.
- Remarque : le code QR "Preview" est un code QR temporaire, à usage unique
  , destiné à être utilisé uniquement par le développeur pendant qu'il développe activement dans Studio. Ce code QR vous emmène
  à une URL privée, de développement, et n'est pas accessible par d'autres. Pour partager votre travail avec d'autres,
  , veuillez consulter la section ci-dessous sur la publication de votre projet.
- Cliquez sur l'icône du casque pour générer un lien pour un périphérique de casque.

### Console {#console}

Déboguer les actions de construction et d'exécution de votre projet. Le mode débogage est une fonction avancée de Studio qui permet d'enregistrer
, d'obtenir des informations sur les performances et des visualisations améliorées directement sur votre appareil.

![StudioConsole](/images/studio/studio-navigate-console.png)

## Éditeur de code {#code-editor-1}

L'éditeur de code 8th Wall fournit aux développeurs un ensemble d'outils de codage leur permettant de créer, de collaborer et de publier sur
du contenu XR basé sur le web. Notre puissant IDE comprend l'éditeur de code, le contrôle de source intégré, l'historique des modifications (
), la prévisualisation en direct, le débogage à distance sans fil et l'hébergement par bouton-poussoir sur un CDN mondial.
Les autres caractéristiques de l'éditeur de code sont les suivantes

- Intellisense
- Palette de commandes
- Coup d'œil sur le code
- Thèmes clairs/sombres

![StudioEditor](/images/studio/studio-navigate-editor.png)
