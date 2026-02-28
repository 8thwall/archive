---
sidebar_label: xrScene()
---

# XR8.Threejs.xrScene()

`XR8.Threejs.xrScene()`

## Beschreibung {#description}

Holen Sie sich ein Handle auf die xr-Szene, die Kamera, den Renderer, die (optionale) Kameratextur und die (optionale) layerScenes.

## Parameter {#parameters}

Keine

## Returns {#returns}

Ein Objekt: `{ scene, camera, renderer, cameraTexture, layerScenes }`

| Eigentum                 | Typ                                                                    | Beschreibung                                                                                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| scene                    | [`Schauplatz`](https://threejs.org/docs/#api/en/scenes/Scene)          | Die three.js-Szene.                                                                                                                                                                     |
| camera                   | [`Kamera`](https://threejs.org/docs/#api/en/cameras/Camera)            | Die Hauptkamera von three.js.                                                                                                                                                           |
| renderer                 | [`Renderer`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) | Der three.js Renderer.                                                                                                                                                                  |
| cameraTexture [Optional] | [`Textur`](https://threejs.org/docs/#api/en/textures/Texture)          | Eine three.js-Textur mit dem auf die Leinwandgröße zugeschnittenen Kamerabild. Aktiviert durch den Aufruf [`XR8.Threejs.configure({renderCameraTexture: true})`](configure.md).         |
| layerScenes [Optional]   | `Datensatz`                                                            | Eine Zuordnung von Ebenennamen zu three.js Ebenenszenen. Enthält Datensätze, die durch den Aufruf von [`aktiviert werden XR8.Threejs.configure({layerScenes: ['sky']})`](configure.md). |

Die `LayerScene` im Objekt `layerScenes` hat die folgenden Eigenschaften:

| Eigentum | Typ                                                         | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| scene    | [`Szene`](https://threejs.org/docs/#api/en/scenes/Scene)    | Die three.js Szene für diese Ebene. Inhalte, die zu diesem Himmel hinzugefügt werden, sind nur sichtbar, wenn sie sich in einem Bereich des Kamerafeeds befinden, in dem diese Ebene erkannt wurde. Bei den Himmelseffekten zum Beispiel wird ein Würfel nur im Himmel angezeigt. Verwenden Sie `XR8.LayersController.configure({layers: {sky: {invertLayerMask: true}}})`, um dies umzukehren und den Würfel nur anzuzeigen, wenn er sich nicht im Himmel befindet. |
| camera   | [`Kamera`](https://threejs.org/docs/#api/en/cameras/Camera) | Die three.js Kamera für diese Ebene. Die Position und Drehung der Kamera wird mit der Hauptkamera synchronisiert.                                                                                                                                                                                                                                                                                                                                                    |

## Beispiel {#example}

```javascript
const {scene, camera, renderer, cameraTexture} = XR8.Threejs.xrScene()
```

## Beispiel - Himmelsszene {#example---sky-scene}

```javascript
XR8.LayersController.configure({layers: {sky: {}}})
XR8.Threejs.configure({layerScenes: ['sky']})
...
const {layerScenes} = XR8.Threejs.xrScene()
createSkyScene(layerScenes.sky.scene, layerScenes.sky.camera)
```
