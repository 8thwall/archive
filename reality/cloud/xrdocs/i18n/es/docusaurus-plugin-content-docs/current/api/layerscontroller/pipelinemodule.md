---
sidebar_label: pipelineModule()
---

# XR8.LayersController.pipelineModule()

`XR8.LayersController.pipelineModule()`

## Descripción {#description}

Crea un módulo de canalización de cámara que, cuando se instala, proporciona detección de capas semánticas.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

El valor devuelto es un objeto puesto a disposición de [`onUpdate`](/api/camerapipelinemodule/onupdate) como:

`processCpuResult.layerscontroller: { rotation, position, intrinsics, cameraFeedTexture, layers }`

| Propiedad         | Tipo                                                                            | Descripción                                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rotation          | `{w, x, y, z}`                                                                  | La orientación (cuaternión) de la cámara en la escena.                                                                                                                 |
| position          | `{x, y, z}`                                                                     | La posición de la cámara en la escena.                                                                                                                                 |
| intrinsics        | `[Número]`                                                                      | Una matriz de proyección de 16 dimensiones de columna mayor 4x4 que da a la cámara de la escena el mismo campo de visión que la alimentación de la cámara renderizada. |
| cameraFeedTexture | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La textura que contiene los datos de alimentación de la cámara.                                                                                                        |
| layers            | `Record<String, LayerOutput>`                                             | Key es el nombre de la capa, LayerOutput contiene los resultados de la detección de la capa semántica para esa capa.                                                   |

`LayerOutput` es un objeto con las siguientes propiedades:

| Propiedad     | Tipo                                                                            | Descripción                                                                                                                                                                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| texture       | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La textura que contiene los datos de la capa. Los canales r, g, b indican nuestra confianza de si la capa está presente en este píxel. 0.00 indica que la capa no está presente y 1,00 indica que está presente. Ten en cuenta que este valor se invertirá si `invertLayerMask` se ha establecido como verdadero. |
| textureWidth  | `Número`                                                                        | Anchura de la textura devuelta en píxeles.                                                                                                                                                                                                                                                                        |
| textureHeight | `Número`                                                                        | Altura de la textura devuelta en píxeles.                                                                                                                                                                                                                                                                         |
| percentage    | `Número`                                                                        | Porcentaje de píxeles clasificados como asociados a la capa. Valor en el intervalo de [0, 1]                                                                                                                                                                                                                      |

## Eventos enviados {#dispatched-events}

**carga de capas**: Se lanza cuando comienza la carga de recursos adicionales de segmentación de capas.

`carga de capas.detalle : {}`

**escaneo de capas**: Se lanza cuando se han cargado todos los recursos de segmentación de capas y ha comenzado la exploración. Se envía un evento por capa escaneada.

`layerscanning.detail : {name}`

| Propiedad | Tipo     | Descripción                               |
| --------- | -------- | ----------------------------------------- |
| name      | `Cadena` | Nombre de la capa que estamos escaneando. |

**capaencontrada**: Se lanza la primera vez que se encuentra una capa.

`detalle de la capa : {name, percentage}`

| Propiedad  | Tipo     | Descripción                                          |
| ---------- | -------- | ---------------------------------------------------- |
| name       | `Cadena` | Nombre de la capa que se ha encontrado.              |
| percentage | `Número` | Porcentaje de píxeles que están asociados a la capa. |

## Ejemplo - añadir módulo canalización {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.LayersController.pipelineModule())
```
