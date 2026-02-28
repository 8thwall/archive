---
sidebar_label: faceCameraBehavior()
---

# XR8.Babylonjs.faceCameraBehavior()

`XR8.Babylonjs.faceCameraBehavior(config, faceConfig)`

## Beschreibung {#description}

Holen Sie sich ein Verhalten, das an eine Babylon-Kamera angehängt werden kann, etwa so: `camera.addBehavior(XR8.Babylonjs.faceCameraBehavior())`

## Parameter {#parameters}

| Parameter                                                                 | Beschreibung                                                                                                    |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| config [Optional]     | Konfigurationsparameter zur Übergabe an [XR8.run()\\`](/legacy/api/xr8/run) |
| faceConfig [Optional] | Gesichtskonfigurationsparameter, die an [`XR8.FaceController`](/legacy/api/facecontroller) zu übergeben sind    |

config" [Optional] ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum                                                                                                 | Typ                                                    | Standard                                                                                        | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webgl2 [Optional]                                    | `Boolean`                                              | false                                                                                           | Bei "true" wird WebGL2 verwendet, falls verfügbar, andernfalls wird auf WebGL1 zurückgegriffen.  Wenn false, wird immer WebGL1 verwendet.                                                                                                                                                                                                                                                                       |
| ownRunLoop [Optional]                                | `Boolean`                                              | `true`                                                                                          | Wenn dies der Fall ist, sollte XR seine eigene Laufschleife verwenden.  Wenn false, stellen Sie Ihre eigene Ausführungsschleife bereit und sind selbst für den Aufruf von [`runPreRender`](/legacy/api/xr8/runprerender) und [`runPostRender`](/legacy/api/xr8/runpostrender) verantwortlich [Nur für fortgeschrittene Benutzer]                                            |
| cameraConfig: {direction} [Optional] | Objekt                                                 | `{Richtung: XR8.XrConfig.camera().BACK}`                                                        | Gewünschte Kamera zu verwenden. Unterstützte Werte für `Richtung` sind `XR8.XrConfig.camera().BACK` oder `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                                                                                          |
| glContextConfig [Kann]                               | WebGLContextAttribute                                  | `Null`                                                                                          | Die Attribute zur Konfiguration des WebGL-Canvas-Kontextes.                                                                                                                                                                                                                                                                                                                                                                     |
| allowedDevices [Optional]                            | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device) | XR8.XrConfig.device().MOBILE | Geben Sie die Klasse der Geräte an, auf denen die Pipeline laufen soll.  Wenn das aktuelle Gerät nicht zu dieser Klasse gehört, schlägt die Ausführung vor dem Öffnen der Kamera fehl. Wenn allowedDevices `XR8.XrConfig.device().ANY` ist, wird immer die Kamera geöffnet. Beachten Sie, dass die Weltverfolgung nur mit `XR8.XrConfig.device().MOBILE` verwendet werden kann. |

`faceConfig` [Optional] ist ein Objekt mit den folgenden Eigenschaften:

| Parameter                                                                     | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [Optional]       | Die Entfernung der nahen Clipebene von der Kamera. Standardmäßig wird der Wert Babylon camera.minZ verwendet.                                                                                                                                                                                                                                                                                                                               |
| farClip [Optional]        | Die Entfernung der entfernten Clipebene von der Kamera. Standardmäßig wird der Wert Babylon camera.maxZ verwendet.                                                                                                                                                                                                                                                                                                                          |
| meshGeometry [Optional]   | Liste, die enthält, welche Teile der Kopfgeometrie sichtbar sind.  Optionen sind: `[XR8.FaceController.MeshGeometry.FACE, XR8.FaceController.MeshGeometry.EYES, XR8.FaceController.MeshGeometry.MOUTH, XR8.FaceController.MeshGeometry.IRIS]`. Die Standardeinstellung ist \\`[XR8.FaceController.MeshGeometry.FACE]'. |
| maxDetections [Optional]  | Die maximale Anzahl der zu erkennenden Gesichter. Die verfügbaren Optionen sind 1, 2 oder 3. Der Standardwert ist 1.                                                                                                                                                                                                                                                                                                                        |
| uvType [Optional]         | Gibt an, welche Uvs im Facescanning- und Faceloading-Ereignis zurückgegeben werden. Die Optionen sind: `[XR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`. Die Standardeinstellung ist `[XR8.FaceController.UvType.STANDARD]`.                                                                                                                                                                     |
| leftHandedAxes [Optional] | Wenn true, werden linkshändige Koordinaten verwendet.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| imageTargets [Optional]   | Wenn true, wird in der Ausgabe nach links und rechts gespiegelt.                                                                                                                                                                                                                                                                                                                                                                                                            |

## Rückgabe {#returns}

Ein Babylon JS-Verhalten, das die Face Effects-Engine mit der Babylon-Kamera verbindet und die Kameraübertragung und -verfolgung startet.

## Beispiel {#example}

```javascript
const startScene = (canvas) => {
  const engine = new BABYLON.Engine(canvas, true /* antialias */)
  const scene = new BABYLON.Scene(engine)
  scene.useRightHandedSystem = false

  const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, 0), scene)
  camera.rotation = new BABYLON.Vector3(0, scene.useRightHandedSystem ? Math.PI : 0, 0)
  camera.minZ = 0.0001
  camera.maxZ = 10000

  // Ein Licht zur Szene hinzufügen
  const directionalLight =
  new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-5, -10, 7), scene)
  directionalLight.intensity = 0.5

  // Mesh-Logik
  const faceMesh = new BABYLON.Mesh("face", scene);
  const material = new BABYLON.StandardMaterial("boxMaterial", scene)
  material.diffuseColor = new BABYLON.Color3(173 / 255.0, 80 / 255.0, 255 / 255.0)
  faceMesh.material = material

  let facePoints = []

  const runConfig = {
    cameraConfig: {XR8.XrConfig.camera().FRONT},
    allowedDevices: XR8.XrConfig.device().ANY,
    verbose: true,
  }

  camera.addBehavior(XR8.Babylonjs.faceCameraBehavior(runConfig)) // Kamera mit XR verbinden und Kamerafeed anzeigen.

  engine.runRenderLoop(() => {
    scene.render()
  })
}
```
