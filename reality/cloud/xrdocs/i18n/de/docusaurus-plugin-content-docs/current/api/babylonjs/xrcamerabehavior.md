---
sidebar_label: xrCameraBehavior()
---

# XR8.Babylonjs.xrCameraBehavior()

`XR8.Babylonjs.xrCameraBehavior(config, xrConfig)`

## Beschreibung {#description}

Schafft ein Verhalten, das an eine Babylon-Kamera angehängt werden kann, wie folgt: `camera.addBehavior(XR8.Babylonjs.xrCameraBehavior())`

## Parameter {#parameters}

| Parameter           | Beschreibung                                                                    |
| ------------------- | ------------------------------------------------------------------------------- |
| config [Optional]   | Konfigurationsparameter zur Übergabe an [`XR8.run()`](/api/xr8/run)             |
| xrConfig [Optional] | Konfigurationsparameter zur Übergabe an [`XR8.XrController`](/api/xrcontroller) |

`config` [Optional] ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum                             | Typ                                             | Standard                                  | Beschreibung                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------ | ----------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webgl2 [Optional]                    | `Boolesche`                                     | `false`                                   | Bei Wahr verwenden Sie WebGL2, falls verfügbar, andernfalls wird auf WebGL1 zurückgegriffen.  Wenn Falsch, verwenden Sie immer WebGL1.                                                                                                                                                                                                                                       |
| ownRunLoop [Optional]                | `Boolesche`                                     | `false`                                   | Wenn Wahr, sollte XR seine eigene Laufschleife verwenden.  Wenn Falsch, stellen Sie Ihre eigene Laufschleife bereit und sind selbst für den Aufruf von [`runPreRender`](/api/xr8/runprerender) und [`runPostRender`](/api/xr8/runpostrender) verantwortlich [Nur für fortgeschrittene Benutzer]                                                                              |
| cameraConfig: {direction} [Optional] | `Objekt`                                        | `{direction: XR8.XrConfig.camera().BACK}` | Zu verwendende Kamera. Unterstützte Werte für `Richtung` sind `XR8.XrConfig.camera().BACK` oder `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                                                |
| glContextConfig [Optional]           | `WebGLContextAttribute`                         | `null`                                    | Die Attribute zur Konfiguration des WebGL-Canvas-Kontextes.                                                                                                                                                                                                                                                                                                                  |
| allowedDevices [Optional]            | [`XR8.XrConfig.device()`](/api/xrconfig/device) | `XR8.XrConfig.device().MOBILE`            | Geben Sie die Klasse der Geräte an, auf denen die Pipeline laufen soll.  Wenn das aktuelle Gerät nicht zu dieser Klasse gehört, schlägt die Ausführung vor dem Öffnen der Kamera fehl. Wenn allowedDevices `XR8.XrConfig.device().ANY` ist, öffnen Sie immer die Kamera. Beachten Sie, dass die Weltverfolgung nur mit `XR8.XrConfig.device().MOBILE` verwendet werden kann. |

`xrConfig` [Optional] ist ein Objekt mit den folgenden Eigenschaften:

| Parameter                       | Beschreibung                                                                                                                                                                                 |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enableLighting [Optional]       | Wenn wahr, wird eine Schätzung der Beleuchtungsinformationen zurückgegeben.                                                                                                                  |
| enableWorldPoints [Optional]    | Wenn wahr, werden die für die Verfolgung verwendeten Kartenpunkte zurückgegeben.                                                                                                             |
| disableWorldTracking [Optional] | Wenn ja, schalten Sie die SLAM-Verfolgung aus Effizienzgründen aus.                                                                                                                          |
| imageTargets [Optional]         | Liste der Namen der zu erkennenden Bildziele. Kann während der Laufzeit geändert werden. Hinweis: Alle derzeit aktiven Bildziele werden durch die in dieser Liste angegebenen Ziele ersetzt. |
| leftHandedAxes [Optional]       | Wenn wahr, verwenden Sie linkshändige Koordinaten.                                                                                                                                           |
| imageTargets [Optional]         | Wenn wahr, spiegeln Sie in der Ausgabe links und rechts.                                                                                                                                     |

## Returns {#returns}

Ein Babylon JS-Verhalten, das die XR-Engine mit der Babylon-Kamera verbindet und den Kamera-Feed und die Verfolgung startet.

## Beispiel {#example}

```javascript
let surface, engine, scene, camera

const startScene = () => {
  const canvas = document.getElementById('renderCanvas')

  engine = new BABYLON.Engine(canvas, true, { stencil: true, preserveDrawingBuffer: true })
  engine.enableOfflineSupport = false

  scene = new BABYLON.Scene(engine)
  camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 3, 0), scene)

  initXrScene({ scene, camera }) // Fügen Sie der Szene Objekte hinzu und setzen Sie die Startposition der Kamera.

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
