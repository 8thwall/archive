---
sidebar_label: xrCameraBehavior()
---

# XR8.Babylonjs.xrCameraBehavior()

`XR8.Babylonjs.xrCameraBehavior(config, xrConfig)`

## Beschreibung {#description}

Holen Sie sich ein Verhalten, das an eine Babylon-Kamera angehängt werden kann, etwa so: `camera.addBehavior(XR8.Babylonjs.xrCameraBehavior())`

## Parameter {#parameters}

| Parameter                                                               | Beschreibung                                                                                                    |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| config [Optional]   | Konfigurationsparameter zur Übergabe an [XR8.run()\\`](/legacy/api/xr8/run) |
| xrConfig [Optional] | Konfigurationsparameter zur Übergabe an [XR8.XrController](/legacy/api/xrcontroller)            |

config" [Optional] ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum                                                                                                 | Typ                                                    | Standard                                                                                        | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webgl2 [Optional]                                    | `Boolean`                                              | false                                                                                           | Bei "true" wird WebGL2 verwendet, falls verfügbar, andernfalls wird auf WebGL1 zurückgegriffen.  Wenn false, wird immer WebGL1 verwendet.                                                                                                                                                                                                                                                                       |
| ownRunLoop [Optional]                                | `Boolean`                                              | false                                                                                           | Wenn dies der Fall ist, sollte XR seine eigene Laufschleife verwenden.  Wenn false, stellen Sie Ihre eigene Ausführungsschleife bereit und sind selbst für den Aufruf von [`runPreRender`](/legacy/api/xr8/runprerender) und [`runPostRender`](/legacy/api/xr8/runpostrender) verantwortlich [Nur für fortgeschrittene Benutzer]                                            |
| cameraConfig: {direction} [Optional] | Objekt                                                 | `{Richtung: XR8.XrConfig.camera().BACK}`                                                        | Gewünschte Kamera zu verwenden. Unterstützte Werte für `Richtung` sind `XR8.XrConfig.camera().BACK` oder `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                                                                                          |
| glContextConfig [Kann]                               | WebGLContextAttribute                                  | `Null`                                                                                          | Die Attribute zur Konfiguration des WebGL-Canvas-Kontextes.                                                                                                                                                                                                                                                                                                                                                                     |
| allowedDevices [Optional]                            | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device) | XR8.XrConfig.device().MOBILE | Geben Sie die Klasse der Geräte an, auf denen die Pipeline laufen soll.  Wenn das aktuelle Gerät nicht zu dieser Klasse gehört, schlägt die Ausführung vor dem Öffnen der Kamera fehl. Wenn allowedDevices `XR8.XrConfig.device().ANY` ist, wird immer die Kamera geöffnet. Beachten Sie, dass die Weltverfolgung nur mit `XR8.XrConfig.device().MOBILE` verwendet werden kann. |

`xrConfig` [Optional] ist ein Objekt mit den folgenden Eigenschaften:

| Parameter                                                                           | Beschreibung                                                                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enableLighting [Optional]       | Wenn true, wird eine Schätzung der Beleuchtungsinformationen zurückgegeben.                                                                                                                                                          |
| enableWorldPoints [Optional]    | Wenn true, werden die für die Verfolgung verwendeten Kartenpunkte zurückgegeben.                                                                                                                                                     |
| disableWorldTracking [Optional] | Wenn ja, wird das SLAM-Tracking aus Effizienzgründen deaktiviert.                                                                                                                                                                    |
| imageTargets [Optional]         | Liste der Namen der zu erkennenden Bildziele. Kann zur Laufzeit geändert werden. Hinweis: Alle derzeit aktiven Bildziele werden durch die in dieser Liste angegebenen Ziele ersetzt. |
| leftHandedAxes [Optional]       | Wenn true, werden linkshändige Koordinaten verwendet.                                                                                                                                                                                |
| imageTargets [Optional]         | Wenn true, wird in der Ausgabe nach links und rechts gespiegelt.                                                                                                                                                                     |

## Rückgabe {#returns}

Ein Babylon JS-Verhalten, das die XR-Engine mit der Babylon-Kamera verbindet und die Kameraübertragung und -verfolgung startet.

## Beispiel {#example}

```javascript
let surface, engine, scene, camera

const startScene = () => {
  const canvas = document.getElementById('renderCanvas')

  engine = new BABYLON.Engine(canvas, true, { stencil: true, preserveDrawingBuffer: true })
  engine.enableOfflineSupport = false

  scene = new BABYLON.Scene(engine)
  camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 3, 0), scene)

  initXrScene({ scene, camera }) // Objekte zur Szene hinzufügen und Startposition der Kamera festlegen.

  // Verbinden Sie die Kamera mit der XR-Engine und zeigen Sie den Kamera-Feed
  camera.addBehavior(XR8.Babylonjs.xrCameraBehavior())

  engine.runRenderLoop(() => {
    scene.render()
  })

  window.addEventListener('resize', () => {
    engine.resize()
  })
}
```
