---
sidebar_label: exécuter()
---

# XR8.run()

`XR8.run(canvas, webgl2, ownRunLoop, cameraConfig, glContextConfig, allowedDevices, sessionConfiguration)`

## Description {#description}

Ouvrez l'appareil photo et lancez la boucle d'exécution de l'appareil photo.

## Paramètres {#parameters}

| Propriété                                                                                                                                                               | Type                                                     | Défaut                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| toile                                                                                                                                                                   | `HTMLCanvasElement`                                      |                                             | Le canevas HTML sur lequel le flux de la caméra sera dessiné.                                                                                                                                                                                                                                                                                                                                                                                                          |
| webgl2 [Facultatif]                                                                                                 | `Booléen`                                                | `true`                                      | Si vrai, utiliser WebGL2 si disponible, sinon utiliser WebGL1.  Si faux, toujours utiliser WebGL1.                                                                                                                                                                                                                                                                                                                                                     |
| ownRunLoop [Facultatif]                                                                                             | `Booléen`                                                | `true`                                      | Si c'est le cas, XR doit utiliser sa propre boucle d'exécution.  Si c'est faux, vous fournirez votre propre boucle d'exécution et serez responsable de l'appel de [runPreRender](runprerender.md) et [runPostRender](runpostrender.md) vous-même [Utilisateurs avancés uniquement].                                                                                                                |
| cameraConfig : {direction} [Facultatif]                                                             | `Objet`                                                  | `{direction : XR8.XrConfig.camera().BACK}`  | Appareil photo souhaité. Les valeurs prises en charge pour `direction` sont `XR8.XrConfig.camera().BACK` ou `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                                                                                                                              |
| glContextConfig [Facultatif]                                                                                        | `WebGLContextAttributes` (en anglais) | `null`                                      | Les attributs permettant de configurer le contexte de la toile WebGL.                                                                                                                                                                                                                                                                                                                                                                                                  |
| allowedDevices [Facultatif]                                                                                         | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device)   | `XR8.XrConfig.device().MOBILE_AND_HEADSETS` | Spécifier la classe des appareils sur lesquels le pipeline doit fonctionner.  Si l'appareil actuel ne fait pas partie de cette classe, l'exécution échouera avant l'ouverture de la caméra. Si allowedDevices est `XR8.XrConfig.device().ANY`, la caméra est toujours ouverte. Notez que le suivi du monde ne peut être utilisé qu'avec `XR8.XrConfig.device().MOBILE_AND_HEADSETS` ou `XR8.XrConfig.device().MOBILE`. |
| sessionConfiguration : `{disableXrTablet, xrTabletStartsMinimized, defaultEnvironment}` [Optionnel] | `Objet`                                                  | `{}`                                        | Configurer les options relatives aux différents types de sessions.                                                                                                                                                                                                                                                                                                                                                                                                     |

`sessionConfiguration` est un objet avec les propriétés [optionnelles] suivantes :

| Propriété                                                                                                                                                                                                              | Type      | Défaut  | Description                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------- | ----------------------------------------------------------------------------------------------------- |
| disableXrTablet [Optionnel]                                                                                                                                        | `Booléen` | `false` | Désactiver la tablette visible dans les sessions immersives.                          |
| xrTabletStartsMinimized [Optionnel]                                                                                                                                | `Booléen` | `false` | La tablette démarre en mode réduit.                                                   |
| defaultEnvironment `{disabled, floorScale, floorTexture, floorColor, fogIntensity, skyTopColor, skyBottomColor, skyGradientStrength}` [Optionnel]. | `Objet`   | {}      | Configurez les options liées à l'environnement par défaut de votre session immersive. |

`defaultEnvironment` est un objet ayant les propriétés [optionnelles] suivantes :

| Propriété                                                                           | Type               | Défaut    | Description                                                                                   |
| ----------------------------------------------------------------------------------- | ------------------ | --------- | --------------------------------------------------------------------------------------------- |
| désactivé [Facultatif]          | `Booléen`          | `false`   | Désactive l'arrière-plan "espace vide" par défaut.                            |
| floorScale [Facultatif]         | `Nombre`           | `1`       | Réduire ou augmenter la texture du sol.                                       |
| floorTexture [Facultatif]       | Actif              |           | Indiquez une autre ressource de texture ou une autre URL pour le sol carrelé. |
| floorColor [Facultatif]         | Couleur hexagonale | `#1A1C2A` | Définir la couleur du sol.                                                    |
| fogIntensity [Facultatif]       | `Nombre`           | `1`       | Augmenter ou diminuer la densité du brouillard.                               |
| skyTopColor [Optionnel]         | Couleur hexagonale | `#BDC0D6` | Définit la couleur du ciel directement au-dessus de l'utilisateur.            |
| skyBottomColor [Optionnel]      | Couleur hexagonale | `#1A1C2A` | Définir la couleur du ciel à l'horizon.                                       |
| skyGradientStrength [Optionnel] | `Nombre`           | `1`       | Permet de contrôler la netteté des transitions du dégradé du ciel.            |

Notes :

- `cameraConfig` : Le suivi du monde (SLAM) n'est possible qu'avec la caméra `back`.  Si vous utilisez la caméra `front`, vous devez désactiver le suivi du monde en appelant d'abord `XR8.XrController.configure({disableWorldTracking: true})`.

## Retourne {#returns}

Aucun

## Exemple {#example}

```javascript
// Ouvrez la caméra et lancez la boucle d'exécution de la caméra
// Dans index.html : <canvas id="camerafeed"></canvas>
XR8.run({canvas : document.getElementById('camerafeed')})
```

## Exemple - Utilisation de la caméra frontale (suivi d'image uniquement) {#example---using-front-camera-image-tracking-only}

```javascript
// Désactiver le suivi du monde (SLAM). Ceci est nécessaire pour utiliser la caméra frontale.
XR8.XrController.configure({disableWorldTracking: true})
// Ouvrir la caméra et lancer la boucle camera run
// Dans index.html : <canvas id="camerafeed"></canvas>
XR8.run({canvas : document.getElementById('camerafeed'), cameraConfig : {direction : XR8.XrConfig.camera().FRONT}})
```

## Exemple - Définir glContextConfig {#example---set-glcontextconfig}

```javascript
// Ouvrir la caméra et lancer la boucle d'exécution de la caméra avec un canevas opaque.
// Dans index.html : <canvas id="camerafeed"></canvas>
XR8.run({canvas : document.getElementById('camerafeed'), glContextConfig : {alpha: false, preserveDrawingBuffer: false}})
```
