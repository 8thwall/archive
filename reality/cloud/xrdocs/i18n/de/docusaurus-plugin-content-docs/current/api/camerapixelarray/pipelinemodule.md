---
sidebar_label: pipelineModule()
---

# XR8.CameraPixelArray.pipelineModule()

`XR8.CameraPixelArray.pipelineModule({ luminance, maxDimension, width, height })`

## Beschreibung {#description}

Ein Pipeline-Modul, das die Kameratextur als Array von RGBA- oder Graustufen-Pixelwerten bereitstellt, die für die CPU-Bildverarbeitung verwendet werden können.

## Parameter {#parameters}

| Parameter                | Standard                               | Beschreibung                                                                                                                                                                                                                |
| ------------------------ | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Leuchtkraft [Optional]   | `false`                                | Falls wahr, Ausgabe in Graustufen statt RGBA                                                                                                                                                                                |
| maxDimension: [Optional] |                                        | Die Größe der längsten Dimension des Ausgabebildes in Pixeln. Die kürzere Abmessung wird im Verhältnis zur Größe der Kameraeingabe skaliert, so dass die Größe des Bildes ohne Beschneidung oder Verzerrung angepasst wird. |
| breite [Optional]        | Die Breite der Textur des Kamerafeeds. | Breite des Ausgabebildes. Wird ignoriert, wenn `maxDimension` angegeben ist.                                                                                                                                                |
| Höhe [Optional]          | Die Höhe der Textur der Kamerazufuhr.  | Höhe des Ausgabebildes. Wird ignoriert, wenn `maxDimension` angegeben ist.                                                                                                                                                  |

## Returns {#returns}

Return-Wert ist ein Objekt, das [`onProcessCpu`](/api/camerapipelinemodule/onprocesscpu) und [`onUpdate`](/api/camerapipelinemodule/onupdate) als zur Verfügung gestellt wird:

processGpuResult.camerapixelarray: {rows, cols, rowBytes, pixels}

| Eigentum | Beschreibung                                                          |
| -------- | --------------------------------------------------------------------- |
| zeilen   | Höhe des Ausgabebildes in Pixeln.                                     |
| Spalten  | Breite des Ausgabebildes in Pixeln.                                   |
| rowBytes | Anzahl der Bytes pro Zeile des Ausgabebildes.                         |
| Pixel    | Ein `UInt8Array` von Pixeldaten.                                      |
| srcTex   | Eine Textur, die das Quellbild für die zurückgegebenen Pixel enthält. |

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
