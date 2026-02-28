---
id: release-notes
sidebar_position: 999
toc_max_heading_level: 2
latest_popup_id: plus récent
runtime_version_2025_10_24: 2.2.0
runtime_version_2025_10_16: 2.1.0
runtime_version_2025_10_10: 2.0.1
runtime_version_2025_09_25: 2.0.1
runtime_version_2025_09_17: 2.0.0
runtime_version_2025_09_09: 2.0.0
runtime_version_2025_08_29: 1.1.0
runtime_version_2025_08_19: 1.0.0
runtime_version_2025_08_06: 1.0.0
---

# Notes de mise à jour

<style> p:has(+ ul) {margin-bottom: 0 !important}</style>

## Octobre 2025 [Mise à jour 3] {#version-2025-october-24}

24 octobre 2025

### Nouvelles fonctionnalités

Runtime 2.2.0 ajoute les décalages de rotation des collisionneurs physiques, et d'autres corrections/améliorations. Lisez les notes de version complètes de
[ici](/api/studio/changelog/#2.2.0).

## Octobre 2025 [Mise à jour 2] {#version-2025-october-16}

16 octobre 2025

### Nouvelles fonctionnalités

Le Runtime 2.1.0 introduit une API pour la boîte à ciel et le brouillard, ainsi que d'autres corrections/améliorations. Lisez les notes de version complètes de
[ici](/api/studio/changelog/#2.1.0).

## Octobre 2025 [Mise à jour 1] {#version-2025-october-10}

10 octobre 2025

### Nouvelles fonctionnalités

Application de bureau

- Ajout de la prise en charge de Windows. Télécharger [ici](https://www.8thwall.com/download).

Exportation d'applications natives

- Ajout d'options d'intégration iFrame avec un extrait de code copiable dans le flux de publication. Pour en savoir plus [ici](https://www.8thwall.com/blog/post/196857049250/embedding-made-easy-iframe-support-in-8th-walls-publish-flow).

### Corrections et améliorations

Application de bureau

- Correction d'un problème où l'application de bureau 8th Wall sur Mac se bloquait parfois lors de la lecture initiale.
- L'application de bureau prend désormais en charge les traductions basées sur les préférences linguistiques de l'utilisateur.

Exportation d'applications natives

- Introduction d'une option de configuration permettant d'inclure ou de supprimer la barre d'état dans les versions d'exportation des applications natives iOS.

Général

- Les fichiers Markdown s'ouvrent par défaut en mode prévisualisation (Studio Web)

## Septembre 2025 [Mise à jour 3] {#version-2025-september-25}

25 septembre 2025

### Corrections et améliorations

Physique

- Correction d'un problème empêchant les objets dynamiques d'atteindre le repos complet
- Correction d'un plantage après des changements d'échelle répétés du collisionneur

Particules

- Correction des directions d'émission incorrectes
- Les effets de particules sont indépendants du framerate.

Application de bureau

- Fiabilité accrue du simulateur

UI

- Correction d'un problème entraînant un placement incorrect des décalages sur les éléments de l'interface utilisateur

## Septembre 2025 [Mise à jour 2] {#version-2025-september-17}

17 septembre 2025

### Nouvelles fonctionnalités

Application de bureau

- [L'application de bureau 8th Wall est ici](http://8th.io/desktopappblog). Désormais en bêta publique pour macOS, et bientôt pour Windows, l'application Desktop apporte la rapidité du développement local et la collaboration du cloud. [En savoir plus](https://www.8thwall.com/docs/studio/app/) et [Télécharger maintenant](https://www.8thwall.com/download).

![](/images/studio/app/hub.jpg)

## Septembre 2025 [Mise à jour 1] {#version-2025-september-9}

9 septembre 2025

### Nouvelles fonctionnalités

Amélioration de la physique

- Le tout nouveau Studio Runtime 2.0.0 est doté d'un [moteur physique reconstruit] (https://8th.io/v2update) plus rapide, plus fluide et prêt à faire face à toutes les situations.
- Certains comportements physiques sont donc différents pour des propriétés telles que le frottement, la restitution et l'amortissement. Consultez le [guide de mise à jour] (https://8th.io/v2upgradeguide) pour une transition en douceur vers la version 2.0.
- Collisionneurs cinématiques : Ajout d'une option cinématique aux types de collisionneurs. Permet aux objets d'avoir des mouvements scriptés ou animés, tout en autorisant les interactions avec les collisions physiques.

Exportation d'applications natives

- Exportez votre expérience 3D ou XR en tant qu'application iOS et augmentez votre portée en la publiant à la fois sur le web et dans la boutique d'applications iOS.

### Corrections et améliorations

Préfabriqués

- Correction d'un problème où les collisions sur les objets préfabriqués imbriqués ne se généraient pas correctement.

Exportation d'applications natives

- Mise à jour de la cible du SDK Android pour l'exportation d'applications natives Android du niveau API 34 au niveau API 36 afin d'assurer la conformité avec les exigences de distribution de Google Play (les applications doivent cibler le niveau API 35+).
- Correction d'un problème où les effets de particules et les polices personnalisées ne s'affichaient pas correctement dans le mode de construction Static Bundle pour Android Native App Export.

Général

- Mise à jour du comportement de la lecture automatique des vidéos afin que les vidéos avec audio se lisent automatiquement en sourdine. Le son de la vidéo sera automatiquement rétabli dès qu'une interaction avec l'utilisateur aura eu lieu.
- Activation d'une vérification plus stricte des scripts au moment de la construction afin d'améliorer les rapports d'erreur.
- Désormais, dans Studio, vous serez automatiquement informé des nouvelles mises à jour.

## Août 2025 [Mise à jour 3] {#version-2025-august-29}

29 août 2025

### Nouvelles fonctionnalités

Version d'exécution

- Les projets Studio peuvent être exécutés avec une version spécifique, qui peut être mise à jour dans les paramètres. Fixez la durée d'exécution de votre projet pour plus de prévisibilité, ou optez pour des mises à jour mineures et des corrections de bogues automatiques pour rester toujours à la page.

### Corrections et améliorations

Laboratoire des actifs

- Les étapes précédentes de génération d'actifs s'affichent désormais lors de l'envoi d'actifs à partir de la bibliothèque pour générer des flux de travail.
- Réessayer plusieurs angles de vue en même temps pendant l'étape de génération d'images pour les flux de travail des modèles 3D et des personnages animés

Visage

- Correction du maillage du visage qui n'est pas rendu tel que configuré avec la caméra Face AR

Physique

- Correction de l'application d'une forme corrompue aux collisionneurs automatiques

## Août 2025 [Mise à jour 2] {#version-2025-august-19}

19 août 2025

### Nouvelles fonctionnalités

Facturation

- Ajout de rechargements de crédit en une seule fois

Général

- Ajout d'un widget de prévisualisation de l'appareil photo

### Corrections et améliorations

Facturation

- Ajout d'un portail de facturation Stripe pour gérer les abonnements, les informations de facturation et les factures.

Cibles d'image

- Correction d'un problème empêchant la mise à jour des cibles des images courbes

Laboratoire des actifs

- Permettre la re-génération d'une seule image lors de la génération d'images multi-vues pour les flux de travail des modèles 3D et des personnages animés

Général

- Correction d'un problème empêchant certains utilisateurs de s'inscrire auprès de Google

## Août 2025 [Mise à jour 1] {#version-2025-august-6}

6 août 2025

### Corrections et améliorations

Général

- Amélioration de la convivialité et de l'organisation de la composante "appareil photo".
- Correction d'un problème où le brouillard n'apparaissait pas lorsqu'il était activé dans le configurateur
- Correction du problème de verrouillage du pointeur de la souris affectant le composant Fly Controls dans Studio

Laboratoire des actifs

- Ajout de la prise en charge de l'opacité de l'arrière-plan pour les images générées avec Image-GPT-1

Éléments de l'interface utilisateur

- Correction de l'artefact apparaissant sur les éléments de l'interface utilisateur avec des images transparentes sur certains appareils iOS
  Particles
- Correction des particules GLTF qui ne s'affichent pas sur
  Prefabs
- Correction des mises à jour du collisionneur pour les enfants des préfabriqués

## Juillet 2025 [Mise à jour 4] {#version-2025-july-29}

29 juillet 2025

### Nouvelles fonctionnalités

Laboratoire des actifs

- Ajout de contrôles pour optimiser les modèles 3D générés

Éléments de l'interface utilisateur

- Ajout de la configuration de l'ordre d'empilement pour gérer les éléments qui se chevauchent

### Corrections et améliorations

Éléments de l'interface utilisateur

- Amélioration de la gestion de l'ordre de tri des éléments frères
- Les groupes d'éléments de l'interface utilisateur sont désormais aplatis en une seule couche

Transformations

- Ajout de `getWorldQuaternion` et `setWorldQuaternion` à world.transform

Physique

- Activation du mode haute précision pour les collisionneurs dynamiques

Matériaux

- Ajout du filtrage des textures avec support mipmap

Éclaboussures

- Ajout de la prise en charge de spz v3

Laboratoire des actifs

- Ajout d'une option permettant de sélectionner des actifs dans la bibliothèque pour les utiliser en tant qu'entrées dans les flux de production d'images, de modèles 3D et de personnages animés.

## Juillet 2025 [Mise à jour 3] {#version-2025-july-22}

22 juillet 2025

### Nouvelles fonctionnalités

Gestionnaire des entrées

- Ajout d'une liaison Screen Touch dans le gestionnaire d'entrées.

### Corrections et améliorations

Laboratoire des actifs

- Ajout de la prise en charge des images chargées par l'utilisateur pour le flux de travail de génération de modèles 3D.
- Mise à jour du flux de travail pour les personnages animés afin de prendre en charge les générations d'images uniques en 3D.
- Ajout de la prise en charge des modèles 3D téléchargés par l'utilisateur pour le flux de travail des personnages animés.

XR

- Correction d'un problème où le clignotement initial se produisait pendant les permissions de la caméra lorsque les objets de la scène étaient chargés.

Exportation d'applications natives

- Mise à jour de la chaîne de l'agent utilisateur pour les applications natives Android afin de mieux refléter la plateforme et l'appareil.
- Correction d'un problème de comportement inattendu des événements tactiles dans les applications Android natives.

## Juillet 2025 [Mise à jour 2] {#version-2025-july-15}

15 juillet 2025

### Nouvelles fonctionnalités

Espaces

- Ajout de la configuration du brouillard dans les paramètres de l'espace.

### Corrections et améliorations

Éléments de l'interface utilisateur

- Ajout de l'option ignoreRaycast.

Laboratoire des actifs

- Ajout de la possibilité de prévisualiser les clips d'animation dans le flux de travail des personnages animés.

XR

- Correction de l'erreur de clé d'application invalide lors du rechargement de l'appareil photo XR.

## Juillet 2025 [Mise à jour 1] {#version-2025-july-07}

7 juillet 2025

### Nouvelles fonctionnalités

Laboratoire des actifs

- Ajout de la prise en charge du modèle de génération d'images en 3D Hunyuan3D-2.1.
- Ajout de la prise en charge du modèle de génération d'images Flux Schnell.

Exportation d'applications natives

- Prise en charge activée pour diverses orientations de périphérique.
- Ajout d'options de configuration pour la barre d'état de l'appareil.
- Ajout de la prise en charge du multi-touches.

### Corrections et améliorations

Général

- Correction du problème où la caméra réglée pour se concentrer sur le déplacement d'objets ne se mettait pas à jour correctement.

Préfabriqués

- Correction de divers problèmes d'exécution des préfabriqués.
- Correction d'un problème où les composants des enfants de la préfabrication n'étaient pas supprimés correctement.
- Les mises à jour de style ont été faites pour mieux mettre en évidence les composants et les changements remplacés.
- Correction d'un problème où les composants des enfants de la préfabrication n'étaient pas supprimés correctement.

Éléments de l'interface utilisateur

- Correction d'un problème d'étirement des images lorsqu'elles sont définies sur "Container".

Laboratoire des actifs

- Correction des délais de chargement de la bibliothèque.

Particules

- Correction du problème où les particules ne pouvaient pas être remplacées par des primitives cubes lorsqu'aucune primitive n'était définie.

Matériaux

- Amélioration des performances du matériel vidéo du GLTF.

Maille

- Correction du problème où l'ajout d'un collision à certains GLB faisait disparaître l'objet dans la fenêtre d'affichage du Studio.

Exportation d'applications natives

- Amélioration de la cohérence de mise à l'échelle de l'interface utilisateur sur les applications Android.
- Correction de problèmes intermittents lors de l'ouverture ou de la fermeture des applications Android.

Simulateur

- Correction d'un problème où le simulateur s'initialisait deux fois à l'ouverture.

## Juin 2025 [Mise à jour 3] {#version-2025-june-11}

11 juin 2025

### Nouvelles fonctionnalités

Laboratoire des actifs

- Générez des images, des modèles 3D et des personnages animés et riggés avec notre nouveau laboratoire d'actifs et ajoutez-les facilement à votre scène.

Exportation d'applications natives

- Exportez votre expérience 3D ou XR en tant qu'application Android et augmentez votre portée en la publiant à la fois sur le web et dans les magasins d'applications.

**Corrections et améliorations**

Général

- Suppression du paramètre optionnel Live Sync pour une lecture plus rationnelle.
- Mise à jour des commandes de lecture et de construction du studio pour une plus grande facilité d'utilisation.

## Juin 2025 [Mise à jour 2] {#version-2025-june-09}

9 juin 2025

### Nouvelles fonctionnalités

Éléments de l'interface utilisateur

- Les événements de survol sont désormais pris en charge pour les éléments de l'interface utilisateur.

Matériaux

- Ajout d'une API pour travailler avec les textures vidéo au moment de l'exécution.

**Corrections et améliorations**

Éléments de l'interface utilisateur

- Correction d'un problème provoquant la persistance des éléments de l'interface utilisateur lors de l'utilisation de `display : none`.

Animations

- Correction d'un bug dans les transitions des animations.

## Juin 2025 [Mise à jour 1] {#version-2025-june-02}

2 juin 2025

### Nouvelles fonctionnalités

Préfabriqués

- Nous avons ajouté la prise en charge des Prefabs dans Studio pour créer des modèles de jeu réutilisables et personnalisables qui rationalisent et adaptent votre développement et optimisent les performances.
- Consultez notre [Guide des préfabriqués](/studio/guides/prefabs) pour commencer.

Général

- Les vidéos sont désormais prises en charge en tant que cartes de texture matérielle. Note : Le nouveau VideoMaterial override tous les matériaux glTF, comme HiderMaterial et VideoMaterial.

## Mai 2025 [Mise à jour 2] {#version-2025-may-29}

29 mai 2025

### Nouvelles fonctionnalités

Événements des éléments de l'interface utilisateur

- Nous avons introduit des événements d'interface utilisateur pour les éléments d'interface utilisateur tels que les boutons. (c'est-à-dire Pressé, Libéré, Sélectionné, Désactivé)
- Les événements de l'interface utilisateur ont désormais des chaînes de caractères dédiées.
- Pour en savoir plus, consultez la section Événements de la documentation de l'API.

Lumières

- Nous avons introduit un nouveau type de lumière appelé "Area Light" qui émet de la lumière à partir d'une primitive rectangulaire.

### Corrections et améliorations

Audio

- Correction d'un problème où plusieurs entités audio n'apparaissaient pas correctement.

## Mai 2025 [Mise à jour 1] {#version-2025-may-05}

5 mai 2025

### Nouvelles fonctionnalités

Réflexions sur la scène

- Ajout de la possibilité de définir une carte de réflexion sur un espace. Cette carte de réflexion affecte la configuration de l'éclairage de votre scène et modifie l'affichage des matériaux réfléchissants. Voir le nouveau paramètre Réflexions dans le panneau Paramètres de l'espace.

**Corrections et améliorations**

Général

- Ajout d'une nouvelle directive "required" pour rendre obligatoires les champs des composants personnalisés. La directive `@required` pour les composants personnalisés génère une erreur si la condition n'est pas remplie lors de la construction.

## Avril 2025 [Mise à jour 2] {#version-2025-april-29}

29 avril 2025

### Nouvelles fonctionnalités

Matériaux

- Ajout d'un nouveau paramètre pour l'habillage des textures dans le configurateur de matériaux.

## Avril 2025 [Mise à jour 1] {#version-2025-april-9}

9 avril 2025

### Nouvelles fonctionnalités

Cibles d'image

- \*\*Les développeurs peuvent désormais ancrer le contenu AR aux images du monde réel, ce qui permet une nouvelle gamme d'expériences créatives et éducatives.

### Corrections et améliorations

Entrée

- `input.getMousePosition()` renvoie maintenant `clientX/Y` au lieu de `screenX/Y` pour un meilleur alignement avec les coordonnées du viewport.
- Ajout d'un nouvel événement `ecs.input.UI_CLICK` pour améliorer le suivi des interactions avec l'interface utilisateur.

Transformations

- Ajout de fonctions utilitaires de transformation dans world.transform.

Radiodiffusion

- Ajout de nouvelles fonctions de raycasting : `raycast()` et `raycastFrom()` pour une interaction plus flexible et plus précise avec les objets 3D.

UI

- Mise à jour de l'interface système Studio UI pour une expérience de développement plus intuitive.

Général

- Correction d'un bug où `world.spaces` ne pouvait pas être accédé dans les callbacks `add`.
- Correction d'un problème avec les pièces jointes d'oreille qui n'apparaissaient pas dans la fenêtre de visualisation lorsqu'elles étaient activées.

## Mars 2025 [Mise à jour 1] {#version-2025-March-5}

5 mars 2025

### Corrections et améliorations

Général

- Ajout d'un événement de spawned de l'emplacement

Ombre

- Frustum de la caméra à ombre intelligente

Animations

- Correction de bogues pour les animations de position/rotation
- Correction du blocage de l'animation lors du changement de modèle

Actifs

- Correction d'un bug où les paramètres étaient périmés lors du chargement des actifs
- Correction d'un problème de concurrence dans le chargement des images de l'interface utilisateur

## Février 2025 [Mise à jour 1] {#version-2025-february-13}

13 février 2025

### Nouvelles fonctionnalités

Cartes Niantic pour le Web

- Relier les expériences au monde réel
  Les cartes sont essentielles à la création d'expériences basées sur la localisation. Désormais, grâce aux cartes Niantic pour le Web disponibles directement dans 8th Wall Studio, vous pouvez les ajouter à votre flux de travail en toute transparence. Avec Niantic Maps in Studio, les développeurs de Studio ont désormais accès à la même technologie que celle utilisée par Niantic pour alimenter nos jeux les plus populaires dans le monde réel, ce qui vous permet d'ancrer vos expériences de RA dans des lieux réels, de faciliter la découverte d'expériences basées sur la localisation et d'agir comme un agrégateur d'expériences de RA dans le monde réel. Les cartes sont désormais entièrement intégrées à la hiérarchie des scènes de Studio, ce qui vous permet d'insérer des cartes dans vos projets d'un simple clic - aucune configuration API supplémentaire n'est nécessaire.

Espaces

- Spaces vous permet désormais de construire et de gérer plusieurs zones distinctes au sein d'un même projet. Vous pouvez considérer les espaces comme des scènes ou des environnements dans d'autres moteurs de jeu ou outils de conception. Pour faire simple, les espaces sont des cadres 3D dans lesquels vous pouvez placer des actifs, des éclairages, des caméras et des interactions de jeu. Un espace (également appelé scène) contient toutes vos entités.

## Janvier 2025 [Mise à jour 3] {#version-2025-january-31}

31 janvier 2025

### Corrections et améliorations

Général

- Correction de bugs généraux pour améliorer les performances du chargement des scènes, du chargement des splats et du travail en mode Live Sync.

## Janvier 2025 [Mise à jour 2] {#version-2025-january-23}

23 janvier 2025

### Corrections et améliorations

Éléments de l'interface utilisateur

- Ajout d'une configuration d'étirement à 9 tranches pour la taille de l'arrière-plan (éléments d'interface utilisateur 3D uniquement)
- Ajout de la configuration du rayon de la frontière

Général

- Correction d'un bug où l'espace colorimétrique n'était pas correctement reflété pour les éléments de l'interface utilisateur.

Physique

- Ajoute un interrupteur pour le système physique, il sautera le système à chaque tick, il fonctionne également comme une optimisation lorsque la physique n'est pas utilisée.

## Janvier 2025 [Mise à jour 1] {#version-2025-january-15}

15 janvier 2025

### Corrections et améliorations

Lumière

- Ajout du type de lumière `spot`.

Ombre

- La configuration de la réception de l'ombre est déplacée vers le composant Mesh.

Mathématiques

- Ajouté `Mat4.decomposeT`
- Ajouté `Mat4.decomposeR`
- Ajouté `Mat4.decomposeS`

## Décembre 2024 [Mise à jour 1] {#version-2024-december-09}

9 décembre 2024

### Corrections et améliorations

VPS

- Ajout de la possibilité de masquer l'affichage de l'élément Localisation dans la fenêtre de visualisation.

UI

- Correction des problèmes d'affichage des polices personnalisées

Audio

- Ajout de la possibilité d'obtenir et de définir la progression des clips audio

VPS

- Ajout de `location` aux données d'événements VPS avec l'eid de l'entité Location concernée

## Novembre 2024 [Mise à jour 2] {#version-2024-november-11}

11 novembre 2024

### Corrections et améliorations

Général

- Amélioration du comportement de `ecs.Disabled`.
- Amélioration des performances avec le raycasting

VPS

- Correction d'un bug avec les LocationMeshes cachés dans la fenêtre de visualisation pendant la synchronisation en direct.

Eclairage

- Prise en charge de la "caméra suiveuse" pour la lumière directionnelle

## Novembre 2024 [Mise à jour 1] {#version-2024-november-05}

5 novembre 2024

### Corrections et améliorations

Général

- Ajout de la possibilité de désactiver les entités et leurs composants dans une scène pour un meilleur contrôle et une optimisation des performances d'exécution.
- Ajout d'une nouvelle capacité à créer une nouvelle version du projet client à partir d'une version précédente. Cette fonctionnalité est accessible à partir de la vue Historique du projet dans les Paramètres de scène de Studio.

Audio

- Ajout d'événements de chargement et de fin de lecture audio pour faciliter la gestion et le contrôle de la lecture audio : événements `ecs.events.AUDIO_CAN_PLAY_THROUGH`, `ecs.events.AUDIO_END`.

Actifs

- Ajout d'une fonction permettant de connaître l'état de chargement des actifs : `ecs.assets.getStatistics`.

UI

- Ajout d'une fonction permettant d'étirer une image dans le cadre d'un élément d'interface utilisateur : `Ui.set({backgroundSize : 'contain/cover/stretch'})`

## Octobre 2024 [Mise à jour 3] {#version-2024-october-29}

29 octobre 2024

### Nouvelles fonctionnalités

Services backend

- Les fonctions backend et les proxies backend sont désormais prises en charge dans 8th Wall Studio !

## Octobre 2024 [Mise à jour 2] {#version-2024-october-24}

24 octobre 2024

### Nouvelles fonctionnalités

VPS

- \*\*Les développeurs peuvent désormais créer des expériences WebAR basées sur la localisation en connectant le contenu AR à des lieux réels.

### Corrections et améliorations

Modèles 3D

- Ajout d'un support pour la lecture de tous les clips d'animation sur un modèle gltf

UI

- Ajout de la possibilité de définir l'opacité des éléments de l'interface utilisateur.

## Octobre 2024 [Mise à jour 1] {#version-2024-october-18}

18 octobre 2024

### Corrections et améliorations

Evénements

- Ajout de l'événement `ecs.events.SPLAT_MODEL_LOADED`.

Physique

- Ajout de la fonction [getLinearVelocity()](/api/studio/ecs/physics/#getlinearvelocity).

Primitives

- Ajout d'une primitive polyèdre, remplaçant le tétraèdre.
- Ajout de la primitive Torus.

## Septembre 2024 [Mise à jour 2] {#version-2024-september-30}

30 septembre 2024

### Nouvelles fonctionnalités

Modèles 3D

- Prise en charge du téléchargement et de la conversion des ressources 3D au format FBX.
- Prise en charge de la prévisualisation et de la configuration de vos modèles 3D. Avec notre Asset Previewer mis à jour, vous pouvez vérifier votre modèle dans différents paramètres d'éclairage, ajuster le point de pivot, modifier les paramètres de compression du maillage, mettre à jour l'échelle, inspecter les matériaux inclus, et bien d'autres choses encore.

Matériaux

- Les matériaux peuvent être modifiés et enregistrés dans l'aperçu des actifs. Les modifications seront répercutées sur le bien et la scène.

UI

- Prise en charge des polices personnalisées avec possibilité de téléchargement de fichiers TTF.
- Affinez les éléments tels que la couleur, les bordures, le texte, l'opacité, etc. Le constructeur d'interface utilisateur vous permet également de combiner plusieurs éléments 2D sur un seul canevas afin de créer des graphiques et des interfaces 2D composés. Editez et modifiez ces éléments en temps réel dans la fenêtre de visualisation du studio, les changements étant instantanément répercutés dans le simulateur.

### Corrections et améliorations

Particules

- Mise à jour du composant Particle avec des options de configuration supplémentaires et des valeurs par défaut plus faciles à utiliser

Physique

- applyImpulse api, alternative à l'application de la force pour le développement de jeux. Bon pour les actions telles que sauter, donner un coup de poing, pousser rapidement, etc.
- Fonction d'obtention simple pour l'exécution, permettant d'interroger le paramètre de gravité actuel.

## Septembre 2024 [Mise à jour 1] {#version-2024-september-11}

11 septembre 2024

### Corrections et améliorations

Machine à états

- Amélioration des capacités et extension de l'API pour travailler avec les machines d'état et les événements. Consultez la documentation [State Machine](/studio/essentials/state-machines/) pour en savoir plus.

## Août 2024 [Mise à jour 5] {#version-2024-august-29}

29 août 2024

### Corrections et améliorations

Particules

- Correction d'un problème où la position de frai des particules n'était pas correctement définie pour les entités enfants.

## Août 2024 [Mise à jour 4] {#version-2024-august-26}

26 août 2024

### Nouvelles fonctionnalités

Éclaboussures

- \*\*En utilisant l'application Niantic Scaniverse, vous pouvez facilement créer et exporter des splats dans un fichier `.SPZ`. Une fois téléchargés dans 8th Wall Studio, les splats peuvent être intégrés de manière transparente dans vos projets, servant de base à des expériences 3D hyperréalistes.

### Corrections et améliorations

Animations

- Correction d'un problème où les animations sans boucle ne se terminaient pas à la bonne position.

Actifs

- Amélioration de la prise en charge de la prévisualisation des actifs et de la modification des paramètres des actifs.

Audio

- Mise à jour des API de cycle de vie audio (lecture, pause, sourdine, rétablissement du son)

Primitives

- Prise en charge des matériaux de dissimulation pour les objets primitifs qui vous permettent d'obscurcir ou de cacher des objets dans une scène.
- Prise en charge des matériaux non éclairés pour les objets primitifs qui ignorent les conditions d'éclairage.
- Correction d'un problème avec les collisionneurs de cylindres qui ne correspondaient pas à la forme primitive

## Août 2024 [Mise à jour 3] {#version-2024-august-15}

15 août 2024

### Corrections et améliorations

Evénements

- Correction d'un problème où les auditeurs d'événements étaient ignorés ou supprimés dans certains scénarios.

UI

- Correction d'un problème où les polices ne pouvaient pas être modifiées.
- Correction des problèmes de performance lors du chargement et du rendu des éléments de l'interface utilisateur.

Docs

- Ajout d'informations sur les problèmes courants et les meilleures pratiques à suivre lors de la création de scripts [Custom Components](/studio/essentials/best-practices/)

## Août 2024 [Mise à jour 2] {#version-2024-august-08}

8 août 2024

### Corrections et améliorations

Gestionnaire des entrées

- Correction d'un problème où les comportements de glissement et de déplacement des navigateurs mobiles n'étaient pas contrôlés.
- Ajout de la possibilité de contrôler et d'accéder au verrouillage du pointeur, ce qui permet d'améliorer les entrées de contrôle du jeu.

Physique

- Correction d'un problème de timing qui créait des comportements physiques incorrects.

Rendu

- Correction d'un problème qui donnait aux matériaux un aspect délavé.

UI

- Ajout de la possibilité de masquer les éléments de l'interface utilisateur dans la scène, ce qui permet d'obtenir des comportements plus dynamiques de l'interface utilisateur.

## Août 2024 [Mise à jour 1] {#version-2024-august-01}

1er août 2024

### Nouvelles fonctionnalités

Animation

- Ajout d'événements et de contrôles de configuration pour prendre en charge les modèles GLTF avec des animations pré-cuisinées - voir [Guide des modèles 3D](/studio/guides/models/)

Hiérarchie

- Ajout de la possibilité de multi-sélectionner et de déplacer des objets à l'aide des touches Commande/Ctrl.
- Ajout de la possibilité de sélectionner des objets à l'aide de la touche Shift.

Physique

- Ajout d'un facteur de gravité pour la physique et les collisionneurs afin de supporter des effets physiques plus configurables - voir [Physics guide](/studio/guides/physics/).

Primitives

- Ajout du type primitif RingGeometry - voir [Primitives guide](/studio/guides/models#primitives)

Fenêtre de visualisation

- Ajout d'un menu contextuel de clic droit pour les objets sélectionnés.
- Ajout de l'accrochage de la transformation lorsque l'on maintient la touche Shift.

### Corrections et améliorations

Actifs

- Correction d'un problème qui empêchait l'ajout de nouveaux fichiers et le déplacement d'actifs.

Appareil photo

- Correction d'un bug où le réglage du clip proche/lointain n'était pas fonctionnel.

Gestionnaire des entrées

- Correction d'un problème d'inversion des touches de direction gauche/droite.

Simulateur

- Le simulateur peut maintenant être redimensionné.

UI

- Correction d'un bug qui empêchait de modifier la taille de la police pour les éléments de l'interface utilisateur.

Fenêtre de visualisation

- Les modèles 3D glissés dans la fenêtre de visualisation s'accrochent désormais à la position actuelle du curseur.

Divers

- Diverses améliorations de l'interface utilisateur.
- Amélioration du copier-coller d'objets.

## Juin 2024 [Mise à jour 1] {#version-2024-june-18}

18 juin 2024

### Nouvelles fonctionnalités

Première version de 8th Wall Studio ! Bonjour le monde !

- Les principales mises à jour concernent les systèmes initiaux et les outils d'édition pour la physique, les animations, les entrées des joueurs, les caméras, l'éclairage, les particules, l'audio, les modèles 3D, les matériaux, les maillages et bien plus encore. Voir la documentation de Studio pour plus d'informations sur ces systèmes.
