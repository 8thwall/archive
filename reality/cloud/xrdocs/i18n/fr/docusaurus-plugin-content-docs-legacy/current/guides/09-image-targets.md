---
id: image-targets
---

# Cibles d'image

Donnez vie à la signalétique, aux magazines, aux boîtes, aux bouteilles, aux gobelets et aux canettes avec les cibles d'image 8th Wall. 8th
Wall Web peut détecter et suivre des cibles d'image plates, cylindriques et coniques, ce qui vous permet de donner vie à un contenu statique à l'adresse
.

Non seulement votre image cible désignée peut déclencher une expérience de RA sur le web, mais votre contenu a également la possibilité de s'y référer directement (
).

Les cibles d'image peuvent fonctionner en tandem avec notre système de suivi du monde (SLAM), ce qui permet de combiner les cibles d'image (
) et le suivi sans marqueur.

Vous pouvez suivre jusqu'à 5 cibles d'image simultanément lorsque le suivi du monde est activé ou jusqu'à 10 lorsqu'il est désactivé (
).

Jusqu'à 5 cibles d'images par projet peuvent être **"chargées automatiquement "**. Une cible d'image chargée automatiquement est activée
dès le chargement de la page. Cette fonction est utile pour les applications qui utilisent 5 images cibles ou moins, comme l'emballage d'un produit sur
, une affiche de cinéma ou une carte de visite.

L'ensemble des cibles d'image actives peut être modifié à tout moment en appelant
[XR8.XrController.configure()](/legacy/api/xrcontroller/configure). Cela vous permet de gérer des centaines de cibles d'images
par projet, ce qui rend possible des cas d'utilisation tels que les chasses aux cibles d'images géo-clôturées, les livres AR, les visites guidées de musées d'art
et bien d'autres choses encore. Si votre projet utilise SLAM la plupart du temps mais que les cibles images
ne sont utilisées qu'une partie du temps, vous pouvez améliorer les performances en ne chargeant les cibles images que lorsque vous en avez besoin. Vous
pouvez même lire les noms des cibles téléchargées à partir des paramètres URL stockés dans différents codes QR, ce qui vous permet
de charger initialement différentes cibles dans la même application web en fonction des codes QR que l'utilisateur
scanne pour entrer dans l'expérience.

\*\*Remarque : les cibles d'images personnalisées ne peuvent pas être visualisées dans le [simulateur]
(/legacy/getting-started/quick-start-guide/#simulator).

## Types d'images cibles {#image-target-types}

**Cylindrique**| ![CylindricalTarget](/images/cylindrical.jpg)| Poursuivez les images enroulées autour d'objets cylindriques tels que des boîtes de conserve et des bouteilles.
**Conical**| ![ConicalTarget](/images/conical.jpg)| Suivre les images entourant des objets dont la circonférence supérieure et inférieure est différente, comme les tasses à café, etc.

## Image Exigences de la cible {#image-target-requirements}

- Types de fichiers : **.jpg**, **.jpeg** ou **.png**
- Dimensions :
  - Minimum : **480 x 640 pixels**
  - Longueur ou largeur maximale : **2048 pixels**.
    - Remarque : si vous téléchargez une image plus grande, elle est redimensionnée à une longueur/largeur maximale de 2048
      , en conservant le rapport hauteur/largeur.
- Hébergement : Toutes les images cibles doivent être téléchargées sur votre projet 8th Wall avant de pouvoir être utilisées sur
  . Vous pouvez héberger vous-même le reste de votre expérience Web AR (si vous disposez d'un plan Enterprise ou Legacy Pro
  ), mais l'image source cible est toujours hébergée par 8th Wall. Vous trouverez ci-dessous des instructions
  sur la création/le téléchargement de cibles d'images plates ou courbes.

## Image Quantités cibles {#image-target-quantities}

Il n'y a pas de limite au nombre d'images cibles qui peuvent être associées à un projet, cependant,
il y a des limites au nombre d'images cibles qui peuvent être **actives** dans le navigateur de l'utilisateur à n'importe quel
moment donné.

- Cibles d'images actives par projet : **32**

## Gestion des cibles d'image {#manage-image-targets}

Cliquez sur l'icône Image Target dans la navigation de gauche ou sur le lien "Manage Image Targets" dans le tableau de bord du projet
pour gérer vos images cibles.

![ManageImageTargets](/images/console-appkey-imagetargets.jpg)

Cet écran vous permet de créer, de modifier et de supprimer les cibles d'image associées à votre projet.
Cliquez sur une cible d'image existante pour la modifier.  Cliquez sur l'icône "+" du type d'image cible souhaité pour
en créer une nouvelle.

![ManageImageTargets2](/images/console-appkey-imagetarget-library.jpg)

## Créer une image plate de la cible {#create-flat-image-target}

1. Cliquez sur l'icône "+ Flat" pour créer une nouvelle cible d'image plate.

![ImageTargetFlat1](/images/image-target-create-flat.jpg)

2. **Téléchargez une cible d'image plate** : Faites glisser votre image (.jpg, .jpeg ou .png) dans le panneau de téléchargement, ou cliquez dans la zone en pointillés et utilisez votre navigateur de fichiers pour sélectionner votre image.

3. **Définir la région de suivi** (et l'orientation) : Utilisez le curseur pour définir la région de l'image qui sera utilisée pour détecter et suivre votre cible dans l'expérience WebAR. Le reste de l'image sera rejeté et la région que vous avez spécifiée sera suivie dans votre expérience.

![SetTrackingRegion](https://media.giphy.com/media/RCFntZ0hn5VO3W9Mld/giphy.gif)

4. **Modifier les propriétés de la cible de l'image plate** :

- (1) Donnez un **nom** à votre image cible en modifiant le champ situé en haut à gauche de la fenêtre.
- (2) **IMPORTANT!** Testez votre image cible : La meilleure façon de déterminer si votre image téléchargée fera une bonne ou une mauvaise image cible (voir [Optimiser le suivi des images cibles](#optimizing-image-target-tracking)) est d'utiliser le simulateur pour évaluer la qualité du suivi.  Scannez le code QR avec votre application caméra pour ouvrir le lien du simulateur, puis pointez votre appareil vers l'écran ou l'objet physique.
- (3) Cliquez sur **Chargement automatique** si vous souhaitez que la cible image soit activée automatiquement lors du chargement du projet WebAR. Jusqu'à 5 cibles d'images peuvent être chargées automatiquement sans qu'il soit nécessaire d'écrire une seule ligne de code.  D'autres cibles peuvent être chargées par programme grâce à l'API Javascript.
- (4) Facultatif : si vous souhaitez ajouter des métadonnées à votre image, au format texte ou JSON, cliquez sur le bouton **Métadonnées** en bas de la fenêtre.

![EditFlatImageTarget](/images/edit-flat-image-target.jpg)

5. Les modifications apportées dans cet écran sont automatiquement enregistrées.  Cliquez sur **Fermer** pour revenir à votre bibliothèque d'images cibles.

## Créer une image cylindrique Cible {#create-cylindrical-image-target}

1. Cliquez sur l'icône "+ Cylindrique" pour créer une nouvelle cible d'image plane.

![ImageTargetFlat1](/images/image-target-create-cylindrical.jpg)

2. **Téléchargez une cible d'image plate** : Faites glisser votre image (.jpg, .jpeg ou .png) dans le panneau de téléchargement, ou cliquez dans la zone en pointillés et utilisez votre navigateur de fichiers pour sélectionner votre image.

3. **Définir la région de suivi** (et l'orientation) : Utilisez le curseur pour définir la région de l'image qui sera utilisée pour détecter et suivre votre cible dans l'expérience WebAR. Le reste de l'image sera rejeté et la région que vous avez spécifiée sera suivie dans votre expérience.

![](https://media.giphy.com/media/AdgvL3hqQAULWEHWTg/giphy.gif)

4. **Modifier les propriétés de la cible de l'image cylindrique** :

- (1) Donnez un **nom** à votre image cible en modifiant le champ situé en haut à gauche de la fenêtre.
- (2) **Faites glisser les curseurs** jusqu'à ce que la forme de votre étiquette apparaisse comme prévu dans le simulateur, ou **entrez les mesures** directement.
- (3) **IMPORTANT!** Testez votre image cible : La meilleure façon de déterminer si votre image téléchargée fera une bonne ou une mauvaise image cible (voir [Optimiser le suivi des images cibles](#optimizing-image-target-tracking)) est d'utiliser le simulateur pour évaluer la qualité du suivi.  Scannez le code QR avec votre application caméra pour ouvrir le lien du simulateur, puis pointez votre appareil vers l'écran ou l'objet physique.
- (4) Cliquez sur **Load automatically** si vous souhaitez que la cible image soit activée automatiquement lors du chargement du projet WebAR. Jusqu'à 5 cibles d'images peuvent être chargées automatiquement sans qu'il soit nécessaire d'écrire une seule ligne de code.  D'autres cibles peuvent être chargées par programme grâce à l'API Javascript.
- (5) Facultatif : si vous souhaitez ajouter des métadonnées à votre image, au format texte ou JSON, cliquez sur le bouton **Métadonnées** en bas de la fenêtre.

![EditCylindricalImageTarget](/images/edit-cylindrical-image-target.jpg)

5. Les modifications apportées dans cet écran sont automatiquement enregistrées.  Cliquez sur **Fermer** pour revenir à votre bibliothèque d'images cibles.

## Créer une image conique Cible {#create-conical-image-target}

1. Cliquez sur l'icône "+ Conique" pour créer une nouvelle cible d'image plane.

![ImageTargetFlat1](/images/image-target-create-conical.jpg)

2. **Télécharger une cible d'image conique** : Faites glisser votre image (.jpg, .jpeg ou .png) dans le panneau de téléchargement, ou cliquez dans la zone en pointillés et utilisez votre navigateur de fichiers pour sélectionner votre image.  L'image téléchargée doit être au format "unwrapped", c'est-à-dire "arc-en-ciel", recadrée de la manière suivante :

![conical rainbow image](/images/conical-rainbow-image.jpg)

3. **Définir l'alignement du grand arc** : Faites glisser le curseur jusqu'à ce que la ligne **rouge** recouvre le **grand arc** de l'image téléchargée.

![set large arc](https://media.giphy.com/media/1zcOKYrjOmhaxUJ7lh/giphy.gif)

4. **Définir l'alignement du petit arc** : Faites de même pour le petit arc.  Faites glisser le curseur jusqu'à ce que la ligne **bleue** recouvre le **petit arc** de l'image téléchargée.

5. **Définir la région de suivi** (et l'orientation) : Faites glisser et zoomez sur l'image pour définir la partie de l'image qui est détectée et suivie. Il s'agit de la partie la plus riche en fonctionnalités de votre image.

![set tracking](https://media.giphy.com/media/t2rSve9UshxGB07US2/giphy.gif)

6. **Modifier les propriétés de la cible de l'image conique** :

- (1) Donnez un **nom** à votre image cible en modifiant le champ situé en haut à gauche de la fenêtre.
- (2) **Faites glisser les curseurs** jusqu'à ce que la forme de votre étiquette apparaisse comme prévu dans le simulateur, ou **entrez les mesures** directement.
- (3) **IMPORTANT!** Testez votre image cible : La meilleure façon de déterminer si votre image téléchargée fera une bonne ou une mauvaise image cible (voir [Optimiser le suivi des images cibles](#optimizing-image-target-tracking)) est d'utiliser le simulateur pour évaluer la qualité du suivi.  Scannez le code QR avec votre application caméra pour ouvrir le lien du simulateur, puis pointez votre appareil vers l'écran ou l'objet physique.
- (4) Cliquez sur **Load automatically** si vous souhaitez que la cible image soit activée automatiquement lors du chargement du projet WebAR. Jusqu'à 5 cibles d'images peuvent être chargées automatiquement sans qu'il soit nécessaire d'écrire une seule ligne de code.  D'autres cibles peuvent être chargées par programme grâce à l'API Javascript.
- (5) Facultatif : si vous souhaitez ajouter des métadonnées à votre image, au format texte ou JSON, cliquez sur le bouton **Métadonnées** en bas de la fenêtre.

![EditConicalImageTarget](/images/edit-conical-image-target.jpg)

7. Les modifications apportées dans cet écran sont automatiquement enregistrées.  Cliquez sur **Fermer** pour revenir à votre bibliothèque d'images cibles.

## Modifier les cibles de l'image {#edit-image-targets}

Cliquez sur l'une des cibles d'image sous **Mes cibles d'image** pour afficher et/ou modifier leurs propriétés :

1. Nom de la cible de l'image
2. Curseurs / Mesures (cibles d'images cylindriques/coniques uniquement)
3. Simulateur QR Code
4. Supprimer la cible de l'image
5. Chargement automatique
6. Métadonnées
7. Orientation et dimensions
8. État de la sauvegarde automatique
9. Fermer

| Type        | Domaines                                                              |
| ----------- | --------------------------------------------------------------------- |
| Plat        | ![flat target](/images/edit-flat-image-target-full.jpg)               |
| Cylindrique | ![cylindrical target](/images/edit-cylindrical-image-target-full.jpg) |
| Conique     | ![conical target](/images/edit-conical-image-target-full.jpg)         |

## Modification des cibles de l'image active {#changing-active-image-targets}

L'ensemble des cibles d'image actives peut être modifié au moment de l'exécution en appelant
[XR8.XrController.configure()](/legacy/api/xrcontroller/configure)

Remarque : L'ensemble des cibles d'image actuellement actives sera **remplacé** par le nouvel ensemble passwd to
[XR8.XrController.configure()](/legacy/api/xrcontroller/configure).

#### Exemple - Modifier l'ensemble des cibles de l'image active {#example---change-active-image-target-set}

```javascript
XR8.XrController.configure({imageTargets : ['image-target1', 'image-target2', 'image-target3']})
```

## Optimisation du suivi des cibles des images {#optimizing-image-target-tracking}

Pour garantir une expérience de suivi des cibles d'image de la plus haute qualité, veillez à suivre les lignes directrices suivantes lors de la sélection d'une cible d'image.

_**DO**_ ont :

- beaucoup de détails variés
- contraste élevé

_**DON**_ have :

- motifs répétitifs
- espace mort excessif
- images à faible résolution

Couleur : la détection des cibles par l'image ne permet pas de distinguer les couleurs, il ne faut donc pas s'y fier pour différencier les cibles.

Pour de meilleurs résultats, utilisez des images sur des surfaces planes, cylindriques ou coniques pour le suivi de la cible de l'image.

Tenez compte de la réflectivité du matériau physique de votre cible d'image. Les surfaces brillantes et les reflets de l'écran peuvent diminuer la qualité du suivi. Utilisez des matériaux mats dans des conditions d'éclairage diffus pour obtenir une qualité de suivi optimale.

Remarque : c'est au centre de l'écran que la détection est la plus rapide.

| Bons marqueurs                               | Mauvais marqueurs                          |
| -------------------------------------------- | ------------------------------------------ |
| ![good logo](/images/it-logo-good.jpg)       | ![bad logo](/images/it-logo-bad.jpg)       |
| ![movie poster](/images/it-movie-poster.jpg) | ![bad pattern](/images/it-pattern-bad.jpg) |

## Image Cible Événements {#image-target-events}

8th Wall Web émet des événements / observables pour divers événements dans le cycle de vie de la cible d'image (par exemple, chargement d'image, numérisation d'image, image trouvée, image mise à jour, image perdue). Veuillez consulter la référence API pour obtenir des instructions sur la gestion de ces événements dans votre application Web :

- [AFrame Events](/legacy/api/aframeevents)
- [BabylonJS Observables](/legacy/api/babylonjs/observables)
- [PlayCanvas Events](/legacy/api/playcanvasevents/playcanvas-image-target-events)
- [XrController Dispatched Events](/legacy/api/xrcontroller/pipelinemodule/#dispatched-events)

#### Exemples de projets {#example-projects}

<https://github.com/8thwall/web/tree/master/examples/aframe/artgallery>

<https://github.com/8thwall/web/tree/master/examples/aframe/flyer>
