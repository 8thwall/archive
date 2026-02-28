# Démarrer avec PlayCanvas

Pour commencer, rendez-vous sur <https://playcanvas.com/user/the8thwall> et créez un exemple de projet :

* Kit de démarrage Exemples de projets
  * [Kit de démarrage pour le suivi d'images](https://playcanvas.com/project/631721/overview/8th-wall-ar-image-targets) : Une application pour vous aider à créer rapidement des applications de suivi d'images dans PlayCanvas.
  * [Kit de démarrage pour le suivi du monde](https://playcanvas.com/project/631719/overview/8th-wall-ar-world-tracking) : Une application pour vous aider à créer rapidement des applications de suivi du monde dans PlayCanvas.
  * [Kit de démarrage des effets de visage](https://playcanvas.com/project/687674/overview/8th-wall-ar-face-effects) : Une application qui vous permet de créer rapidement des applications effets de visage dans PlayCanvas.
  * [Kit de démarrage effets de ciel](https://playcanvas.com/project/1055775/overview/8th-wall-sky-effects) : Une application qui vous permet de créer rapidement des applications effets de ciel dans PlayCanvas.
  * [Kit de démarrage pour le suivi des mains](https://playcanvas.com/project/1115012/overview/8th-wall-ar-hand-tracking) : Une application pour vous aider à créer rapidement des applications de suivi des mains dans PlayCanvas.
  * [Ear Tracking Starter Kit](https://playcanvas.com/project/1158433/overview/8th-wall-ears) : une application qui vous permet de commencer à créer rapidement des applications de détection des oreilles dans PlayCanvas.


* Autres exemples de projets
  * [Suivi du monde et effets de visage](https://playcanvas.com/project/701392/overview/8th-wall-ar-swap-camera) : Un exemple qui illustre comment basculer entre le suivi du monde et les effets de visage dans un même projet.
  * [Échange de couleur](https://playcanvas.com/project/783654/overview/8th-wall-ar-color-swap) : Une application pour vous permettre de créer rapidement des applications de suivi du monde AR qui incluent une interface utilisateur simple et un changement de couleur.
  * [Échange de décor](https://playcanvas.com/project/781435/overview/8th-wall-ar-swap-scenes) : Une application pour vous aider à créer rapidement des applications de suivi du monde AR qui changent de décor.
  * [Échange de caméra](https://playcanvas.com/project/701392/overview/8th-wall-ar-swap-camera) : Une application qui montre comment basculer entre les effets de visage de la caméra frontale et le suivi du monde de la caméra dorsale.

## Ajoutez votre clé d'application {#add-your-app-key}

Allez dans Paramètres -> Scripts externes

Les deux scripts suivants doivent être ajoutés :

* `https://cdn.8thwall.com/web/xrextras/xrextras.js`
* `https://apps.8thwall.com/xrweb?appKey=XXXXXX`

Remplacez ensuite `XXXXXX` par votre propre clé d'application unique obtenue auprès de la console 8th Wall.

## Activer la fonction "Transparent Canvas" (toile transparente) {#enable-transparent-canvas}

1. Allez dans Paramètres -> Rendu.
2. Assurez-vous que l'option "Transparent Canvas" est **cochée **.

## Désactiver "Préférer WebGL 2.0" {#disable-prefer-webgl-20}

1. Allez dans Paramètres -> Rendu.
2. Assurez-vous que l'option "Prefer WebGL 2.0" n'est pas **cochée**.

## Ajouter xrcontroller.js {#add-xrcontroller}
Les exemples de projets PlayCanvas sur 8th Wall sont fournis d'un objet de jeu XRController. Si vous commencez avec un projet vierge, téléchargez `xrcontroller.js` à partir de <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> et attachez-la à une entité de votre scène.

**NOTE** : Uniquement pour les projets SLAM et/ou Image cible. `xrcontroller.js` et `facecontroller.js` ou `layerscontroller.js` ne peuvent pas être utilisés simultanément.

| Option                       | Description                                                                                                                                                                                          |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| désactiver le suivi du monde | Si c'est le cas, désactivez le suivi SLAM pour plus d'efficacité.                                                                                                                                    |
| matériau d'ombre             | Matériau que vous souhaitez utiliser comme récepteur d'ombre transparent (par exemple pour les ombres au sol). En règle générale, ce matériau sera utilisé sur un plan de masse positionné à (0,0,0) |

## Ajouter le fichier layerscontroller.js {#add-layerscontroller}
Les exemples de projets PlayCanvas 8th Wall sont fournis d'un objet de jeu FaceController. Si vous commencez avec un projet vierge, téléchargez `layerscontroller.js` à partir de <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> et attachez-la à une entité de votre scène.

**NOTE** : Uniquement pour les projets avec effet de ciel. `layerscontroller.js` et `facecontroller.js` ou `xrcontroller.js` ne peuvent pas être utilisés simultanément.

## Ajouter facecontroller.js {#add-facecontroller}
Les exemples de projets PlayCanvas 8th Wall sont fournis d'un objet de jeu FaceController. Si vous commencez avec un projet vierge, téléchargez `facecontroller.js` à partir de <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> et attachez-le à une entité de votre scène.

**NOTE** : Uniquement pour les projets avec effet de visage. `facecontroller.js` et `xrcontroller.js` ou `layerscontroller.js` ou `handcontroller.js` ne peuvent pas être utilisés simultanément.

| Option     | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| headAnchor | L'entité à ancrer à la racine de la tête dans l'espace mondial. |

## Ajouter handcontroller.js {#add-handcontroller}
Les exemples de projets PlayCanvas 8th Wall sont peuplés d'un objet de jeu HandController. Si vous commencez avec un projet vierge, téléchargez `handcontroller.js` à partir de <https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/> et attachez-le à une entité de votre scène.

**NOTE** : Uniquement pour les projets de suivi de main. `handcontroller.js` et `xrcontroller.js` ou `layerscontroller.js` ou `facecontroller.js` ne peuvent pas être utilisés simultanément.

| Option     | Description                                                     |
| ---------- | --------------------------------------------------------------- |
| mainAnchor | L'entité à ancrer à la racine de la main dans l'espace mondial. |
