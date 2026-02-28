---
sidebar_label: pipelineModule()
---

# XR8.LayersController.pipelineModule()

`XR8.LayersController.pipelineModule()`

## Beschreibung {#description}

Erstellt ein Kamera-Pipelinemodul, das nach der Installation die Erkennung semantischer Ebenen ermöglicht.

## Parameter {#parameters}

Keine

## Rückgabe {#returns}

Rückgabewert ist ein Objekt, das für [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) als zur Verfügung gestellt wird:

`processCpuResult.layerscontroller: { rotation, position, intrinsics, cameraFeedTexture, layers }`

| Eigentum          | Typ                                                                          | Beschreibung                                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rotation          | `{w, x, y, z}`                                                               | Die Ausrichtung (Quaternion) der Kamera in der Szene.                                                                |
| Position          | {x, y, z}                                                                    | Die Position der Kamera in der Szene.                                                                                                   |
| Intrinsics        | `[Zahl]`                                                                     | Eine 16-dimensionale spaltengroße 4x4-Projektionsmatrix, die der Szenekamera das gleiche Sichtfeld wie dem gerenderten Kamerabild gibt. |
| cameraFeedTexture | [WebGLTextur](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Die Textur, die die Kamerafeed-Daten enthält.                                                                                           |
| Schichten         | `Record<String, LayerOutput>`                                                | Key ist der Name der Ebene, LayerOutput enthält die Ergebnisse der semantischen Ebenenerkennung für diese Ebene.                        |

LayerOutput" ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum     | Typ                                                                          | Beschreibung                                                                                                                                                                                                                                                                                                                                                           |
| ------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Textur       | [WebGLTextur](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Die Textur, die die Ebenendaten enthält. Die Kanäle r, g, b geben an, ob die Schicht an diesem Pixel vorhanden ist. 0,0 bedeutet, dass die Schicht nicht vorhanden ist, und 1,0, dass sie vorhanden ist. Beachten Sie, dass dieser Wert umgedreht wird, wenn `invertLayerMask` auf true gesetzt wurde. |
| texturBreite | Nummer                                                                       | Breite der zurückgegebenen Textur in Pixeln.                                                                                                                                                                                                                                                                                                           |
| texturHöhe   | Nummer                                                                       | Höhe der zurückgegebenen Textur in Pixeln.                                                                                                                                                                                                                                                                                                             |
| Prozentsatz  | Nummer                                                                       | Prozentualer Anteil der Pixel, die als mit der Ebene verbunden eingestuft werden. Wert im Bereich von [0, 1]                                                                                                                                                                                       |

## Versendete Ereignisse {#dispatched-events}

**Laden der Ebenen**: Wird ausgelöst, wenn der Ladevorgang für zusätzliche Schichtsegmentierungsressourcen beginnt.

Schichtladung.Detail : {}

**Layerscanning**: Wird ausgelöst, wenn alle Ebenensegmentierungsressourcen geladen wurden und das Scannen begonnen hat. Pro gescannter Ebene wird ein Ereignis ausgelöst.

`layerscanning.detail : {name}`

| Eigentum | Typ      | Beschreibung                                            |
| -------- | -------- | ------------------------------------------------------- |
| Name     | `String` | Name der Ebene, die wir scannen wollen. |

**Schicht gefunden**: Wird ausgelöst, wenn zum ersten Mal eine Ebene gefunden wird.

`layerfound.detail : {name, percentage}`

| Eigentum    | Typ      | Beschreibung                                                                     |
| ----------- | -------- | -------------------------------------------------------------------------------- |
| Name        | `String` | Name der Ebene, die gefunden wurde.                              |
| Prozentsatz | Nummer   | Prozentualer Anteil der Pixel, die mit der Ebene verbunden sind. |

## Beispiel - Hinzufügen eines Pipeline-Moduls {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.LayersController.pipelineModule())
```
