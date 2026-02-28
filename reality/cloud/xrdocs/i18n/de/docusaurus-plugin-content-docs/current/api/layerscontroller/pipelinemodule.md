---
sidebar_label: pipelineModule()
---

# XR8.LayersController.pipelineModule()

`XR8.LayersController.pipelineModule()`

## Beschreibung {#description}

Erstellt ein Kamera-Pipeline-Modul, das nach der Installation die Erkennung von semantischen Ebenen ermöglicht.

## Parameter {#parameters}

Keine

## Returns {#returns}

Return-Wert ist ein Objekt, das [`onUpdate`](/api/camerapipelinemodule/onupdate) als zur Verfügung gestellt wird:

`processCpuResult.layerscontroller: { rotation, position, intrinsics, cameraFeedTexture, layers }`

| Eigentum          | Typ                                                                            | Beschreibung                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| rotation          | `{w, x, y, z}`                                                                 | Die Ausrichtung (Quaternion) der Kamera in der Szene.                                                                              |
| position          | `{x, y, z}`                                                                    | Die Position der Kamera in der Szene.                                                                                              |
| intrinsics        | `[Nummer]`                                                                     | Eine 16-dimensionale 4x4-Spalten-Projektionsmatrix, die der Szenekamera das gleiche Sichtfeld wie dem gerenderten Kamerabild gibt. |
| cameraFeedTexture | [`WebGLTextur`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Die Textur, die die Kamerafeed-Daten enthält.                                                                                      |
| ebenen            | `Datensatz`                                                                    | Key ist der Name der Ebene, LayerOutput enthält die Ergebnisse der semantischen Ebenenerkennung für diese Ebene.                   |

`LayerOutput` ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum      | Typ                                                                            | Beschreibung                                                                                                                                                                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| texture       | [`WebGLTextur`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Die Textur, die die Ebenendaten enthält. Die r-, g- und b-Kanäle zeigen an, ob die Ebene an diesem Pixel vorhanden ist. 0.0 bedeutet, dass die Ebene nicht vorhanden ist, und 1.0 bedeutet, dass sie vorhanden ist. Beachten Sie, dass dieser Wert gespiegelt wird, wenn `invertLayerMask` auf true gesetzt wurde. |
| texturBreite  | `Nummer`                                                                       | Breite der zurückgegebenen Textur in Pixel.                                                                                                                                                                                                                                                                        |
| textureHeight | `Nummer`                                                                       | Höhe der zurückgegebenen Textur in Pixel.                                                                                                                                                                                                                                                                          |
| percentage    | `Nummer`                                                                       | Prozentualer Anteil der Pixel, die als mit der Ebene verbunden eingestuft werden. Wert im Bereich von [0, 1]                                                                                                                                                                                                       |

## Versendete Ereignisse {#dispatched-events}

**layerloading**: Wird ausgelöst, wenn der Ladevorgang für zusätzliche Ebenensegmentierungsressourcen beginnt.

`layerloading.detail : {}`

**ebenen-Scannen**: Wird ausgelöst, wenn alle Ebenensegmentierungsressourcen geladen wurden und die Suche begonnen hat. Für jede Ebene, die gescannt wird, wird ein Ereignis ausgelöst.

`layerscanning.detail : {name}`

| Eigentum | Typ      | Beschreibung                     |
| -------- | -------- | -------------------------------- |
| name     | `String` | Name der Ebene, die wir scannen. |

**layerfound**: Wird ausgelöst, wenn zum ersten Mal eine Ebene gefunden wird.

`layerfound.detail : {name, percentage}`

| Eigentum   | Typ      | Beschreibung                                                     |
| ---------- | -------- | ---------------------------------------------------------------- |
| name       | `String` | Name der Ebene, die gefunden wurde.                              |
| percentage | `Nummer` | Prozentualer Anteil der Pixel, die mit der Ebene verbunden sind. |

## Beispiel - Hinzufügen eines Pipeline-Moduls {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.LayersController.pipelineModule())
```
