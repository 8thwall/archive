---
sidebar_label: run()
---

# XR8.run()

`XR8.run(canvas, webgl2, ownRunLoop, cameraConfig, glContextConfig, allowedDevices, sessionConfiguration)`

## Description {#description}

Ouvrez l'appareil photo et lancez la boucle d'exécution de l'appareil photo.

## Paramètres {#parameters}

| Propriété                                                                                            | Type                                            | Défaut                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| support                                                                                              | `HTMLCanvasElement`                             |                                             | Le canevas HTML sur lequel le flux de la caméra sera dessiné.                                                                                                                                                                                                                                                                                                                                                   |
| webgl2 [Facultatif]                                                                                  | `Booléen`                                       | `vrai`                                      | Si vrai, utilisez WebGL2 si disponible, sinon utilisez WebGL1.  Si faux, utilisez toujours WebGL1.                                                                                                                                                                                                                                                                                                              |
| ownRunLoop [Facultatif]                                                                              | `Booléen`                                       | `vrai`                                      | Si c'est le cas, XR doit utiliser sa propre boucle d'exécution.  Si c’est faux, vous fournirez votre propre boucle d'exécution et serez responsable de l'appel à [runPreRender](runprerender.md) et [runPostRender](runpostrender.md) par vous-même [Utilisateurs avancés uniquement]                                                                                                                           |
| cameraConfig : {direction} [Facultatif]                                                              | `Objet`                                         | `{direction: XR8.XrConfig.camera().BACK}`   | Appareil photo souhaité. Les valeurs prises en charge pour la direction `` sont `XR8.XrConfig.camera().BACK` ou `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                                                                   |
| glContextConfig [Facultatif]                                                                         | `WebGLContextAttributes`                        | `nul`                                       | Les attributs permettant de configurer le contexte du support WebGL.                                                                                                                                                                                                                                                                                                                                            |
| allowedDevices [Facultatif]                                                                          | [`XR8.XrConfig.device()`](/api/xrconfig/device) | `XR8.XrConfig.device().MOBILE_AND_HEADSETS` | Spécifiez la classe d'appareils sur lesquels le pipeline doit fonctionner.  Si l'appareil actuel ne fait pas partie de cette classe, l'exécution échouera avant l'ouverture de la caméra. Si allowedDevices est `XR8.XrConfig.device().ANY`, ouvrez toujours la caméra. Notez que le suivi du monde ne peut être utilisé qu'avec `XR8.XrConfig.device().MOBILE_AND_HEADSETS` ou `XR8.XrConfig.device().MOBILE`. |
| sessionConfiguration : `{disableXrTablet, xrTabletStartsMinimized, defaultEnvironment}` [Facultatif] | `Objet`                                         | `{}`                                        | Configurez les options relatives aux différents types de sessions.                                                                                                                                                                                                                                                                                                                                              |

`sessionConfiguration` est un objet doté des propriétés [facultatives] suivantes :

| Propriété                                                                                                                                          | Type      | Défaut | Description                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------ | ------------------------------------------------------------------------------------- |
| disableXrTablet [Optionnel]                                                                                                                        | `Booléen` | `faux` | Désactivez la tablette visible lors des sessions immersives.                          |
| xrTabletStartsMinimized [Optional]                                                                                                                 | `Booléen` | `faux` | La tablette démarre en mode réduit.                                                   |
| defaultEnvironment `{disabled, floorScale, floorTexture, floorColor, fogIntensity, skyTopColor, skyBottomColor, skyGradientStrength}` [Facultatif] | `Objet`   | {}     | Configurez les options liées à l'environnement par défaut de votre session immersive. |

`defaultEnvironment` est un objet doté des propriétés [facultatives] suivantes :

| Propriété                       | Type               | Défaut    | Description                                                                   |
| ------------------------------- | ------------------ | --------- | ----------------------------------------------------------------------------- |
| désactivé [Facultatif]          | `Booléen`          | `faux`    | Désactive l'arrière-plan "espace vide" par défaut.                            |
| floorScale [Facultatif]         | `Nombre`           | `1`       | Réduire ou augmenter la texture du sol.                                       |
| floorTexture [Facultatif]       | Actif              |           | Indiquez une autre ressource de texture ou une autre URL pour le sol carrelé. |
| floorColor [Facultatif]         | Couleur hexagonale | `#1A1C2A` | Définissez la couleur du sol.                                                 |
| fogIntensity [Facultatif]       | `Nombre`           | `1`       | Augmenter ou diminuer la densité du brouillard.                               |
| skyTopColor [Optionnel]         | Couleur hexagonale | `#BDC0D6` | Définit la couleur du ciel directement au-dessus de l'utilisateur.            |
| skyBottomColor [Optionnel]      | Couleur hexagonale | `#1A1C2A` | Définissez la couleur du ciel à l'horizon.                                    |
| skyGradientStrength [Optionnel] | `Nombre`           | `1`       | Contrôlez la netteté des transitions du dégradé du ciel.                      |

Notes :

* `cameraConfig` : Le suivi du monde (SLAM) n'est pris en charge que sur la caméra `back` .  Si vous utilisez la caméra frontale `` , vous devez désactiver le suivi du monde en appelant d'abord `XR8.XrController.configure({disableWorldTracking: true})`.

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
// Ouvrez la caméra et lancez la boucle d'exécution de la caméra
// Dans index.html :
XR8.run({canvas: document.getElementById('camerafeed')})
```

## Exemple - Utilisation de la caméra frontale (suivi d'image uniquement) {#example---using-front-camera-image-tracking-only}

```javascript
// Désactiver le suivi du monde (SLAM). Cela est nécessaire pour utiliser la caméra frontale.
XR8.XrController.configure({disableWorldTracking: true})
// Ouvrez la caméra et lancez la boucle d'exécution
// Dans index.html :
XR8.run({canvas: document.getElementById('camerafeed'), cameraConfig: {direction: XR8.XrConfig.camera().FRONT}})
```

## Exemple - Définir glContextConfig {#example---set-glcontextconfig}

```javascript
// Ouvrez la caméra et commencez à exécuter la boucle d'exécution de la caméra avec un canevas opaque.
// Dans index.html :
XR8.run({canvas: document.getElementById('camerafeed'), glContextConfig: {alpha: false, preserveDrawingBuffer: false}})
```
