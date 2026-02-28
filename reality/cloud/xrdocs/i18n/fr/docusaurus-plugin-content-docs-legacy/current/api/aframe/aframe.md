# XR8.AFrame

A-Frame (<https://aframe.io>) est un cadre web conçu pour créer des expériences de réalité virtuelle.
En ajoutant 8th Wall Web à votre projet A-Frame, vous pouvez maintenant facilement créer des expériences de **réalité augmentée**
pour le web.

## Ajout de l'âme du 8ème mur à l'ossature en A {#adding-8th-wall-web-to-a-frame}

#### Editeur de nuages {#cloud-editor}

1. Il suffit d'ajouter une balise "meta" dans le fichier head.html pour inclure la bibliothèque "8-Frame" dans votre projet. Si vous clonez à partir d'un des modèles A-Frame de 8th Wall ou d'un projet auto-hébergé, il sera déjà présent.  De plus, il n'est pas nécessaire d'ajouter manuellement votre AppKey.

`<meta name="8thwall:renderer" content="aframe:1.4.1">`

#### {#self-hosted}auto-hébergé

8th Wall Web peut être ajouté à votre projet A-Frame en quelques étapes faciles :

1. Inclut une version légèrement modifiée de A-Frame (appelée "8-Frame") qui corrige certains problèmes de polissage :

`<script src="//cdn.8thwall.com/web/aframe/8frame-1.4.1.min.js"></script>`

2. Ajoutez la balise de script suivante au HEAD de votre page. Remplacez les X par votre clé d'application :

`<script src="//apps.8thwall.com/xrweb?appKey=XXXXX"></script>`

## Configuration de la caméra : `xrconfig` {#configuring-the-camera}

Pour configurer le flux de la caméra, ajoutez le composant `xrconfig` à votre `a-scene` :

`<a-scene xrconfig>`

#### xrconfig Attributs (tous facultatifs) {#xrconfig-attributes}

| Composant                                                                                                 | Type               | Défaut                       | Description                                                                                                                                                                                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------- | ------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| cameraDirection                                                                                           | `Chaîne`           | `'back'`                     | Appareil photo souhaité. Choisissez entre : `back` ou `front`. Utilisez `cameraDirection : front;` avec `mirroredDisplay : true;` pour le mode selfie. Notez que le suivi du monde n'est possible qu'avec `cameraDirection : back;`.                                               |
| appareils autorisés                                                                                       | `Chaîne`           | `'mobile-and-headsets'` \\` | Classes d'appareils prises en charge. Choisissez entre : `'mobile-and-headsets'' , `'mobile'' ou `'any''. Utilisez `'any'`pour activer les ordinateurs portables ou de bureau avec des webcams intégrées ou connectées. Notez que le suivi du monde n'est possible que sur ``mobile-and-headsets'' ou`mobile\\`.  |
| mirroredDisplay                                                                                           | `Booléen`          | `false`                      | Si la valeur est vraie, la géométrie de sortie est inversée à gauche et à droite et la direction du flux de la caméra est inversée. Utilisez `'mirroredDisplay : true;'` avec `'cameraDirection : front;'` pour le mode selfie. Ne doit pas être activé si le suivi du monde (SLAM) est activé. |
| désactiverXrTablet                                                                                        | `Booléen`          | `false`                      | Désactiver la tablette visible dans les sessions immersives.                                                                                                                                                                                                                                                                                       |
| xrTabletStartsMinimized                                                                                   | `Booléen`          | `false`                      | La tablette démarre en mode réduit.                                                                                                                                                                                                                                                                                                                |
| Désactiver l'environnement par défaut                                                                     | `Booléen`          | `false`                      | Désactive l'arrière-plan "espace vide" par défaut.                                                                                                                                                                                                                                                                                                 |
| disableDesktopCameraControls                                                                              | `Booléen`          | `false`                      | Désactiver le WASD et la recherche de la caméra avec la souris.                                                                                                                                                                                                                                                                                    |
| disableDesktopTouchEmulation                                                                              | `Booléen`          | `false`                      | Désactiver les fausses touches sur le bureau.                                                                                                                                                                                                                                                                                                      |
| désactiverXrTouchEmulation                                                                                | `Booléen`          | `false`                      | N'émettez pas d'événements tactiles basés sur les rayonnements du contrôleur avec la scène.                                                                                                                                                                                                                                                        |
| Désactiver le parrainage de la caméra                                                                     | `Booléen`          | `false`                      | Désactiver le déplacement de l'objet caméra -> contrôleur                                                                                                                                                                                                                                                                                                          |
| defaultEnvironmentFloorScale                                                                              | `Nombre`           | `1`                          | Réduire ou augmenter la texture du sol.                                                                                                                                                                                                                                                                                                            |
| defaultEnvironmentFloorTexture (texture de sol par défaut)                             | Actif              |                              | Indiquez une autre ressource de texture ou une autre URL pour le sol carrelé.                                                                                                                                                                                                                                                                      |
| Couleur du sol de l'environnement par défaut                                                              | Couleur hexagonale | `#1A1C2A`                    | Définir la couleur du sol.                                                                                                                                                                                                                                                                                                                         |
| defaultEnvironmentFogIntensity (intensité du brouillard de l'environnement par défaut) | `Nombre`           | `1`                          | Augmenter ou diminuer la densité du brouillard.                                                                                                                                                                                                                                                                                                    |
| defaultEnvironmentSkyTopColor (couleur du sommet du ciel)                              | Couleur hexagonale | `#BDC0D6`                    | Définit la couleur du ciel directement au-dessus de l'utilisateur.                                                                                                                                                                                                                                                                                 |
| defaultEnvironmentSkyBottomColor (couleur du fond de l'environnement)                  | Couleur hexagonale | `#1A1C2A`                    | Définir la couleur du ciel à l'horizon.                                                                                                                                                                                                                                                                                                            |
| defaultEnvironmentSkyGradientStrength (force du gradient de ciel par défaut)           | `Nombre`           | `1`                          | Permet de contrôler la netteté des transitions du dégradé du ciel.                                                                                                                                                                                                                                                                                 |

Notes :

- `cameraDirection` : Lors de l'utilisation de `xrweb` pour le suivi du monde (SLAM), seule la caméra `back` est supportée
  . Si vous utilisez la caméra `front`, vous devez désactiver le suivi du monde en réglant
  `disableWorldTracking : true` sur `xrweb`.

## Suivi du monde, cibles d'images, et/ou navire-phare VPS : `xrweb` {#world-tracking-image-targets-andor-lightship-vps}

Si vous voulez des cibles d'images de suivi du monde, ou des VPS de bateaux-phares, ajoutez le composant `xrweb` à votre `a-scene` :

`<a-scene xrconfig xrweb>`

#### xrweb Attributs (tous facultatifs) {#xrweb-attributes}

| Composant                    | Type      | Défaut      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------- | --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| échelle                      | `Chaîne`  | `'réactif'` | Soit `'responsive'', soit `'absolute''. `'responsive'` renverra des valeurs telles que la caméra de la frame 1 soit à l'origine définie par [`XR8.XrController.updateCameraProjectionMatrix()`](../xrcontroller/updatecameraprojectionmatrix). `'absolute'` retournera la caméra, les cibles de l'image, etc. en mètres. La valeur par défaut est `'responsive''. En utilisant `'absolute'`, la position x, la position z et la rotation de la pose de départ respecteront les paramètres définis dans [`XR8.XrController.updateCameraProjectionMatrix()\\`](../xrcontroller/updatecameraprojectionmatrix) une fois que l'échelle a été estimée. La position y dépend de la hauteur physique de la caméra par rapport au plan du sol. |
| Désactiver le suivi du monde | `Booléen` | `false`     | Si c'est le cas, le suivi SLAM est désactivé pour des raisons d'efficacité.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| activerVps                   | `Booléen` | `false`     | Si c'est le cas, recherchez des emplacements de projet et un maillage. Le maillage renvoyé n'a aucun rapport avec les emplacements de projet et sera renvoyé même si aucun emplacement de projet n'est configuré. L'activation de VPS annule les réglages de `scale` et `disableWorldTracking`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| projetWayspots               | `Array`   | `[]`        | Chaînes séparées par des virgules de noms de lieux de projets à localiser exclusivement. Si le paramètre n'est pas défini ou si une chaîne vide est transmise, nous localiserons tous les emplacements de projet à proximité.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

Notes :

- `xrweb` et `xrface` ne peuvent pas être utilisés en même temps.
- `xrweb` et `xrlayers` peuvent être utilisés en même temps. Vous devez utiliser `xrconfig` pour ce faire.
  - La meilleure pratique est de toujours utiliser `xrconfig` ; cependant, si vous utilisez `xrweb` sans `xrface` ou
    `xrlayers` ou `xrconfig`, alors `xrconfig` sera ajouté automatiquement. Lorsque cela se produit, tous les attributs de
    qui ont été définis sur `xrweb` seront transmis à `xrconfig`.
- `cameraDirection` : Le suivi du monde (SLAM) n'est possible qu'avec la caméra `back`. Si vous utilisez
  la caméra `front`, vous devez désactiver le suivi du monde en réglant `disableWorldTracking : true`.
- Le suivi du monde (SLAM) n'est possible que sur les appareils mobiles.

## Effets de ciel : `xrlayers` et `xrlayerscene` {#sky-effects-xrlayers-and-xrlayerscene}

Si vous voulez Sky Effects :

1. Ajoutez le composant `xrlayers` à votre `a-scene`
2. Ajoutez le composant `xrlayerscene` à une `a-entity` et ajoutez le contenu que vous voulez voir dans le ciel sous cette `a-entity`.

```html
<a-scene xrconfig xrlayers>
  <a-entity xrlayerscene="name: sky; edgeSmoothness:0.6; invertLayerMask: true;">
    <!-- Add your Sky Effects content here. -->
  </a-entity>
</a-scene>
```

#### xrlayers Attributs {#xrlayers-attributes}

Aucun

Notes :

- `xrlayers` et `xrface` ne peuvent pas être utilisés en même temps.
- `xrlayers` et `xrweb` peuvent être utilisés en même temps. Vous devez utiliser `xrconfig` pour ce faire.
  - La meilleure pratique est de toujours utiliser `xrconfig` ; cependant, si vous utilisez `xrlayers` sans `xrface` ou `xrweb` ou `xrconfig`, alors `xrconfig` sera ajouté automatiquement. Lorsque cela se produit, tous les attributs qui ont été définis sur `xrweb` seront transmis à `xrconfig`.

#### Attributs xrlayerscene {#xrlayerscene-attributes}

| Composant         | Type      | Défaut  | Description                                                                                                                                                                                                                                        |
| ----------------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nom               | `Chaîne`  | `''`    | Le nom de la couche. Doit correspondre à une couche de [`XR8.LayersController`](../layerscontroller/layerscontroller.md). La seule couche supportée pour le moment est `sky`.                      |
| invertLayerMask   | `Booléen` | `false` | Si cette option est activée, le contenu que vous placez dans votre scène occultera les zones qui ne sont pas dans le ciel. S'il est faux, le contenu que vous placez dans votre scène occultera les zones du ciel. |
| douceur des bords | `Nombre`  | `0`     | Montant pour lisser les bords de la couche. Valeurs valables entre 0 et 1.                                                                                                                                         |

## Effets de visage : `xrface` {#face-effects}

Si vous voulez suivre les effets de visage, ajoutez le composant `xrface` à votre `a-scene` :

`<a-scene xrconfig xrface>`

#### xrface Attributs {#xrface-attributes}

| Composant                                                                      | Type      | Défaut                                         | Description                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------ | --------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| meshGeometry                                                                   | `Array`   | `['face']`                                     | Chaînes de caractères séparées par des virgules qui configurent les parties du maillage de la face pour lesquelles des indices de triangle seront renvoyés. Il peut s'agir de n'importe quelle combinaison de `visage'', `yeux'', `iris'' et/ou `bouche''. |
| maxDetections [Facultatif] | `Nombre`  | `1`                                            | Nombre maximal de visages à détecter. Les choix possibles sont 1, 2 ou 3.                                                                                                                                                                                  |
| uvType [Facultatif]        | `Chaîne`  | \`[XR8.FaceController.UvType.STANDARD]\`\\` | Spécifie quels uv sont renvoyés dans l'événement de balayage des visages et de chargement des visages. Les options sont les suivantes : `[XR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`                                        |
| enableEars [Facultatif]    | `Booléen` | `false`                                        | Si la valeur est vraie, la détection des oreilles s'effectue en même temps que les effets de visage et renvoie les points d'attache des oreilles.                                                                                                                          |

Notes :

- `xrface` et `xrweb` ne peuvent pas être utilisés en même temps.
- `xrface` et `xrlayers` ne peuvent pas être utilisés en même temps.
- La meilleure pratique est de toujours utiliser `xrconfig` ; cependant, si vous utilisez `xrface` sans `xrconfig`, alors `xrconfig` sera ajouté automatiquement. Lorsque cela se produit, tous les attributs qui ont été définis sur `xrface` seront transmis à `xrconfig`.

## Suivi des mains : `xrhand` {#hand-tracking}

Si vous voulez le Hand Tracking, ajoutez le composant `xrhand` à votre `a-scene` :

`<a-scene xrconfig xrhand>`

#### xrhand Attributs {#xrhand-attributes}

| Composant                                                                     | Type      | Défaut  | Description                                                                                                                                   |
| ----------------------------------------------------------------------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| enableWrists [Facultatif] | `Booléen` | `false` | Si true, la détection du poignet s'effectue en même temps que le suivi de la main et renvoie les points d'attache du poignet. |

Aucun

Notes :

- `xrhand` et `xrweb` ne peuvent pas être utilisés en même temps.
- `xrhand` et `xrlayers` ne peuvent pas être utilisés en même temps.
- `xrhand` et `xrface` ne peuvent pas être utilisés en même temps.

## Fonctions {#functions}

| Fonction                                          | Description                                                                                                                                                                                                                       |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xrconfigComponent](xrconfigcomponent.md)         | Crée un composant A-Frame pour configurer la caméra qui peut être enregistré avec `AFRAME.registerComponent()`. En général, il n'est pas nécessaire de l'appeler directement.                     |
| [xrwebComponent](xrwebcomponent.md)               | Crée un composant A-Frame pour le suivi du monde et/ou de l'image cible qui peut être enregistré avec `AFRAME.registerComponent()`. En général, il n'est pas nécessaire de l'appeler directement. |
| [xrlayersComponent](xrlayerscomponent.md)         | Crée un composant A-Frame pour le suivi des couches qui peut être enregistré avec `AFRAME.registerComponent()`. En général, il n'est pas nécessaire de l'appeler directement.                     |
| [xrfaceComponent](xrfacecomponent.md)             | Crée un composant A-Frame pour le suivi de Face Effects qui peut être enregistré avec `AFRAME.registerComponent()`. En général, il n'est pas nécessaire de l'appeler directement.                 |
| [xrlayersceneComponent](xrlayerscenecomponent.md) | Crée un composant A-Frame pour une scène Layer qui peut être enregistrée avec `AFRAME.registerComponent()`. En général, il n'est pas nécessaire de l'appeler directement.                         |

#### Exemple - SLAM activé (par défaut) {#example---slam-enabled-default}

```html
<a-scene xrconfig xrweb>
```

#### Exemple - SLAM désactivé (suivi d'image uniquement) {#example---slam-disabled-image-tracking-only}

```html
<a-scene xrconfig xrweb="disableWorldTracking: true">
```

#### Exemple - Activer VPS {#example---enable-vps}

```html
<a-scene xrconfig xrweb="enableVps: true; projectWayspots=location1,location2,location3">
```

#### Exemple - Caméra frontale (suivi d'image uniquement) {#example---front-camera-image-tracking-only}

```html
<a-scene xrconfig="cameraDirection: front" xrweb="disableWorldTracking: true">
```

#### Exemple - Caméra frontale Effets de ciel {#example---front-camera-sky-effects}

```html
<a-scene xrconfig="cameraDirection: front" xrlayers>
```

#### Exemple - Sky + SLAM {#example---sky--slam}

```html
<a-scene xrconfig xrweb xrlayers>
  <a-entity xrlayerscene="name: sky; edgeSmoothness:0.6; invertLayerMask: true;">
    <!-- Add your Sky Effects content here. -->
  </a-entity>
</a-scene>
```

#### Exemple - Effets de visage {#example---face-effects}

```html
<a-scene xrconfig xrface>
```

#### Exemple - Effets de visage avec oreilles {#example---face-effects-ears}

```html
<a-scene xrconfig xrface="enableEars:true">
```

#### Exemple - Suivi des mains {#example---hand-tracking}

```html
<a-scene xrconfig xrhand>
```
