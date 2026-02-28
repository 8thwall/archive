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

El valor devuelto es un objeto puesto a disposición de [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) como:

`processCpuResult.layerscontroller: { rotation, position, intrinsics, cameraFeedTexture, layers }`

| Propiedad         | Tipo                                                                            | Descripción                                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rotación          | `{w, x, y, z}`                                                                  | La orientación (cuaternión) de la cámara en la escena.                                                                                                       |
| posición          | `{x, y, z}`                                                                     | La posición de la cámara en la escena.                                                                                                                                          |
| intrínsecos       | `[Número]`                                                                      | Una matriz de proyección 4x4 de 16 dimensiones de columna mayor que proporciona a la cámara de la escena el mismo campo de visión que la alimentación de la cámara renderizada. |
| cameraFeedTexture | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La textura que contiene los datos de alimentación de la cámara.                                                                                                                 |
| capas             | `Registro<String, LayerOutput>`                                                 | Key es el nombre de la capa, LayerOutput contiene los resultados de la detección de la capa semántica para esa capa.                                                            |

`LayerOutput` es un objeto con las siguientes propiedades:

| Propiedad     | Tipo                                                                            | Descripción                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| textura       | [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | La textura que contiene los datos de la capa. Los canales r, g, b indican nuestra confianza de si la capa está presente en este píxel. 0,0 indica que la capa no está presente y 1,0 indica que está presente. Tenga en cuenta que este valor se invertirá si `invertLayerMask` se ha establecido en true. |
| textureWidth  | `Número`                                                                        | Anchura de la textura devuelta en píxeles.                                                                                                                                                                                                                                                                                                                 |
| textureHeight | `Número`                                                                        | Altura de la textura devuelta en píxeles.                                                                                                                                                                                                                                                                                                                  |
| porcentaje    | `Número`                                                                        | Porcentaje de píxeles clasificados como asociados a la capa. Valor en el rango de [0, 1]                                                                                                                                                                                                               |

## Eventos enviados {#dispatched-events}

**Carga de capas**: Se activa cuando comienza la carga de recursos adicionales de segmentación de capas.

`layerloading.detail : {}`

**Exploración de capas**: Se activa cuando se han cargado todos los recursos de segmentación de capas y se ha iniciado la exploración. Se envía un evento por cada capa escaneada.

`layerscanning.detail : {name}`

| Propiedad | Tipo   | Descripción                                               |
| --------- | ------ | --------------------------------------------------------- |
| nombre    | Cadena | Nombre de la capa que estamos escaneando. |

**capaencontrada**: Se activa la primera vez que se encuentra una capa.

`layerfound.detail : {name, percentage}`

| Propiedad  | Tipo     | Descripción                                                          |
| ---------- | -------- | -------------------------------------------------------------------- |
| nombre     | Cadena   | Nombre de la capa que se ha encontrado.              |
| porcentaje | `Número` | Porcentaje de píxeles que están asociados a la capa. |

## Ejemplo: añadir el módulo {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.LayersController.pipelineModule())
```
