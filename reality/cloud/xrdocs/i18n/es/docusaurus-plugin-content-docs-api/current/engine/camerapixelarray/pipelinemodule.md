---
sidebar_label: pipelineModule()
---

# XR8.CameraPixelArray.pipelineModule()

`XR8.CameraPixelArray.pipelineModule({ luminance, maxDimension, width, height })`

## Descripción {#description}

Un módulo de canalización que proporciona la textura de la cámara como una matriz de valores de píxeles RGBA o en escala de grises
que se puede utilizar para el procesamiento de imágenes de la CPU.

## Parámetros {#parameters}

| Parámetro                                                                                    | Por defecto                                                            | Descripción                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luminancia [Opcional]                    | `false`                                                                | Si es true, salida en escala de grises en lugar de RGBA                                                                                                                                                                                                         |
| maxDimension: [Opcional] |                                                                        | El tamaño en píxeles de la dimensión más larga de la imagen de salida. La dimensión más corta se escalará en relación con el tamaño de la entrada de la cámara para que la imagen se redimensione sin recortes ni distorsiones. |
| anchura [Opcional]                       | La anchura de la textura de alimentación de la cámara. | Anchura de la imagen de salida. Se ignora si se especifica `maxDimension`.                                                                                                                                                      |
| altura [Opcional]                        | La altura de la textura de alimentación de la cámara.  | Altura de la imagen de salida. Se ignora si se especifica `maxDimension`.                                                                                                                                                       |

## Devuelve {#returns}

El valor de retorno es un objeto puesto a disposición de [`onProcessCpu`](/api/engine/camerapipelinemodule/onprocesscpu) y
[`onUpdate`](/api/engine/camerapipelinemodule/onupdate) como:

processGpuResult.camerapixelarray: {rows, cols, rowBytes, pixels}

| Propiedad | Descripción                                                                            |
| --------- | -------------------------------------------------------------------------------------- |
| filas     | Altura en píxeles de la imagen de salida.                              |
| cols      | Anchura en píxeles de la imagen de salida.                             |
| rowBytes  | Número de bytes por fila de la imagen de salida.                       |
| píxeles   | Un `UInt8Array` de datos de píxeles.                                   |
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
