---
sidebar_label: konfigurieren()
---

# XR8.Threejs.configure()

`XR8.Threejs.configure({renderCameraTexture, layerNames})`

## Beschreibung {#description}

Konfiguriert den three.js-Renderer.

## Parameter {#parameters}

| Eigentum                                                                           | Typ        | Standard | Beschreibung                                                                                                                                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------- | ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| renderCameraTexture [Optional] | `Boolean`  | `true`   | Wenn `true`, wird der auf die Leinwandgröße zugeschnittene Kamerafeed in eine Textur gerendert. Diese wird als `cameraTexture` von [`XR8.Threejs.xrScene()`](xrscene.md) zurückgegeben. Wenn `false` oder `null`, wird der Kamerafeed nicht in eine Textur gerendert. |
| layerScenes [Optional]         | `[String]` | `[]`     | Ein Array von Ebenennamen. Die Ebenen, für die neue three.js-Szenen erstellt werden. Szenen werden als `layerScenes` von [`XR8.Threejs.xrScene()`](xrscene.md) zurückgegeben. Der einzig gültige Wert ist `'sky'`.                    |

## Rückgabe {#returns}

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
