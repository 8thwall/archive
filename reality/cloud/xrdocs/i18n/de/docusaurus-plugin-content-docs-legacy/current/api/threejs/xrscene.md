---
sidebar_label: xrScene()
---

# XR8.Threejs.xrScene()

`XR8.Threejs.xrScene()`

## Beschreibung {#description}

Holt einen Handle auf die xr-Szene, die Kamera, den Renderer, die (optionale) Kameratextur und die (optionale) layerScenes.

## Parameter {#parameters}

Keine

## Rückgabe {#returns}

Ein Objekt: `{ Szene, Kamera, Renderer, cameraTexture, layerScenes }`

| Eigentum                                                                     | Typ                                                                  | Beschreibung                                                                                                                                                                                                                            |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Szene                                                                        | [Szene](https://threejs.org/docs/#api/en/scenes/Scene)               | Die three.js-Szene.                                                                                                                                                                                     |
| Kamera                                                                       | [`Kamera`](https://threejs.org/docs/#api/en/cameras/Camera)          | Die Hauptkamera von three.js.                                                                                                                                                                           |
| Renderer                                                                     | [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) | Der three.js-Renderer.                                                                                                                                                                                  |
| cameraTexture [Optional] | [Textur](https://threejs.org/docs/#api/en/textures/Texture)          | Eine three.js-Textur mit dem auf die Leinwandgröße zugeschnittenen Kamerabild. Aktiviert durch Aufruf von [`XR8.Threejs.configure({renderCameraTexture: true})`](configure.md).         |
| layerScenes [Optional]   | `Record<String, LayerScene>`                                         | Eine Zuordnung von Ebenennamen zu three.js-Ebenenszenen. Enthält Datensätze, die durch den Aufruf von [`XR8.Threejs.configure({layerScenes: ['sky']})`](configure.md) aktiviert wurden. |

Die `LayerScene` im `layerScenes`-Objekt hat die folgenden Eigenschaften:

| Eigentum | Typ                                                         | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Szene    | [Szene](https://threejs.org/docs/#api/en/scenes/Scene)      | Die three.js-Szene für diese Ebene. Inhalte, die zu diesem Himmel hinzugefügt werden, sind nur sichtbar, wenn sie sich in einem Bereich des Kamerafeeds befinden, in dem diese Ebene erkannt wurde. In den Himmelseffekten wird ein Würfel zum Beispiel nur im Himmel angezeigt. Verwenden Sie `XR8.LayersController.configure({layers: {sky: {invertLayerMask: true}}})`, um dies umzukehren und den Würfel nur anzuzeigen, wenn er sich nicht im Himmel befindet. |
| Kamera   | [`Kamera`](https://threejs.org/docs/#api/en/cameras/Camera) | Die three.js-Kamera für diese Ebene. Die Position und Drehung der Kamera wird mit der Hauptkamera synchronisiert.                                                                                                                                                                                                                                                                                                                                                                                   |

## Beispiel {#example}

```javascript
const {Szene, Kamera, Renderer, cameraTexture} = XR8.Threejs.xrScene()
```

## Beispiel - Himmelsszene {#example---sky-scene}

```javascript
XR8.LayersController.configure({layers: {sky: {}}})
XR8.Threejs.configure({layerScenes: ['sky']})
...
const {layerScenes} = XR8.Threejs.xrScene()
createSkyScene(layerScenes.sky.scene, layerScenes.sky.camera)
```
