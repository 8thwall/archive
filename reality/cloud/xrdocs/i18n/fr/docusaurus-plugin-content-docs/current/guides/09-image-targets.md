---
id: image-targets
---

# Images Cible

Donnez vie à la signalétique, aux magazines, aux boîtes, aux bouteilles, aux gobelets et aux canettes avec les images cible 8th Wall. 8th Wall Web peut détecter et suivre des images cible plates, cylindriques et coniques, ce qui vous permet de donner vie à un contenu statique.

Non seulement votre image cible désignée peut déclencher une expérience de AR sur le web, mais votre contenu a également la possibilité de s'y référer directement.

Les images cible peuvent fonctionner en tandem avec notre système de suivi du monde (SLAM), ce qui permet de combiner les images cible et le suivi sans marqueur.

Vous pouvez suivre jusqu'à 5 images cible simultanément lorsque le suivi du monde est activé ou jusqu'à 10 lorsqu'il est désactivé.

Jusqu'à 5 images cible par projet peuvent être **« Autochargées »**. Une image cible chargée automatiquement est activée dès le chargement de la page. Cette fonction est utile pour les applications qui utilisent 5 images cible ou moins, comme l'emballage d'un produit, une affiche de cinéma ou une carte de visite.

L'ensemble des images cible actives peut être modifié à tout moment en appelant [XR8.XrController.configure()](/api/xrcontroller/configure). Vous pouvez ainsi gérer des centaines de d'images cible par projet, ce qui rend possible des utilisations tels que des chasses aux cibles d'images géo-clôturées, des livres AR, des visites guidées de musées d’art et bien d'autres encore. Si votre projet utilise SLAM la plupart du temps mais que les images cible ne sont utilisées qu'une partie du temps, vous pouvez améliorer les performances en ne chargeant les images cible que lorsque vous en avez besoin. Vous pouvez même lire les noms des cibles téléchargées à partir des paramètres URL stockés dans différents QR codes, ce qui vous permet de charger initialement différentes cibles dans la même application web en fonction des codes QR que l'utilisateur scanne pour entrer dans l'expérience.

**Remarque : les images cibles personnalisées ne peuvent pas être visualisées dans le simulateur[](/getting-started/quick-start-guide/#simulator).**

## Types d’images cible {#image-target-types}

 |                    |                                                                                                                                                                                    |
 | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
 | **Plate(s)**       | ![Cible plate](/images/flat.jpg)| Les images en 2D comme les affiches, les panneaux, les magazines, les boîtes, etc.                                                               |
 | **Cylindrique(s)** | ![CylindricalTarget](/images/cylindrical.jpg)| Les images suivies s'enroulent autour d'objets cylindriques tels que les boîtes de conserve et les bouteilles.                      |
 | **Conique(s)**     | ![Cible conique](/images/conical.jpg)| Les images suivies s'enroulent autour d'objets dont la circonférence supérieure et inférieure est différente, comme des tasses à café, etc. |

## Prérequis pour les images cible {#image-target-requirements}

* Types de fichiers : **.jpg**, **.jpeg** ou **.png**
* Dimensions :
  * Minimum : **480 x 640 pixels**
  * Longueur ou largeur maximale : **2048 pixels**.
    * Remarque : si vous téléchargez une image plus grande, elle est redimensionnée à une longueur/largeur maximale de 2048 , en conservant le rapport hauteur/largeur.
* Hébergement : Toutes les images cibles doivent être téléchargées sur votre projet 8th Wall avant de pouvoir être utilisées sur . Vous pouvez héberger vous-même le reste de votre expérience Web AR (si vous disposez d'un plan Pro ou Enterprise), mais la cible de l'image source est toujours hébergée par 8th Wall. Vous trouverez ci-dessous des instructions sur la création/le téléchargement de cibles d'images plates ou courbes.

## Quantités d’images cible {#image-target-quantities}

Il n'y a pas de limite au nombre d'images cible qui peuvent être associées à un projet, cependant, il y a des limites au nombre de cibles d'images qui peuvent être **actives** à un moment donné.

Jusqu'à 5 images cibles peuvent être actives simultanément lorsque le suivi mondial (SLAM) est activé. Si le suivi du monde (SLAM) est désactivé (en réglant "disableWorldTracking : true"), vous pouvez avoir jusqu'à 10 images cible actives simultanément.

* Images actives par projet (suivi mondial activé) : **5**
* Images actives par projet (suivi mondial désactivé) : **10**

## Gérer les images cible {#manage-image-targets}

Cliquez sur l'icône Image Cible dans la navigation de gauche ou sur le lien « Gérer les images cible » dans le tableau de bord du projet pour gérer vos images cible.

![ManageImageTargets](/images/console-appkey-imagetargets.jpg)

Cet écran vous permet de créer, de modifier et de supprimer les images cible associées à votre projet. Cliquez sur une cible d'image existante pour la modifier.  Cliquez sur l'icône "+" du type d'image cible souhaité pour en créer une nouvelle.

![Gérer les images cible2](/images/console-appkey-imagetarget-library.jpg)

## Créer une image cible plate {#create-flat-image-target}

1. Cliquez sur l'icône "+ Plate" pour créer une nouvelle image cible plate.

![ImageTargetFlat1](/images/image-target-create-flat.jpg)

2. **Charger une image Cible plate**: Faites glisser votre image (.jpg, .jpeg ou .png) dans le panneau de téléchargement, ou cliquez dans la zone en pointillés et utilisez votre navigateur de fichiers pour sélectionner votre image.

3. **Définir la région de suivi** (et l’orientation) : Utilisez le curseur pour définir la région de l'image qui sera utilisée pour détecter et suivre votre cible dans l'expérience WebAR. Le reste de l'image sera rejeté et la région que vous avez spécifiée sera suivie dans votre expérience.

![SetTrackingRegion](https://media.giphy.com/media/RCFntZ0hn5VO3W9Mld/giphy.gif)

4. **Modifier les propriétés de l'image cible plate**:

* (1) Donnez à votre cible d'image **un nom** en modifiant le champ en haut à gauche de la fenêtre.
* (2) **IMPORTANT !** Testez votre image cible : La meilleure façon de déterminer si votre image chargée fera une bonne ou une mauvaise image cible (voir [Optimiser le suivi de l’image cible](#optimizing-image-target-tracking)) est d'utiliser le simulateur pour évaluer la qualité du suivi.  Scannez le QR code avec votre application caméra pour ouvrir le lien du simulateur, puis pointez votre appareil vers l'écran ou l'objet physique.
* (3) Cliquez sur **Charger automatiquement** si vous souhaitez que l’image cible soit activée automatiquement lors du chargement du projet WebAR. Jusqu'à 5 images cible peuvent être chargées automatiquement sans qu'il soit nécessaire d'écrire une seule ligne de code.  D'autres cibles peuvent être chargées par programme grâce à l'API Javascript.
* (4) Facultatif : si vous souhaitez ajouter des métadonnées à votre image, au format texte ou JSON, cliquez sur le bouton **Metadata** en bas de la fenêtre.

![EditFlatImageTarget](/images/edit-flat-image-target.jpg)

5. Les modifications apportées dans cet écran sont automatiquement enregistrées.  Cliquez sur **Fermer** pour revenir à votre bibliothèque d'images cibles.

## Créer une image cible cylindrique {#create-cylindrical-image-target}

1. Cliquez sur l'icône "+ Cylindrique" pour créer une nouvelle image cible plane.

![ImageTargetFlat1](/images/image-target-create-cylindrical.jpg)

2. **Charger une image Cible plate**: Faites glisser votre image (.jpg, .jpeg ou .png) dans le panneau de téléchargement, ou cliquez dans la zone en pointillés et utilisez votre navigateur de fichiers pour sélectionner votre image.

3. **Définir la région de suivi** (et l’orientation) : Utilisez le curseur pour définir la région de l'image qui sera utilisée pour détecter et suivre votre cible dans l'expérience WebAR. Le reste de l'image sera rejeté et la région que vous avez spécifiée sera suivie dans votre expérience.

![](https://media.giphy.com/media/AdgvL3hqQAULWEHWTg/giphy.gif)

4. **Modifier les propriétés de l'image cible cylindrique**:

* (1) Donnez à votre 'image cible**un nom** en modifiant le champ en haut à gauche de la fenêtre.
* (2) **Faites glisser les curseurs** jusqu'à ce que la forme de votre étiquette apparaisse comme prévu dans le simulateur, ou **saisissez **directement les mesures.
* (3) **IMPORTANT !** Testez votre image cible : La meilleure façon de déterminer si votre image chargée fera une bonne ou une mauvaise image cible (voir [Optimiser le suivi de l’image cible](#optimizing-image-target-tracking)) est d'utiliser le simulateur pour évaluer la qualité du suivi.  Scannez le QR code avec votre application caméra pour ouvrir le lien du simulateur, puis pointez votre appareil vers l'écran ou l'objet physique.
* (4) Cliquez sur **Charger automatiquement** si vous souhaitez que l’image cible soit activée automatiquement lors du chargement du projet WebAR. Jusqu'à 5 images cible peuvent être chargées automatiquement sans qu'il soit nécessaire d'écrire une seule ligne de code.  D'autres cibles peuvent être chargées par programme grâce à l'API Javascript.
* (5) Facultatif : si vous souhaitez ajouter des métadonnées à votre image, au format texte ou JSON, cliquez sur le bouton **Metadata** en bas de la fenêtre.

![EditCylindricalImageTarget](/images/edit-cylindrical-image-target.jpg)

5. Les modifications apportées dans cet écran sont automatiquement enregistrées.  Cliquez sur **Fermer** pour revenir à votre bibliothèque d'images cibles.

## Créer une image cible conique {#create-conical-image-target}

1. Cliquez sur l'icône "+ Conique" pour créer une nouvelle image cible plane.

![ImageTargetFlat1](/images/image-target-create-conical.jpg)

2. **Charger une image cible conique**: Faites glisser votre image (.jpg, .jpeg ou .png) dans le panneau de téléchargement, ou cliquez dans la zone en pointillés et utilisez votre navigateur de fichiers pour sélectionner votre image.  L'image chargée doit être au format « unwrapped », c'est-à-dire « rainbow », recadrée comme suit :

![image de l'arc-en-ciel conique](/images/conical-rainbow-image.jpg)

3. **Définir l'alignement du grand arc**: Faites glisser le curseur jusqu'à ce que la ligne rouge **** recouvre le grand arc **de l'image téléchargée**.

![set large arc](https://media.giphy.com/media/1zcOKYrjOmhaxUJ7lh/giphy.gif)

4. **Réglez l'alignement du petit arc**: Faites de même pour le petit arc.  Faites glisser le curseur jusqu'à ce que la ligne**bleue** recouvre le petit arc **de l'image téléchargée**.

5. **Définir la région de suivi** (et l’orientation) : Faites glisser et zoomez sur l'image pour définir la partie de l'image qui est détectée et suivie. Il s'agit de la partie la plus riche en fonctionnalités de votre image.

![définir le suivi](https://media.giphy.com/media/t2rSve9UshxGB07US2/giphy.gif)

6. **Modifier les propriétés de l’image cible conique**:

* (1) Donnez à votre image cible**un nom** en modifiant le champ en haut à gauche de la fenêtre.
* (2) **Faites glisser les curseurs** jusqu'à ce que la forme de votre étiquette apparaisse comme prévu dans le simulateur, ou **saisissez **directement les mesures.
* (3) **IMPORTANT !** Testez votre image cible : La meilleure façon de déterminer si votre image chargée fera une bonne ou une mauvaise image cible (voir [Optimiser le suivi de l’image cible](#optimizing-image-target-tracking)) est d'utiliser le simulateur pour évaluer la qualité du suivi.  Scannez le QR code avec votre application caméra pour ouvrir le lien du simulateur, puis pointez votre appareil vers l'écran ou l'objet physique.
* (4) Cliquez sur **Charger automatiquement** si vous souhaitez que l’image cible soit activée automatiquement lors du chargement du projet WebAR. Jusqu'à 5 images cible peuvent être chargées automatiquement sans qu'il soit nécessaire d'écrire une seule ligne de code.  D'autres cibles peuvent être chargées par programme grâce à l'API Javascript.
* (5) Facultatif : si vous souhaitez ajouter des métadonnées à votre image, au format texte ou JSON, cliquez sur le bouton **Metadata** en bas de la fenêtre.

![EditConicalImageTarget](/images/edit-conical-image-target.jpg)

7. Les modifications apportées dans cet écran sont automatiquement enregistrées.  Cliquez sur **Fermer** pour revenir à votre bibliothèque d'images cibles.

## Modifier les images cible {#edit-image-targets}

Cliquez sur l'une des cibles d'image sous **Mes images cible** pour afficher et/ou modifier leurs propriétés :

1. Nom de l’image cible
2. Curseurs / Mesures (images cible cylindriques/coniques uniquement)
3. Simulateur QR Code
4. Supprimer l’image cible
5. Chargement automatique
6. Métadonnées
7. Orientation et dimensions
8. État de la sauvegarde automatique
9. Fermer

| Type           | Domaines                                                             |
| -------------- | -------------------------------------------------------------------- |
| Plate(s)       | ![objectif plat](/images/edit-flat-image-target-full.jpg)            |
| Cylindrique(s) | ![cible cylindrique](/images/edit-cylindrical-image-target-full.jpg) |
| Conique(s)     | ![cible conique](/images/edit-conical-image-target-full.jpg)         |

## Modification des images cible actives {#changing-active-image-targets}

L'ensemble des cibles d'image actives peut être modifié au moment de l'exécution en appelant [XR8.XrController.configure()](/api/xrcontroller/configure)

Remarque : L'ensemble des cibles d'image actuellement actives sera **remplacé** par le nouvel mot de passe choisi à [XR8.XrController.configure()](/api/xrcontroller/configure).

#### Exemple - Modifier l'ensemble des images cible actives {#example---change-active-image-target-set}

```javascript
XR8.XrController.configure({imageTargets: ['image-target1', 'image-target2', 'image-target3']})
```

## Optimiser le suivi des images cible {#optimizing-image-target-tracking}

Pour garantir une expérience de suivi des cibles d'image de la plus haute qualité, veillez à suivre les lignes directrices suivantes lors de la sélection d'une image cible.

***DOIT*** avoir :

* beaucoup de détails variés
* contraste élevé

***NE PAS*** avoir :

* motifs répétitifs
* espace mort excessif
* images à faible résolution

Couleur : la détection des images cible ne permet pas de faire la distinction entre les couleurs ; ne comptez donc pas sur elle pour différencier les cibles.

Pour de meilleurs résultats, utilisez des images sur des surfaces planes, cylindriques ou coniques pour le suivi de la cible de l'image.

Tenez compte de la réflectivité du matériau physique de votre image cible. Les surfaces brillantes et les reflets de l'écran peuvent réduire la qualité du suivi. Utilisez des matériaux mats dans des conditions d'éclairage diffus pour obtenir une qualité de suivi optimale.

Remarque : c'est au centre de l'écran que la détection est la plus rapide.

| Bons marqueurs                                  | Mauvais marqueurs                            |
| ----------------------------------------------- | -------------------------------------------- |
| ![bon logo](/images/it-logo-good.jpg)           | ![mauvais logo](/images/it-logo-bad.jpg)     |
| ![affiche de film](/images/it-movie-poster.jpg) | ![mauvais motif](/images/it-pattern-bad.jpg) |

## Image Target Events {#image-target-events}

8th Wall Web émet des événements / observables pour divers événements dans le cycle de vie de la cible d'image (par exemple, chargement d'image, numérisation d'image, image trouvée, image mise à jour, image perdue). Veuillez consulter la référence API pour obtenir des instructions sur la gestion de ces événements dans votre application Web :

* [Événements AFrame](/api/aframeevents)
* [Observables BabylonJS](/api/babylonjs/observables)
* [Événements PlayCanvas](/api/playcanvasevents/playcanvas-image-target-events)
* [Événements distribués par le XrController](/api/xrcontroller/pipelinemodule/#dispatched-events)

#### Exemples de projets {#example-projects}

<https://github.com/8thwall/web/tree/master/examples/aframe/artgallery>

<https://github.com/8thwall/web/tree/master/examples/aframe/flyer>
