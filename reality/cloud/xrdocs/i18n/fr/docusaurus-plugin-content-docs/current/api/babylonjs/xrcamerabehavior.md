---
sidebar_label: xrCameraBehavior()
---

# XR8.Babylonjs.xrCameraBehavior()

`XR8.Babylonjs.xrCameraBehavior(config, xrConfig)`

## Description {#description}

Obtenez un comportement qui peut être attaché à une caméra Babylon comme suit : `camera.addBehavior(XR8.Babylonjs.xrCameraBehavior())`

## Paramètres {#parameters}

| Paramètres            | Description                                                                         |
| --------------------- | ----------------------------------------------------------------------------------- |
| config [Optionnel]    | Paramètres de configuration à transmettre à [`XR8.run()`](/api/xr8/run)             |
| xrConfig [Facultatif] | Paramètres de configuration à transmettre à [`XR8.XrController`](/api/xrcontroller) |

`config` [Facultatif] est un objet avec les propriétés suivantes :

| Propriété                               | Type                                            | Défaut                                    | Description                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------- | ----------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webgl2 [Facultatif]                     | `Booléen`                                       | `faux`                                    | Si vrai, utilisez WebGL2 si disponible, sinon utilisez WebGL1.  Si faux, utilisez toujours WebGL1.                                                                                                                                                                                                                                                               |
| ownRunLoop [Facultatif]                 | `Booléen`                                       | `faux`                                    | Si c'est le cas, XR doit utiliser sa propre boucle d'exécution.  Si c'est faux, vous fournirez votre propre boucle d'exécution et serez responsable de l'appel à [`runPreRender`](/api/xr8/runprerender) et [`runPostRender`](/api/xr8/runpostrender) vous-même [Utilisateurs avancés uniquement]                                                                |
| cameraConfig : {direction} [Facultatif] | `Objet`                                         | `{direction: XR8.XrConfig.camera().BACK}` | Appareil photo souhaité. Les valeurs prises en charge pour la direction `` sont `XR8.XrConfig.camera().BACK` ou `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                    |
| glContextConfig [Facultatif]            | `WebGLContextAttributes`                        | `nul`                                     | Les attributs permettant de configurer le contexte du support WebGL.                                                                                                                                                                                                                                                                                             |
| allowedDevices [Facultatif]             | [`XR8.XrConfig.device()`](/api/xrconfig/device) | `XR8.XrConfig.device().MOBILE`            | Spécifiez la classe d'appareils sur lesquels le pipeline doit fonctionner.  Si l'appareil actuel ne fait pas partie de cette classe, l'exécution échouera avant l'ouverture de la caméra. Si allowedDevices est `XR8.XrConfig.device().ANY`, ouvrez toujours la caméra. Notez que le suivi du monde ne peut être utilisé qu'avec `XR8.XrConfig.device().MOBILE`. |

`xrConfig` [Facultatif] est un objet ayant les propriétés suivantes :

| Paramètres                        | Description                                                                                                                                                                                              |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enableLighting [Facultatif]       | Si vrai, vous obtiendrez une estimation des informations relatives à l'éclairage.                                                                                                                        |
| enableWorldPoints [Facultatif]    | Si vrai, renvoie les points de la carte utilisés pour le suivi.                                                                                                                                          |
| disableWorldTracking [Facultatif] | Si c'est le cas, désactivez le suivi SLAM pour plus d'efficacité.                                                                                                                                        |
| imageTargets [Facultatif]         | Liste des noms de la cible d'image à détecter. Peut être modifié en cours d'exécution. Remarque : Toutes les images cible actuellement actives seront remplacées par celles spécifiées dans cette liste. |
| leftHandedAxes [Facultatif]       | Si vrai, utilisez des coordonnées pour gaucher.                                                                                                                                                          |
| imageTargets [Facultatif]         | Si vrai, inverser la gauche et la droite dans la sortie.                                                                                                                                                 |

## Retours {#returns}

Un comportement Babylon JS qui connecte le moteur XR à la caméra Babylon et démarre l'alimentation et le suivi de la caméra.

## Exemple {#example}

```javascript
let surface, engine, scene, camera

const startScene = () => {
  const canvas = document.getElementById('renderCanvas')

  engine = new BABYLON.Engine(canvas, true, { stencil: true, preserveDrawingBuffer: true })
  engine.enableOfflineSupport = false

  scene = new BABYLON.Scene(engine)
  camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 3, 0), scene)

  initXrScene({ scene, camera }) // Ajoutez des objets à la scène et définissez la position initiale de la caméra.

  // Connecter la caméra au moteur XR et afficher le flux de la caméra
  camera.addBehavior(XR8.Babylonjs.xrCameraBehavior())

  engine.runRenderLoop(() => {
    scene.render()
  })

  window.addEventListener('resize', () => {
    engine.resize()
  })
}
```
