---
sidebar_label: configure()
---

# XR8.Threejs.configure()

`XR8.Threejs.configure({renderCameraTexture, layerNames})`

## Beschreibung {#description}

Konfiguriert den three.js Renderer.

## Parameter {#parameters}

| Eigentum                       | Typ         | Standard | Beschreibung                                                                                                                                                                                                                                                                   |
| ------------------------------ | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| renderCameraTexture [Optional] | `Boolesche` | `true`   | Wenn wahr</code>, wird der auf die Größe der Leinwand zugeschnittene Kamerafeed in eine Textur übertragen. Diese wird als `cameraTexture` von [`XR8.Threejs.xrScene()`](xrscene.md) zurückgegeben. Wenn `Falsch` oder `null`, rendern Sie den Kamerafeed nicht in eine Textur. |
| layerScenes [Optional]         | `[String]`  | `[]`     | Ein Array von Ebenennamen. Die Ebenen, für die Sie neue three.js Szenen erstellen. Szenen werden als `layerScenes` von [`XR8.Threejs.xrScene()`](xrscene.md) zurückgegeben. Der einzig gültige Wert ist `'sky'`.                                                               |

## Returns {#returns}

Keine

## Beispiel - Rendering von Kamerabildern in eine Textur {#example---render-camera-feed-to-a-texture}

```javascript
XR8.Threejs.configure({renderCameraTexture: true})
...
const {cameraTexture} = XR8.Threejs.xrScene()
```

## Beispiel - Himmelsszene {#example---sky-scene}

```javascript
XR8.Threejs.configure({layerScenes: ['sky']})
...
const {layerScenes} = XR8.Threejs.xrScene()
createSkyScene(layerScenes.sky.scene, layerScenes.sky.camera)
```
