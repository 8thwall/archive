---
sidebar_label: xrCameraBehavior()
---

# XR8.Babylonjs.xrCameraBehavior()

`XR8.Babylonjs.xrCameraBehavior(config, xrConfig)`

## Description {#description}

Obtenir un comportement qui peut être attaché à une caméra Babylon comme suit : `camera.addBehavior(XR8.Babylonjs.xrCameraBehavior())`

## Paramètres {#parameters}

| Paramètres                                                                | Description                                                                                |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| config [Optionnel]    | Paramètres de configuration à transmettre à [`XR8.run()`](/legacy/api/xr8/run)             |
| xrConfig [Facultatif] | Paramètres de configuration à transmettre à [`XR8.XrController`](/legacy/api/xrcontroller) |

`config` [Optional] est un objet avec les propriétés suivantes :

| Propriété                                                                                                   | Type                                                     | Défaut                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webgl2 [Facultatif]                                     | `Booléen`                                                | `false`                                    | Si vrai, utiliser WebGL2 si disponible, sinon utiliser WebGL1.  Si faux, toujours utiliser WebGL1.                                                                                                                                                                                                                                                                                                      |
| ownRunLoop [Facultatif]                                 | `Booléen`                                                | `false`                                    | Si c'est le cas, XR doit utiliser sa propre boucle d'exécution.  Si false, vous fournirez votre propre boucle d'exécution et serez responsable de l'appel à [`runPreRender`](/legacy/api/xr8/runprerender) et [`runPostRender`](/legacy/api/xr8/runpostrender) vous-même [Utilisateurs avancés uniquement].                                         |
| cameraConfig : {direction} [Facultatif] | `Objet`                                                  | `{direction : XR8.XrConfig.camera().BACK}` | Appareil photo souhaité. Les valeurs prises en charge pour `direction` sont `XR8.XrConfig.camera().BACK` ou `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                                                                               |
| glContextConfig [Facultatif]                            | `WebGLContextAttributes` (en anglais) | `null`                                     | Les attributs permettant de configurer le contexte de la toile WebGL.                                                                                                                                                                                                                                                                                                                                                   |
| allowedDevices [Facultatif]                             | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device)   | `XR8.XrConfig.device().MOBILE`             | Spécifier la classe des appareils sur lesquels le pipeline doit fonctionner.  Si l'appareil actuel ne fait pas partie de cette classe, l'exécution échouera avant l'ouverture de la caméra. Si allowedDevices est `XR8.XrConfig.device().ANY`, la caméra est toujours ouverte. Notez que le suivi du monde ne peut être utilisé qu'avec `XR8.XrConfig.device().MOBILE`. |

`xrConfig` [Optional] est un objet avec les propriétés suivantes :

| Paramètres                                                                                                                                 | Description                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enableLighting [Facultatif]                                                            | Si c'est le cas, une estimation des informations sur l'éclairage est renvoyée.                                                                                                                                                                             |
| enableWorldPoints [Facultatif]                                                         | Si true, renvoie les points de la carte utilisés pour le suivi.                                                                                                                                                                                            |
| disableWorldTracking [Facultatif] (désactivation du suivi du monde) | Si c'est le cas, le suivi SLAM est désactivé pour des raisons d'efficacité.                                                                                                                                                                                |
| imageTargets [Facultatif]                                                              | Liste des noms de la cible d'image à détecter. Peut être modifié en cours d'exécution. Remarque : Toutes les cibles d'image actuellement actives seront remplacées par celles spécifiées dans cette liste. |
| leftHandedAxes [Facultatif]                                                            | Si c'est le cas, utiliser des coordonnées gauches.                                                                                                                                                                                                         |
| imageTargets [Facultatif]                                                              | Si vrai, inverser la gauche et la droite dans la sortie.                                                                                                                                                                                                   |

## Retourne {#returns}

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

  initXrScene({ scene, camera }) // Ajoute des objets à la scène et définit la position initiale de la caméra.

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
