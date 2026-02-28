---
sidebar_label: pipelineModule()
---

# XR8.CameraPixelArray.pipelineModule()

`XR8.CameraPixelArray.pipelineModule({ luminance, maxDimension, width, height })`

## Descripción {#description}

Un módulo pipeline que proporciona la textura de la cámara como una matriz de valores de píxeles RGBA o en escala de grises que puede utilizarse para el procesamiento de imágenes por la CPU.

## Parámetros {#parameters}

| Parámetro                | Por defecto                                            | Descripción                                                                                                                                                                                                                         |
| ------------------------ | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luminance [Opcional]     | `false`                                                | Si es verdadero, salida en escala de grises en lugar de RGBA                                                                                                                                                                        |
| maxDimension: [Opcional] |                                                        | El tamaño en píxeles de la dimensión más larga de la imagen de salida. La dimensión más corta se escalará en relación con el tamaño de la entrada de la cámara, de modo que la imagen se redimensione sin recortes ni distorsiones. |
| width [Opcional]         | La anchura de la textura de alimentación de la cámara. | Anchura de la imagen de salida. Se ignora si se especifica `maxDimension`.                                                                                                                                                          |
| height [Opcional]        | La altura de la textura de alimentación de la cámara.  | Altura de la imagen de salida. Se ignora si se especifica `maxDimension`.                                                                                                                                                           |

## Devuelve {#returns}

El valor devuelto es un objeto puesto a disposición de [`onProcessCpu`](/api/camerapipelinemodule/onprocesscpu) y [`onUpdate`](/api/camerapipelinemodule/onupdate) como:

processGpuResult.camerapixelarray: {rows, cols, rowBytes, pixels}

| Propiedad | Descripción                                                            |
| --------- | ---------------------------------------------------------------------- |
| rows      | Altura en píxeles de la imagen de salida.                              |
| cols      | Anchura en píxeles de la imagen de salida.                             |
| rowBytes  | Número de bytes por fila de la imagen de salida.                       |
| pixels    | Un `UInt8Array` de datos de píxeles.                                   |
| srcTex    | Una textura que contiene la imagen de origen de los píxeles devueltos. |

## Ejemplo {#example}

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
