---
sidebar_label: faceCameraBehavior()
---

# XR8.Babylonjs.faceCameraBehavior()

`XR8.Babylonjs.faceCameraBehavior(config, faceConfig)`

## Description {#description}

Obtenir un comportement qui peut être attaché à une caméra Babylon comme suit : `camera.addBehavior(XR8.Babylonjs.faceCameraBehavior())`

## Paramètres {#parameters}

| Paramètres                                                                  | Description                                                                                              |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| config [Optionnel]      | Paramètres de configuration à transmettre à [`XR8.run()`](/legacy/api/xr8/run)                           |
| faceConfig [Facultatif] | Paramètres de configuration du visage à transmettre à [`XR8.FaceController`](/legacy/api/facecontroller) |

`config` [Optional] est un objet avec les propriétés suivantes :

| Propriété                                                                                                   | Type                                                     | Défaut                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webgl2 [Facultatif]                                     | `Booléen`                                                | `false`                                    | Si vrai, utiliser WebGL2 si disponible, sinon utiliser WebGL1.  Si faux, toujours utiliser WebGL1.                                                                                                                                                                                                                                                                                                      |
| ownRunLoop [Facultatif]                                 | `Booléen`                                                | `true`                                     | Si c'est le cas, XR doit utiliser sa propre boucle d'exécution.  Si false, vous fournirez votre propre boucle d'exécution et serez responsable de l'appel à [`runPreRender`](/legacy/api/xr8/runprerender) et [`runPostRender`](/legacy/api/xr8/runpostrender) vous-même [Utilisateurs avancés uniquement].                                         |
| cameraConfig : {direction} [Facultatif] | `Objet`                                                  | `{direction : XR8.XrConfig.camera().BACK}` | Appareil photo souhaité. Les valeurs prises en charge pour `direction` sont `XR8.XrConfig.camera().BACK` ou `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                                                                               |
| glContextConfig [Facultatif]                            | `WebGLContextAttributes` (en anglais) | `null`                                     | Les attributs permettant de configurer le contexte de la toile WebGL.                                                                                                                                                                                                                                                                                                                                                   |
| allowedDevices [Facultatif]                             | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device)   | `XR8.XrConfig.device().MOBILE`             | Spécifier la classe des appareils sur lesquels le pipeline doit fonctionner.  Si l'appareil actuel ne fait pas partie de cette classe, l'exécution échouera avant l'ouverture de la caméra. Si allowedDevices est `XR8.XrConfig.device().ANY`, la caméra est toujours ouverte. Notez que le suivi du monde ne peut être utilisé qu'avec `XR8.XrConfig.device().MOBILE`. |

`faceConfig` [Optional] est un objet avec les propriétés suivantes :

| Paramètres                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| nearClip [Facultatif]       | Distance entre la caméra et le plan du clip le plus proche. Par défaut, il utilisera le Babylon camera.minZ                                                                                                                                                                                                                                                |
| farClip [Facultatif]        | Distance entre la caméra et le plan du clip le plus éloigné. Par défaut, il utilisera le Babylon camera.maxZ                                                                                                                                                                                                                                               |
| meshGeometry [Optionnel]    | Liste contenant les parties de la géométrie de la tête qui sont visibles.  Les options sont les suivantes : `[XR8.FaceController.MeshGeometry.FACE, XR8.FaceController.MeshGeometry.EYES, XR8.FaceController.MeshGeometry.MOUTH, XR8.FaceController.MeshGeometry.IRIS]`. La valeur par défaut est `[XR8.FaceController.MeshGeometry.FACE]` |
| maxDetections [Facultatif]  | Nombre maximal de visages à détecter. Les choix possibles sont 1, 2 ou 3. La valeur par défaut est 1.                                                                                                                                                                                                                                      |
| uvType [Facultatif]         | Spécifie quels uv sont renvoyés dans l'événement de balayage des visages et de chargement des visages. Les options sont les suivantes : `[XR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`. La valeur par défaut est `[XR8.FaceController.UvType.STANDARD]`.                                      |
| leftHandedAxes [Facultatif] | Si c'est le cas, utiliser des coordonnées gauches.                                                                                                                                                                                                                                                                                                                         |
| imageTargets [Facultatif]   | Si vrai, inverser la gauche et la droite dans la sortie.                                                                                                                                                                                                                                                                                                                   |

## Retourne {#returns}

Un comportement Babylon JS qui connecte le moteur Face Effects à la caméra Babylon et démarre l'alimentation et le suivi de la caméra.

## Exemple {#example}

```javascript
const startScene = (canvas) => {
  const engine = new BABYLON.Engine(canvas, true /* antialias */)
  const scene = new BABYLON.Scene(engine)
  scene.useRightHandedSystem = false

  const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, 0), scene)
  camera.rotation = new BABYLON.Vector3(0, scene.useRightHandedSystem ? Math.PI : 0, 0)
  camera.minZ = 0.0001
  camera.maxZ = 10000

  // Ajouter une lumière à la scène
  const directionalLight =
  new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-5, -10, 7), scene)
  directionalLight.intensity = 0.5

  // Logique de maillage
  const faceMesh = new BABYLON.Mesh("face", scene) ;
  const material = new BABYLON.StandardMaterial("boxMaterial", scene)
  material.diffuseColor = new BABYLON.Color3(173 / 255.0, 80 / 255.0, 255 / 255.0)
  faceMesh.material = material

  let facePoints = []

  const runConfig = {
    cameraConfig : {XR8.XrConfig.camera().FRONT},
    allowedDevices : XR8.XrConfig.device().ANY,
    verbose : true,
  }

  camera.addBehavior(XR8.Babylonjs.faceCameraBehavior(runConfig)) // Connecter la caméra au XR et afficher le flux de la caméra.

  engine.runRenderLoop(() => {
    scene.render()
  })
}
```
