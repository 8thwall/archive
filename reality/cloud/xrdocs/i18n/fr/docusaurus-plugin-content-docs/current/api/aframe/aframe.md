# XR8.AFrame

A-Frame (<https://aframe.io>) est une structure web conçue pour créer des expériences de réalité virtuelle. En ajoutant 8th Wall Web à votre projet A-Frame, vous pouvez désormais facilement créer des expériences de **réalité augmentée** pour le web.

## Ajout 8th Wall Web à A-Frame {#adding-8th-wall-web-to-a-frame}

#### Cloud Editor {#cloud-editor}

1. Il suffit d'ajouter une balise "meta" dans le fichier head.html pour inclure la bibliothèque "8-Frame" dans votre projet. Si vous clonez à partir d'un des modèles basés sur A-Frame de 8th Wall ou d'un projet auto-hébergé, il sera déjà présent.  De plus, il n'est pas nécessaire d'ajouter manuellement votre AppKey.

`<meta name="8thwall:renderer" content="aframe:1.4.1"&gt ;`

#### Auto-hébergé {#self-hosted}

8th Wall Web peut être ajouté à votre projet A-Frame en quelques étapes faciles :

1. Inclut une version légèrement modifiée de A-Frame (appelée "8-Frame") qui corrige certains problèmes de polissage :

`<script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>`

2. Ajoutez la balise de script suivante au HEAD de votre page. Remplacez les X par votre clé d’application :

`<script src="//cdn.8thwall.com/web/iframe/iframe.js"></script&gt ;`

## Configuration de la caméra : `xrconfig` {#configuring-the-camera}

Pour configurer le flux de la caméra, ajoutez le composant `xrconfig` à votre `a-scene` :

`<a-scene xrconfig&gt ;`

#### attributs de xrconfig (tous facultatifs) {#xrconfig-attributes}

| Composant                                                                              | Type               | Défaut                | Description                                                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------- | ------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cameraDirection                                                                        | `Chaîne`           | `retour"`             | Appareil photo souhaité. Choisissez parmi : `back` ou `front`. Utilisez `cameraDirection : front ;` avec `mirroredDisplay : true ;` pour le mode selfie. Notez que le suivi du monde n'est pris en charge qu'avec `cameraDirection : back ;`.`                                                                  |
| appareils autorisés                                                                    | `Chaîne`           | `'mobile-et-casques'` | Classes d'appareils prises en charge. Choisissez parmi : `'mobile-and-headsets'` , `'mobile'` ou `'any'`. Utilisez `'any'` pour activer les ordinateurs portables ou de bureau dotés d'une webcam intégrée ou connectée. Notez que le suivi du monde n'est possible que sur `'mobile-and-headsets'` ou `mobile`. |
| mirroredDisplay                                                                        | `Booléen`          | `faux`                | Si la valeur est vraie, la géométrie de sortie est inversée à gauche et à droite et la direction du flux de la caméra est inversée. Utilisez `'mirroredDisplay : true;'` avec `'cameraDirection : front;'` pour le mode selfie. Ne doit pas être activé si le suivi du monde (SLAM) est activé.                  |
| désactiverXrTablet                                                                     | `Booléen`          | `faux`                | Désactivez la tablette visible lors des sessions immersives.                                                                                                                                                                                                                                                     |
| xrTabletStartsMinimized                                                                | `Booléen`          | `faux`                | La tablette démarre en mode réduit.                                                                                                                                                                                                                                                                              |
| désactiver l'environnement par défaut                                                  | `Booléen`          | `faux`                | Désactive l'arrière-plan "espace vide" par défaut.                                                                                                                                                                                                                                                               |
| disableDesktopCameraControls                                                           | `Booléen`          | `faux`                | Désactivez le WASD et la recherche de la caméra à l'aide de la souris.                                                                                                                                                                                                                                           |
| disableDesktopTouchEmulation                                                           | `Booléen`          | `faux`                | Désactivez les fausses touches du bureau.                                                                                                                                                                                                                                                                        |
| désactiverXrTouchEmulation                                                             | `Booléen`          | `faux`                | N'émettez pas d'événements tactiles basés sur les rayonnements du contrôleur avec la scène.                                                                                                                                                                                                                      |
| désactiver la représentation de la caméra                                              | `Booléen`          | `faux`                | Désactiver le déplacement de l'objet caméra -> contrôleur                                                                                                                                                                                                                                                        |
| defaultEnvironmentFloorScale                                                           | `Nombre`           | `1`                   | Réduire ou augmenter la texture du sol.                                                                                                                                                                                                                                                                          |
| defaultEnvironmentFloorTexture (texture de sol par défaut)                             | Actif              |                       | Indiquez une autre ressource de texture ou une autre URL pour le sol carrelé.                                                                                                                                                                                                                                    |
| couleur du sol de l'environnement par défaut                                           | Couleur hexagonale | `#1A1C2A`             | Définissez la couleur du sol.                                                                                                                                                                                                                                                                                    |
| defaultEnvironmentFogIntensity (intensité du brouillard de l'environnement par défaut) | `Nombre`           | `1`                   | Augmenter ou diminuer la densité du brouillard.                                                                                                                                                                                                                                                                  |
| defaultEnvironmentSkyTopColor (couleur du sommet du ciel)                              | Couleur hexagonale | `#BDC0D6`             | Définit la couleur du ciel directement au-dessus de l'utilisateur.                                                                                                                                                                                                                                               |
| defaultEnvironmentSkyBottomColor (couleur du fond de l'environnement)                  | Couleur hexagonale | `#1A1C2A`             | Définissez la couleur du ciel à l'horizon.                                                                                                                                                                                                                                                                       |
| defaultEnvironmentSkyGradientStrength (force du gradient de ciel par défaut)           | `Nombre`           | `1`                   | Contrôlez la netteté des transitions du dégradé du ciel.                                                                                                                                                                                                                                                         |

Notes :

* `cameraDirection` : Lorsque vous utilisez `xrweb` pour assurer le suivi du monde (SLAM), seule la caméra `arrière` est prise en charge. Si vous utilisez la caméra frontale `` , vous devez désactiver le suivi du monde en réglant `disableWorldTracking : true` on `xrweb`.

## Suivi du monde, cibles d'images, et/ou VPS Lightship : `xrweb` {#world-tracking-image-targets-andor-lightship-vps}

Si vous voulez des cibles d'images de suivi du monde, ou le VPS Lightship, ajoutez le composant `xrweb` à votre `a-scene` :

`<a-scene xrconfig&gt ;`

#### attributs de xrweb (tous facultatifs) {#xrweb-attributes}

| Composant                    | Type      | Défaut         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------- | --------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| échelle                      | `Chaîne`  | `'responsive'` | Soit `"responsive"` , soit `"absolute"`. `'responsive'` renverra des valeurs telles que la caméra de l'image 1 soit à l'origine définie via [`XR8.XrController.updateCameraProjectionMatrix()`](../xrcontroller/updatecameraprojectionmatrix). `'absolute'` renvoie la caméra, les images cible, etc. en mètres. La valeur par défaut est `"responsive"`. Lorsque vous utilisez `"absolute"` , la position x, la position z et la rotation de la pose de départ respectent les paramètres définis dans [`XR8.XrController.updateCameraProjectionMatrix()`](../xrcontroller/updatecameraprojectionmatrix) une fois que l'échelle a été estimée. La position y dépend de la hauteur physique de la caméra par rapport au plan du sol. |
| désactiver le suivi du monde | `Booléen` | `faux`         | Si c'est le cas, désactivez le suivi SLAM pour plus d'efficacité.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| activerVps                   | `Booléen` | `faux`         | Si c'est le cas, recherchez des emplacements de projet et un maillage. Le maillage renvoyé n'a aucun rapport avec les emplacements de projet et sera renvoyé même si aucun emplacement de projet n'est configuré. L'activation de VPS annule les paramètres `d’échelle` et `disableWorldTracking`.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| projetWayspots               | `Réseau`  | `[]`           | Chaînes séparées par des virgules de noms de lieux de projets à localiser exclusivement. Si le paramètre n'est pas défini ou si une chaîne vide est transmise, nous localiserons tous les emplacements de projet à proximité.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

Notes :

* `xrweb` et `xrface` ne peuvent pas être utilisés en même temps.
* `xrweb` et `xrlayers` peuvent être utilisés en même temps. Vous devez utiliser `xrconfig` pour ce faire.
  * La meilleure pratique consiste à toujours utiliser `xrconfig`; cependant, si vous utilisez `xrweb` sans `xrface` ou `xrlayers` ou `xrconfig`, alors `xrconfig` sera ajouté automatiquement. À ce moment-là, tous les attributs de qui ont été définis sur `xrweb` seront transmis à `xrconfig`.
* `cameraDirection` : Le suivi du monde (SLAM) n'est pris en charge que sur la caméra `arrière` . Si vous utilisez la caméra frontale `` , vous devez désactiver le suivi du monde en définissant `disableWorldTracking : true`.
* Le suivi du monde (SLAM) n'est possible que sur les appareils mobiles.

## Effets de ciel : `xrlayers` et `xrlayerscene` {#sky-effects-xrlayers-and-xrlayerscene}

Si vous voulez Sky Effects :

1. Ajoutez le composant `xrlayers` à votre`a-scène`
2. Ajoutez le composant `xrlayerscene` à une `a-entity` et ajoutez le contenu que vous souhaitez voir apparaître dans le ciel sous cette `a-entity`.

```html

  
    <!-- Ajoutez votre contenu Sky Effects ici. -->
  

```

#### xrlayers Attributs {#xrlayers-attributes}

Aucun

Notes :

* `les xrlayers` et `xrface` ne peuvent pas être utilisés en même temps.
* `xrlayers` et `xrweb` peuvent être utilisés en même temps. Vous devez utiliser `xrconfig` pour ce faire.
  * La meilleure pratique consiste à toujours utiliser `xrconfig`; cependant, si vous utilisez `xrlayers` sans `xrface` ou `xrweb` ou `xrconfig`, alors `xrconfig` sera ajouté automatiquement. À ce moment-là, tous les attributs définis sur `xrweb` seront transmis à `xrconfig`.

#### xrlayerscene Attributs {#xrlayerscene-attributes}

| Composant         | Type      | Défaut | Description                                                                                                                                                                                                        |
| ----------------- | --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| nom               | `Chaîne`  | `''`   | Le nom de la couche. Doit correspondre à une couche de [`XR8.LayersController`](../layerscontroller/layerscontroller.md). La seule couche prise en charge à l'heure actuelle est `sky`.                            |
| invertLayerMask   | `Booléen` | `faux` | Si cette option est activée, le contenu que vous placez dans votre scène occultera les zones qui ne sont pas dans le ciel. S'il est faux, le contenu que vous placez dans votre scène occultera les zones du ciel. |
| douceur des bords | `Nombre`  | `0`    | Montant pour lisser les bords de la couche. Valeurs valables entre 0 et 1.                                                                                                                                         |

## Effets de visage : `xrface` {#face-effects}

Si vous voulez suivre les effets de visage, ajoutez le composant `xrface` à votre `a-scene` :

`<a-scene xrconfig&gt ;`

#### xrface Attributs {#xrface-attributes}

| Composant                  | Type      | Défaut                                 | Description                                                                                                                                                                                                                               |
| -------------------------- | --------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| meshGeometry               | `Réseau`  | `['face']`                             | Chaînes de caractères séparées par des virgules qui configurent les parties du maillage de la face pour lesquelles des indices de triangle seront renvoyés. Peut être une combinaison de `"visage"`, `"yeux"`, `"iris"` et/ou `"bouche"`. |
| maxDetections [Facultatif] | `Nombre`  | `1`                                    | Nombre maximal de visages à détecter. Les choix possibles sont 1, 2 ou 3.                                                                                                                                                                 |
| uvType [Facultatif]        | `Chaîne`  | `[XR8.FaceController.UvType.STANDARD]` | Spécifie quels uv sont renvoyés dans l'événement de scan des visages et de chargement des visages. Les options sont les suivantes : `[XR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`                           |
| enableEars [Optional]      | `Booléen` | `faux`                                 | Si la valeur est vraie, la détection des oreilles s'effectue en même temps que les effets de visage et renvoie les points d'attache des oreilles.                                                                                         |


Notes :

* `xrface` et `xrweb` ne peuvent pas être utilisés en même temps.
* `xrface` et `xrlayers` ne peuvent pas être utilisés en même temps.
* La meilleure pratique consiste à toujours utiliser `xrconfig`; cependant, si vous utilisez `xrface` sans `xrconfig` , `xrconfig` sera ajouté automatiquement. À ce moment-là, tous les attributs définis sur `xrface` seront transmis à `xrconfig`.

## Suivi des mains : `xrhand` {#hand-tracking}

Si vous souhaitez le suivi des mains, ajoutez le composant `xrhand` à votre scène `a-scene`:

`<a-scene xrconfig&gt ;`

#### xrhand Attributs {#xrhand-attributes}

| Composant                 | Type      | Défaut | Description                                                                                                                   |
| ------------------------- | --------- | ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| enableWrists [Facultatif] | `Booléen` | `faux` | Si true, la détection du poignet s'effectue en même temps que le suivi de la main et renvoie les points d'attache du poignet. |

Aucun

Notes :

* `xrhand` et `xrweb` ne peuvent pas être utilisés en même temps.
* `xrhand` et `xrlayers` ne peuvent pas être utilisés en même temps.
* `xrhand` et `xrface` ne peuvent pas être utilisés en même temps.

## Fonctions {#functions}

| Fonction                                          | Description                                                                                                                                                                                                |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xrconfigComponent](xrconfigcomponent.md)         | Crée un composant A-Frame pour la configuration de la caméra qui peut être enregistré avec `AFRAME.registerComponent()`. En général, il n'est pas nécessaire de l'appeler directement.                     |
| [xrwebComponent](xrwebcomponent.md)               | Crée un composant A-Frame pour le suivi du monde et/ou le suivi de l'image cible qui peut être enregistré avec `AFRAME.registerComponent()`. En général, il n'est pas nécessaire de l'appeler directement. |
| [xrlayersComponent](xrlayerscomponent.md)         | Crée un composant A-Frame pour le suivi des couches qui peut être enregistré avec `AFRAME.registerComponent()`. En général, il n'est pas nécessaire de l'appeler directement.                              |
| [xrfaceComponent](xrfacecomponent.md)             | Crée un composant A-Frame pour le suivi des effets de visage qui peut être enregistré avec `AFRAME.registerComponent()`. En général, il n'est pas nécessaire de l'appeler directement.                     |
| [xrlayersceneComponent](xrlayerscenecomponent.md) | Crée un composant A-Frame pour une scène Layer qui peut être enregistré avec `AFRAME.registerComponent()`. En général, il n'est pas nécessaire de l'appeler directement.                                   |

#### Exemple - SLAM activé (par défaut) {#example---slam-enabled-default}

```html
<a-scene xrconfig&gt ;
```

#### Exemple - SLAM désactivé (suivi d'image uniquement) {#example---slam-disabled-image-tracking-only}

```html
<a-scene xrconfig xrweb="disableWorldTracking : true"&gt ;
```

#### Exemple - Activer VPS {#example---enable-vps}

```html
<a-scene xrconfig xrweb="enableVps : true ; projectWayspots=location1,location2,location3">
```

#### Exemple - Caméra frontale (suivi d'image uniquement) {#example---front-camera-image-tracking-only}

```html
<a-scene xrconfig="cameraDirection : front" xrweb="disableWorldTracking : true"&gt ;
```

#### Exemple - Caméra frontale Effets de ciel {#example---front-camera-sky-effects}

```html
<a-scene xrconfig="cameraDirection : front" xrlayers&gt ;
```

#### Exemple - Sky + SLAM {#example---sky--slam}

```html
<a-scene xrconfig xrweb xrlayers>
  <a-entity xrlayerscene="name: sky; edgeSmoothness:0.6; invertLayerMask: true;">
    <!-- Ajoutez votre contenu Sky Effects ici. -->
  

```

#### Exemple - Effets de visage {#example---face-effects}

```html
<a-scene xrconfig&gt ;
```

#### Exemple - Effets de visage avec oreilles {#example---face-effects-ears}

```html
<a-scene xrconfig xrface="enableEars:true">
```

#### Exemple - Suivi des mains {#example---hand-tracking}

```html
<a-scene xrconfig&gt ;
```
