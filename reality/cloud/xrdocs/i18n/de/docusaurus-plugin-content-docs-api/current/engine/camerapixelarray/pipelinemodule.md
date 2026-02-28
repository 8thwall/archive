---
sidebar_label: pipelineModule()
---

# XR8.CameraPixelArray.pipelineModule()

`XR8.CameraPixelArray.pipelineModule({ luminance, maxDimension, width, height })`

## Beschreibung {#description}

Ein Pipeline-Modul, das die Kameratextur als Array von RGBA- oder Graustufen-Pixelwerten bereitstellt
, die für die CPU-Bildverarbeitung verwendet werden können.

## Parameter {#parameters}

| Parameter                                                                                    | Standard                                     | Beschreibung                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Leuchtdichte [Optional]                  | false                                        | Falls true, Ausgabe in Graustufen statt RGBA                                                                                                                                                                                                           |
| maxDimension: [Optional] |                                              | Die Größe der längsten Dimension des Ausgabebildes in Pixeln. Die kürzere Abmessung wird relativ zur Größe der Kameraeingabe skaliert, so dass das Bild ohne Beschneidung oder Verzerrung in der Größe angepasst wird. |
| Breite [Optional]                        | Die Breite der Kameratextur. | Breite des Ausgabebildes. Wird ignoriert, wenn `maxDimension` angegeben ist.                                                                                                                                           |
| Höhe [fakultativ]                        | Die Höhe der Kameratextur.   | Höhe des Ausgabebildes. Wird ignoriert, wenn `maxDimension` angegeben ist.                                                                                                                                             |

## Rückgabe {#returns}

Rückgabewert ist ein Objekt, das für [`onProcessCpu`](/api/engine/camerapipelinemodule/onprocesscpu) und
[`onUpdate`](/api/engine/camerapipelinemodule/onupdate) als zur Verfügung gestellt wird:

processGpuResult.camerapixelarray: {rows, cols, rowBytes, pixels}

| Eigentum | Beschreibung                                                                             |
| -------- | ---------------------------------------------------------------------------------------- |
| Zeilen   | Höhe des Ausgabebildes in Pixeln.                                        |
| Spalten  | Breite des Ausgabebildes in Pixeln.                                      |
| rowBytes | Anzahl der Bytes pro Zeile des Ausgabebildes.                            |
| Pixel    | Ein "UInt8Array" mit Pixeldaten.                                         |
| srcTex   | Eine Textur, die das Ausgangsbild für die zurückgegebenen Pixel enthält. |

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule(XR8.CameraPixelArray.pipelineModule({ luminance: true }))
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onProcessCpu: ({ processGpuResult }) => {
    const { camerapixelarray } = processGpuResult
    if (!camerapixelarray || !camerapixelarray.pixels) {
      return
    }
    const { rows, cols, rowBytes, pixels } = camerapixelarray

    ...
  },
```
